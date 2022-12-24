<template>
  <div class="m-recovery-password">
    <WTextField
      v-model="password"
      autofocus
      floating
      type="password"
      :placeholder="$t('pages.auth.password')"
      class="w-full mt-4"
    />
    <WTextField
      v-model="confirmPassword"
      floating
      type="password"
      :placeholder="$t('pages.auth.confirmPassword')"
      class="w-full mt-4"
    />
    <div class="m-recovery-password__actions">
      <WButton
        class="w-full"
        :disabled="!possibilityConfirm"
        @click="onSave"
      >
        Сохранить
      </WButton>
      <WButton
        outlined
        class="w-full"
        @click="emit('click:cancel')"
      >
        Отменить
      </WButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref } from "vue"

defineComponent({ name: "MRecoveryPassword" })

const password = ref<string>()
const confirmPassword = ref<string>()
const possibilityConfirm = computed(() =>
  password.value
  && password.value === confirmPassword.value
  && password.value?.length >= 6,
)

const emit = defineEmits([ "click:cancel", "click:save" ])
const onSave = (): void => {
  if (!possibilityConfirm.value) return
  emit("click:save", password.value)
  emit("click:cancel")
}
</script>

<style>
.m-recovery-password {
  @apply flex flex-col gap-2;
}

.m-recovery-password__actions {
  @apply flex gap-2 mt-2;
}
</style>
