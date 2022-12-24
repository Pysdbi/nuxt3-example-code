<template>
  <svg
    viewBox="0 0 76 76"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="w-loader"
    :class="[ sizeClasses ]"
  >
    <path
      d="M3 38C3 57.33 18.67 73 38 73C57.33 73 73 57.33 73 38C73 18.67 57.33 3 38 3"
      stroke="currentColor"
      stroke-width="6"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup lang="ts">
// Composables
import { useVariant, VariantSizes } from "@/composables/variant"

// Utilities
import { defineComponent, PropType } from "vue"

// Styles
import "./index.css"

defineComponent({ name: "WLink" })
const props = defineProps({
  size: {
    type: String as PropType<VariantSizes>,
    default: "base",
  },
})
const { variantClasses: sizeClasses } = useVariant(
  props.size, "w-loader", "size", [ "base" ],
)
</script>
