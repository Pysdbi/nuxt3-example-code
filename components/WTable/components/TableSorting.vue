<template>
  <WPopover position="right">
    <template #activator="{ open }">
      <WBadge
        class="w-6 h-6"
        :hidden="table.getHeaderGroups()[0].headers.every(x => !x.column.getIsSorted())"
      >
        <ColumnSortIcon
          class="w-6"
          :class="{ 'text-pink': open }"
        />
      </WBadge>
    </template>
    <template #default>
      <div class="flex flex-col gap-2 w-72 overflow-hidden">
        <div class="mb-2 h3-text-accent-20 pr-2">
          {{ $t("components.table.sort-column") }}
        </div>

        <div class="flex flex-col gap-2 max-h-96 overflow-auto">
          <template
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <div
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="flex p-4 bg-light-blue rounded-lg transition cursor-pointer select-none"
              :class="{ 'bg-light-pink text-pink': header.column.getIsSorted() !== false }"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <FlexRender :render="header.column.columnDef.header" />
              <ArrowDownIcon
                class="ml-auto w-6"
                :class="{ 'rotate-180': header.column.getIsSorted() === 'desc' }"
              />
            </div>
          </template>
        </div>
      </div>
    </template>
  </WPopover>
</template>

<script setup lang="ts">
import { defineComponent, PropType } from "vue"
import { FlexRender, Table } from "@tanstack/vue-table"

// Components
import WPopover from "@/components/WPopover/index.vue"

// Icons
import ColumnSortIcon from "@/assets/icons/column-sort.svg?component"
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?component"

defineComponent({ name: "WTableSorting" })
defineProps({
  table: {
    type: Object as PropType<Table<any>>,
    default: null,
  },
})
</script>
