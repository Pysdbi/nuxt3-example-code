import { defineStore } from "pinia"
import { ref } from "vue"
import { useApiFetch } from "@/composables/api"

export type Permission = {
  id: number
  canWrite: boolean
  isDeprecated: boolean
  minAuthMethod: string
  permissionDescription: string
  permissionName: string
}
export type Role = {
  id: number
  isDeprecated: boolean
  permissions: Permission[]
  roleDescription: string
  roleName: string
}

type State = {
  roles: Role[]
  loading: boolean
  moreLoading: boolean
}
type Actions = {
  getRoles: (payload?: { search: string }) => Promise<void>
  getRole: (id: string | number) => Promise<Role | undefined>
  // loadMore: () => Promise<void>
}

const limitData = 40
const skip = ref(0)

export const useRolesStore = defineStore<string, State, {}, Actions>("RolesStore", {
  state: () => ({
    roles: [],
    loading: false,
    moreLoading: false,

    search: "",
  }),
  actions: {
    async getRoles (payload) {
      const { search } = payload ?? {}
      this.search = search ?? ""

      this.loading = true
      skip.value = 0
      const {
        data,
        error,
      } = await useApiFetch("auth-service")("role/get", {
        params: {
          offset: skip.value,
          limit: limitData,
          ...(this.search && { fast_search: this.search }),
        },
      })
      if (error) {
        this.roles = []
        return
      }
      this.roles = data
      this.loading = false
    },
    async getRole (id) {
      this.loading = true
      const {
        data,
        error,
      } = await useApiFetch("auth-service")<Role>("role/get_by_id", { params: { id } })
      if (error) return
      this.loading = false
      return data
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
