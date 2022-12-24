<template>
  <Popper
    @open:popper="onOpen"
    @close:popper="onClose"
  >
    <div class="cursor-pointer">
      <slot
        name="activator"
        :open="open"
      />
    </div>

    <template #content="{ isOpen }">
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
        class="origin-top-right"
      >
        <div
          v-if="isOpen"
          class="w-popover"
        >
          <slot />
        </div>
      </transition>
    </template>
  </Popper>
</template>

<script setup lang="ts">
import Popper from "vue3-popper"
import { defineComponent, PropType, ref } from "vue"

// Styles
import "./index.css"

defineComponent({ name: "WPopover" })

defineProps({
  position: {
    type: String as PropType<"left" | "right">,
    default: "left",
  },
})
const emit = defineEmits([ "open:popper", "close:popper" ])

const open = ref(false)

function onOpen (): void {
  emit("open:popper")
  open.value = true
}

function onClose (): void {
  emit("close:popper")
  open.value = false
}
</script>
