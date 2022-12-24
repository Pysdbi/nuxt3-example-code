<template>
  <div class="p-4 h-full">
    <div class="flex flex-wrap gap-4">
      <nuxt-link
        v-for="section in sections"
        :key="section.name"
        :to="`/reference-books/${section.name}`"
        class="section-block"
        :class="{ 'opacity-50 pointer-events-none': section?.disabled === true }"
      >
        <component
          :is="section.icon"
          class="w-6 h-6 inline-block"
        />

        <div>{{ t(`pages.reference-books.${section.name}`) }}</div>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, markRaw } from "vue"
import { useLocal, useStateHeader } from "#imports"

import BlockIcon from "@/assets/icons/block.svg?component"
import BlockingMXIcon from "@/assets/icons/blocking-mx.svg?component"
import GatesIcon from "@/assets/icons/gates.svg?component"
import StorageAreasIcon from "@/assets/icons/storage-areas.svg?component"
import MXMezzanineIcon from "@/assets/icons/mx-mezzanine.svg?component"
import AppointmentOfCounterIcon from "@/assets/icons/appointment-of-counter.svg?component"
import RefusalsAcceptanceIcon from "@/assets/icons/refusals-acceptance.svg?component"
import WarehousesIcon from "@/assets/icons/warehouses.svg?component"
import DescentFromMezzanineIcon from "@/assets/icons/descent-from-mezzanine.svg?component"
import TablesIcon from "@/assets/icons/tables.svg?component"
import EmployeesIcon from "@/assets/icons/employees.svg?component"
import ContainersIcon from "@/assets/icons/containers.svg?component"
import TSDIcon from "@/assets/icons/tsd.svg?component"
import { useUserStore } from "@/store/user"
import { storeToRefs } from "pinia"

defineComponent({ name: "PageReferenceBooks" })

const { t } = useLocal()
const { setPageTitle } = useStateHeader()
setPageTitle(() => t("nav.reference-books"))
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
type Section = {
  name: string
  href?: string
  icon?: any
  disabled?: boolean
}
const sections = computed<Section[]>(() => [
  {
    name: "blocks",
    icon: markRaw(BlockIcon),
  },
  {
    name: "blocking-mx",
    disabled: true,
    icon: markRaw(BlockingMXIcon),
  },
  {
    name: "gates",
    icon: markRaw(GatesIcon),
  },
  {
    name: "storage-areas",
    disabled: true,
    icon: markRaw(StorageAreasIcon),
  },
  {
    name: "mx-mezzanine",
    disabled: true,
    icon: markRaw(MXMezzanineIcon),
  },
  {
    name: "appointment-of-counter",
    disabled: true,
    icon: markRaw(AppointmentOfCounterIcon),
  },
  {
    name: "refusals-acceptance",
    disabled: true,
    icon: markRaw(RefusalsAcceptanceIcon),
  },
  {
    name: "warehouses",
    icon: markRaw(WarehousesIcon),
  },
  {
    name: "descent-from-mezzanine",
    disabled: true,
    icon: markRaw(DescentFromMezzanineIcon),
  },
  {
    name: "tables",
    disabled: true,
    icon: markRaw(TablesIcon),
  },
  {
    name: "employees",
    icon: markRaw(EmployeesIcon),
  },
  {
    name: "containers",
    disabled: true,
    icon: markRaw(ContainersIcon),
  },
  {
    name: "tsd",
    disabled: true,
    icon: markRaw(TSDIcon),
  },
])
</script>
