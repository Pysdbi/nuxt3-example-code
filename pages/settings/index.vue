<template>
  <div class="p-4 h-full">
    <div class="flex flex-wrap gap-4">
      <nuxt-link
        v-for="section in sections"
        :key="section.name"
        :to="`/settings/${section?.to ?? section.name}`"
        class="section-block"
        :class="{ 'opacity-50 pointer-events-none': section?.disabled === true }"
      >
        <div>
          <component
            :is="section.icon"
            class="w-6 h-6 inline-block"
          />
        </div>
        <div>{{ t(`pages.settings.${section.name}`) }}</div>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, markRaw } from "vue"
import { useLocal, useStateHeader } from "#imports"

import IncidentsIcon from "@/assets/icons/incidents.svg?component"
import PackagingIcon from "@/assets/icons/packaging.svg?component"
import RoleIcon from "@/assets/icons/role.svg?component"

defineComponent({ name: "PageSettings" })

const { t } = useLocal()
const { setPageTitle } = useStateHeader()
setPageTitle(() => t("nav.settings"))

type Section = {
  name: string
  to?: string
  href?: string
  icon?: any
  disabled?: boolean
}
const sections = computed<Section[]>(() => [
  {
    name: "incidents-pallet",
    to: "incidents",
    icon: markRaw(IncidentsIcon),
  },
  {
    name: "packages.title",
    to: "packages",
    icon: markRaw(PackagingIcon),
  },
  {
    name: "roles.title",
    to: "roles",
    icon: markRaw(RoleIcon),
  },
])
</script>
