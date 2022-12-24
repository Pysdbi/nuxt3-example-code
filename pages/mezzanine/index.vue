<template>
  <div class="p-4 h-full w-full overflow-hidden">
    <div class="h-full overflow-auto">
      <div
        style="height: 100vh;width: 100vw;"
        class="bg-light-pink"
      >
        123
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import { useLocal, useStateHeader } from "#imports"

defineComponent({ name: "PageMezzanine" })

const { t } = useLocal()
const { setPageTitle } = useStateHeader()
setPageTitle(() => t("nav.mezzanine"))
</script>
