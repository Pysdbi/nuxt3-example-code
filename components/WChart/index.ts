import {
  Chart,
  ChartDataset,
  ChartOptions,
  Color,
  LegendItem,
  TooltipLabelStyle,
  TooltipModel,
} from "chart.js"

const chartElColor = (): {
  tooltip: (el: TooltipLabelStyle) => string
  legend: (el: LegendItem) => string
} => {
  const isNull = (c?: Color): boolean => c === "transparent"

  return {
    tooltip: (el) => isNull(el.borderColor) ? String(el.backgroundColor) : String(el.borderColor),
    legend: (el) => isNull(el.strokeStyle) ? String(el.fillStyle) : String(el.strokeStyle),
  }
}

/* ============ Tooltip ============ */
const getOrCreateTooltip = (chart: any): any => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div")

  if (!tooltipEl) {
    tooltipEl = document.createElement("div")
    tooltipEl.style.background = "white"
    tooltipEl.style.borderRadius = "8px"
    tooltipEl.style.color = "#424242"
    tooltipEl.style.opacity = 1
    tooltipEl.style.pointerEvents = "none"
    tooltipEl.style.position = "absolute"
    tooltipEl.style.transform = "translate(-50%, 0)"
    tooltipEl.style.transition = "all .1s ease"
    tooltipEl.style.boxShadow = "0px 2px 10px 0px rgba(0,0,0,0.06)"

    const table = document.createElement("table")
    table.style.margin = "4px"
    table.style.minWidth = "100px"

    tooltipEl.appendChild(table)
    chart.canvas.parentNode.appendChild(tooltipEl)
  }

  return tooltipEl
}

export const externalTooltipHandler = (context: { chart: Chart, tooltip: TooltipModel<any> }): void => {
  // Tooltip Element
  const {
    chart,
    tooltip,
  } = context
  const tooltipEl = getOrCreateTooltip(chart)

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0
    return
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || []
    const bodyLines = tooltip.body.map(b => b.lines)

    const tableHead = document.createElement("thead")

    titleLines.forEach(title => {
      const tr = document.createElement("tr")
      tr.style.borderWidth = "0"

      const th = document.createElement("th")
      th.style.borderWidth = "0"
      const text = document.createTextNode(title)

      th.appendChild(text)
      tr.appendChild(th)
      tableHead.appendChild(tr)
    })

    const tableBody = document.createElement("tbody")
    bodyLines.forEach((body, i) => {
      const color = chartElColor().tooltip(tooltip.labelColors[i])
      // dataset color
      const span = document.createElement("span")

      span.style.background = color
      // span.style.borderColor = colors.borderColor
      span.style.borderRadius = "4px"
      span.style.marginRight = "10px"
      span.style.height = "16px"
      span.style.width = "16px"
      span.style.display = "inline-block"

      // Row
      const tr = document.createElement("tr")
      tr.style.backgroundColor = "inherit"
      tr.style.borderWidth = "0"

      // Cell
      const td = document.createElement("td")
      td.style.borderWidth = "0"

      const text = document.createTextNode(body[0].split(":")[1])

      td.appendChild(span)
      td.appendChild(text)
      tr.appendChild(td)
      tableBody.appendChild(tr)
    })

    const tableRoot = tooltipEl.querySelector("table")

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove()
    }

    // Add new children
    tableRoot.appendChild(tableHead)
    tableRoot.appendChild(tableBody)
  }

  const {
    offsetLeft: positionX,
    offsetTop: positionY,
  } = chart.canvas

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1
  tooltipEl.style.left = `${positionX + tooltip.caretX}px`
  tooltipEl.style.top = `${positionY + tooltip.caretY}px`
  // @ts-expect-error
  tooltipEl.style.font = tooltip.options.bodyFont.string
  // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions
  tooltipEl.style.padding = `${tooltip.options.padding}px ${tooltip.options.padding}px`
}

