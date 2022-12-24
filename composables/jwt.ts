// Composables
import { useApiFetch } from "@/composables/api"

// Utilities
import { useCookie, useRouter, useRuntimeConfig } from "#app"
import camelcaseKeys from "camelcase-keys"
import { $fetch } from "ohmyfetch"
import { computed, unref } from "vue"

export type ResponseJwtToken = {
  accessToken: string
  accessTokenExpUtc: string
  exp: number
  refreshToken: string
}

type JWT = {
  accessToken?: string
  refreshToken?: string
  expToken?: number
}

type UseJwt = {
  onLogin: (token: { accessToken: string, refreshToken: string, exp: number }) => void
  onLogout: (redirectToAuth?: boolean) => Promise<void>
  validateJWT: () => Promise<boolean>
  checkExpires: () => boolean | undefined
  getToken: () => JWT
  updateRefreshToken: (returnObject?: boolean) => Promise<boolean>
}

export const useJWT: () => UseJwt = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const accessToken = useCookie<string | undefined>("access_token")
  const refreshToken = useCookie<string | undefined>("refresh_token")
  const expToken = useCookie<number | undefined>("exp_token")
  const emptyToken = computed(() => !accessToken.value || !expToken)

  const onLogin: UseJwt["onLogin"] = (token) => {
    accessToken.value = token.accessToken
    refreshToken.value = token.refreshToken
    expToken.value = token.exp
  }

  const onLogout: UseJwt["onLogout"] = async (redirectToAuth = false) => {
    try {
      if (!emptyToken.value) await useApiFetch("auth-service")("logout")
    }
    catch (ex) {
    }
    // eslint-disable-next-line require-atomic-updates
    accessToken.value = undefined
    refreshToken.value = undefined
    expToken.value = undefined
    if (redirectToAuth) await useRouter().push("/auth")
  }

  /**
   * @description Проверить валидность токена
   * @return boolean (true: валиден | false: невалидный токен)
   */
  const validateJWT: UseJwt["validateJWT"] = async () => {
    if (emptyToken.value) return false
    const { data } = await useApiFetch("auth-service")("protected")
    const isValid = data?.employeeId ?? false

    if (isValid === false) {
      // Попробовать обновить токен
      return updateRefreshToken(true)
    }
    return isValid
  }

  const checkExpires: UseJwt["checkExpires"] = () => {
    if (expToken.value === undefined) return
    if (!expToken.value) return false
    return !(Date.now() >= new Date(expToken.value * 1000).getTime())
  }

  const getToken: UseJwt["getToken"] = () => ({
    accessToken: unref(accessToken),
    refreshToken: unref(refreshToken),
    expToken: unref(expToken),
  } as JWT)

  const updateRefreshToken: UseJwt["updateRefreshToken"] = async (returnObject = false) => {
    if (!refreshToken.value) return false
    try {
      const data = await $fetch(`${apiBase}/auth-service/api/v1/refresh`, {
        method: "POST",
        body: { refresh_token: refreshToken.value },
      })
      onLogin(camelcaseKeys(data))
      return true
    }
    catch (ex: any) {
      await onLogout(!returnObject)
      return false
    }
  }

  return {
    onLogin,
    onLogout,
    validateJWT,
    checkExpires,
    getToken,
    updateRefreshToken,
  }
}
