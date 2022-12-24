<template>
  <div class="pt-4 h-full w-full overflow-hidden">
    <WTable
      can-click-row
      enable-column-resizing
      hidden-filters
      hidden-sorting
      :rows="packages"
      :columns="columns"
      :loading="loading"
      @click:row="viewPackage"
    >
      <template #search="attrs">
        <WTableSearch
          v-bind="attrs"
          disable-global-filter
          @change="getPackages({ search: $event })"
        />
      </template>
      <template #prepend-search>
        <WButton
          size="xl"
          class="whitespace-nowrap"
          @click="createPackage"
        >
          <PlusIcon class="w-6 inline-block" />
          Добавить упаковку
        </WButton>
      </template>
      <template #cell-subjects="{ cell }">
        {{ cell.join(', ') || 'Все товары' }}
      </template>
    </WTable>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import { navigateTo, useLocal, useStateHeader } from "#imports"
import { storeToRefs } from "pinia"
import { usePackagesWBStore } from "@/store/settings/packages/wb"
import { formatDateTime } from "@/util"
import { Cell } from "@tanstack/vue-table"
import { getFIOByUser } from "@/store/user"

import PlusIcon from "@/assets/icons/plus.svg?component"
import { ClickItem } from "@/components/WTable/types"

defineComponent({ name: "PageSettingsPackagesWB" })

const { t } = useLocal()
const {
  setPageTitle,
  setNavigateBack,
} = useStateHeader()

setPageTitle(() => t("pages.settings.packages.wb.title"))
setNavigateBack(() => navigateTo("/settings/packages"))

const packagesWBStore = usePackagesWBStore()
const {
  packages,
  loading,
} = storeToRefs(packagesWBStore)
const { getPackages } = packagesWBStore

const columns = {
  parentName: {
    size: 180,
    header: t("pages.settings.columns.packages.wb.parentName"),
  },
  subjects: {
    size: 220,
    cell: (v: Cell<any, any>) => [ ...v.getValue() ].map(x => x.subjectName).join(", ") || "Все товары",
    header: t("pages.settings.columns.packages.wb.subjects"),
  },
  createdAt: {
    size: 200,
    cell: (v: Cell<any, any>) => formatDateTime(v.getValue()),
    header: t("pages.settings.columns.packages.wb.createdAt"),
  },
  user: {
    size: 220,
    cell: (v: Cell<any, any>) => {
      return getFIOByUser(v.row.original.user)
    },
    header: t("pages.settings.columns.packages.wb.user"),
  },
}

void getPackages()

async function createPackage (): Promise<void> {
  await navigateTo("/settings/packages/wb/create")
}

async function viewPackage (row: ClickItem): Promise<void> {
  await navigateTo(`/settings/packages/wb/${String(row.data.parentId)}`)
}
</script>
