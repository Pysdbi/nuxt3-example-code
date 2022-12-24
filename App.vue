<template>
  <div class="relative h-screen w-screen bg-gradient-purple">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <WAlerts />
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import { useLocal } from "#imports"

defineComponent({ name: "App" })

const { setPreferredLanguage } = useLocal()
setPreferredLanguage()
</script>
