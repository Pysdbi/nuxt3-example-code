<template>
  <div class="pt-4 h-full w-full overflow-hidden flex flex-col">
    <div class="px-4 h-full w-full overflow-y-auto flex flex-col gap-4 max-w-[800px]">
      <template v-if="roleMode === 'create'">
        create
      </template>
      <template v-else-if="roleMode === 'view'">
        <MSettingsRoleCard
          v-model:name="roleCard.roleName"
          v-model:description="roleCard.roleDescription"
        />
      </template>
    </div>
    <div class="bg-light-blue p-4 flex gap-4">
      <template v-if="roleMode === 'create'">
        <WButton
          class="w-full"
          size="lg"
          :disabled="true"
          @click="createRole"
        >
          {{ t('add') }}
        </WButton>
        <WButton
          outlined
          size="lg"
          class="w-full"
          @click="navigateBack"
        >
          {{ t('cancel') }}
        </WButton>
      </template>
      <template v-if="roleMode === 'edit'">
        <WButton
          class="w-full"
          size="lg"
          @click="updateRole"
        >
          {{ t('save') }}
        </WButton>
        <WButton
          outlined
          size="lg"
          class="w-full"
          @click="deleteRole"
        >
          {{ t('delete') }}
        </WButton>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref } from "vue"
import { useLocal } from "@/composables/locale"
import { useStateHeader } from "@/composables/stateHeader"
import { navigateTo, useAlerts, useRoute } from "#imports"
import { Role, useRolesStore } from "@/store/settings/roles"
import MSettingsRoleCard from "@/components/molecules/Settings/RoleCard/index.vue"
import { cloneDeep } from "lodash-es"

defineComponent({ name: "PageSettingsRoleById" })

const _paramsId = Number(useRoute().params?.id)
const roleId = isNaN(_paramsId) ? undefined : _paramsId

const { t } = useLocal()
const {
  setPageTitle,
  setNavigateBack,
} = useStateHeader()

const roleMode = computed<"create" | "edit" | "view">(() => {
  if (roleId === undefined) return "create"
  return "view"
})

const navigateBack = async (): Promise<void> => {
  await navigateTo("/settings/roles")
}
setPageTitle(() => {
  const spanID = roleId !== undefined ? `<span class="ml-2 text-grey">ID: ${roleId}</span>` : ""
  return [ t(`pages.settings.roles.role.${roleMode.value}`), spanID ].join("")
})
setNavigateBack(navigateBack)

const rolesStore = useRolesStore()

const originalRole = ref<Role>()
const roleCard = ref<Partial<Role>>({
  roleName: undefined,
  roleDescription: undefined,
})

async function getRole (): Promise<void> {
  if (roleId !== undefined) {
    originalRole.value = await rolesStore.getRole(roleId)
    if (originalRole.value === undefined) {
      useAlerts().error("Роль не найдена")
      await navigateBack()
    }
    else {
      roleCard.value = cloneDeep(originalRole.value)
    }
  }
}

await getRole()

// === Actions ===
// Create
const createRole = async (): Promise<void> => {

}
// UPDATE
const updateRole = async (): Promise<void> => {

}
// DELETE
const deleteRole = async (): Promise<void> => {

}
</script>
