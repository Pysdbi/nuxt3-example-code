<template>
  <div class="w-badge">
    <slot />
    <div
      v-show="!hidden"
      class="badge"
    />
  </div>
</template>

<script setup lang="ts">
// Utilities
import { defineComponent } from "vue"

// Styles
import "./index.css"

defineComponent({ name: "WBadge" })
defineProps({ hidden: Boolean })
</script>
