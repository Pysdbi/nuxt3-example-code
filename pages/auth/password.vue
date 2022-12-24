<template>
  <div class="flex flex-col gap-2.5">
    <div
      v-show="isLoading"
      class="
        absolute top-0 left-0 right-0 bottom-0 z-10 rounded-2xl
        bg-white/60 flex justify-center items-center
      "
    >
      <WLoader />
    </div>
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
      <CheckSuccessIcon class="h-6 text-icon-green" />
      <span
        class="leading-4"
        v-text="userFIO"
      />
    </div>

    <WTextField
      v-model="password"
      autofocus
      floating
      type="password"
      :placeholder="$t('pages.auth.password')"
      class="w-full mt-4"
    />
    <WLink
      @click="forgotPassword"
      v-text="$t('pages.auth.forgotYourPassword')"
    />

    <WButton
      :disabled="!possibilityLogin"
      size="lg"
      class="mt-4"
      @click="login"
    >
      {{ $t('pages.auth.signIn') }}
    </WButton>
  </div>
</template>

<script setup lang="ts">
// Utilities
import { computed, defineComponent, inject, ref } from "vue"
import { definePageMeta, onKeyStroke, useLoading, useLocal } from "#imports"
import { useAuthStore } from "@/store/auth"

// Icons
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?component"
import CheckSuccessIcon from "@/assets/icons/check-success.svg?component"
import { navigateTo } from "#app"

definePageMeta({ layout: "auth" })
defineComponent({ name: "PageAuthPassword" })

const { t } = useLocal()

const layout = inject("layout", {} as any)

// eslint-disable-next-line no-void
const navigateBack = (): void => void navigateTo("/auth")

const authStore = useAuthStore()
const user = computed(() => authStore.checkedUser ?? null)
if (user.value === null) await navigateTo("/auth")
if (user.value?.userHavePassword === false) await navigateTo("/auth/new-password")

const userFIO = computed(() => user.value && [
  user?.value?.lastname,
  user?.value?.firstname,
  user?.value?.middlename,
].join(" "))

const { isLoading } = useLoading()

const password = ref<string>()
const possibilityLogin = computed(() => password.value && password.value?.length >= 6)

const login = async (): Promise<void> => {
  if (!possibilityLogin.value) return

  const res = await authStore.loginByEidWithPassword(
    Number(user.value?.employeeId),
    String(password.value),
  )
  if (res?.error) {
    layout?.setError?.(res.error)
    return
  }
  await navigateTo("/")
}

const forgotPassword = (): void => {
  layout?.setError?.(t("pages.auth.contactSupervisor"))
}

onKeyStroke([ "Enter" ], login)
</script>
