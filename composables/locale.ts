import { useI18n } from "vue-i18n"
import { useCookie, useNuxtApp } from "#app"

export type LocaleType = "ru" | "en"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useLocal = () => {
  const {
    locale,
    t,
  } = useI18n()

  const currentLocale = useCookie("lang")

  const setLocale = (l?: LocaleType): void => {
    if (typeof l !== "undefined") {
      currentLocale.value = l
      locale.value = l
    }
    else {
      currentLocale.value = currentLocale.value === "ru" ? "en" : "ru"
      locale.value = currentLocale.value
    }
  }

  const setPreferredLanguage = (): void => {
    if (currentLocale.value === undefined) {
      if (process.server) {
        const nuxtApp = useNuxtApp()
        if ((nuxtApp.ssrContext?.req?.headers) !== undefined) {
          const acceptLanguage = nuxtApp.ssrContext.req.headers["accept-language"] ?? "ru"
          const preferredLanguage = acceptLanguage.split(",")[0]
          setLocale(preferredLanguage.slice(0, 2) as LocaleType)
        }
      }
    }
    else {
      setLocale(currentLocale.value.slice(0, 2) as LocaleType)
    }
  }

  return {
    setPreferredLanguage,
    setLocale,
    locale,
    t,
  }
}
