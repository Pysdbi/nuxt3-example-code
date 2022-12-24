// Composables
// Utilities
import { computed, ComputedRef, unref } from "vue"
// Types
import type { MaybeRef } from "@/util"

// Sizes
export const variantSizes = [ "xs", "sm", "base", "lg", "xl" ] as const
export type VariantSizes = typeof variantSizes[number]

// Colors
export const variantColors = [ "purple", "red", "green" ] as const
export type VariantColors = typeof variantColors[number]

export function useVariant (
  val: MaybeRef<Record<string, boolean> | string>,
  name: string,
  key?: string | null,
  ignore?: string[],
): Record<"variantClasses", ComputedRef<string>> {
  const variantClasses = computed(() => {
    const getClass = (value: string): string => {
      if (ignore?.includes(value)) return ""
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const keyName = key === null ? "" : key ? `${key}-` : "variant-"
      return `${name}--${keyName}${value}`
    }
    if (typeof val === "string" && val) return getClass(val)
    const obj = unref(val)
    const variant = Object.entries(obj).find(([ , v ]) => v)?.[0] ?? "default"
    return variant !== "default" ? getClass(variant) : ""
  })

  return { variantClasses }
}
