<template>
  <WModal
    v-if="activeAlert"
    v-model="activeAlert.isShow"
    overlay
  >
    <template #modal-header>
      <div
        :class="{
          'text-red': activeAlert.type === 'error',
          'text-orange': activeAlert.type === 'warn',
          'text-pink': activeAlert.type === 'info',
          'text-green': activeAlert.type === 'success',
        }"
        class="flex items-center justify-between w-full"
      >
        <h1
          :class="activeAlert.title ? 'h3-text-med-20' : 'h2-text-accent-26'"
          v-html="activeAlertTitle"
        />
        <div>
          <InfoIcon class="w-5" />
        </div>
      </div>
    </template>
    <template #default>
      <div class="mb-4 min-w-[300px]">
        {{ activeAlert.msg }}
      </div>
      <WButton
        v-if="!activeAlert.isConfirm"
        class="w-full"
        size="lg"
        @click="ok"
      >
        {{ $t('ok') }}
      </WButton>
      <div
        v-else
        class="flex gap-2"
      >
        <WButton
          class="w-full"
          size="lg"
          @click="yes"
        >
          {{ $t('yes') }}
        </WButton>
        <WButton
          class="w-full"
          size="lg"
          outlined
          @click="no"
        >
          {{ $t('not') }}
        </WButton>
      </div>
    </template>
  </WModal>
</template>

<script setup lang="ts">
import { computed, defineComponent } from "vue"
import { useLocal } from "@/composables/locale"
import { useAlerts } from "@/composables/alerts"
import WModal from "@/components/WModal/index.vue"
import WButton from "@/components/WButton/index.vue"

import InfoIcon from "@/assets/icons/info.svg?component"

defineComponent({ name: "WAlerts" })

const { t } = useLocal()
const activeAlert = useAlerts().getActiveAlert

const types = {
  error: t("alerts.error"),
  warn: t("alerts.warn"),
  info: t("alerts.info"),
  success: t("alerts.success"),
}

const activeAlertTitle = computed(() =>
  activeAlert.value?.title ?? types?.[activeAlert.value?.type as keyof typeof types] ?? "",
)

function ok (): void {
  useAlerts().closeActive()
  activeAlert.value?.onOkFunc()
}

function yes (): void {
  useAlerts().closeActive()
  activeAlert.value?.onYesFunc()
}

function no (): void {
  useAlerts().closeActive()
  activeAlert.value?.onNoFunc()
}
</script>
