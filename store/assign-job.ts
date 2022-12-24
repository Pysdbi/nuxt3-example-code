import { defineStore } from "pinia"
import { ref } from "vue"
import { ApiResponse, useApiFetch } from "@/composables/api"
import { pickWithoutBy, snakeCaseObject } from "@/util"

export type Worker = {
  employeeId: number
}
export type WorkerInfo = {
  banFromWms: boolean
  birthdate: string
  currentWork: {
    blockId: number
    blockName: string
    workId: number
    workIsManualAssign: boolean
    workName: string
    workStartedAt: string
  }
  employeeId: number
  firstname: string
  isIn: boolean
  lastEntered: string
  lastname: string
  middlename: string
  photoUrl: string
  sex: string
}
export type Block = {
  id: number
  office_ids: number[]
  parts: number[]
  wh_ids: number[]
  wh_name: string
}
export type Workplace = {
  id: number
  name: string
  haveAccess?: boolean
}

type State = {
  workers: Worker[]
  loading: boolean
  moreLoading: boolean

  blocks: Block[]
  workplaces: Workplace[]
}
type Actions = {
  getWorkers: (payload?: { search: string }) => Promise<void>
  loadMore: () => Promise<void>

  getWorkplacesForEmployee: (eId: number) => Promise<Workplace[] | undefined>
  getWorkplaces: (isFilters?: boolean) => Promise<void | Workplace[]>
  getBlocks: () => Promise<void>
  getWorkerByEId: (eId: number) => Promise<ApiResponse<WorkerInfo>>
  revokeAssignedWork: (eId: number, blockId: number, workId: number) => Promise<boolean>
  assignWork: (eId: number, blockId: number, workId: number) => Promise<string | undefined>
}

const limitData = 40
const skip = ref(0)

export const useAssignJobStore = defineStore<string, State, {}, Actions>("AssignJobStore", {
  state: () => ({
    workers: [],
    loading: false,
    moreLoading: false,
    search: "",

    blocks: [],
    workplaces: [],
  }),
  actions: {
    async getWorkers (payload) {
      const {
        search,
        ...filters
      } = payload ?? {}
      this.search = search ?? ""

      this.loading = true
      skip.value = 0
      const {
        data,
        error,
      } = await useApiFetch("wms-workplaces", { version: "api/v2" })("work/get_workers", {
        params: {
          offset: skip.value,
          limit: limitData,
          ...(this.search && { fast_search: this.search }),
          ...pickWithoutBy(snakeCaseObject(filters)),
        },
      })
      if (error) {
        this.workers = []
        return
      }
      this.workers = data
      this.loading = false
    },

    async loadMore () {
      if (!this.workers.length || this.moreLoading) return
      this.moreLoading = true
      const {
        data,
        error,
      } = await useApiFetch("wms-workplaces", { version: "api/v2" })("work/get_workers", {
        params: {
          offset: skip.value + limitData,
          limit: limitData,
          ...(this.search && { fast_search: this.search }),
        },
      })
      if (error) {
        this.moreLoading = false
        return
      }
      this.workers = [ ...this.workers, ...data ]
      skip.value += limitData
      this.moreLoading = false
    },

    async getBlocks () {
      const {
        data,
        error,
      } = await useApiFetch("web-admin-backend")("blocks/get_group_by_block/")
      this.blocks = error ? [] : data.flat()
    },

    async getWorkplaces (isFilters = false) {
      const {
        data,
        error,
      } = await useApiFetch("wms-workplaces", { version: "api/v2" })("work/get_workplaces")
      if (!isFilters) {
        this.workplaces = error ? [] : data?.withManualAssign
      }
      else {
        return error ? [] : [ ...data?.withManualAssign, ...data?.withoutManualAssign ]
      }
    },

    async getWorkplacesForEmployee (eId: number) {
      const {
        data,
        error,
      } = await useApiFetch("wms-workplaces", { version: "api/v2" })("work/get_workplaces_for_employee", { params: { employee_id: eId } })
      return error ? [] : data.withManualAssign
    },

    async getWorkerByEId (eid) {
      return useApiFetch("wms-workplaces", { version: "api/v2" })<WorkerInfo>("work/get_employee_info", { params: { employee_id: eid } })
    },

    async revokeAssignedWork (eId, blockId, workId) {
      const { error } = await useApiFetch("wms-workplaces", { version: "api/v2" })("work/revoke_assigned_work", {
        method: "POST",
        body: {
          employee_id: eId,
          block_id: blockId,
          work_id: workId,
        },
      })
      return !!error
    },

    async assignWork (eId, blockId, workId) {
      const { error } = await useApiFetch("wms-workplaces", { version: "api/v2" })("work/assign_work", {
        method: "POST",
        body: {
          employee_id: eId,
          block_id: blockId,
          work_id: workId,
        },
      })
      return error
    },
  },
})
