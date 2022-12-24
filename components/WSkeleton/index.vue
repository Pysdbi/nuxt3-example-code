<template>
  <Skeletor
    class="w-skeleton rounded-lg"
    :width="width"
    :height="height"
  />
</template>

<script setup lang="ts">
import { Skeletor } from "vue-skeletor"
import "vue-skeletor/dist/vue-skeletor.css"
import { defineComponent } from "vue"

defineComponent({ name: "WSkeleton" })

defineProps({
  width: {
    type: [ Number, String ],
    default: "100%",
  },
  height: {
    type: [ Number, String ],
    default: "100%",
  },
})
</script>

<style>
.w-skeleton {
  @apply overflow-hidden;
}
</style>
