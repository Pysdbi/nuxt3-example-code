<template>
  <div class="m-employee-card">
    <div class="flex gap-4">
      <div class="m-employee-card__left-side w-[300px]">
        <WAvatar
          :src="userAvatar"
          class="text-pink max-w-[300px] max-h-[400px]"
          large
        />
      </div>
      <div class="m-employee-card__right-side w-[600px] min-h-[425px]">
        <div class="m-employee-card__header">
          <div />
          <WModal
            v-if="useAllowed('RESET_PASSWORD')"
            v-model="passwordRecoveryModal"
            :modal-title="$t('components.molecules.employee.card.reset-password-title')"
            overlay
          >
            <template #activator="{ open }">
              <WButton
                outlined
                @click="open"
              >
                {{ $t('components.molecules.employee.card.reset-password') }}
              </WButton>
            </template>
            <template #default="{ close }">
              <MRecoveryPassword
                class="mt-4"
                @click:save="recoveryPassword"
                @click:cancel="close"
              />
            </template>
          </WModal>
        </div>
        <MEmployeeCardViewMode
          v-if="!editMode"
          :employee="employee"
          :terminal-history="terminalHistory"
          @click:terminal-history="getTerminalHistory"
        />
        <MEmployeeCardEditMode
          v-else
          v-model="editedEmployee"
          :employee="employee"
          :roles="rolesList"
        />
      </div>
    </div>

    <div class="m-employee-card__actions">
      <WButton
        class="w-1/2"
        size="lg"
        :disabled="!canEdit"
        @click="editMode ? saveChanges() : toggleEditMode()"
      >
        {{ editMode ? $t('save') : $t('edit') }}
      </WButton>
      <WButton
        outlined
        class="w-1/2"
        size="lg"
        @click="editMode ? toggleEditMode() : cancel?.()"
      >
        {{ $t('cancel') }}
      </WButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData } from "#app"
import { booleanRef } from "@/util"
import { useApiImage } from "#imports"
import {
  computed,
  defineComponent,
  PropType,
  ref,
  watch,
} from "vue"
import { EmployeeInfo, Role, TerminalHistoryItem, useEmployeesStore } from "@/store/reference-books/employees"
// Components
import MEmployeeCardViewMode from "@/components/molecules/Employee/card/View.vue"
import MEmployeeCardEditMode from "@/components/molecules/Employee/card/Edit.vue"

import "./index.css"
import lodash from "lodash-es"
import { useAllowed } from "@/composables/permissions"
import MRecoveryPassword from "@/components/molecules/RecoveryPassword/index.vue"
import { getFIOByUser } from "@/store/user"

defineComponent({ name: "MEmployeeCard" })
// eslint-disable-next-line vue/require-default-prop
const props = defineProps({
  eId: {
    type: Number,
    default: undefined,
  },
  cancel: {
    type: Function as PropType<(() => void)>,
    default: undefined,
  },
})
const emit = defineEmits([ "update:employeeTitle" ])

const employeeStore = useEmployeesStore()

const {
  value: passwordRecoveryModal,
  toggle: togglePasswordRecoveryModal,
} = booleanRef(false)

const {
  value: editMode,
  toggle: toggleEditMode,
} = booleanRef(false)

const canEdit = computed(() =>
  [
    useAllowed("TURNSTILE_MANAGE"),
    useAllowed("USERS_ASSIGN_ROLES"),
  ].some(x => x),
)

const rolesList = ref<Role[]>()

const employee = ref<EmployeeInfo>()
const userAvatar = ref()

const needLoadAvatar = ref(true)
const getEmployeeByEId = async (isInit?: boolean): Promise<void> => {
  needLoadAvatar.value = isInit ?? false
  if (props.eId) {
    const data = await employeeStore.getUserInfo(+props.eId)
    if (!data) return
    employee.value = data
  }

  if (needLoadAvatar.value && employee.value?.photoUrl) {
    userAvatar.value = await useApiImage().getImage(employee.value?.photoUrl)
    // eslint-disable-next-line require-atomic-updates
    needLoadAvatar.value = false
  }

  emit("update:employeeTitle", `${getFIOByUser(employee.value as any)} <span class="text-grey ml-2">EID: ${String(employee.value?.employeeId)}<span>`)
}

emit("update:employeeTitle", undefined)

await getEmployeeByEId()

const terminalHistory = ref<TerminalHistoryItem[]>([])

async function getTerminalHistory (): Promise<void> {
  terminalHistory.value = []
  if (props.eId === undefined) return

  const { data } = await employeeStore.getTerminalHistory(props.eId)
  terminalHistory.value = data ?? []
}

void useAsyncData(async () => {
  if (!employee.value?.photoUrl) return
  rolesList.value = await employeeStore.getRoles()
})

const editedEmployee = ref<EmployeeInfo>()
watch(editMode, () => (editedEmployee.value = lodash.cloneDeep(employee.value) as EmployeeInfo))

const saveChanges = async (): Promise<void> => {
  if (!editedEmployee.value || !props.eId) return
  await employeeStore.updateUserInfo(editedEmployee.value)
  employee.value = await employeeStore.getUserInfo(props.eId)
  toggleEditMode()
}
const recoveryPassword = async (password: string): Promise<void> => {
  if (props.eId === undefined) return
  const success = await employeeStore.recoveryPassword(props.eId, password)
  if (success) togglePasswordRecoveryModal()
}
</script>
