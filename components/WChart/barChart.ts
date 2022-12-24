import { defineComponent, h, PropType } from "vue"

import { Bar } from "vue-chartjs"

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  Plugin,
  Title,
  Tooltip,
} from "chart.js"
import { rangeApply } from "@/util"
import { ChartOptionsPreset, DatasetBarPresets, htmlLegendPlugin } from "@/components/WChart/index"

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
  name: "WChartBar",
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object as PropType<Partial<CSSStyleDeclaration>>,
      default: () => {
      },
    },
    plugins: {
      type: Array as PropType<Array<Plugin<"bar">>>,
      default: () => [],
    },

    labels: {
      type: Array as PropType<Array<string | number>>,
      default: undefined,
    },
    datasets: {
      type: Array as PropType<ChartData["datasets"]>,
      default: () => [],
    },
  },
  setup (props) {
    const chartData: ChartData = {
      labels: props.labels ?? rangeApply(props.datasets?.[0]?.data?.length ?? 0),
      // @ts-expect-error
      datasets: props.datasets?.map(dataset => ({
        ...DatasetBarPresets,
        ...dataset,
      })),
    }

    const chartOptions: ChartOptions = { ...ChartOptionsPreset }

    return () =>
      h("div", [
        // @ts-expect-error
        h("div", { id: "legend-container" }, null),
        // @ts-expect-error
        h(Bar,
          {
            chartData,
            chartOptions,
            chartId: props.chartId,
            width: props.width,
            height: props.height,
            cssClasses: props.cssClasses,
            styles: props.styles,
            plugins: [ htmlLegendPlugin, ...props.plugins ],
          }),
      ])
  },
})
