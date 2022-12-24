<template>
  <Menu
    v-slot="{ open }"
    as="div"
    class="relative inline-block"
  >
    <MenuButton
      :disabled="disabled || undefined"
      @click="emit('click:activator')"
    >
      <slot
        name="activator"
        v-bind="{ open }"
      >
        <div class="inline-flex justify-center items-center rounded px-4 py-2 border">
          <slot name="activator-title">
            {{ activatorTitle }}
          </slot>
          <slot
            name="activator-icon"
            v-bind="{ open }"
          >
            <ChevronDownIcon
              class="ml-2 -mr-1 h-4 w-4 transition-transform"
              aria-hidden="true"
              :class="{ '-rotate-180': open }"
            />
          </slot>
        </div>
      </slot>
    </MenuButton>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
      class="origin-top-right"
    >
      <MenuItems
        class="z-10 mt-2 w-full p-2 absolute max-h-60 bg-white overflow-auto rounded-lg shadow-bg"
        :static="!closeOnClick"
      >
        <slot>
          <MenuItem
            v-for="item in items"
            :key="item?.title ?? item"
            v-slot="{ active }"
            :disabled="item?.disabled ?? false"
            class="flex"
            @click="() => menuItemClick(item)"
          >
            <component
              :is="itemTag"
              :href="item?.href"
              class="w-full px-2 py-1.5 cursor-pointer rounded"
              :class="{
                'bg-primary/10': active,
                'opacity-75': item?.disabled ?? false,
              }"
            >
              <slot name="menu-item-prepend" />
              <slot
                name="item"
                v-bind="{ item }"
              >
                {{ item?.[itemTitle] ?? item }}
              </slot>
              <slot name="menu-item-append" />
            </component>
          </MenuItem>
        </slot>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import ChevronDownIcon from "@/assets/icons/chevron-down.svg?component"
import { defineComponent, PropType } from "vue"
import { VariantColors, VariantSizes } from "@/composables/variant"

defineComponent({ name: "VDropdown" })

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },

  // Activator
  activatorTitle: {
    type: String,
    default: "",
  },

  // Items
  items: {
    type: Array as PropType<any[]>,
    default: () => ([]),
  },
  itemTitle: {
    type: String,
    default: "title",
  },
  itemTag: {
    type: String,
    default: "div",
  },
  closeOnClick: {
    type: Boolean,
    default: true,
  },

  // Visual
  color: {
    type: String as PropType<VariantColors>,
    default: "primary",
  },
  size: {
    type: String as PropType<VariantSizes>,
    default: "base",
  },
})
const emit = defineEmits([ "click:activator", "click:item" ])

function menuItemClick (item: any): void {
  item?.click?.()
  emit("click:item", item)
}
</script>
