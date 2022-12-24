<template>
  <div class="pt-4 h-full w-full overflow-hidden">
    <WTable
      can-click-row
      enable-multi-select
      enable-column-resizing
      :rows="workers"
      :columns="columns"
      :loading="loading"
      :more-loading="moreLoading"
      @infinite-scroll="loadMore"
      @click:row="clickRow"
    >
      <template #prepend-search>
        <WButton
          size="xl"
          class="whitespace-nowrap"
          @click="toggleShowSearchEmployeeId"
        >
          <PlusIcon class="w-6 inline-block" />
          Назначить работу
        </WButton>
      </template>

      <template #filters="attrs">
        <WTableFilters
          v-bind="attrs"
          disable-global-filter
          :inputs-options="filterInputsOptions"
          @click:apply="getWorkers"
        />
      </template>
    </WTable>

    <!-- Search Employee -->
    <WModal
      v-model="showSearchEmployeeId"
      modal-title="Введите EID сотрудника"
      overlay
    >
      <div class="mt-4">
        <WTextField
          v-model="searchEmployeeId"
          placeholder="EID сотрудника"
          class="w-full"
        />
        <div class="flex gap-2 mt-4">
          <WButton
            class="w-full"
            size="lg"
            :disabled="!searchEmployeeId"
            @click="openSearchEmployeeCard"
          >
            Далее
          </WButton>
          <WButton
            outlined
            class="w-full"
            size="lg"
            @click="toggleShowSearchEmployeeId"
          >
            Отменить
          </WButton>
        </div>
      </div>
    </WModal>

    <!-- Employee Card -->
    <WModal
      v-slot="{ setTitle }"
      v-model="employeeCardModal"
      modal-title="Карточка сотрудника"
      overlay
      mount-by-model-value
    >
      <Suspense>
        <template #fallback>
          <MAssignJobEmployeeCardSkeleton />
        </template>
        <MAssignJobEmployeeCard
          :e-id="selectedWorkerId"
          @employee:404="employeeNotFound"
          @update:employee-title="setTitle"
        />
      </Suspense>
    </WModal>
  </div>
</template>

<script setup lang="ts">
import { booleanRef, formatDateTime } from "@/util"
import { storeToRefs } from "pinia"
import { defineComponent, ref, watch } from "vue"
import { useAlerts, useLocal, useStateHeader } from "#imports"
import { ClickItem } from "@/components/WTable/types"
import PlusIcon from "@/assets/icons/plus.svg?component"
import { useAssignJobStore } from "@/store/assign-job"
import { Cell } from "@tanstack/vue-table"
import { getFIOByUser } from "@/store/user"
import MAssignJobEmployeeCard from "@/components/molecules/Employee/assign-job-card/index.vue"
import MAssignJobEmployeeCardSkeleton from "@/components/molecules/Employee/assign-job-card/skeleton.vue"

defineComponent({ name: "PageAssignJob" })

const { t } = useLocal()
const { setPageTitle } = useStateHeader()
setPageTitle(() => t("pages.assign-job.title"))

const {
  value: showSearchEmployeeId,
  toggle: toggleShowSearchEmployeeId,
} = booleanRef(false)
const searchEmployeeId = ref()
watch(showSearchEmployeeId, () => (searchEmployeeId.value = undefined))

const {
  value: employeeCardModal,
  toggle: toggleEmployeeCardModal,
} = booleanRef(false)
const selectedWorkerId = ref<number>()
watch(employeeCardModal, (val) => {
  if (!val) selectedWorkerId.value = undefined
})

const clickRow = (row: ClickItem): void => {
  toggleEmployeeCardModal()
  selectedWorkerId.value = row.data.employeeId
}

const assignJobStore = useAssignJobStore()
const {
  workers,
  loading,
  moreLoading,
} = storeToRefs(assignJobStore)
const {
  loadMore,
  getWorkers,
} = assignJobStore

const columns = {
  employeeId: t("pages.assign-job.columns.employeeId"),
  fio: {
    cell: (v: Cell<any, any>) => {
      return getFIOByUser(v.row.original)
    },
    size: 350,
    header: t("pages.assign-job.columns.fio"),
  },
  blockName: { header: t("pages.assign-job.columns.blockName") },
  workName: { header: t("pages.assign-job.columns.workName") },
  workStartedAt: {
    size: 300,
    header: t("pages.assign-job.columns.workStartedAt"),
  },
}
void getWorkers()
await assignJobStore.getBlocks()
const workplaces = ref()
workplaces.value = await assignJobStore.getWorkplaces(true) ?? []

const filterInputsOptions = {
  employeeId: {
    type: "text",
    placeholder: columns.employeeId,
  },
  blockId: {
    type: "select",
    activatorTitle: columns.blockName.header,
    placeholder: columns.blockName.header,
    items: assignJobStore.blocks,
    itemTitle: "whName",
    itemValue: (item: any) => item?.id,
  },
  workId: {
    type: "select",
    activatorTitle: columns.workName.header,
    placeholder: columns.workName.header,
    items: workplaces.value,
    itemTitle: "name",
    itemValue: (item: any) => item?.id,
  },
  startedFromDt: {
    type: "text",
    inputType: "datetime-local",
    placeholder: "Дата начала",
    itemValue: (item: any) => item !== undefined ? formatDateTime(item, true) : item,
  },
  startedToDt: {
    type: "text",
    inputType: "datetime-local",
    placeholder: "Дата окончания",
    itemValue: (item: any) => item !== undefined ? formatDateTime(item, true) : item,
  },
}

const openSearchEmployeeCard = (): void => {
  selectedWorkerId.value = searchEmployeeId.value
  toggleShowSearchEmployeeId()
  toggleEmployeeCardModal()
}

const employeeNotFound = (): void => {
  useAlerts().error("Пользователь не найден")
  toggleEmployeeCardModal()
  if (searchEmployeeId.value) {
    searchEmployeeId.value = undefined
    toggleShowSearchEmployeeId()
  }
}
</script>
