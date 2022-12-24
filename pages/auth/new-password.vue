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
      <span
        class="leading-4"
        v-text="$t('pages.auth.setPassword')"
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
    <WTextField
      v-model="confirmPassword"
      floating
      type="password"
      :placeholder="$t('pages.auth.confirmPassword')"
      class="w-full mt-4"
    />

    <WButton
      :disabled="!possibilityLogin"
      size="lg"
      class="mt-4"
      @click="setNewPassword"
    >
      {{ $t('pages.auth.signIn') }}
    </WButton>
  </div>
</template>

<script setup lang="ts">
// Utilities
import { computed, defineComponent, inject, ref } from "vue"
import {
  definePageMeta,
  navigateTo,
  onKeyStroke,
  useLoading,
  useLocal,
} from "#imports"
import { useAuthStore } from "@/store/auth"

// Icons
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?component"

definePageMeta({ layout: "auth" })
defineComponent({ name: "PageAuthNewPassword" })

const { t } = useLocal()

const layout = inject("layout", {} as any)

// eslint-disable-next-line no-void
const navigateBack = (): void => void navigateTo("/auth")

const authStore = useAuthStore()
const user = computed(() => authStore.checkedUser ?? null)
if (user.value === null) await navigateTo("/auth")

const { isLoading } = useLoading()

const password = ref<string>()
const confirmPassword = ref<string>()
const possibilityLogin = computed(() =>
  password.value
  && password.value === confirmPassword.value
  && password.value?.length >= 6,
)

const setNewPassword = async (): Promise<void> => {
  const isEqualsPwd = password.value === confirmPassword.value
  // Throw Error
  if (!possibilityLogin.value || !isEqualsPwd) {
    const passwordError = !password.value ? "empty" : !isEqualsPwd ? "confirm" : "minLength"
    layout?.setError?.(t(`pages.auth.${passwordError}PasswordError`))
    return
  }

  const res = await authStore.setPassword(
    Number(user.value?.employeeId),
    String(password.value),
  )
  if (res?.error) {
    layout?.setError?.(res.error)
    return
  }

  await authStore.loginByEidWithPassword(
    Number(user.value?.employeeId),
    String(password.value),
  )
  await navigateTo("/")
}

onKeyStroke([ "Enter" ], setNewPassword)
</script>
