<template>
  <img
    v-if="src"
    :src="src"
    alt="User Avatar"
    class="w-avatar"
    :class="{ 'w-avatar--large': large }"
  >

  <AvatarIcon
    v-else
    class="w-avatar"
    :class="{ 'w-avatar--large': large }"
  />
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import AvatarIcon from "@/assets/icons/avatar.svg?component"

defineComponent({ name: "WAvatar" })

defineProps({
  src: {
    type: String,
    default: undefined,
  },
  large: Boolean,
})
</script>

<style>
.w-avatar {
  @apply rounded-full w-10 h-10 object-cover;
}

.w-avatar--large {
  @apply w-full h-full rounded-none;
}
</style>