/* ============ Legend ============ */
const getOrCreateLegendList = (chart: Chart, id: string): HTMLElement => {
  const legendContainer = document.getElementById(id)
  // @ts-expect-error
  let listContainer = legendContainer.querySelector("ul")

  if (!listContainer) {
    listContainer = document.createElement("ul")
    listContainer.style.display = "flex"
    listContainer.style.flexDirection = "column"
    listContainer.style.margin = "0"
    listContainer.style.padding = "0"

    // @ts-expect-error
    legendContainer.appendChild(listContainer)
  }

  return listContainer
}

export const htmlLegendPlugin = {
  id: "htmlLegend",
  afterUpdate (chart: Chart, args: Object, options: any) {
    const ul = getOrCreateLegendList(chart, options.containerID)

    while (ul.firstChild) {
      ul.firstChild.remove()
    }

    // @ts-expect-error
    const items = chart.options.plugins.legend.labels.generateLabels(chart)

    items.forEach(item => {
      const li = document.createElement("li")
      li.style.alignItems = "center"
      li.style.cursor = "pointer"
      li.style.display = "flex"
      li.style.flexDirection = "row"
      li.style.marginLeft = "10px"

      li.onclick = () => {
        // @ts-expect-error
        const { type } = chart.config
        if (type === "pie" || type === "doughnut") {
          chart.toggleDataVisibility(item.index as number)
        }
        else {
          chart.setDatasetVisibility(
            item.datasetIndex as number,
            !chart.isDatasetVisible(item.datasetIndex as number),
          )
        }
        chart.update()
      }

      // Color box
      const boxSpan = document.createElement("span")
      const color = chartElColor().legend(item)
      boxSpan.style.background = color
      boxSpan.style.borderColor = color
      boxSpan.style.borderWidth = `${String(item.lineWidth)}px`
      boxSpan.style.backgroundImage = !item.hidden
        // eslint-disable-next-line vue/max-len
        ? "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='14' height='14' viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FFF' d='M3.53 6.47L2.47 7.53l3.58 3.581 5.526-6.63-1.152-.961L5.95 8.889z' fill-rule='evenodd'/%3E%3C/svg%3E\")"
        : ""
      boxSpan.style.display = "inline-block"
      boxSpan.style.height = "20px"
      boxSpan.style.marginRight = "10px"
      boxSpan.style.width = "20px"
      boxSpan.style.borderRadius = "8px"

      // Text
      const textContainer = document.createElement("p")
      textContainer.style.color = item.fontColor as string
      textContainer.style.margin = "0"
      textContainer.style.padding = "0"
      textContainer.style.opacity = item.hidden ? "0.5" : "1"

      const text = document.createTextNode(item.text)
      textContainer.appendChild(text)

      li.appendChild(boxSpan)
      li.appendChild(textContainer)
      ul.appendChild(li)
    })
  },
}

/*  ============ Presets ============ */
export const ChartOptionsPreset: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: "index",
  },
  plugins: {
    tooltip: {
      enabled: false,
      position: "average",
      axis: "x",
      external: externalTooltipHandler,
    },
    legend: { display: false },
    // @ts-expect-error
    htmlLegend: { containerID: "legend-container" },
  },
  scales: { x: { grid: { display: false } } },
}

export const DatasetLinePresets: ChartDataset = {
  cubicInterpolationMode: "monotone",
  pointStyle: "circle",
  pointBackgroundColor: "white",
  pointRadius: 4,
  pointBorderWidth: 3,
  pointHoverBackgroundColor: "white",
  pointHoverRadius: 6,
  pointHoverBorderWidth: 3,

  data: [],
}

export const DatasetBarPresets: ChartDataset = {
  borderRadius: {
    topLeft: 4,
    topRight: 4,
  },
  maxBarThickness: 40,
  barPercentage: 1,
  data: [],
}

export const ChartColors = [ "#CB1DAB", "#497AF9", "#1DCB43" ]
