<template>
  <div class="flex flex-col gap-2.5">
    <div class="flex gap-4 items-center">
      <ArrowLeftIcon
        class="h-4 cursor-pointer"
        @click="navigateBack"
      />
      <h1 class="h2-text-accent-f26">
        {{ $t('pages.auth.loginToSystem') }}
      </h1>
    </div>

    <div class="inline-flex gap-4">
      <div>
        <!-- Phone code -->
        <span class="b2-text-body-reg-14">{{ $t('pages.auth.phoneCode') }}</span>
        <WSelect
          v-model="phoneCode"
          activator-class="h-full"
          :items="phoneCodes"
        />
      </div>
      <div>
        <!-- Phone field -->
        <span class="b2-text-body-reg-14 text-grey">{{ $t('pages.auth.phoneNumber') }}</span>
        <WTextField
          v-model="phoneNumber"
          autofocus
          floating
          clearable
          :placeholder="$t('pages.auth.phoneNumber')"
          class="w-full"
          :input-mask="phoneMask"
        />
      </div>
    </div>

    <WButton
      size="lg"
      :disabled="disableLogin"
      @click="loginByPhone"
    >
      {{ $t('pages.auth.getCode') }}
    </WButton>
  </div>
</template>

<script setup lang="ts">
// Utilities
import { computed, defineComponent, inject, reactive } from "vue"
import { definePageMeta, navigateTo, onKeyStroke, useLocalState } from "#imports"

// Icons
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?component"
import { useAuthStore } from "@/store/auth"

definePageMeta({
  layout: "auth",
  keepalive: true,
})
defineComponent({ name: "PageAuthPhone" })

const layout = inject("layout", {} as any)

const authStore = useAuthStore()

const phoneCodes = reactive([ "+7", "+48", "+77", "+374", "+375", "+380", "+421", "+996" ])
const { state: phoneCode } = useLocalState<string>("phoneCode", phoneCodes[0])

// eslint-disable-next-line no-void
const navigateBack = (): void => void navigateTo("/auth")

const phoneMasks = reactive<Record<string, string>>({
  "+7": "(###) ###-##-##",
  "+48": "#### #####",
  "+77": "(###) ### ####",
  "+374": "## ######",
  "+375": "## ###-##-##",
  "+380": "## ### ####",
  "+421": "## ### ## ##",
  "+996": "### ### ###",
})

const phoneMask = computed(() => phoneMasks[phoneCode.value])

const { state: phoneNumber } = useLocalState<string>("phoneNumber")

const loginByPhone = async (): Promise<void> => {
  if (!phoneNumber.value) return
  const phone = ([ phoneCode.value, phoneNumber.value ].join("")).replace(/\D+/g, "")
  const res = await authStore.loginByPhone(phone)
  if (res?.error) {
    layout?.setError?.(res.error)
  }
  else {
    await navigateTo("/auth/phone/code")
  }
}

const disableLogin = computed(() => phoneMask.value.length !== phoneNumber.value?.length)

onKeyStroke([ "Enter" ], loginByPhone)
</script>
