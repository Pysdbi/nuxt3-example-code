import { createTemplate } from "@/util/storybook"

import WChartLine from "./lineChart.ts"
import WChartBar from "./barChart.ts"
import { randInt, rangeApply } from "../../util"
import { ChartColors } from "./index"

export default {
  title: "w/Chart",
  component: WChartLine,
  argTypes: {},
}

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const datasetsLine = rangeApply(2, (_, i) => ({
  label: `Line-${i}`,
  data: rangeApply(12, () => randInt(0)(100)),
  borderColor: ChartColors[i + 1],
  backgroundColor: ChartColors[i + 1],
}))

const { createVariant: createVariantWithSlotLine } = createTemplate({ component: { WChartLine } })
export const Line = createVariantWithSlotLine({
  datasets: datasetsLine,
  labels,
})

const datasetsBar = rangeApply(2, (_, i) => ({
  label: `Bar-${i}`,
  data: rangeApply(12, () => randInt(0)(3000)),
  backgroundColor: ChartColors[i + 1],
  borderColor: "transparent",
}))

const { createVariant: createVariantWithSlotBar } = createTemplate({ component: { WChartBar } })
export const Bar = createVariantWithSlotBar({
  datasets: datasetsBar,
  labels,
})
