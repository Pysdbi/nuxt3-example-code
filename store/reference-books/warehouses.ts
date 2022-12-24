import { defineStore } from "pinia"
import { ref } from "vue"
import { useApiFetch } from "@/composables/api"

type Warehouse = {
  abbreviation: string
  employeId: number
  employeUpdId: number
  id: number
  isClosed: boolean
  officeId: number
  whId: number
  whName: string
  createdAt: string
}

type State = {
  warehouses: Warehouse[]
  loading: boolean
  moreLoading: boolean
}
type Actions = {
  getWarehouses: (payload?: { search?: string, filters?: Record<string, any> }) => Promise<void>
  loadMore: () => Promise<void>
}

const limitData = 40
const skip = ref(0)

export const useWarehousesStore = defineStore<string, State, {}, Actions>("WarehousesStore", {
  state: () => ({
    warehouses: [],
    loading: false,
    moreLoading: false,

    search: "",
  }),
  actions: {
    async getWarehouses (payload) {
      const { search } = payload ?? {}
      this.search = search ?? ""

      this.loading = true
      skip.value = 0
      const {
        data,
        error,
      } = await useApiFetch("web-admin-backend")("warehouses/", {
        params: {
          offset: skip.value,
          limit: limitData,
          ...(this.search && { fast_search: this.search }),
        },
      })
      if (error) {
        this.warehouses = []
        return
      }
      this.warehouses = data
      this.loading = false
    },

    async loadMore () {
      if (!this.warehouses.length || this.moreLoading) return
      this.moreLoading = true
      const {
        data,
        error,
      } = await useApiFetch("web-admin-backend")("warehouses/", {
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
      this.warehouses = [ ...this.warehouses, ...data ]
      skip.value += limitData
      this.moreLoading = false
    },

  },
})
