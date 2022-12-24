// Composables
// Utilities
import { ref, Ref } from "vue"

type UseModals = () => {
  modals: Ref<Array<Ref<boolean>>>
  appendModal: (value: Ref<boolean>) => void
  appendModals: (values: Array<Ref<boolean>>) => void
  hideAll: () => void
  hideLast: () => void
  deleteModal: (val: Ref<boolean>) => void
}

const modals = ref<Array<Ref<boolean>>>([])
export const useModals: UseModals = () => {
  return {
    modals,
    appendModal: (value) => {
      modals.value.push(value)
    },
    appendModals: (values) => {
      modals.value.push(...values)
    },
    hideAll: () => {
      modals.value.forEach(x => (x.value = false))
      modals.value = []
    },
    hideLast: () => {
      modals.value.forEach((x, idx) => (
        idx === modals.value.length - 1 && (x.value = false)
      ))
    },
    deleteModal: (val) => {
      modals.value = modals.value.filter(x => x !== val)
    },
  }
}
