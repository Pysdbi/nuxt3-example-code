<template>
  <div class="p-4 h-full w-full overflow-hidden">
    <WChartLine
      :datasets="datasetsLine"
      :labels="labels"
    />
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import { navigateTo, useLocal, useStateHeader } from "#imports"
import WChartLine from "@/components/WChart/lineChart"
import { randInt, rangeApply } from "@/util"
import { ChartColors } from "@/components/WChart"

defineComponent({ name: "PageReportsAcceptance" })

const { t } = useLocal()
const {
  setPageTitle,
  setNavigateBack,
} = useStateHeader()
setPageTitle(() => t("pages.reports.acceptance"))
setNavigateBack(() => navigateTo("/reports"))

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
</script>
