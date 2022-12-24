<template>
  <div class="p-1 md:p-5 flex items-center justify-center h-full">
    <div class="relative bg-white rounded-2xl w-[320px] md:w-[380px] p-5">
      <div
        v-show="isLoading"
        class="
        absolute top-0 left-0 right-0 bottom-0 z-10 rounded-2xl
        bg-white/60 flex justify-center items-center
      "
      >
        <WLoader />
      </div>

      <slot />

      <ClientOnly>
        <div
          class="layout-auth__error"
          :class="{ show: textError?.length }"
        >
          <InfoIcon class="h-8" />
          <div class="error__text">
            {{ textError }}
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, provide, ref } from "vue"
import InfoIcon from "@/assets/icons/info.svg?component"
import { useLoading } from "@/composables/api"
import { useJWT } from "#imports"
import { useResetPinia } from "@/composables/resetPinia"

defineComponent({ name: "LayoutDefault" })

await useJWT().onLogout()

const { isLoading } = useLoading()

const textError = ref<string>()
provide("layout", {
  setError: (value: string) => {
    textError.value = value
    setTimeout(() => {
      textError.value = ""
    }, 3000)
  },
})
useResetPinia().all()
</script>

<style>
.layout-auth__error {
  @apply absolute left-0 right-0 top-full;
  @apply flex gap-2.5 items-center py-4 px-5 bg-black/80;
  @apply text-white text-size-15 font-600 leading-16;
  @apply rounded-2xl transition-transform opacity-0;

  transform: translateY(6px);
  transition: 1s;
}

.layout-auth__error.show {
  @apply opacity-100;
  transform: translateY(16px);
}
</style>
