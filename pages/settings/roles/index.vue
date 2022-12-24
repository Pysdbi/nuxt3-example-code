<template>
  <div class="pt-4 h-full w-full overflow-hidden">
    <WTable
      can-click-row
      enable-multi-select
      enable-column-resizing
      hidden-filters
      hidden-sorting
      :rows="roles"
      :columns="columns"
      :loading="loading"
      :more-loading="moreLoading"
      @click:row="editRole"
    >
      <template #prepend-search>
        <WButton
          size="xl"
          class="whitespace-nowrap"
          @click="createRole"
        >
          <PlusIcon class="w-6 inline-block" />
          Создать роль
        </WButton>
      </template>
    </WTable>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import { navigateTo, useLocal, useStateHeader } from "#imports"
import { storeToRefs } from "pinia"
import { ClickItem } from "@/components/WTable/types"
import { useRolesStore } from "@/store/settings/roles"

import PlusIcon from "@/assets/icons/plus.svg?component"

defineComponent({ name: "PageSettingsRoles" })

const { t } = useLocal()
const {
  setPageTitle,
  setNavigateBack,
} = useStateHeader()
setPageTitle(() => t("pages.settings.roles.title"))
setNavigateBack(() => navigateTo("/settings"))

const rolesStore = useRolesStore()
const {
  roles,
  loading,
  moreLoading,
} = storeToRefs(rolesStore)
const { getRoles } = rolesStore

const columns = {
  id: {
    size: 80,
    header: t("pages.settings.columns.roles.id"),
  },
  roleName: {
    size: 200,
    header: t("pages.settings.columns.roles.roleName"),
  },
  roleDescription: {
    size: "100%",
    header: t("pages.settings.columns.roles.roleDescription"),
  },
}

void getRoles()

async function createRole (): Promise<void> {
  await navigateTo("/settings/roles/create")
}

async function editRole (row: ClickItem): Promise<void> {
  await navigateTo(`/settings/roles/${String(row.data.id)}`)
}
</script>
