import { createTemplate } from "@/util/storybook"

import WButton from "./index.vue"

export default {
  title: "W/Button",
  component: WButton,
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
    outlined: {
      control: { type: "boolean" },
      defaultValue: false,
    },
    text: {
      control: { type: "boolean" },
      defaultValue: false,
    },
    size: {
      // options: variantSizes,
      options: [ "sm", "lg" ],
      control: { type: "radio" },
      defaultValue: "sm",
    },
    // color: {
    //   options: variantColors,
    //   control: { type: "radio" },
    //   defaultValue: "purple",
    // },
  },
}

const TEXT = "Default"

const { createVariant: createVariantWithSlot } = createTemplate({
  component: { WButton },
  slot: TEXT,
})

export const Default = createVariantWithSlot({})
