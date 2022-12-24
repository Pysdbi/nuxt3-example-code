<template>
  <WPopover position="right">
    <template #activator="{ open }">
      <WBadge
        class="w-6 h-6"
        :hidden="table.getIsAllColumnsVisible()"
      >
        <ColumnVisibleIcon
          class="w-6"
          :class="{ 'text-pink': open }"
        />
      </WBadge>
    </template>
    <template #default>
      <div class="flex flex-col gap-2 w-72 overflow-hidden">
        <WCheckbox
          :checked="table.getIsAllColumnsVisible()"
          :disabled="table.getIsAllColumnsVisible()"
          direction="rtl"
          class="mb-2 h3-text-accent-20 pr-2"
          @update:checked="table.toggleAllColumnsVisible"
        >
          {{ $t("components.table.show-all-column") }}
        </WCheckbox>

        <div class="flex flex-col gap-2 max-h-96 overflow-auto">
          <WCheckbox
            v-for="column in table.getAllLeafColumns()"
            :key="column.id"
            :checked="column.getIsVisible()"
            direction="rtl"
            class="p-4 bg-light-blue rounded-lg"
            :disabled="column.getIsVisible() && !canHidden"
            @update:checked="column.toggleVisibility"
          >
            <FlexRender :render="column.columnDef.header" />
          </WCheckbox>
        </div>
      </div>
    </template>
  </WPopover>
</template>

<script setup lang="ts">
import { computed, defineComponent, PropType } from "vue"
import { FlexRender, Table } from "@tanstack/vue-table"

// Components
import WPopover from "@/components/WPopover/index.vue"
import WCheckbox from "@/components/WCheckbox/index.vue"

// Icons
import ColumnVisibleIcon from "@/assets/icons/column-visible.svg?component"

defineComponent({ name: "WTableVisibilityColumns" })
const props = defineProps({
  table: {
    type: Object as PropType<Table<any>>,
    default: null,
  },
})
const canHidden = computed(() => props.table.getHeaderGroups()[0].headers.map(x => x.column.getIsVisible()).filter(x => x).length > 1)
</script>
