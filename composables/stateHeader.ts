import { computed, Ref, ref, watch } from "vue"

type StateHeader = {
  // states
  pageTitle: Ref<string | undefined>
  appendComponent: any
  navigateBack: Ref<(() => void) | undefined>

  // setters
  setPageTitle: (title: (() => string)) => void
  setAppendComponent: (component: any) => void
  setNavigateBack: (func: (() => void)) => void
}
type UseStateHeader = () => StateHeader

const state = ref({
  pageTitle: (() => "") as (() => string),
  appendComponent: null,
  navigateBack: undefined as ((() => void) | undefined),
})

export const useStateHeader: UseStateHeader = () => {
  const pageTitle = computed(() => state.value.pageTitle())
  watch(pageTitle, () => (state.value.appendComponent = null))
  const appendComponent = computed(() => state.value.appendComponent)
  const navigateBack = computed(() => state.value.navigateBack)

  return {
    pageTitle,
    appendComponent,
    navigateBack,

    setPageTitle: title => (state.value.pageTitle = title),
    setAppendComponent: component => (state.value.appendComponent = component),
    setNavigateBack: func => (state.value.navigateBack = async () => {
      state.value.navigateBack = undefined
      await func()
    }),
  }
}
