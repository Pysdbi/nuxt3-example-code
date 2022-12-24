import { createTemplate } from "@/util/storybook"

import WAutocomplete from "./index.vue"

export default {
  title: "w/Autocomplete",
  component: WAutocomplete,
  argTypes: {},
}

const { createVariant: createVariantWithSlot } = createTemplate({ component: { WAutocomplete } })

export const Default = createVariantWithSlot({})
export const LabelFloating = createVariantWithSlot({})
