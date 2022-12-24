import { defineStore } from "pinia"
import { ref } from "vue"
import { ApiResponse, useApiFetch } from "@/composables/api"
import { useAllowed } from "@/composables/permissions"
import { pickWithoutBy, snakeCaseObject } from "@/util"

export type Role = {
  id: number
  roleName: string
  roleDescription: string
  permissions: Array<{
    id: number
    permissionName: string
    permissionDescription: string
  }>
}

export type Employee = {
  birthdate: string
  departmentId: number
  employeeId: number
  lastname: string
  firstname: string
  middlename: string
  isActive: boolean
  phone: string
  sex: string
}

export type EmployeeInfo = Employee & {
  lastEntered: string
  isIn: boolean
  photoUrl: string
  banFromWms: boolean
  roles: Role[]

  createdAt: string
}

export type TerminalHistoryItem = {
  idDt: string
  outDt: string
}

type State = {
  users: Employee[]
  loading: boolean
  moreLoading: boolean
}
type Actions = {
  getUsers: (payload?: { search: string }) => Promise<void>
  loadMore: () => Promise<void>
  getUserInfo: (eId: number) => Promise<EmployeeInfo | undefined>

  getTerminalHistory: (eId: number) => Promise<ApiResponse<TerminalHistoryItem[]>>
  getRoles: () => Promise<Role[] | undefined>

  updateUserInfo: (user: EmployeeInfo) => Promise<void>

  recoveryPassword: (eId: string | number, password: string) => Promise<boolean>
}

const limitData = 40
const skip = ref(0)

export const useEmployeesStore = defineStore<string, State, {}, Actions>("EmployeesStore", {
  state: () => ({
    users: [],
    loading: false,
    moreLoading: false,

    search: "",
  }),
  actions: {
    async getUsers (payload) {
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
      } = await useApiFetch("auth-service")("find_employees", {
        params: {
          offset: skip.value,
          limit: limitData,
          ...(this.search && { fast_search: this.search }),
          ...pickWithoutBy(snakeCaseObject(filters)),
        },
      })
      if (error) {
        this.users = []
        return
      }
      this.users = data
      this.loading = false
    },

    async loadMore () {
      if (!this.users.length || this.moreLoading) return
      this.moreLoading = true
      const {
        data,
        error,
      } = await useApiFetch("auth-service")("find_employees", {
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
      this.users = [ ...this.users, ...data ]
      skip.value += limitData
      this.moreLoading = false
    },

    async getUserInfo (eId) {
      const {
        data,
        error,
      } = await useApiFetch("auth-service")<EmployeeInfo>(`get_user_info/${eId}`)
      if (error) {
        return undefined
      }
      return data
    },

    async getTerminalHistory (eId) {
      return useApiFetch("auth-service")<TerminalHistoryItem[]>(`get_user_terminal_history/${eId}`)
    },

    async getRoles () {
      const {
        data,
        error,
      } = await useApiFetch("auth-service")<Role[]>("role/get")
      if (error) {
        return undefined
      }
      return data
    },

    // Update
    async updateUserInfo (updatedUser) {
      // Is in
      if (useAllowed("TURNSTILE_MANAGE")) {
        await useApiFetch("auth-service")("set_user_wh_loc", {
          method: "POST",
          params: {
            eid: updatedUser.employeeId,
            is_in: updatedUser.isIn,
          },
        })
      }
      // Set roles
      if (useAllowed("USERS_ASSIGN_ROLES")) {
        await useApiFetch("auth-service")("emp-role/set_roles", {
          method: "POST",
          params: { eid: updatedUser.employeeId },
          body: updatedUser.roles.map(x => x.id),
        })
      }
    },

    async recoveryPassword (eid, password) {
      const { error } = await useApiFetch("auth-service")("reset_pwd", {
        method: "POST",
        body: {
          eid,
          password,
        },
      })
      return !!error
    },
  },
})
