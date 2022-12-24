import { computed, ComputedRef, Ref, ref } from "vue"

export function useBooleanRef (value: boolean): [ ComputedRef<boolean>, () => void, (newValue: boolean) => void ] {
  const customRef = ref(value)

  const exportCustomRef = computed(() => customRef.value)

  const toggleCustomRef = (): void => {
    customRef.value = !customRef.value
  }

  const setCustomRef = (newValue: boolean): void => {
    customRef.value = newValue
  }

  return [ exportCustomRef, toggleCustomRef, setCustomRef ]
}

export function booleanRef (defaultValue: boolean): { value: Ref<boolean>, toggle: () => void } {
  const value = ref(defaultValue)

  const toggle = (): void => {
    value.value = !value.value
  }

  return {
    value,
    toggle,
  }
}
