<template>
  <div class="p-4 h-full">
    <div class="flex flex-wrap gap-4">
      <nuxt-link
        v-for="section in sections"
        :key="section.name"
        :to="`/reports/${section.name}`"
        class="section-block"
        :class="{ 'opacity-50 pointer-events-none': section?.disabled === true }"
      >
        <component
          :is="section.icon"
          class="w-6 h-6 inline-block"
        />

        <div>{{ t(`pages.reports.${section.name}`) }}</div>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, markRaw } from "vue"
import { useLocal, useStateHeader } from "#imports"

import ReportsIcon from "@/assets/icons/reports.svg?component"

defineComponent({ name: "PageReports" })

const { t } = useLocal()
const { setPageTitle } = useStateHeader()
setPageTitle(() => t("nav.reports"))

type Section = {
  name: string
  href?: string
  icon?: any
  disabled?: boolean
}
const sections: Section[] = [
  {
    name: "acceptance",
    icon: markRaw(ReportsIcon),
  },
]
</script>
