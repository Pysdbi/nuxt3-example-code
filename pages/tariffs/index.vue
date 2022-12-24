<template>
  <div class="p-4 h-full">
    Отчеты
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import { useLocal, useStateHeader } from "#imports"

defineComponent({ name: "PageTariffs" })

const { t } = useLocal()
const { setPageTitle } = useStateHeader()
setPageTitle(() => t("nav.tariffs"))
</script>
