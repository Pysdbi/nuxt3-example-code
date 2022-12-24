<template>
  <Listbox
    v-slot="{ open }"
    :model-value="modelValue ?? modelValueLocal"
    :disabled="disabled"
    :multiple="multiple"
    as="div"
    class="relative"
    :by="by"
    @update:model-value="changeValue"
  >
    <div ref="trigger">
      <slot
        name="activator"
        v-bind="{ selected: modelValue }"
      >
        <ListboxButton as="template">
          <div
            class="w-select__activator"
            :class="{
              'w-select__activator--active': open,
              'w-select__activator--disabled': disabled,
              'w-select__activator--selected': currentValueTitle !== activatorTitle,
            }"
          >
            <slot
              name="activator-title"
              v-bind="{ selected: modelValue }"
            >
              <span
                v-if="currentValueTitle !== activatorTitle"
                class="w-select__activator--label"
              >{{ activatorTitle }}</span>
              <div class="w-select__activator--title">
                {{ currentValueTitle }}
              </div>
            </slot>
            <div class="w-select__activator--icon">
              <div>
                <XIcon
                  v-if="clearable && (modelValueLocal || modelValue)"
                  class="w-5 h-2.5"
                  @click.stop="clearField"
                />
                <slot
                  v-else
                  name="activator-icon"
                >
                  <ChevronDownIcon class="w-5 h-2.5" />
                </slot>
              </div>
            </div>
          </div>
        </ListboxButton>
      </slot>
    </div>
    <div
      v-if="open"
      ref="container"
    >
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
        class="origin-top-right"
      >
        <ListboxOptions
          class="w-select__list"
          :class="{ 'w-select__list--search': enableSearch }"
        >
          <div v-if="enableSearch">
            <WTextField
              v-model="search"
              class="w-full"
              :placeholder="$t('Поиск')"
              autofocus
            />
          </div>
          <div v-bind="containerProps">
            <div v-bind="wrapperProps">
              <template
                v-for="item in virtualListItems"
                :key="item.index"
              >
                <h1
                  v-if="typeof item.data === 'string'"
                  class="c1-text-accent-12 text-grey"
                  v-text="item.data"
                />
                <ListboxOption
                  v-else-if="item.data"
                  v-slot="{
                    active, selected, disabled: itemDisabled,
                  }"
                  :key="item.index"
                  :value="item.data"
                  :disabled="isDisabled(item.data)"
                  as="template"
                >
                  <li
                    class="w-select__item mt-1"
                    :style="{ height: getLiHeight(item) }"
                    :class="[
                      {
                        'w-select__item--active': active,
                        'w-select__item--selected': selected,
                        'w-select__item--disabled': itemDisabled,
                      },
                    ]"
                  >
                    <slot name="menu-item-prepend" />
                    <slot
                      name="item"
                      v-bind="{
                        item: item.data, selected, itemDisabled, active,
                      }"
                    >
                      {{ getItemTitle(item.data) }}
                    </slot>
                    <slot name="menu-item-append" />
                  </li>
                </ListboxOption>
              </template>
            </div>
          </div>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { groupBy, mapKeys } from "lodash-es"
import { usePopper } from "@/composables/usePopper"
import { computed, defineComponent, PropType, ref } from "vue"
import { VariantColors, VariantSizes } from "@/composables/variant"

// Components
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"
import WTextField from "@/components/WTextField/index.vue"

// Icons
import XIcon from "@/assets/icons/x.svg?component"
import ChevronDownIcon from "@/assets/icons/chevron-down.svg?component"

// Styles
import "./index.css"
import { useVirtualList } from "#imports"

defineComponent({ name: "WSelect" })

const [ trigger, container ] = usePopper({
  placement: "bottom-start",
  strategy: "fixed",
  modifiers: [],
})

const props = defineProps({
  modelValue: {
    type: [ String, Object ] as PropType<any>,
    default: undefined,
  },
  defaultValue: {
    type: [ String, Object ] as PropType<any>,
    default: undefined,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  clearable: Boolean,
  disabled: {
    type: Boolean,
    default: false,
  },
  by: {
    type: Function as PropType<((a: any, z: any) => boolean)>,
    default: undefined,
  },

  groupByKey: {
    type: String,
    default: undefined,
  },
  groupByLabels: {
    type: Object,
    default: () => ({}),
  },

  // Activator
  activatorTitle: {
    type: String,
    default: "",
  },
  activatorClasses: {
    type: String,
    default: "",
  },

  // Items
  items: {
    type: Array as PropType<any[]>,
    default: () => ([]),
  },
  itemTitle: {
    type: [ String, Function ] as PropType<string | ((item: any) => string)>,
    default: "title",
  },

  disabledBy: {
    type: [ String, Function ],
    default: undefined,
  },

  // Search
  enableSearch: Boolean,
  searchBy: {
    type: [ String, Function ],
    default: undefined,
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

const emit = defineEmits([ "update:modelValue", "change", "click:clear" ])

const search = ref()

const modelValueLocal = ref(props.multiple ? props.modelValue ?? [] : props.modelValue)

const currentValueTitle = computed(() => {
  const value = props.modelValue ?? modelValueLocal.value
  return (
    typeof props.itemTitle === "string"
      ? (
          value?.[props.itemTitle]
          ?? value?.map?.((x: any) => x?.[props.itemTitle as string])?.join(", ")
          ?? value
        )
      : undefined
  )
    || props.defaultValue
    || props.activatorTitle
})

function changeValue (val: any): void {
  modelValueLocal.value = val
  emit("update:modelValue", val)
  emit("change", val)
}

const getItemTitle = (item: any): string => typeof props.itemTitle === "function"
  ? props.itemTitle?.(item)
  : (item?.[props.itemTitle] ?? item)

const searchFunc = (item: any): boolean => {
  if (!search.value) return true
  if (!props.enableSearch) return true
  let currItem: string
  if (props.searchBy !== undefined) {
    currItem = (typeof props.searchBy === "function"
      ? props.searchBy?.(item)
      : item?.[props.searchBy])
      ?? ""
  }
  else {
    currItem = getItemTitle(item)
  }
  return currItem.toLowerCase().includes(search.value.toLowerCase())
}

const groupedItems = computed(() => {
  const items = props.items?.filter(searchFunc)
  const itemsGrouped = mapKeys(
    groupBy(items, props.groupByKey),
    (v, k) => props.groupByLabels[k],
  )
  const groupedEntries = Object.entries(props.groupByLabels).map(([ , v ]) => v).map(x => [ x ])
  return Object.assign(
    Object.fromEntries(groupedEntries),
    itemsGrouped,
  )
})

const groupedItemsFlat = computed(() => {
  const itemsEntries = Object.entries(groupedItems.value)
  const items = itemsEntries.flat?.(2)
  if (itemsEntries.length > 1) return items
  return items.slice(1)
})

const {
  list: virtualListItems,
  containerProps,
  wrapperProps,
}: {
  list: any
  containerProps: any
  wrapperProps: any
} = useVirtualList(
  groupedItemsFlat,
  { itemHeight: (index) => (typeof groupedItemsFlat.value[index] === "string" ? 12 : 36) + 4 },
)
const getLiHeight = (item: { data: { height: string | number } }): string => `${item.data.height}px`

const isDisabled = (item: any): boolean => {
  const disabledBy = typeof props.disabledBy === "function"
    ? props.disabledBy?.(item)
    : props.disabledBy
      ? item?.[props.disabledBy]
      : false
  return (disabledBy || item?.disabled) ?? false
}

function clearField (): void {
  changeValue(undefined)
  emit("click:clear")
}
</script>
