<template>
  <div class="w-indicator">
    <span>
      <span
        :class="{ active: !!value }"
        :style="{ background: color }"
      />
    </span>
    <slot>
      {{ label }}
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, PropType } from "vue"
import { useLocal } from "@/composables/locale"

defineComponent({ name: "WIndicator" })

const { t } = useLocal()
type MapValues = Record<string, string>
const props = defineProps({
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

const keys = computed<MapValues>(() => props.keys ?? {
  true: t("yes"),
  false: t("not"),
})

const label = computed(() => keys.value[String(props.value ?? "false")])
const color = computed(() => props.colors?.[String(props.value)])
</script>

<style>
.w-indicator {
  @apply inline-flex items-center;
}

.w-indicator > span:first-child {
  @apply h-2 w-2 mr-2 inline-flex;
}

.w-indicator > span:first-child > span:first-child {
  @apply w-2 h-2 rounded-full bg-red;
}

.w-indicator > span:first-child > .active:first-child {
  @apply bg-green;
}
</style>
