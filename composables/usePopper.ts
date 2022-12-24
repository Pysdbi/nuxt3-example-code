import { onMounted, Ref, ref, watchEffect } from "vue"
import type { Options } from "@popperjs/core"
import { createPopper } from "@popperjs/core"

export function usePopper (options: Options): [ Ref, Ref ] {
  const reference = ref(null)
  const popper = ref(null)

  onMounted(() => {
    watchEffect((onInvalidate) => {
      if (!popper.value) return
      if (!reference.value) return
      if (process.server) return

      // @ts-expect-error
      const popperEl = popper.value.el || popper.value
      // @ts-expect-error
      const referenceEl = reference.value.el || reference.value

      if (!(referenceEl instanceof HTMLElement)) return
      if (!(popperEl instanceof HTMLElement)) return

      popperEl.style.zIndex = "10"
      options.modifiers.push({
        name: "sameWidth",
        enabled: true,
        phase: "beforeWrite",
        requires: [ "computeStyles" ],
        fn ({ state }) {
          state.styles.popper.width = `${state.rects.reference.width}px`
        },
        effect ({ state }) {
          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`
        },
      })
      const { destroy } = createPopper(referenceEl, popperEl, options)

      onInvalidate(destroy)
    })
  })

  return [ reference, popper ]
}
