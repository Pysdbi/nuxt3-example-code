import { computed, Ref, ref } from "vue"

type LocalState<T = any> = {
  state: Ref<T>
  setState: (val: T) => void
}
type UseLocalState = <T>(key: string, defaultValue?: T) => LocalState<T>

const state = ref<Record<string, any>>({})

export const useLocalState: UseLocalState = (key, defaultValue) => {
  const _state = computed({
    get: () => (state.value[key]),
    set: (val) => (state.value[key] = val),
  })
  const setState: LocalState["setState"] = (val) => (state.value[key] = val)

  if (!state.value[key] && defaultValue) setState(defaultValue)

  return {
    state: _state,
    setState,
  }
}
