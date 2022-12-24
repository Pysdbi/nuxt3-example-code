import { defineNuxtPlugin } from "#app"
import Toast, { POSITION, useToast } from "vue-toastification"
import "vue-toastification/dist/index.css"

const toastClient = useToast()

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Toast, {
    position: POSITION.BOTTOM_CENTER,
    timeout: 5000,
  })
  nuxtApp.provide("toast", (msg, type, time) => toastClient[type](msg, { timeout: time }))
})
