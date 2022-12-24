import { defineStore } from "pinia"
import { ref } from "vue"
import { ApiResponse, useApiFetch } from "@/composables/api"

export type PackageParent = {
  parentId: number
  parentName: string
  isUsed?: boolean
}

export type PackageSubject = {
  subjectId: number
  subjectName: string
}

export type Package = PackageParent & {
  createdAt: string
  subjects: PackageSubject[]
  user: {
    eid: number
    firstName: string
    lastName: string
    middleName: string
  }
}
export type Parent = {
  parentId: number
  parentName: string
}

type State = {
  packages: Package[]
  loading: boolean
  moreLoading: boolean
}
type Actions = {
  getPackages: (payload?: { search: string }) => Promise<void>
  createPackage: (payload?: { parentId: number, subjectIds: number[] }) => Promise<ApiResponse>
  updatePackage: (payload: { parentId: number, subjectIds: number[] }) => Promise<ApiResponse>
  deletePackage: (parentId: number) => Promise<void>
  getPackage: (id: string | number) => Promise<Package | undefined>
  getParents: (options?: { wb?: boolean }) => Promise<Parent[]>
  getSubjects: (id: string | number) => Promise<PackageSubject[]>
}

const limitData = 40
const skip = ref(0)

export const usePackagesWBStore = defineStore<string, State, {}, Actions>("PackagesStore", {
  state: () => ({
    packages: [],
    loading: false,
    moreLoading: false,

    search: "",
  }),
  actions: {
    async getPackages (payload) {
      const { search } = payload ?? {}
      this.search = search ?? ""

      this.loading = true
      skip.value = 0
      const {
        data,
        error,
      } = await useApiFetch("wms-package")("packages/wb", {
        params: {
          offset: skip.value,
          limit: limitData,
          ...(this.search && { search: this.search }),
        },
      })
      this.loading = false
      if (error) {
        this.packages = []
        return
      }
      this.packages = data
    },
    // Create Package
    async createPackage (payload) {
      return useApiFetch("wms-package")("packages/wb", {
        method: "POST",
        body: payload,
      })
    },
    // Update Package
    async updatePackage (payload) {
      return useApiFetch("wms-package")(`packages/wb/parent/${payload.parentId}`, {
        method: "PUT",
        body: { subjectIds: payload.subjectIds },
      })
    },
    // Delete Package
    async deletePackage (parentId) {
      await useApiFetch("wms-package")("packages/wb/parent", {
        method: "DELETE",
        params: { parent_ids: [ parentId ] },
      })
    },

    // Get package by id
    async getPackage (id) {
      this.loading = true
      const {
        data,
        error,
      } = await useApiFetch("wms-package")<Package>(`packages/wb/parent/${id}`)
      this.loading = false
      if (error) return
      return data
    },

    // Categories
    async getParents (options) {
      const {
        data,
        error,
      } = await useApiFetch("wms-package")<Parent[]>("parents", { params: options })
      if (error) return []
      return data
    },

    // Subcategories
    async getSubjects (id) {
      const {
        data,
        error,
      } = await useApiFetch("wms-package")<PackageSubject[]>(`parents/${id}/subjects`)
      if (error) return []
      return data
    },
  },
})
