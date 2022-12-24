<template>
  <div class="pt-4 h-full w-full overflow-hidden">
    <WTable
      can-click-row
      enable-multi-select
      enable-column-resizing
      hidden-filters
      hidden-sorting
      :rows="incidents"
      :columns="columns"
      :loading="loading"
      :more-loading="moreLoading"
      @click:row="clickRow"
    >
      <template #cell-status="{ cell }">
        <WCellStatus
          :value="cell"
          :keys="cellStatus.keys"
          :colors="cellStatus.colors"
        />
      </template>
      <template #cell-priority="{ cell }">
        <WCellStatus
          :value="cell"
          :keys="cellPriority.keys"
          :colors="cellPriority.colors"
        />
      </template>
    </WTable>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, reactive } from "vue"
import { navigateTo, useLocal, useStateHeader } from "#imports"
import { storeToRefs } from "pinia"
import WCellStatus from "@/components/WTable/components/cells/CellStatus.vue"
import { useIncidentsStore } from "@/store/settings/incidents"
import { formatDateTime } from "@/util"
import { Cell } from "@tanstack/vue-table"
import { ClickItem } from "@/components/WTable/types"

defineComponent({ name: "PageSettingsIncidents" })

const { t } = useLocal()
const {
  setPageTitle,
  setNavigateBack,
} = useStateHeader()
setPageTitle(() => t("pages.settings.incidents-pallet"))
setNavigateBack(() => navigateTo("/settings"))

const incidentsStore = useIncidentsStore()
const {
  incidents,
  loading,
  moreLoading,
} = storeToRefs(incidentsStore)
const { getIncidents } = incidentsStore

const clickRow = async (row: ClickItem): Promise<void> => {
  await navigateTo(`/settings/incidents/${String(row.data.id)}`)
}

const columns = {
  id: {
    size: 80,
    header: t("pages.settings.columns.incidents.id"),
  },
  createdAt: {
    cell: (v: Cell<any, any>) => formatDateTime(v.getValue()),
    header: t("pages.settings.columns.incidents.createdAt"),
  },
  whId: t("pages.settings.columns.incidents.whId"),
  status: t("pages.settings.columns.incidents.status"),
  priority: { header: t("pages.settings.columns.incidents.priority") },
  appName: t("pages.settings.columns.incidents.appName"),
  appVersion: t("pages.settings.columns.incidents.appVersion"),
  type: t("pages.settings.columns.incidents.type"),
  resolverName: t("pages.settings.columns.incidents.resolverName"),
  solution: t("pages.settings.columns.incidents.solution"),
}

const cellStatus = reactive({
  keys: {
    created: t("pages.settings.cells.incidents.status.created"),
    resolved: t("pages.settings.cells.incidents.status.resolved"),
    ignored: t("pages.settings.cells.incidents.status.ignored"),
  },
  colors: {
    created: "#ff5c00",
    resolved: "#497af9",
    ignored: "#1dcb43",
  },
})

const cellPriority = reactive({
  keys: {
    high: t("pages.settings.cells.incidents.priority.high"),
    medium: t("pages.settings.cells.incidents.priority.medium"),
    low: t("pages.settings.cells.incidents.priority.low"),
  },
  colors: {
    high: "#ff5c00",
    medium: "#497af9",
    low: "#1dcb43",
  },
})

void getIncidents()
</script>
