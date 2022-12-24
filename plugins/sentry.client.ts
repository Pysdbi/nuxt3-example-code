import { defineNuxtPlugin, useRuntimeConfig } from "#imports"
import * as Sentry from "@sentry/vue"
import { BrowserTracing } from "@sentry/tracing"

export default defineNuxtPlugin((nuxtApp) => {
  const release = "vue-frontend"
  const environment = useRuntimeConfig().public.ENV
  const dsn = "https://38dea98c2d53484f9513eaa9eee8ee54@sentry.wb.ru//6"
  const { vueApp } = nuxtApp

  Sentry.init({
    app: [ vueApp ],
    dsn,
    release,
    environment,
    integrations: [ new BrowserTracing({ routingInstrumentation: Sentry.vueRouterInstrumentation(nuxtApp.$router) }) ],
    tracesSampleRate: 1.0,
    beforeSend (event, hint) {
      if (event.exception) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,no-console
        console.info(`[Exception handled by Sentry]: (${hint.originalException})`, {
          event,
          hint,
        })
      }
      return event
    },
  })

  vueApp.mixin(Sentry.createTracingMixins({
    trackComponents: true,
    timeout: 2000,
    hooks: [ "activate", "mount", "update" ],
  }))
  Sentry.attachErrorHandler(vueApp, {
    logErrors: true,
    attachProps: true,
    trackComponents: true,
    timeout: 2000,
    hooks: [ "activate", "mount", "update" ],
  })

  return { provide: { sentry: Sentry } }
})
