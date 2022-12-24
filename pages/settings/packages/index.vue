<template>
  <div class="p-4 h-full">
    <div class="flex flex-wrap gap-4">
      <nuxt-link
        v-for="section in sections"
        :key="section.name"
        :to="`/settings/packages/${section?.to ?? section.name}`"
        class="section-block"
        :class="{ 'opacity-50 pointer-events-none': section?.disabled === true }"
      >
        <component
          :is="section.icon"
          class="w-6 h-6 inline-block"
        />

        <div>{{ t(`pages.settings.packages.${section.name}.title`) }}</div>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, markRaw } from "vue"
import { navigateTo, useLocal, useStateHeader } from "#imports"

import PackagingWBIcon from "@/assets/icons/package-wb.svg?component"
import PackagingSuppliersIcon from "@/assets/icons/package-suppliers.svg?component"

defineComponent({ name: "PageSettingsPackages" })

const { t } = useLocal()
const {
  setPageTitle,
  setNavigateBack,
} = useStateHeader()
setPageTitle(() => t("pages.settings.packages.title"))
setNavigateBack(() => navigateTo("/settings"))

type Section = {
  name: string
  to?: string
  href?: string
  icon?: any
  disabled?: boolean
}
const sections = computed<Section[]>(() => [
  {
    name: "wb",
    icon: markRaw(PackagingWBIcon),
  },
  {
    name: "suppliers",
    icon: markRaw(PackagingSuppliersIcon),
  },
])
</script>
