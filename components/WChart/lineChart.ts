import { defineComponent, h, PropType } from "vue"

import { Line } from "vue-chartjs"
import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  Plugin,
  PointElement,
  Title,
  Tooltip,
} from "chart.js"
import { ChartOptionsPreset, DatasetLinePresets, htmlLegendPlugin } from "@/components/WChart/index"
import { rangeApply } from "@/util"

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
)

export default defineComponent({
  name: "WChartLine",
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Line },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
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
      type: Array as PropType<Array<Plugin<"line">>>,
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
        ...DatasetLinePresets,
        ...dataset,
      })),
    }

    const chartOptions: ChartOptions = { ...ChartOptionsPreset }

    return () =>
      h("div", [
        // @ts-expect-error
        h("div", { id: "legend-container" }, null),
        // @ts-expect-error
        h(Line, {
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
