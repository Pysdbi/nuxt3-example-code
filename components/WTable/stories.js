import { createTemplate } from "@/util/storybook"

import WTable from "./index.vue"

export default {
  title: "w/Table",
  component: WTable,
  argTypes: {},
}

const defaultData = [
  ...Array.from({ length: 30 }, (k, i) => ({
    firstName: `tanner-${i}`,
    lastName: "linsley",
    age: 10 + Math.floor(Math.random() * (50 - 20 + 1)) + 20,
    visits: Math.floor(Math.random() * (500 - 1 + 1)) + 1,
    status: "In Relationship",
    progress: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
  })),
]
const columns = {
  firstName: { header: "Имя" },
  lastName: { header: "Фамилия" },
  age: { header: "Возраст" },
  visits: { header: "Визиты" },
  status: "Статус",
  progress: "Прогресс",
}

const { createVariant: createVariantWithSlot } = createTemplate({ component: { WTable } })

export const Default = createVariantWithSlot({
  rows: defaultData,
  columns,
})
