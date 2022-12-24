<template>
  <div class="pt-4 h-full w-full overflow-hidden">
    <WTable
      enable-multi-select
      enable-column-resizing
      :rows="warehouses"
      :columns="columns"
      :loading="loading"
      :more-loading="moreLoading"
      hidden-filters
      @infinite-scroll="loadMore"
    >
      <template #search="attrs">
        <WTableSearch
          v-bind="attrs"
          disable-global-filter
          @change="getWarehousesSearch"
        />
      </template>

      <template #cell-isActive="{ cell }">
        <WCellStatus :value="cell" />
      </template>
    </WTable>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import { navigateTo, useLocal, useStateHeader } from "#imports"
import { storeToRefs } from "pinia"
import WCellStatus from "@/components/WTable/components/cells/CellStatus.vue"
import { useWarehousesStore } from "@/store/reference-books/warehouses"

defineComponent({ name: "PageReferenceBooksWarehouses" })

const { t } = useLocal()
const {
  setPageTitle,
  setNavigateBack,
} = useStateHeader()
setPageTitle(() => t("pages.reference-books.warehouses"))
setNavigateBack(() => navigateTo("/reference-books"))

const warehousesStore = useWarehousesStore()
const {
  warehouses,
  loading,
  moreLoading,
} = storeToRefs(warehousesStore)
const {
  loadMore,
  getWarehouses,
} = warehousesStore

const getWarehousesSearch = async (search: string): Promise<void> => getWarehouses({ search })
const getWarehousesFilters = async (filters: any): Promise<void> => getWarehouses({ filters })

const columns = {
  address: t("pages.reference-books.columns.warehouses.address"),
  allowKgt: t("pages.reference-books.columns.warehouses.allowKgt"),
  boxTypeMask: t("pages.reference-books.columns.warehouses.boxTypeMask"),
  boxTypeString: t("pages.reference-books.columns.warehouses.boxTypeString"),
  canRequestPass: t("pages.reference-books.columns.warehouses.canRequestPass"),
  checksMask: t("pages.reference-books.columns.warehouses.checksMask"),
  destinationWarehousesString: t("pages.reference-books.columns.warehouses.destinationWarehousesString"),
  displayName: t("pages.reference-books.columns.warehouses.displayName"),
  gln: t("pages.reference-books.columns.warehouses.gln"),
  id: t("pages.reference-books.columns.warehouses.id"),
  isActive: t("pages.reference-books.columns.warehouses.isActive"),
  isActiveInternal: t("pages.reference-books.columns.warehouses.isActiveInternal"),
  isSortingCenter: t("pages.reference-books.columns.warehouses.isSortingCenter"),
  isSupplierWarehouse: t("pages.reference-books.columns.warehouses.isSupplierWarehouse"),
  isTransitActive: t("pages.reference-books.columns.warehouses.isTransitActive"),
  name: t("pages.reference-books.columns.warehouses.name"),
  needInterval: t("pages.reference-books.columns.warehouses.needInterval"),
  turnoverString: t("pages.reference-books.columns.warehouses.turnoverString"),
}

void getWarehouses()
</script>
