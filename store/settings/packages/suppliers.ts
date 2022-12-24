import { defineStore } from "pinia"
import { ref } from "vue"
import { ApiResponse, useApiFetch } from "@/composables/api"
import { Package } from "@/store/settings/packages/wb"

export type Supplier = {
  supplierId: number
  supplierName: string
  createdAt: string
  user: {
    eid: number
    firstName: string
    lastName: string
    middleName: string
  }
}
export type SupplierInfo = {
  packages: Package[]
  supplierId: number
  supplierName: string
}
export type Parent = {
  parentId: number
  parentName: string
}

type State = {
  suppliers: Supplier[]
  loading: boolean
  moreLoading: boolean
  search: string
  suppliersItems: []
}
type Actions = {
  getSuppliers: (payload?: { search: string }) => Promise<void>
  // Supplier
  getSupplier: (id: string | number) => Promise<SupplierInfo | undefined>
  createSupplier: (supplierID: number, payload?: Array<{ parentId: number, subjectIds: number[] }>) => Promise<ApiResponse>
  deleteSupplier: (supplierID: number) => Promise<void>
  getSuppliersItems: (params?: { wb: boolean }) => Promise<void>
  // Supplier Package
  createPackage: (supplierID: number, payload?: { parentId: number, subjectIds: number[] }) => Promise<ApiResponse>
  updatePackage: (supplierID: number, payload: { parentId: number, subjectIds: number[] }) => Promise<ApiResponse>
  deletePackage: (supplierID: number, parentId: number) => Promise<void>
}

const limitData = 40
const skip = ref(0)

export const usePackagesSuppliersStore = defineStore<string, State, {}, Actions>("PackagesSuppliersStore", {
  state: () => ({
    suppliers: [],
    loading: false,
    moreLoading: false,
    search: "",

    suppliersItems: [],
  }),
  actions: {
    async getSuppliers (payload) {
      const { search } = payload ?? {}
      this.search = search ?? ""

      this.loading = true
      skip.value = 0
      const {
        data,
        error,
      } = await useApiFetch("wms-package")("packages/supplier", {
        params: {
          offset: skip.value,
          limit: limitData,
          ...(this.search && { search: this.search }),
        },
      })
      this.loading = false
      if (error) {
        this.suppliers = []
        return
      }
      this.suppliers = data
    },

    // Get supplier by id
    async getSupplier (id) {
      this.loading = true
      const {
        data,
        error,
      } = await useApiFetch("wms-package")<SupplierInfo>(`packages/supplier/${id}`)
      this.loading = false
      if (error) return
      return data
    },

    // Create Supplier
    async createSupplier (supplierId, payload) {
      return useApiFetch("wms-package")("packages/supplier", {
        method: "POST",
        body: {
          supplierId,
          packages: payload,
        },
      })
    },

    // Get suppliers items
    async getSuppliersItems (params) {
      const {
        data,
        error,
      } = await useApiFetch("wms-package")("suppliers", { params })
      if (error) {
        this.suppliersItems = []
        return
      }
      this.suppliersItems = data
    },

    // Create Package
    async createPackage (supplierId, payload) {
      return useApiFetch("wms-package")(`packages/supplier/${supplierId}`, {
        method: "POST",
        body: payload,
      })
    },
    // Update Package
    async updatePackage (supplierId, payload) {
      return useApiFetch("wms-package")(`packages/supplier/${supplierId}/parent/${payload.parentId}`, {
        method: "PUT",
        body: { subjectIds: payload.subjectIds },
      })
    },
    // Delete Supplier
    async deleteSupplier (supplierId) {
      await useApiFetch("wms-package")("packages/supplier", {
        method: "DELETE",
        params: { supplier_ids: [ supplierId ] },
      })
    },
    // Delete Supplier Package
    async deletePackage (supplierId, parentId) {
      await useApiFetch("wms-package")(`packages/supplier/${supplierId}`, {
        method: "DELETE",
        params: { parent_ids: [ parentId ] },
      })
    },
  },
})
