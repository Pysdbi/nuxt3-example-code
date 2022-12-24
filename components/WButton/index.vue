<template>
  <component
    :is="tag"
    class="w-button"
    :class="[
      {
        'w-button--disabled': isDisabled || loading,
        'w-button--rounded-full': roundedFull,
        'w-button--icon': icon,
      },
      [ variantClasses, sizeClasses, colorClasses ],
    ]"
    :disabled="isDisabled || loading || undefined"
    @click="onClick"
  >
    <span
      v-if="$slots?.prepend?.()"
      class="w-button__prepend"
    >
      <slot name="prepend" />
    </span>

    <span>
      <slot v-if="!loading" />
      <span
        v-else
        class="flex justify-center"
      >
        <WLoader size="sm" />
      </span>
    </span>

    <span
      v-if="$slots?.append?.()"
      class="w-button__append"
    >
      <slot name="append" />
    </span>
  </component>
</template>

<script setup lang="ts">
// Composables
import { useVariant, VariantSizes } from "@/composables/variant"

// Utilities
import { computed, defineComponent, PropType } from "vue"

// Styles
import "./index.css"

defineComponent({ name: "WButton" })
const props = defineProps({
  disabled: Boolean,
  tag: {
    type: String,
    default: "button",
  },
  // prependIcon: any,
  // appendIcon: any,

  roundedFull: Boolean,
  outlined: Boolean,
  text: Boolean,
  icon: Boolean,
  loading: Boolean,
  color: {
    type: String as PropType<"orange">,
    default: "default",
  },

  size: {
    type: String as PropType<VariantSizes>,
    default: "sm",
  },
})
const emit = defineEmits([ "click" ])
const variant = {
  outlined: props.outlined,
  text: props.text,
}
const { variantClasses } = useVariant(
  variant, "w-button",
)
const { variantClasses: sizeClasses } = useVariant(
  props.size, "w-button", "size", [ "sm" ],
)

const { variantClasses: colorClasses } = useVariant(
  props.color, "w-button", "color", [ "default" ],
)

const isDisabled = computed(() => props.disabled)

const onClick = (): void => !isDisabled.value ? emit("click") : undefined
</script>
