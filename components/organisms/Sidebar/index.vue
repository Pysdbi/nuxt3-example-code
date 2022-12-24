<template>
  <div
    class="o-sidebar flex-none"
    :class="{ 'o-sidebar--collapsed': collapsed }"
  >
    <div
      class="o-sidebar--item my-2"
      @click="toggleCollapsed"
    >
      <WButton icon>
        <ChevronLeftIcon
          class="w-2 transition-transform"
          :class="{ 'rotate-180': collapsed }"
        />
      </WButton>
      <span>
        {{ $t('components.sidebar.collapseMenu') }}
      </span>
    </div>

    <nuxt-link
      v-for="item in navItems"
      :key="item.name"
      :href="getNavItemHref(item)"
      class="o-sidebar--item"
      :class="{
        'opacity-50 pointer-events-none': item?.disabled === true,
        'text-pink': isSelectedNavItem(item),
      }"
    >
      <div>
        <component
          :is="item.icon"
          class="w-6 h-6"
        />
      </div>
      <div>
        {{ $t(`nav.${item.name}`) }}
      </div>
    </nuxt-link>

    <div class="mt-auto" />

    <WModal
      overlay
      modal-title="Выйти из ТСД"
    >
      <template #activator="{ open }">
        <div
          class="o-sidebar--item  text-red"
          @click="open"
        >
          <div>
            <LogoutIcon class="w-6" />
          </div>
          <div>
            {{ $t('components.sidebar.logoutTSD') }}
          </div>
        </div>
      </template>
      <div class="mt-4 flex items-center justify-center min-h-[285px] min-w-[285px]">
        <MExitFromTSD />
      </div>
    </WModal>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, markRaw, ref } from "vue"
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?component"

import MezzanineIcon from "@/assets/icons/mezzanine.svg?component"
import AllocationIcon from "@/assets/icons/allocation.svg?component"
import AssemblyIcon from "@/assets/icons/assembly.svg?component"
import SortingIcon from "@/assets/icons/sorting.svg?component"
import ShipmentIcon from "@/assets/icons/shipment.svg?component"
import TariffsIcon from "@/assets/icons/tariffs.svg?component"
import ReferenceBooksIcon from "@/assets/icons/reference-books.svg?component"
import ReportsIcon from "@/assets/icons/reports.svg?component"
import OrderPassIcon from "@/assets/icons/order-pass.svg?component"
import AssignJobIcon from "@/assets/icons/assign-job.svg?component"
import SettingsIcon from "@/assets/icons/settings.svg?component"

import LogoutIcon from "@/assets/icons/logout.svg?component"
import { useRoute } from "#imports"
import MExitFromTSD from "@/components/molecules/ExitFromTSD.vue"

defineComponent({ name: "OSidebar" })

const collapsed = ref(false)
const toggleCollapsed = (): boolean => (collapsed.value = !collapsed.value)

const getNavItemHref = (item: NavItem): string => item?.href ?? `/${item.name}`
const isSelectedNavItem = (item: NavItem): boolean => useRoute().path.split("/").slice(1).includes(getNavItemHref(item).slice(1))

type NavItem = {
  name: string
  href?: string
  icon: any
  disabled?: boolean
}
const navItems = ref<NavItem[]>([
  {
    name: "mezzanine",
    icon: markRaw(MezzanineIcon),
    disabled: true,
  },
  {
    name: "allocation",
    icon: markRaw(AllocationIcon),
    disabled: true,
  },
  {
    name: "assembly",
    icon: markRaw(AssemblyIcon),
    disabled: true,
  },
  {
    name: "sorting",
    icon: markRaw(SortingIcon),
    disabled: true,
  },
  {
    name: "shipment",
    icon: markRaw(ShipmentIcon),
    disabled: true,
  },
  {
    name: "tariffs",
    icon: markRaw(TariffsIcon),
    disabled: true,
  },
  {
    name: "reference-books",
    icon: markRaw(ReferenceBooksIcon),
  },
  {
    name: "reports",
    icon: markRaw(ReportsIcon),
  },
  {
    name: "order-pass",
    icon: markRaw(OrderPassIcon),
    disabled: true,
  },
  {
    name: "assign-job",
    icon: markRaw(AssignJobIcon),
  },
  {
    name: "settings",
    icon: markRaw(SettingsIcon),
  },

])
</script>

<style>
.o-sidebar {
  @apply w-[224px] px-5 pb-1.5 transition-[width] overflow-x-hidden whitespace-nowrap;
  @apply flex flex-col border-r border-grey;
}

.o-sidebar.o-sidebar--collapsed {
  @apply w-[64px] px-5;
}

/* Item */
.o-sidebar--item {
  @apply inline-flex items-center gap-4 py-2;
  @apply cursor-pointer transition-colors hover:text-pink;
}

.o-sidebar.o-sidebar--collapsed .o-sidebar--item > :last-child {
  @apply opacity-0 transition-opacity;
}
</style>
