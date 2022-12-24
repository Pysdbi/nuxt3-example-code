<template>
  <div class="flex flex-col gap-2.5">
    <h1 class="h2-text-accent-26">
      {{ $t('pages.auth.loginToSystem') }}
    </h1>

    <div class="inline-flex gap-3.5">
      <span
        class="leading-4"
        v-html="$t('pages.auth.scanBadge')"
      />
    </div>

    <div class="flex justify-center">
      <QRScaningIcon class="h-20 text-icon-black" />
    </div>

    <!-- Badge number field -->
    <span class="b1-text-reg-16">{{ $t('pages.auth.inputEidByHand') }}</span>
    <WTextField
      v-model="eId"
      autofocus
      floating
      clearable
      :placeholder="$t('pages.auth.badgeNumber')"
      class="w-full"
    />

    <!-- Auth by -->
    <span class="">{{ $t('pages.auth.loginBy') }}</span>
    <WButton
      outlined
      size="lg"
      @click="navigateTo('/auth/phone')"
    >
      {{ $t('pages.auth.usingPhone') }}
    </WButton>
  </div>
</template>

<script setup lang="ts">
// Utilities
import { defineComponent, inject, onMounted, ref } from "vue"
import { definePageMeta, onKeyStroke, useEventListener } from "#imports"

// Icons
import QRScaningIcon from "@/assets/icons/qr-scaning.svg?component"
import { useAuthStore } from "@/store/auth"
import { navigateTo } from "#app"

definePageMeta({ layout: "auth" })
defineComponent({ name: "PageAuth" })

const layout = inject("layout", {} as any)

const authStore = useAuthStore()

const eId = ref<number>()
const checkEId = async (): Promise<void> => {
  if (!eId.value) return
  const res = await authStore.checkUser(Number(eId.value))
  if (res?.error) {
    layout?.setError?.(res.error)
  }
  else {
    await navigateTo("/auth/password")
  }
}

onKeyStroke([ "Enter" ], checkEId)
onMounted(() => {
  useEventListener(window, "paste", async (e: ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData?.getData("text/plain")
    if (!isNaN(Number(pasted))) eId.value = Number(pasted)
    await checkEId()
  })
})
</script>
