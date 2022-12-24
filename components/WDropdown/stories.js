import { createTemplate } from "@/util/storybook"

import WDropdown from "./index.vue"
import { variantColors, variantSizes } from "@/composables/variant"

export default {
  title: "w/Dropdown",
  component: WDropdown,
  argTypes: {
    activatorTitle: {
      control: {
        name: "string",
        required: false,
      },
      defaultValue: "Dropdown",
    },
    items: { defaultValue: [ { title: "Edit" }, { title: "Open" }, { title: "Remove" } ] },
    itemTitle: {
      control: {
        name: "string",
        required: false,
      },
      defaultValue: "title",
    },
    itemTag: {
      control: {
        name: "string",
        required: false,
      },
      defaultValue: "span",
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

const { createVariant: createVariantWithSlot } = createTemplate({ component: { WDropdown } })

export const Default = createVariantWithSlot({})
