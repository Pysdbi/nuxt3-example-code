<template>
  <div class="pt-4 h-full w-full overflow-hidden">
    <WTable
      can-click-row
      enable-column-resizing
      hidden-filters
      hidden-sorting
      :rows="suppliers"
      :columns="columns"
      :loading="loading"
      @click:row="viewSupplier"
    >
      <template #search="attrs">
        <WTableSearch
          v-bind="attrs"
          disable-global-filter
          @change="getSuppliers({ search: $event })"
        />
      </template>
      <template #prepend-search>
        <WButton
          size="xl"
          class="whitespace-nowrap"
          @click="createSupplier"
        >
          <PlusIcon class="w-6 inline-block" />
          Добавить поставщика
        </WButton>
      </template>
    </WTable>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import { navigateTo, useLocal, useStateHeader } from "#imports"
import { storeToRefs } from "pinia"
import { formatDateTime } from "@/util"
import { Cell } from "@tanstack/vue-table"
import { getFIOByUser } from "@/store/user"

import PlusIcon from "@/assets/icons/plus.svg?component"
import { ClickItem } from "@/components/WTable/types"
import { usePackagesSuppliersStore } from "@/store/settings/packages/suppliers"

defineComponent({ name: "PageSettingsPackagesWB" })

const { t } = useLocal()
const {
  setPageTitle,
  setNavigateBack,
} = useStateHeader()
setPageTitle(() => t("pages.settings.packages.suppliers.title"))
setNavigateBack(() => navigateTo("/settings/packages"))

const packagesSuppliersStore = usePackagesSuppliersStore()
const {
  suppliers,
  loading,
} = storeToRefs(packagesSuppliersStore)
const { getSuppliers } = packagesSuppliersStore

const columns = {
  supplierId: {
    size: 100,
    header: t("pages.settings.columns.packages.suppliers.supplierId"),
  },
  supplierName: {
    size: 220,
    header: t("pages.settings.columns.packages.suppliers.supplierName"),
  },
  createdAt: {
    size: 200,
    cell: (v: Cell<any, any>) => formatDateTime(v.getValue()),
    header: t("pages.settings.columns.packages.suppliers.createdAt"),
  },
  user: {
    size: 220,
    cell: (v: Cell<any, any>) => {
      return getFIOByUser(v.row.original.user)
    },
    header: t("pages.settings.columns.packages.suppliers.user"),
  },
}

void getSuppliers()

async function createSupplier (): Promise<void> {
  await navigateTo("/settings/packages/suppliers/create")
}

async function viewSupplier (row: ClickItem): Promise<void> {
  await navigateTo(`/settings/packages/suppliers/${String(row.data.supplierId)}`)
}
</script>
