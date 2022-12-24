<template>
  <div
    class="w-checkbox"
    :class="{
      active: activeClass,
      disabled,
      rtl: direction === 'rtl',
    }"
    @click="selectItem"
  >
    <div>
      <slot :active="activeClass">
        {{ label }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, PropType, toRefs, watch } from "vue"
import { useBooleanRef } from "@/util"

defineComponent({ name: "WCheckbox" })

const props = defineProps({
  direction: {
    type: String as PropType<"rtl" | "ltr">,
    default: null,
  },
  label: {
    type: String,
    default: undefined,
  },
  disabled: Boolean,
  checked: Boolean,
  modelValue: {
    type: Boolean,
    default: undefined,
  },
})
const emit = defineEmits([ "update:checked", "update:modelValue" ])
const {
  checked,
  disabled,
} = toRefs(props)
const [ activeClass, toggleClass ] = useBooleanRef(props.modelValue ?? checked.value)
watch(() => checked.value, () => !checked.value && activeClass.value ? toggleClass() : checked.value && !activeClass.value ? toggleClass() : "")

const selectItem = (): any => {
  return disabled.value && checked.value ? emitSelect() : !checked.value && disabled.value ? "" : emitSelect()
}
const emitSelect = async (): Promise<void> => {
  if (disabled.value) return
  toggleClass()
  emit("update:checked", activeClass.value)
  emit("update:modelValue", activeClass.value)
}
</script>

<style>
.w-checkbox {
  @apply flex items-center cursor-pointer select-none gap-1;
}

.w-checkbox:before {
  @apply content-[''] inline-block w-6 h-6 border border-2 rounded-full border-icon-grey bg-no-repeat bg-center;
  @apply bg-none;
}

.w-checkbox.active:before {
  @apply border-none bg-opacity-100;
  background-image: url("../../assets/icons/checkbox--active.svg");
}

.w-checkbox.rtl {
  @apply justify-between flex-row-reverse;
}
</style>
