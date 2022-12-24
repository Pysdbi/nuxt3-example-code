import { createTemplate } from "@/util/storybook"

import WSkeleton from "./index.vue"

export default {
  title: "w/Skeleton",
  component: WSkeleton,
  argTypes: {
    // width: {
    //   control: { type: "number" },
    //   defaultValue: 300,
    // },
    // height: {
    //   control: { type: "number" },
    //   defaultValue: 100,
    // },
  },
}

const { createVariant: createVariantWithSlot } = createTemplate({ component: { WSkeleton } })

export const Default = createVariantWithSlot({})
