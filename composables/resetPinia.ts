import { getActivePinia, Pinia, Store } from "pinia"

type ExtendedPinia = {
  _s: Map<string, Store>
} & Pinia

export function useResetPinia (): Record<"all" | string, Function> {
  const pinia = getActivePinia() as ExtendedPinia

  if (!pinia) return {}

  const resetStores: Record<"all" | string, Function> = {}

  pinia._s.forEach((store, name) => {
    resetStores[name] = () => store.$reset()
  })

  return {
    ...resetStores,
    all: () => pinia._s.forEach((store) => store.$reset()),
  }
}
