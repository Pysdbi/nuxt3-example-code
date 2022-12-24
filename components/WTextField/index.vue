<template>
  <div
    class="w-text-field"
    :class="[
      {
        'w-text-field--disabled': isDisabled,
        'w-text-field--focus': isFocus,
        'w-text-field--floating': floating && placeholder,
      },
      [ variantClasses, colorClasses, sizeClasses ],
    ]"
  >
    <span
      v-if="$slots?.prepend?.()"
      class="w-text-field__prepend"
      @click="emit('click:prepend')"
    >
      <slot name="prepend" />
    </span>

    <div
      :class="{ 'w-text-field--wrapper': placeholder }"
    >
      <component
        :is="tag"
        ref="inputRef"
        v-mask="inputMask"
        :placeholder="placeholder"
        :type="currentType"
        :value="modelValue ?? modelValueLocal"
        @blur="isFocus = false"
        @focus="isFocus = true"
        @input="onInput"
      />
      <label
        v-if="placeholder && floating && tag !== 'textarea'"
        for="#"
      >{{ placeholder }}</label>
    </div>

    <span
      v-if="$slots?.append?.() || clearable || props.type === 'password'"
      class="w-text-field__append"
      @click="emit('click:append')"
    >
      <template v-if="props.type === 'password'">
        <EyeOpenIcon
          v-if="!isPassword"
          class="mx-2 w-4 h-full"
          @click="isPassword = !isPassword"
        />
        <EyeCloseIcon
          v-if="isPassword"
          class="mx-2 w-4 h-full"
          @click="isPassword = !isPassword"
        />
      </template>
      <XIcon
        v-if="clearable && (modelValueLocal || modelValue)"
        class="mx-2 w-3 h-full"
        @click="changeValue(undefined)"
      />
      <span
        v-else
        class="mx-2"
      >
        <slot
          name="append"
        />
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
// Composables
import { useVariant, VariantColors, VariantSizes } from "@/composables/variant"

// Utilities
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
} from "vue"

// Icons
import XIcon from "@/assets/icons/x.svg?component"
import EyeOpenIcon from "@/assets/icons/eye-open.svg?component"
import EyeCloseIcon from "@/assets/icons/eye-close.svg?component"
import { maska } from "maska"

// Styles
import "./index.css"

defineComponent({
  name: "WTextField",
  inheritAttrs: false,
})

const vMask = maska

const props = defineProps({
  modelValue: {
    type: [ String, Number ] as PropType<string | number>,
    default: undefined,
  },
  disabled: Boolean,
  autofocus: Boolean,
  clearable: Boolean,
  floating: {
    type: Boolean,
    default: true,
  },
  outlined: Boolean,
  tag: {
    type: String as PropType<"input" | "textarea">,
    default: "input",
  },
  type: {
    type: String as PropType<string | "text" | "number" | "password" | "date" | "datetime-local">,
    default: "input",
  },
  placeholder: {
    type: String,
    default: null,
  },
  inputMask: {
    type: String,
    default: null,
  },
  maxLength: {
    type: Number,
    default: undefined,
  },

  color: {
    type: String as PropType<VariantColors>,
    default: "primary",
  },
  size: {
    type: String as PropType<VariantSizes>,
    default: "base",
  },
})
const emit = defineEmits([ "change", "update:modelValue", "click:prepend", "click:append" ])

const inputRef = ref<HTMLInputElement>()
onMounted(() => {
  if (props.autofocus) setTimeout(() => inputRef.value?.focus?.(), 100)
})

const currentType = computed(() =>
  props.type === "password"
    ? isPassword.value ? "password" : "text"
    : props.type,
)
const isPassword = ref(props.type === "password")

const variant = { outlined: props.outlined }
const { variantClasses } = useVariant(
  variant, "w-text-field",
)
const { variantClasses: colorClasses } = useVariant(
  props.color, "w-text-field", "color", [ "primary" ],
)
const { variantClasses: sizeClasses } = useVariant(
  props.size, "w-text-field", "size", [ "base" ],
)

const isDisabled = computed(() => props.disabled)
const isFocus = ref(false)

const modelValueLocal = ref<string | number>()

const onInput = (event: any): void => changeValue(event.target.value)

function changeValue (val: string | number | undefined): void {
  modelValueLocal.value = val !== undefined ? String(val).slice(0, props.maxLength ?? -1) : undefined
  emit("update:modelValue", val)
}
</script>
