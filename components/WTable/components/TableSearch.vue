<template>
  <WTextField
    :placeholder="$t('search')"
    clearable
    class="grow"
    :model-value="search"
    @click:append="clear"
    @update:model-value="setSearch"
  >
    <template #append>
      <SearchIcon class="mx-2 w-4 h-full" />
    </template>
  </WTextField>
</template>

<script setup lang="ts">
import { computed, defineComponent, PropType, ref } from "vue"
import { Table } from "@tanstack/vue-table"
import lodash from "lodash-es"

// Components
import WTextField from "@/components/WTextField/index.vue"

// Icons
import SearchIcon from "@/assets/icons/search.svg?component"
import { useTableSearch } from "@/components/WTable/utils/search"

defineComponent({ name: "WTableSearch" })
const props = defineProps({
  table: {
    type: Object as PropType<Table<any>>,
    default: null,
  },
  disableGlobalFilter: Boolean,
})
const emit = defineEmits([ "change" ])

const {
  globalFilter,
  setGlobalFilter,
} = useTableSearch()

const value = ref("")

function setSearch (val: string): void {
  if (!props.disableGlobalFilter) {
    setGlobalFilter(val)
  }
  else {
    value.value = val
  }
  search.value = val
}

const search = computed({
  get: () => !props.disableGlobalFilter ? globalFilter.value : value.value,
  set: lodash.debounce((val: string) => {
    if (!props.disableGlobalFilter) {
      // globalFilter.value = val
      props.table.setState(old => ({
        ...old,
        globalFilter: val,
      }))
    }
    emit("change", val)
  }, 800),
})

function clear (): void {
  search.value = ""
  props.table.resetGlobalFilter()
}
</script>
