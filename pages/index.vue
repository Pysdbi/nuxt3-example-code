<template>
  <div class="p-4 h-full">
    <h1 class="w-full bg-btn-orange text-orange py-2 px-4 rounded-lg flex gap-2 items-center">
      <InfoIcon class="w-5 h-5" />
      Выберите тип работ
    </h1>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import { useLocal, useStateHeader } from "#imports"
import InfoIcon from "@/assets/icons/info.svg?component"

defineComponent({ name: "PageMain" })

const { t } = useLocal()
const { setPageTitle } = useStateHeader()
setPageTitle(() => t("welcome"))
</script>
