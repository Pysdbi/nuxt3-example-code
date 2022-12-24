import { defineStore } from "pinia"
import { ref } from "vue"
import { useApiFetch } from "@/composables/api"

type Gate = {
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
  gates: Gate[]
  loading: boolean
  moreLoading: boolean
}
type Actions = {
  getGates: (payload?: { search?: string, filters?: Record<string, any> }) => Promise<void>
  loadMore: () => Promise<void>
}

const limitData = 40
const skip = ref(0)

export const useGatesStore = defineStore<string, State, {}, Actions>("GatesStore", {
  state: () => ({
    gates: [],
    loading: false,
    moreLoading: false,

    search: "",
  }),
  actions: {
    async getGates (payload) {
      const { search } = payload ?? {}
      this.search = search ?? ""

      this.loading = true
      skip.value = 0
      const {
        data,
        error,
      } = await useApiFetch("web-admin-backend")("gates/", {
        params: {
          offset: skip.value,
          limit: limitData,
          ...(this.search && { fast_search: this.search }),
        },
      })
      if (error) {
        this.gates = []
        return
      }
      this.gates = data
      this.loading = false
    },

    async loadMore () {
      if (!this.gates.length || this.moreLoading) return
      this.moreLoading = true
      const {
        data,
        error,
      } = await useApiFetch("web-admin-backend")("gates/", {
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
      this.gates = [ ...this.gates, ...data ]
      skip.value += limitData
      this.moreLoading = false
    },

  },
})
