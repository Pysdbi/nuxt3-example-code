<template>
  <div class="inline-flex gap-2">
    <WSelect
      v-model="phoneCode"
      activator-class="h-full"
      :items="phoneCodes"
    />
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
</template>

<script setup lang="ts">
import { computed, defineComponent, reactive, ref } from "vue"

defineComponent({ name: "WTextFieldPhone" })

const phoneCodes = reactive([ "+7", "+48", "+77", "+374", "+375", "+380", "+421", "+996" ])
const phoneCode = ref(phoneCodes[0])

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

const phoneNumber = ref()
</script>
