<template>
  <div class="flex flex-col gap-2.5">
    <div class="flex gap-4 items-center">
      <ArrowLeftIcon
        class="h-4 cursor-pointer"
        @click="navigateBack"
      />
      <h1 class="h2-text-accent-26">
        {{ $t('pages.auth.loginToSystem') }}
      </h1>
    </div>

    <div class="inline-flex gap-3.5">
      <span
        class="leading-4"
        v-html="$t('pages.auth.phoneCodeInfo')"
      />
    </div>

    <WTextField
      v-model="code"
      autofocus
      floating
      type="text"
      :placeholder="$t('pages.auth.phoneCodeFromPush')"
      class="w-full mt-4"
      :max-length="6"
    />

    <WButton
      :disabled="timeLeft !== 0"
      size="lg"
      text
      class="mt-4"
      @click="getPhoneCode"
    >
      {{ $t('pages.auth.sendCode') }}
      <template v-if="timeLeft">
        {{ timeLeft }}
      </template>
    </WButton>
  </div>
</template>

<script setup lang="ts">
// Utilities
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  ref,
  watchEffect,
} from "vue"
import { definePageMeta, navigateTo, useTimer } from "#imports"
import { useAuthStore } from "@/store/auth"

// Icons
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?component"

definePageMeta({ layout: "auth" })
defineComponent({ name: "PageAuthPhoneCode" })

const layout = inject("layout", {} as any)

// eslint-disable-next-line no-void
const navigateBack = (): void => void navigateTo("/auth/phone")

const authStore = useAuthStore()
const phoneData = computed(() => authStore.phoneData ?? null)

if (phoneData.value === null) await navigateTo("/auth/phone")

const code = ref<string>()
const possibilityLogin = computed(() => code.value && code.value?.length === phoneData.value?.codeLength)

const verify = async (): Promise<void> => {
  if (!possibilityLogin.value) return

  const res = await authStore.verifyCode(
    Number(phoneData.value?.eid),
    String(phoneData.value?.tempToken),
    Number(code.value),
  )
  if (res?.error) {
    layout?.setError?.(res.error)
    // eslint-disable-next-line require-atomic-updates
    code.value = ""
    return
  }
  await navigateTo("/")
}

const getPhoneCode = async (): Promise<void> => {
  await authStore.loginByPhone()
  startTimer()
}

const {
  start: startTimer,
  timeLeft,
} = useTimer(30)
onMounted(startTimer)

watchEffect(() => code.value?.length === phoneData.value?.codeLength && verify())
</script>
