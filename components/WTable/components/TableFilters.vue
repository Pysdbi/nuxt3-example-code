<template>
  <WPopover position="right">
    <template #activator="{ open }">
      <div class="w-6 h-6">
        <WBadge
          class="w-6 h-6"
          :hidden="!availabilitySelectedFilters"
        >
          <ColumnFilterIcon
            class="w-6"
            :class="{ 'text-pink': open }"
          />
        </WBadge>
      </div>
    </template>
    <template #default>
      <div class="flex flex-col gap-2 w-72 overflow-hidden">
        <div class="h3-text-accent-20">
          {{ $t('components.table.filters') }}
        </div>
        <div class="flex flex-col gap-2 max-h-96 overflow-auto min-h-[100px]">
          <template
            v-for="columnId in Object.keys(inputsOptions)"
            :key="`${TableFiltersID}-${columnId}`"
          >
            <WTextField
              v-if="isWTextField(inputsOptions[columnId]?.type)"
              v-model="filters[columnId]"
              :placeholder="inputsOptions[columnId]?.placeholder"
              :type="inputsOptions[columnId]?.inputType"
            />
            <WSelect
              v-if="inputsOptions[columnId]?.type === 'select'"
              v-model="filters[columnId]"
              v-bind="inputsOptions[columnId]"
              clearable
            />
            <WCheckbox
              v-if="inputsOptions[columnId]?.type === 'boolean'"
              v-model="filters[columnId]"
              v-bind="inputsOptions[columnId]"
            >
              <template v-if="table.getAllColumns().find(x => x.id === columnId)">
                <FlexRender :render="table.getColumn(columnId).columnDef.header" />
              </template>
            </WCheckbox>
          </template>
        </div>
        <div class="flex gap-2 mt-2">
          <WButton
            class="w-full"
            :disabled="!availabilitySelectedFilters"
            @click="onApply"
          >
            Применить
          </WButton>
          <WButton
            outlined
            class="w-full"
            @click="resetFilters"
          >
            Сбросить
          </WButton>
        </div>
      </div>
    </template>
  </WPopover>
</template>

<script setup lang="ts">
import { computed, defineComponent, PropType, ref } from "vue"
import { FlexRender, Table } from "@tanstack/vue-table"

// Components
import WPopover from "@/components/WPopover/index.vue"
import WSelect from "@/components/WSelect/index.vue"

// Icons
import ColumnFilterIcon from "@/assets/icons/column-filter.svg?component"
import { cloneDeep, transform } from "lodash-es"

type InputOption = {
  [key: string]: any
  items: any[]
  type: string | "select" | "text" | "text-date" | "boolean"
  multiple: boolean
  itemValue: (item: any) => any
  placeholder: string
  inputType: string | "text" | "number" | "password" | "date" | "datetime-local"
  activatorTitle: string
  itemTitle: string
}

defineComponent({ name: "WTableFilters" })

const TableFiltersID = ref(Date.now())

const props = defineProps({
  table: {
    type: Object as PropType<Table<any>>,

    default: null,
    required: true,
  },
  inputsOptions: {
    type: Object as PropType<Record<string, Partial<InputOption>>>,
    default: () => ({}),
  },
  disableFilter: Boolean,
})
const emit = defineEmits([ "click:apply" ])

const filters = ref<Record<string, any>>(
  Object.fromEntries(
    Object.keys(props.inputsOptions)
      .map(key => [ key, undefined ]),
  ),
)
const availabilitySelectedFilters = computed(() =>
  Object.entries(filters.value).some(([ , val ]) => !!val),
)

const resetFilters = (): void => {
  Object.keys(filters.value).forEach(key => (filters.value[key] = undefined))
  TableFiltersID.value = Date.now()
  emit("click:apply", filters.value)
}

const onApply = (): void => {
  const filtersApply = transform(cloneDeep(filters.value), (r: Record<string, any>, v, k) => {
    r[k] = props.inputsOptions[k]?.itemValue?.(v) ?? v?.value ?? v
  })
  emit("click:apply", filtersApply)
}

const isWTextField = (type?: string): boolean => !!type && [ "text", "text-date" ].includes(type)
</script>
