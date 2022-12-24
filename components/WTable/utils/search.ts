import { FilterFn } from "@tanstack/vue-table"
import { rankItem } from "@tanstack/match-sorter-utils"
import { useLocalState } from "@/composables/localState"
import { Ref } from "vue"

type UseTableSearch = () => {
  fuzzyFilter: FilterFn<any>
  globalFilter: Ref
  setGlobalFilter: (val: any) => void
}

export const useTableSearch: UseTableSearch = () => {
  const {
    state,
    setState,
  } = useLocalState("table-search", "")

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
  }

  return {
    globalFilter: state,
    setGlobalFilter: setState,
    fuzzyFilter,
  }
}
