import { createTemplate } from "@/util/storybook"

import WLoader from "./index.vue"
import { variantSizes } from "@/composables/variant"

export default {
  title: "W/Loader",
  component: WLoader,
  argTypes: {
    size: {
      options: variantSizes,
      control: { type: "radio" },
      defaultValue: "base",
    },
  },
}

const { createVariant: createVariantWithSlot } = createTemplate({ component: { WLoader } })

export const Default = createVariantWithSlot({})
