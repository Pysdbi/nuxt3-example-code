import { createTemplate } from "@/util/storybook"

import WPopover from "./index.vue"

export default {
  title: "w/Popover",
  component: WPopover,
  argTypes: {},
}

const { createVariant: createVariantWithSlot } = createTemplate({ component: { WPopover } })

export const Default = createVariantWithSlot({})
