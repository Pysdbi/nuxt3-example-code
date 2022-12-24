<template>
  <component
    :is="tag"
    class="w-link"
    :class="[
      { 'w-link--disabled': isDisabled },
      [ sizeClasses ],
    ]"
    :href="href"
    :disabled="isDisabled || undefined"
    @click.prevent="onClick"
  >
    <slot>{{ content }}</slot>
  </component>
</template>

<script setup lang="ts">
// Composables
import { useVariant, VariantSizes } from "@/composables/variant"

// Utilities
import { computed, defineComponent, PropType } from "vue"

// Styles
import "./index.css"

defineComponent({ name: "WLink" })
const props = defineProps({
  disabled: Boolean,
  tag: {
    type: String,
    default: "a",
  },
  content: {
    type: String,
    default: undefined,
  },
  href: {
    type: String,
    default: undefined,
  },

  size: {
    type: String as PropType<VariantSizes>,
    default: "base",
  },
})
const emit = defineEmits([ "click" ])
const { variantClasses: sizeClasses } = useVariant(
  props.size, "w-link", "size", [ "base" ],
)

const isDisabled = computed(() => props.disabled)

const onClick = (): void => {
  if (isDisabled.value) return
  emit("click")
}
</script>
