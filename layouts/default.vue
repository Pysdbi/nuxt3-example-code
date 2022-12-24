<template>
  <div class="px-5 pt-5 h-full">
    <div class="container mx-auto bg-white rounded-t-2xl h-full flex">
      <OSidebar />
      <main class="grow flex flex-col h-full w-full relative overflow-hidden">
        <OHeader />
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import OSidebar from "@/components/organisms/Sidebar/index.vue"
import OHeader from "@/components/organisms/Header/index.vue"
import { useUserStore } from "@/store/user"
import { onMounted } from "#imports"

defineComponent({ name: "LayoutDefault" })

const userStore = useUserStore()
await userStore.init()

onMounted(userStore.getAvatar)
</script>
