<template>
  <WIndicator
    :value="value"
    :keys="keys"
    :colors="colors"
  >
    <slot />
  </WIndicator>
</template>

<script setup lang="ts">
import { defineComponent, PropType } from "vue"
import WIndicator from "@/components/WIndicator/index.vue"

defineComponent({ name: "WCellStatus" })

type MapValues = Record<string, string>
defineProps({
  value: {
    type: [ String, Boolean, Number ] as PropType<any>,
    default: undefined,
  },
  keys: {
    type: Object as PropType<MapValues>,
    default: undefined,
  },
  colors: {
    type: Object as PropType<MapValues>,
    default: undefined,
  },
})
</script>
