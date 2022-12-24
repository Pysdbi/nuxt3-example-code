<template>
  <div class="pt-4 h-full w-full overflow-hidden">
    <WTable
      can-click-row
      enable-multi-select
      enable-column-resizing
      :rows="users"
      :columns="columns"
      :loading="loading"
      :more-loading="moreLoading"
      @infinite-scroll="loadMore"
      @click:row="clickRow"
    >
      <template #search="attrs">
        <WTableSearch
          v-bind="attrs"
          disable-global-filter
          @change="getUsers({ search: $event })"
        />
      </template>

      <template #filters="attrs">
        <WTableFilters
          v-bind="attrs"
          disable-global-filter
          :inputs-options="filterInputsOptions"
          @click:apply="getUsers"
        />
      </template>

      <template #cell-isActive="{ cell }">
        <WCellStatus :value="cell" />
      </template>
    </WTable>

    <WModal
      v-slot="{ close, setTitle }"
      v-model="employeeCardModal"
      :modal-title="t('components.molecules.employee.card.employee-card')"
      overlay
    >
      <MEmployeeCard
        :e-id="selectedEmployee?.employeeId"
        :cancel="close"
        @update:employee-title="setTitle"
      />
    </WModal>
  </div>
</template>

<script setup lang="ts">
import { booleanRef } from "@/util"
import { storeToRefs } from "pinia"
import { defineComponent, ref } from "vue"
import { navigateTo, useLocal, useStateHeader } from "#imports"
import { Employee, useEmployeesStore } from "@/store/reference-books/employees"
import WCellStatus from "@/components/WTable/components/cells/CellStatus.vue"
import { ClickItem } from "@/components/WTable/types"
import MEmployeeCard from "@/components/molecules/Employee/card/index.vue"

defineComponent({ name: "PageReferenceBooksEmployees" })

const { t } = useLocal()
const {
  setPageTitle,
  setNavigateBack,
} = useStateHeader()
setPageTitle(() => t("pages.reference-books.employees"))
setNavigateBack(() => navigateTo("/reference-books"))

const {
  value: employeeCardModal,
  toggle: toggleEmployeeCardModal,
} = booleanRef(false)
const selectedEmployee = ref<Employee>()

const clickRow = (row: ClickItem): void => {
  toggleEmployeeCardModal()
  selectedEmployee.value = row.data
}

const employeeStore = useEmployeesStore()
const {
  users,
  loading,
  moreLoading,
} = storeToRefs(employeeStore)
const {
  loadMore,
  getUsers,
} = employeeStore

const columns = {
  employeeId: t("pages.reference-books.columns.employees.employeeId"),
  lastname: t("pages.reference-books.columns.employees.lastname"),
  firstname: t("pages.reference-books.columns.employees.firstname"),
  middlename: t("pages.reference-books.columns.employees.middlename"),
  phone: t("pages.reference-books.columns.employees.phone"),
  sex: t("pages.reference-books.columns.employees.sex"),
  birthdate: t("pages.reference-books.columns.employees.birthdate"),
  departmentId: t("pages.reference-books.columns.employees.departmentId"),
  isActive: t("pages.reference-books.columns.employees.isActive"),
}

void getUsers()

const filterInputsOptions = {
  employeeId: {
    type: "text",
    placeholder: columns.employeeId,
  },
  lastname: {
    type: "text",
    placeholder: columns.lastname,
  },
  firstname: {
    type: "text",
    placeholder: columns.firstname,
  },
  middlename: {
    type: "text",
    placeholder: columns.middlename,
  },
  phone: {
    type: "text",
    placeholder: columns.phone,
  },
  isActive: {
    type: "select",
    activatorTitle: columns.isActive,
    items: [
      {
        title: t("yes"),
        value: true,
      },
      {
        title: t("not"),
        value: false,
      },
    ],
    itemValue: (x) => x.value,
  },
  sex: {
    type: "select",
    activatorTitle: columns.sex,
    items: [
      {
        title: "Мужчина",
        value: "M",
      }, {
        title: "Женщина",
        value: "F",
      },
    ],
  },
  birthdate: {
    type: "text",
    placeholder: columns.birthdate,
  },
  departmentId: {
    type: "text",
    placeholder: columns.departmentId,
  },
}
</script>
