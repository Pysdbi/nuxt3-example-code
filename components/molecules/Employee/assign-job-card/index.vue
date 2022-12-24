<template>
  <div class="m-employee-card">
    <div class="flex gap-4">
      <div class="m-employee-card__left-side w-[240px]">
        <WAvatar
          :src="userAvatar"
          class="text-pink max-w-full min-h-[200px]"
          large
        />
      </div>
      <div class="m-employee-card__right-side w-[500px] min-h-[240px]">
        <div
          v-if="employee"
          class="m-employee-card__items"
        >
          <div class="view__item">
            <div>Дата рождения</div>
            <div>{{ formatDate(employee.birthdate) }}</div>
          </div>
          <div class="view__item">
            <div>Заблокирован</div>
            <WIndicator :value="employee.banFromWms" />
          </div>
          <div class="view__item">
            <div>Дата последнего входа</div>
            <div>{{ formatDateTime(employee.lastEntered) }}</div>
          </div>
          <div class="view__item">
            <div>На складе</div>
            <WIndicator :value="employee.isIn" />
          </div>

          <div class="view__item--row">
            <div class="b1-text-med-16">
              Текущий статус
            </div>
            <WIndicator
              :value="!!employee?.currentWork"
              :keys="currentWorkKeys"
            />
          </div>

          <!-- Block -->
          <template v-if="!editMode">
            <div
              v-if="employee?.currentWork"
              class="view__item--block"
            >
              {{ employee?.currentWork?.blockName }}
            </div>
          </template>
          <WSelect
            v-else
            v-model="selectedBlock"
            activator-title="Блок"
            :items="blocks"
            item-title="whName"
          />

          <!-- Work -->
          <template v-if="!editMode">
            <div
              v-if="employee?.currentWork"
              class="view__item--block"
            >
              {{ employee?.currentWork?.workName }}
            </div>
          </template>
          <WSelect
            v-else
            v-model="selectedJob"
            activator-title="Вид работ"
            :items="workplaces"
            item-title="name"
            group-by-key="haveAccess"
            :group-by-labels="{
              true: 'Доступно',
              false: 'Недоступно',
            }"
            :disabled-by="(x) => !x?.haveAccess"
          />
        </div>
      </div>
    </div>

    <div class="m-employee-card__actions mt-3">
      <template v-if="!editMode">
        <WButton
          v-if="!!employee?.currentWork"
          class="w-full"
          color="orange"
          size="lg"
          :loading="isLoading"
          :disabled="!employee?.currentWork.workIsManualAssign"
          @click="confirmRevokeWork"
        >
          Снять работу
        </WButton>
        <WButton
          v-else
          class="w-full"
          size="lg"
          @click="toggleEditMode"
        >
          Назначить работу
        </WButton>
      </template>
      <!-- Действия при назначении работы -->
      <template v-else>
        <WButton
          class="w-full bg-icon-yellow"
          size="lg"
          :loading="isLoading"
          :disabled="!(selectedJob && selectedBlock)"
          @click="assignJob"
        >
          Сохранить
        </WButton>
        <WButton
          outlined
          class="w-full"
          size="lg"
          @click="toggleEditMode"
        >
          Отменить
        </WButton>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { booleanRef, formatDate, formatDateTime } from "@/util"
import { getFIOByUser } from "@/store/user"
import { useAlerts, useApiImage, useLoading } from "#imports"
import { defineComponent, PropType, ref, watch } from "vue"
import { useAssignJobStore, WorkerInfo, Workplace } from "@/store/assign-job"

import "../card/index.css"
import "./index.css"
import { storeToRefs } from "pinia"

defineComponent({ name: "MAssignJobEmployeeCard" })
// eslint-disable-next-line vue/require-default-prop
const props = defineProps({
  eId: {
    type: [ String, Number ],
    default: undefined,
  },
  cancel: {
    type: Function as PropType<(() => void)>,
    default: undefined,
  },
})
const emit = defineEmits([ "employee:404", "update:employeeTitle" ])

const { isLoading } = useLoading()

const assignJobStore = useAssignJobStore()
const { blocks } = storeToRefs(assignJobStore)

const currentWorkKeys = {
  true: "Работает",
  false: "Не работает",
}

const {
  value: editMode,
  toggle: toggleEditMode,
} = booleanRef(false)

// TODO Permissions
// const canEdit = computed(() =>
//   [
//     useAllowed("TURNSTILE_MANAGE"),
//     useAllowed("USERS_ASSIGN_ROLES"),
//   ].some(x => x),
// )

const selectedBlock = ref()
const selectedJob = ref()
watch(editMode, () => {
  selectedBlock.value = undefined
  selectedJob.value = undefined
})

const employee = ref<WorkerInfo>()
const userAvatar = ref()

const workplaces = ref<Workplace[]>([])

const needLoadAvatar = ref(true)
const getEmployeeByEId = async (isInit?: boolean): Promise<void> => {
  needLoadAvatar.value = isInit ?? false
  if (props.eId) {
    const {
      data,
      error,
    } = await assignJobStore.getWorkerByEId(+props.eId)
    if (error) {
      emit("employee:404")
      return
    }
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

if (props.eId) {
  await getEmployeeByEId(true)
  void assignJobStore.getBlocks()
  workplaces.value = await assignJobStore.getWorkplacesForEmployee(+props.eId) ?? []
}

/* REVOKE WORK */
const revokeWork = async (): Promise<void> => {
  useLoading().start()
  const {
    blockId,
    workId,
  } = employee.value?.currentWork ?? {}
  if (!props.eId || blockId === undefined || workId === undefined) return
  const error = await assignJobStore.revokeAssignedWork(+props.eId, blockId, workId)
  if (!error) {
    await getEmployeeByEId()
  }
  else {
    confirmRevokeWork()
  }
  useLoading().end()
}

const confirmRevokeWork = (): void => {
  const { onYes } = useAlerts().question("Снять сотрудника с <br>работы работы?")
  onYes(async () => {
    await revokeWork()
  })
}

/* ASSIGN WORK */
const assignJob = async (): Promise<void> => {
  useLoading().start()
  if (!props.eId) return
  const error = await assignJobStore.assignWork(
    +props.eId,
    selectedBlock.value.id,
    selectedJob.value.id,
  )
  if (!error) {
    // eslint-disable-next-line require-atomic-updates
    await getEmployeeByEId()
    toggleEditMode()
  }
  else {
    useAlerts().error(error ?? "")
  }
  useLoading().end()
}
</script>
