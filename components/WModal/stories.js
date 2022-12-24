import { createTemplate } from "@/util/storybook"

import WModal from "./index.vue"
import { variantColors, variantSizes } from "@/composables/variant"

export default {
  title: "w/Modal",
  component: WModal,
  argTypes: {
    activatorTitle: {
      control: {
        name: "string",
        required: false,
      },
      defaultValue: "Open",
    },

    modalTitle: {
      control: {
        name: "string",
        required: false,
      },
      defaultValue: "Modal title",
    },
    modalDescription: {
      control: {
        name: "string",
        required: false,
      },
      defaultValue: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aut doloremque, eaque impedit libero necessitatibus officia.",
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

const { createVariant: createVariantWithSlot } = createTemplate({ component: { WModal } })

export const Default = createVariantWithSlot({})
