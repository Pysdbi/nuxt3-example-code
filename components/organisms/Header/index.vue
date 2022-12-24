<template>
  <div />
  <div class="o-header">
    <div class="flex gap-3.5 items-center">
      <WAvatar
        :src="userAvatar"
        class="text-pink"
      />
      <h1 class="b1-text-med-16">
        {{ userFIO }}
      </h1>
      <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
      <h2 class="b1-text-med-16 text-grey">
        EID: {{ user?.employeeId }}
      </h2>
    </div>
    <div class="ml-auto flex gap-4">
      <WModal
        overlay
        modal-title="Выработка"
        @open:modal="getTarifierData"
      >
        <template #activator="{ open }">
          <RubIcon
            class="o-header--icon"
            @click="open"
          />
        </template>
        <div class="mt-2 min-w-[300px]">
          <h1 class="h3-text-med-20 text-pink">
            {{ userFIO }}
          </h1>
          <div class="o-header__tarifier--list">
            <div>
              <span>Тип договора:</span> <span>{{ tarifierData?.accountType }}</span>
            </div>
            <div>
              <span>Выработка по тарификатору:</span>
              <span class="text-green">
                <template v-if="tarifierData?.production ?? 0 > 0">+</template>
                <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
                {{ tarifierData?.production }} ₽
              </span>
            </div>
            <div>
              <span>Удержания по тарификатору:</span>
              <span class="text-red">
                <template v-if="tarifierData?.retention ?? 0 > 0">-</template>
                <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
                {{ tarifierData?.retention }} ₽
              </span>
            </div>
            <div>
              <span>Вид работы:</span> <span>{{ tarifierData?.workType }}</span>
            </div>
            <div>
              <span>Количество:</span> <span>{{ tarifierData?.quantity }}</span>
            </div>
          </div>
        </div>
      </WModal>
      <WPopover position="right">
        <template #activator="{ open }">
          <div class="mt-auto">
            <SettingsIcon
              class="o-header--icon"
              :class="{ 'text-pink': open }"
            />
          </div>
        </template>
        <div
          class="w-12 text-center border border-grey rounded-lg select-none cursor-pointer"
          @click="() => setLocale()"
        >
          {{ locale }}
        </div>
      </WPopover>
      <NotifyIcon class="o-header--icon" />
      <PowerIcon
        class="o-header--icon text-red"
        @click="onLogout(true)"
      />
    </div>
  </div>

  <div class="o-header--sub">
    <div class="flex items-center gap-4">
      <div
        v-if="navigateBack"
        class="p-1 icon-button"
        @click="navigateBack"
      >
        <ChevronLeftIcon class="w-3" />
      </div>
      <h1
        class="h3-text-accent-20"
        v-html="pageTitle"
      />
    </div>
    <div class="ml-auto">
      <component :is="appendComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue"
import { useUserStore } from "@/store/user"
import { storeToRefs } from "pinia"
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?component"
import RubIcon from "@/assets/icons/rub.svg?component"
import SettingsIcon from "@/assets/icons/settings.svg?component"
import NotifyIcon from "@/assets/icons/notify.svg?component"
import PowerIcon from "@/assets/icons/power.svg?component"
import { useApiFetch, useJWT, useLocal, useStateHeader } from "#imports"

defineComponent({ name: "OHeader" })

const {
  pageTitle,
  appendComponent,
  navigateBack,
} = useStateHeader()
const {
  setLocale,
  locale,
} = useLocal()

const userStore = useUserStore()
const { onLogout } = useJWT()

const {
  userFIO,
  user,
  userAvatar,
} = storeToRefs(userStore)

const tarifierData = ref<{
  accountType: string
  et: number
  production: number
  quantity: number
  retention: number
  workType: string
}>()
const getTarifierData = async (): Promise<void> => {
  const {
    data,
    error,
  } = await useApiFetch("wms-statuses")("tarifier/data")
  if (error) return
  tarifierData.value = data
}
</script>

<style>
.o-header {
  @apply flex items-center border-b border-grey;
  @apply px-4 h-14;
}

.o-header--sub {
  @apply border-b border-grey p-4 flex items-center;
}

.o-header--icon {
  @apply w-6 cursor-pointer transition-colors hover:text-pink select-none;
}

.o-header__tarifier--list {
  @apply flex flex-col gap-2 mt-3;
}

.o-header__tarifier--list > div {
  @apply flex justify-between gap-2;
}

.o-header__tarifier--list > div > span:first-child {
  @apply b2-text-body-accent-14;
}

.o-header__tarifier--list > div > span:last-child {
  @apply b1-text-accent-16
}
</style>
