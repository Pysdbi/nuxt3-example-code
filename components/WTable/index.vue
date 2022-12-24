<template>
  <div
    class="w-table"
    :class="{ 'can-click-row': canClickRow }"
  >
    <div
      v-if="!simpleTable"
      class="w-table__top-menu"
    >
      <!-- -->
      <slot
        name="prepend-search"
        v-bind="{ table }"
      />

      <!-- Search Table -->
      <slot
        name="search"
        v-bind="{ table }"
      >
        <WTableSearch :table="table" />
      </slot>

      <div class="ml-auto" />

      <!-- Sorting Table -->
      <slot
        name="sorting"
        v-bind="{ table }"
      >
        <WTableSorting
          v-if="!hiddenSorting"
          :table="table"
        />
      </slot>

      <!-- Filters Table -->
      <slot
        name="filters"
        v-bind="{ table }"
      >
        <WTableFilters
          v-if="!hiddenFilters"
          :table="table"
        />
      </slot>

      <!-- Visibility columns Table -->
      <WTableVisibilityColumns :table="table" />
    </div>

    <div
      ref="tableWrapper"
      v-infinite-scroll="[ onLoadMore, { distance: 10 } ]"
      class="h-full w-full relative"
      :class="[ !loading ? 'overflow-auto' : 'overflow-hidden' ]"
    >
      <div
        class="table"
        :style="{ width: `${table?.getCenterTotalSize()}px` }"
      >
        <div
          class="thead"
          :class="{ 'shadow-bg': !arrivedState.top }"
        >
          <div
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="tr"
          >
            <!-- TODO checkbox -->
            <!-- Select row head -->
            <!--            <div -->
            <!--              v-if="enableMultiSelect" -->
            <!--              class="th w-[50px]" -->
            <!--            /> -->

            <div
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="th"
            >
              <div
                :style="{ width: `${header.getSize()}px` }"
              >
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <!-- Resize -->
                <div
                  v-if="!simpleTable && header.column.getCanResize()"
                  class="resizer"
                  :class="{ active: header.column.getIsResizing() }"
                  @mousedown="header.getResizeHandler()?.($event)"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="tbody">
          <template v-if="table.getRowModel().rows.length">
            <div
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              class="tr"
              @click="onClickRow(row)"
            >
              <!-- TODO checkbox -->
              <!-- Select row body -->
              <!--            <div -->
              <!--              v-if="enableMultiSelect" -->
              <!--              class="td w-[50px]" -->
              <!--            > -->
              <!--              <WCellCheckbox @change="shownFooter = $event" /> -->
              <!--            </div> -->

              <div
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="td"
              >
                <div :style="{ width: `${cell.column.getSize()}px` }">
                  <slot
                    :name="`cell-${cell.column.id}`"
                    :cell="cell.getValue()"
                    :cell-def="cell"
                  >
                    <FlexRender
                      :render="cell.column.columnDef.cell"
                      :props="cell.getContext()"
                    />
                  </slot>
                </div>
              </div>
            </div>
          </template>
          <!-- No data -->
          <template v-else-if="!loading">
            <div
              class="w-full text-center mt-5"
              v-text="noDataText"
            />
          </template>
        </div>
      </div>

      <div
        v-if="loading"
        class="w-full h-full absolute left-0 top-0 bg-white/60"
      >
        <div class="h-1/2 flex justify-center items-center">
          <WLoader
            class="text-black"
          />
        </div>
      </div>
    </div>

    <!--    <div -->
    <!--      v-if="shownFooter" -->
    <!--      class="p-4 bg-light-blue" -->
    <!--    > -->
    <!--      TODO Multiselect &lt;!&ndash; TODO checkbox &ndash;&gt; -->
    <!--    </div> -->

    <div
      class="w-full flex justify-center items-center absolute left-0 bottom-0 mb-2"
      :class="{ 'bottom-[50px]': shownFooter }"
    >
      <WLoader
        v-if="moreLoading"
        class="text-black"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  useVueTable,
} from "@tanstack/vue-table"
import { vInfiniteScroll as infinityScroll } from "@vueuse/components"
import { useTableSearch } from "@/components/WTable/utils/search"
import { defineComponent, PropType, ref, watch } from "vue"
import { useScroll } from "@vueuse/core"
import { ClickItem } from "@/components/WTable/types"
import { DisplayColumnDef, IdentifiedColumnDef } from "@tanstack/table-core"

// Components
import WTableSearch from "@/components/WTable/components/TableSearch.vue"
import WTableSorting from "@/components/WTable/components/TableSorting.vue"
import WTableFilters from "@/components/WTable/components/TableFilters.vue"
import WTableVisibilityColumns from "./components/TableVisibilityColumns.vue"

// Styles
import "./index.css"

const vInfiniteScroll = infinityScroll

defineComponent({ name: "WTable" })

const props = defineProps({
  rows: {
    type: Array as PropType<Object[] | any[]>,
    default: () => [],
  },
  columns: {
    type: Object as PropType<Record<string, any | DisplayColumnDef<any, any> | IdentifiedColumnDef<any, any>>>,
    default: () => ({}),
  },

  canClickRow: Boolean,

  enableColumnResizing: {
    type: Boolean,
    default: true,
  },
  hiddenFilters: Boolean,
  hiddenSorting: Boolean,

  loading: Boolean,
  moreLoading: Boolean,

  simpleTable: Boolean,

  noDataText: {
    type: String,
    default: "",
  },

  enableMultiSelect: Boolean,
})
const emit = defineEmits([ "infinite-scroll", "click:row" ])

const tableWrapper = ref<any>()

const { arrivedState } = useScroll(tableWrapper)

const shownFooter = ref(false)

const columnHelper = createColumnHelper<Object>()

const columnsProps = Object.entries(props.columns).map(([ key, opt ]) => columnHelper.accessor(
  key,
  { ...(typeof opt === "string" ? { header: opt } : opt) },
))

const columns = [
  ...columnsProps,
  ...(!columnsProps.length
    ? Object.keys(props.rows?.[0] ?? {}).map((key) => columnHelper.accessor(key, { header: () => key }))
    : []
  ),
]
columns.forEach(x => (x.minSize = 80))

const {
  setGlobalFilter,
  fuzzyFilter,
} = useTableSearch()

const data = ref(props.rows)

const table = useVueTable({
  get data () {
    return data.value
  },

  columns,

  enableColumnResizing: props.enableColumnResizing,
  columnResizeMode: "onChange",

  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),

  // Search
  onGlobalFilterChange: setGlobalFilter,
  globalFilterFn: fuzzyFilter,
  getFilteredRowModel: getFilteredRowModel(),

})

watch(() => props.rows, () => (data.value = props.rows), { deep: true })

function onLoadMore (): void {
  emit("infinite-scroll")
}

function onClickRow (row: Row<unknown>): void {
  emit("click:row", {
    data: data.value[row.index],
    index: row.index,
  } as ClickItem)
}
</script>
