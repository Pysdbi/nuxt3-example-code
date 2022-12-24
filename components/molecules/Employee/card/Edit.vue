<template>
  <div
    v-if="modelValue"
    class="m-employee-card__edit-mode"
  >
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.birthdate') }}</div>
      <div>{{ formatDate(modelValue.birthdate) }}</div>
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.age') }}</div>
      <div>{{ calculateAge(modelValue.birthdate) }}</div>
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.email') }}</div>
      <div>{{ $t('undefined') }}</div>
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.phone') }}</div>
      <div>{{ modelValue.phone }}</div>
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.last-entered') }}</div>
      <div>
        {{ formatDateTime(modelValue.lastEntered) }}
      </div>
    </div>
    <div class="view__item">
      <div />
      <WCheckbox
        v-if="useAllowed('USERS_ASSIGN_ROLES')"
        v-model="editedEmployee.isIn"
        :label="$t('components.molecules.employee.card.is-in')"
      />
    </div>
    <div class="view__item col-span-2">
      <div />
      <WSelect
        v-if="useAllowed('USERS_ASSIGN_ROLES')"
        v-model="editedEmployee.roles"
        multiple
        :activator-title="$t('components.molecules.employee.card.roles')"
        item-title="roleName"
        :items="roles"
        :by="(a, z) => (a.id === z.id)"
      />
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.created-date') }}</div>
      <div>{{ formatDate(modelValue.createdAt) }}</div>
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.blocked') }}</div>
      <WIndicator :value="modelValue.banFromWms" />
    </div>
    <div class="view__item">
      <div>{{ $t('components.molecules.employee.card.active') }}</div>
      <WIndicator :value="modelValue.isActive" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, PropType, ref, watch } from "vue"
import { useAllowed } from "#imports"
import { calculateAge, formatDate, formatDateTime } from "@/util"
import { EmployeeInfo, Role } from "@/store/reference-books/employees"

defineComponent({ name: "MEmployeeCardEditMode" })
const props = defineProps({
  modelValue: {
    type: Object as PropType<EmployeeInfo>,
    default: () => ({}),
  },
  roles: {
    type: Array as PropType<Role[]>,
    default: () => [],
  },
})
const emit = defineEmits([ "update:modelValue" ])

const editedEmployee = ref<EmployeeInfo>(props.modelValue)
watch(editedEmployee, val => emit("update:modelValue", val), { deep: true })
</script>

<style>
.m-employee-card__edit-mode {
  @apply grid grid-cols-2 gap-4;
}

/* Info Item Title */
.m-employee-card__edit-mode .view__item div:first-child {
  @apply first:c1-text-reg-12 first:text-grey;
}

/* Info Item Content */
.m-employee-card__edit-mode .view__item div:last-child {
  @apply b1-text-reg-16;
}
</style>
