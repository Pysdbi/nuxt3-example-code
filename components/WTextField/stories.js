import { createTemplate } from "@/util/storybook"

import WTextField from "./index.vue"

import { variantColors, variantSizes } from "@/composables/variant"

export default {
  title: "w/TextFiled",
  component: WTextField,
  argTypes: {
    tag: {
      options: [ "input", "textarea" ],
      control: {
        name: "radio",
        required: true,
      },
      defaultValue: "input",
    },
    type: {
      options: [ "text", "number" ],
      control: {
        name: "radio",
        required: true,
      },
      defaultValue: "text",
    },
    placeholder: { defaultValue: null },
    disabled: {
      control: { type: "boolean" },
      defaultValue: false,
    },
    clearable: {
      control: { type: "boolean" },
      defaultValue: false,
    },
    outlined: {
      control: { type: "boolean" },
      defaultValue: false,
    },
    size: {
      options: variantSizes,
      control: { type: "radio" },
      defaultValue: "base",
    },
    color: {
      options: variantColors,
      control: { type: "radio" },
      defaultValue: "primary",
    },
  },
}

const { createVariant: createVariantWithSlot } = createTemplate({ component: { WTextField } })

export const Default = createVariantWithSlot({})
export const LabelFloating = createVariantWithSlot({ placeholder: "Placeholder" })
export const Datetime = createVariantWithSlot({ type: "date" })

// const { createVariant: createVariantWithSlotDateTime } = createTemplate({ component: { WTextFieldDateTime } })
//
// export const DateTimePicker = createVariantWithSlotDateTime({})
