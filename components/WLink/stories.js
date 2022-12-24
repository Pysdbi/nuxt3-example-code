import { createTemplate } from "@/util/storybook"

import WLink from "./index.vue"

export default {
  title: "W/Link",
  component: WLink,
  argTypes: {
    tag: {
      control: {
        name: "string",
        required: false,
      },
      defaultValue: "button",
    },
    disabled: {
      control: { type: "boolean" },
      defaultValue: false,
    },
    size: {
      // options: variantSizes,
      options: [ "sm", "lg" ],
      control: { type: "radio" },
      defaultValue: "sm",
    },
  },
}

const TEXT = "Default"

const { createVariant: createVariantWithSlot } = createTemplate({
  component: { WLink },
  slot: TEXT,
})

export const Default = createVariantWithSlot({})
