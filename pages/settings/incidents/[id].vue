<template>
  <div class="incident-wrap">
    <div
      v-if="incident"
      class="incident"
    >
      <div class="incident__item">
        <span class="incident__item--name">
          {{ t("pages.settings.incident-pallet.entityCreatedAt") }}
        </span>
        <span class="incident__item--value">
          {{ formatDateTime(incident.entity.createdAt) }}
        </span>
      </div>
      <div class="incident__item">
        <span class="incident__item--name">
          {{ t("pages.settings.incident-pallet.entityType") }}
        </span>
        <span class="incident__item--value">
          {{ entityType }}
        </span>
      </div>
      <div class="incident__item">
        <span class="incident__item--name">
          {{ t("pages.settings.incident-pallet.cargoQRcode") }}
        </span>
        <span class="incident__item--value">
          {{ incident.entity.cargoQrCode }}
        </span>
      </div>
      <div class="incident__item">
        <span class="incident__item--name">
          {{ t("pages.settings.incident-pallet.block") }}
        </span>
        <span class="incident__item--value">
          {{ t("pages.settings.incident-pallet.block") }} {{ incident.whId }}
        </span>
      </div>
      <div class="incident__item">
        <span class="incident__item--name">
          {{ t("pages.settings.incident-pallet.toLocationDescription") }}
        </span>
        <span class="incident__item--value">
          {{ incident.entity.toLocationDescription }}
        </span>
      </div>
      <div class="incident__item">
        <span class="incident__item--name">
          {{ t("pages.settings.incident-pallet.initiatorId") }}
        </span>
        <span class="incident__item--value">
          {{ incident.entity.initiatorId }}
        </span>
      </div>
      <div class="incident__item">
        <span class="incident__item--name">
          {{ t("pages.settings.incident-pallet.executorId") }}
        </span>
        <span class="incident__item--value">
          {{ incident.entity.executorId }}
        </span>
      </div>
      <div class="incident__item">
        <span class="incident__item--name">
          {{ t("pages.settings.incident-pallet.entityStatus") }}
        </span>
        <span class="incident__item--value">
          {{ incident.entity.status }}
        </span>
      </div>
      <div class="incident__item">
        <span class="incident__item--name">
          {{ t("pages.settings.incident-pallet.entityId") }}
        </span>
        <span class="incident__item--value">
          {{ incident.entity.id }}
        </span>
      </div>
      <div class="incident__item">
        <span class="incident__item--name">
          {{ t("pages.settings.incident-pallet.errorReason") }}
        </span>
        <span class="incident__item--value">
          {{ incident.errorReason }}
        </span>
      </div>
      <div class="incident__item">
        <span class="incident__item--name">
          {{ t("pages.settings.incident-pallet.solution") }}
        </span>
        <span class="incident__item--value">
          {{ incident.solution }}
        </span>
      </div>
      <div
        v-if="incident.comment"
        class="incident__item"
      >
        <div class="incident__item--name">
          {{ t("pages.settings.incident-pallet.comment") }}
        </div>
        <div>
          {{ incident.comment }}
        </div>
      </div>

      <template v-if="![ 'ignored', 'resolved' ].includes(incident.status)">
        <WTextField
          v-model="commentModel"
          tag="textarea"
          class="w-full"
          floating
          :placeholder="t('pages.settings.incident-pallet.comment')"
        />

        <div class="flex gap-4">
          <WButton
            v-for="button in incidentButtons"
            :key="button.action"
            size="lg"
            class="w-full"
            @click="doAction(button.action)"
          >
            {{ button.name }}
          </WButton>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo, useLocal, useRoute, useStateHeader } from "#imports"
import {
  computed,
  defineComponent,
  h,
  reactive,
  ref,
} from "vue"
import { Incident, useIncidentsStore } from "@/store/settings/incidents"
import { formatDateTime, snakeCase } from "@/util"
import WIndicator from "@/components/WIndicator/index.vue"

defineComponent({ name: "PageSettingsIncidentById" })

const incidentId = useRoute().params.id as string

const { t } = useLocal()
const incidentStatus = reactive({
  keys: {
    created: t("pages.settings.cells.incidents.status.created"),
    resolved: t("pages.settings.cells.incidents.status.resolved"),
    ignored: t("pages.settings.cells.incidents.status.ignored"),
  },
  colors: {
    created: "#ff5c00",
    resolved: "#497af9",
    ignored: "#1dcb43",
  },
})
const {
  setPageTitle,
  setAppendComponent,
  setNavigateBack,
} = useStateHeader()
setPageTitle(() => `${t("pages.settings.incident-pallet.title")} <span class="text-grey ml-2">ID: ${incidentId}<span>`)

const navigateBack = (): any => navigateTo("/settings/incidents")
setNavigateBack(navigateBack)

const incidentsStore = useIncidentsStore()
const incident = ref<Incident>()
incident.value = await incidentsStore.getIncident(incidentId)

const incidentDeliveryTypes: Record<any, any> = { delivery_tables: t("pages.settings.incident-pallet.deliveryTables") }

const entityType = computed(() =>
  incidentDeliveryTypes[incident.value?.entity.type ?? ""]
  ?? incident.value?.entity.type,
)

setAppendComponent(h(WIndicator, {
  value: incident.value?.status,
  keys: incidentStatus.keys,
  colors: incidentStatus.colors,
}))

const commentModel = ref()
const incidentButtons = ref<Array<{ name: string, action: string }>>([])
if (
  typeof incident.value?.allowedActions === "object"
  && Object.keys(incident.value.allowedActions).length
) {
  Object.keys(incident.value.allowedActions).forEach((item) => {
    incidentButtons.value.push({
      name: incident.value?.allowedActions[item],
      action: item,
    })
  })
}

const doAction = async (action: string): Promise<void> => {
  if (!incident.value) return

  const success = await incidentsStore.resolveIncident(
    incident.value.id,
    snakeCase(action),
    commentModel.value,
  )
  if (success) {
    await navigateBack()
  }
}
</script>

<style>
.incident-wrap {
  @apply h-full overflow-y-auto;
}

.incident {
  @apply flex flex-col gap-4 p-4 container mx-auto max-w-4xl;
}

.incident__item {
  @apply bg-light-blue flex flex-wrap gap-x-4 gap-y-2 justify-between items-center px-4 py-3 rounded-lg;
  @apply overflow-ellipsis overflow-hidden;
}

.incident__item--name {
  @apply text-grey b2-text-body-reg-14;
}

.incident__item--value {
  @apply overflow-ellipsis overflow-hidden;
}
</style>
