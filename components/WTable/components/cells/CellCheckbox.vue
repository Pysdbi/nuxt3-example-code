<template>
  <div class="table-cell__checkbox">
    <WCheckbox
      :checked="value"
      @update:checked="emit('change', $event)"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"

// Icons

defineComponent({ name: "WCellCheckbox" })

defineProps({ value: Boolean })
const emit = defineEmits([ "change" ])
</script>

<style>
.table-cell__checkbox > :first-child {
  @apply flex justify-center;
}
</style>
