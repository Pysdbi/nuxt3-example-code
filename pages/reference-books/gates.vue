<template>
  <div class="pt-4 h-full w-full overflow-hidden">
    <WTable
      enable-multi-select
      enable-column-resizing
      :rows="gates"
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
          @change="getGatesSearch"
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
import { useGatesStore } from "@/store/reference-books/gates"

defineComponent({ name: "PageReferenceBooksGates" })

const { t } = useLocal()
const {
  setPageTitle,
  setNavigateBack,
} = useStateHeader()
setPageTitle(() => t("pages.reference-books.gates"))
setNavigateBack(() => navigateTo("/reference-books"))

const gatesStore = useGatesStore()
const {
  gates,
  loading,
  moreLoading,
} = storeToRefs(gatesStore)
const {
  getGates,
  loadMore,
} = gatesStore

const getGatesSearch = async (search: string): Promise<void> => getGates({ search })
const getGatesFilters = async (filters: any): Promise<void> => getGates({ filters })

const columns = {
  id: t("pages.reference-books.columns.gates.id"),
  barcode: t("pages.reference-books.columns.gates.barcode"),
  blockId: t("pages.reference-books.columns.gates.blockId"),
  blockName: t("pages.reference-books.columns.gates.blockName"),
  gateNumber: t("pages.reference-books.columns.gates.gateNumber"),
  gateTypeName: t("pages.reference-books.columns.gates.gateTypeName"),
  gates_type_id: t("pages.reference-books.columns.gates.gates_type_id"),
  goodsIncomeTypes: t("pages.reference-books.columns.gates.goodsIncomeTypes"),
  isActive: t("pages.reference-books.columns.gates.isActive"),
  isMarketplace: t("pages.reference-books.columns.gates.isMarketplace"),
  isTransit: t("pages.reference-books.columns.gates.isTransit"),
  statusId: t("pages.reference-books.columns.gates.statusId"),
  updatedAt: t("pages.reference-books.columns.gates.updatedAt"),
  warehouseName: t("pages.reference-books.columns.gates.warehouseName"),
}

void getGates()
</script>
