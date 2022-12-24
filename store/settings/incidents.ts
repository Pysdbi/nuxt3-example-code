import { defineStore } from "pinia"
import { ref } from "vue"
import { useApiFetch } from "@/composables/api"

export type Incident = {
  allowedActions: any
  appName: string
  appVersion: string
  comment: string
  createdAt: string
  entity: {
    createdAt: string
    type: string
    cargoQrCode: string
    toLocationDescription: string
    initiatorId: number
    executorId: number
    status: string
    id: number
  }
  entityName: string
  errorReason: string
  id: number
  priority: string
  resolverFullName: string
  resolverId: number
  solution: any
  status: string
  type: string
  updatedAt: string
  whId: number
}

type State = {
  incidents: Incident[]
  loading: boolean
  moreLoading: boolean
}
type Actions = {
  getIncidents: (payload?: { search: string }) => Promise<void>
  getIncident: (id: string) => Promise<Incident | undefined>
  resolveIncident: (id: string | number, action: string, comment?: string) => Promise<boolean>
  // loadMore: () => Promise<void>
}

const limitData = 40
const skip = ref(0)

export const useIncidentsStore = defineStore<string, State, {}, Actions>("IncidentsStore", {
  state: () => ({
    incidents: [],
    loading: false,
    moreLoading: false,

    search: "",
  }),
  actions: {
    async getIncidents (payload) {
      const { search } = payload ?? {}
      this.search = search ?? ""

      this.loading = true
      skip.value = 0
      const {
        data,
        error,
      } = await useApiFetch("wms-tasks")("incidents/list?page=1&pageSize=99999&sortType=asc&status=created", {
        params: {
          offset: skip.value,
          limit: limitData,
          ...(this.search && { fast_search: this.search }),
        },
      })
      if (error) {
        this.incidents = []
        return
      }
      this.incidents = data
      this.loading = false
    },
    async getIncident (id) {
      this.loading = true
      const {
        data,
        error,
      } = await useApiFetch("wms-tasks")<Incident>(`incidents/${id}`, {})
      if (error) return
      this.loading = false
      return data
    },
    async resolveIncident (id, action, comment) {
      const { error } = await useApiFetch("wms-tasks")(`incidents/${id}/resolved`, {
        method: "POST",
        body: {
          action: String(action),
          ...(comment && { comment }),
        },
      })
      return !error
    },

    // async loadMore () {
    //   if (!this.incidents.length || this.moreLoading) return
    //   this.moreLoading = true
    //   const {
    //     data,
    //     error,
    //   } = await useApiFetch("web-admin-backend")("incidents/", {
    //     params: {
    //       offset: skip.value + limitData,
    //       limit: limitData,
    //       ...(this.search && { fast_search: this.search }),
    //     },
    //   })
    //   if (error) {
    //     this.moreLoading = false
    //     return
    //   }
    //   this.incidents = [ ...this.incidents, ...data ]
    //   skip.value += limitData
    //   this.moreLoading = false
    // },

  },
})
