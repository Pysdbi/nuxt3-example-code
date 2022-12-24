<template>
  <div class="pt-4 h-full w-full overflow-hidden">
    <WTable
      enable-multi-select
      enable-column-resizing
      :rows="blocks"
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
          @change="getBlocksSearch"
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
import { useBlocksStore } from "@/store/reference-books/blocks"

defineComponent({ name: "PageReferenceBooksEmployees" })

const { t } = useLocal()
const {
  setPageTitle,
  setNavigateBack,
} = useStateHeader()
setPageTitle(() => t("pages.reference-books.blocks"))
setNavigateBack(() => navigateTo("/reference-books"))

const blocksStore = useBlocksStore()
const {
  blocks,
  loading,
  moreLoading,
} = storeToRefs(blocksStore)
const {
  loadMore,
  getBlocks,
} = blocksStore

const getBlocksSearch = async (search: string): Promise<void> => getBlocks({ search })
const getBlocksFilters = async (filters: any): Promise<void> => getBlocks({ filters })

const columns = {
  whName: t("pages.reference-books.columns.blocks.whName"),
  officeId: t("pages.reference-books.columns.blocks.officeId"),
  abbreviation: t("pages.reference-books.columns.blocks.abbreviation"),
  createdAt: t("pages.reference-books.columns.blocks.createdAt"),
  employeId: t("pages.reference-books.columns.blocks.employeId"),
  isActive: t("pages.reference-books.columns.blocks.isActive"),
}

void getBlocks()
</script>
