<template>
  <div
    v-if="qrCode"
    class="h-[285px] w-[285px]"
    v-html="qrCode"
  />
  <WLoader v-else />
</template>

<script setup lang="ts">
import { useRuntimeConfig } from "#imports"
import { defineComponent, onUnmounted, ref } from "vue"

defineComponent({ name: "MExitFromTSD" })

const config = useRuntimeConfig()

const apiBaseWS: string = config.public.apiBaseWS

const socket = new WebSocket(`${apiBaseWS}/auth-service/api/v1/tsd/ws`)
const qrCode = ref()
socket.onmessage = (event) => {
  qrCode.value = event.data
}
onUnmounted(() => {
  socket.close()
})
</script>
