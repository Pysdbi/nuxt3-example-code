<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4">
      <div class="flex-[4] flex flex-col gap-2">
        <WTextField
          v-model="roleName"
          placeholder="Наименование"
        />
        <WTextField
          v-model="roleDescription"
          placeholder="Описание роли"
        />
      </div>
      <div class="flex-[2] flex flex-col gap-2">
        <WCheckbox>
          Только чтение
        </WCheckbox>
        <WCheckbox>
          Полный доступ
        </WCheckbox>
      </div>
    </div>
    <WSelect activator-title="Админ" />
    <WSelect activator-title="Админ" />
    <WSelect activator-title="Админ" />
    <WSelect activator-title="Админ" />
    <WSelect activator-title="Админ" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, PropType } from "vue"

defineComponent({ name: "MSettingsRoleCard" })

const props = defineProps({
  name: {
    type: String,
    default: undefined,
  },
  description: {
    type: String,
    default: undefined,
  },
  permissions: {
    type: Array as PropType<Permissions[]>,
    default: () => [],
  },
})
const emit = defineEmits([ "update:name", "update:description" ])

const roleName = computed({
  get: () => props.name,
  set: (val) => emit("update:name", val),
})
const roleDescription = computed({
  get: () => props.description,
  set: (val) => emit("update:description", val),
})
</script>
