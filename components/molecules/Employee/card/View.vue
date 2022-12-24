<template>
  <div
    v-if="employee"
    class="m-employee-card__view-mode"
  >
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.birthdate') }}</div>
      <div>{{ formatDate(employee.birthdate) }}</div>
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.age') }}</div>
      <div>{{ calculateAge(employee.birthdate) }}</div>
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.email') }}</div>
      <div class="text-grey">
        {{ $t('undefined') }}
      </div>
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.phone') }}</div>
      <div>{{ employee.phone }}</div>
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.last-entered') }}</div>
      <WModal
        overlay
        :modal-title="$t('components.molecules.employee.card.terminal-history')"
      >
        <template #activator="{ open }">
          <WLink @click="showTerminalHistory(open)">
            {{ formatDateTime(employee.lastEntered) }}
          </WLink>
        </template>
        <WTable
          :columns="columns"
          :rows="terminalHistory"
          simple-table
          class="mt-4"
          :no-data-text="$t('no-data')"
        />
      </WModal>
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.is-in') }}</div>
      <WIndicator :value="employee.isIn" />
    </div>
    <div class="view__item col-span-2">
      <div>{{ $t('components.molecules.employee.card.roles') }}</div>
      <div>{{ employee.roles?.map(x => x.roleName).join('; ') }}</div>
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.created-date') }}</div>
      <div>{{ formatDate(employee.createdAt) }}</div>
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.blocked') }}</div>
      <WIndicator :value="employee.banFromWms" />
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.active') }}</div>
      <WIndicator :value="employee.isActive" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, PropType } from "vue"
import { calculateAge, formatDate, formatDateTime } from "@/util"
import { EmployeeInfo, TerminalHistoryItem } from "@/store/reference-books/employees"
import { useLocal } from "@/composables/locale"

const { t } = useLocal()

defineComponent({ name: "MEmployeeCardViewMode" })
defineProps({
  employee: {
    type: Object as PropType<EmployeeInfo>,
    default: undefined,
  },
  terminalHistory: {
    type: Array as PropType<TerminalHistoryItem[]>,
    default: () => [],
  },
})
const emit = defineEmits([ "click:terminalHistory" ])

const columns = {
  inDt: {
    header: t("input"),
    cell: cell => cell.getValue() ? formatDateTime(cell.getValue()) : "—",
  },
  outDt: {
    header: t("output"),
    cell: cell => cell.getValue() ? formatDateTime(cell.getValue()) : "—",
  },
}

function showTerminalHistory (open: Function): void {
  emit("click:terminalHistory")
  open()
}
</script>

<style>
.m-employee-card__view-mode {
  @apply grid grid-cols-2 gap-4;
}

/* Info Item Title */
.m-employee-card__view-mode .view__item div:first-child {
  @apply first:c1-text-reg-12 first:text-grey;
}

/* Info Item Content */
.m-employee-card__view-mode .view__item div:last-child {
  @apply b1-text-reg-16;
}
</style>
