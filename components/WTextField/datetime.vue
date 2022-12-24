<template>
  <div class="inline-flex gap-2">
    <WTextField
      v-model="ddMM"
      input-mask="##.##"
    />
    <WTextField
      v-model="yyyy"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref } from "vue"
import WTextField from "./index.vue"

defineComponent({ name: "WTextFieldDateTimePicker" })
const ddMM = ref()
const yyyy = ref(new Date().getFullYear())

const date = computed(() => [ ddMM.value, yyyy.value ].join("."))
</script>
