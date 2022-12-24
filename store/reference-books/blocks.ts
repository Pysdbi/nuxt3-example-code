import { defineStore } from "pinia"
import { ref } from "vue"
import { useApiFetch } from "@/composables/api"

type Block = {
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
  blocks: Block[]
  loading: boolean
  moreLoading: boolean
}
type Actions = {
  getBlocks: (payload?: { search?: string, filters?: Record<string, any> }) => Promise<void>
  loadMore: () => Promise<void>
}

const limitData = 40
const skip = ref(0)

export const useBlocksStore = defineStore<string, State, {}, Actions>("BlocksStore", {
  state: () => ({
    blocks: [],
    loading: false,
    moreLoading: false,

    search: "",
  }),
  actions: {
    async getBlocks (payload) {
      const { search } = payload ?? {}
      this.search = search ?? ""

      this.loading = true
      skip.value = 0
      const {
        data,
        error,
      } = await useApiFetch("web-admin-backend")("blocks/", {
        params: {
          offset: skip.value,
          limit: limitData,
          ...(this.search && { fast_search: this.search }),
        },
      })
      if (error) {
        this.blocks = []
        return
      }
      this.blocks = data
      this.loading = false
    },

    async loadMore () {
      if (!this.blocks.length || this.moreLoading) return
      this.moreLoading = true
      const {
        data,
        error,
      } = await useApiFetch("web-admin-backend")("blocks/", {
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
      this.blocks = [ ...this.blocks, ...data ]
      skip.value += limitData
      this.moreLoading = false
    },

  },
})
