import { createTemplate } from "@/util/storybook"

import WCheckbox from "./index.vue"

export default {
  title: "w/Checkbox",
  component: WCheckbox,
  argTypes: {},
}

const { createVariant: createVariantWithSlot } = createTemplate({
  component: { WCheckbox },
  slot: "Checkbox",
})

export const Default = createVariantWithSlot({})
