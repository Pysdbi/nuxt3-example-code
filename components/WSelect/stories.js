import { createTemplate } from "@/util/storybook"

import WSelect from "./index.vue"
import { variantColors, variantSizes } from "@/composables/variant"

export default {
  title: "w/Select",
  component: WSelect,
  argTypes: {
    defaultValue: { control: { type: "string" } },
    multiple: {
      control: { type: "boolean" },
      defaultValue: false,
    },

    enableSearch: {
      control: { type: "boolean" },
      defaultValue: false,
    },
    searchBy: {
      control: {
        name: "string",
        required: false,
      },
    },

    activatorTitle: {
      control: {
        name: "string",
        required: false,
      },
      defaultValue: "Select",
    },

    items: { defaultValue: [ { title: "One" }, { title: "Two" }, { title: "Three" } ] },
    itemTitle: {
      control: {
        name: "string",
        required: false,
      },
      defaultValue: "title",
    },

    disabled: {
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

const { createVariant: createVariantWithSlot } = createTemplate({ component: { WSelect } })

export const Default = createVariantWithSlot({})
export const Multiselect = createVariantWithSlot({ multiple: true })
