import { defineNuxtRouteMiddleware, navigateTo } from "#app"
import { useJWT } from "#imports"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const prefix = to.fullPath.slice(1).split("/")?.[0]
  // Не отслеживать страницы авторизации
  if ([ "auth" ].includes(prefix)) return

  const {
    getToken,
    validateJWT,
  } = useJWT()

  const { accessToken } = getToken()
  if (accessToken === undefined) {
    return navigateTo("/auth", {
      external: true,
      redirectCode: 301,
    })
  }

  const authenticated = await validateJWT()
  if (!authenticated) {
    return navigateTo("/auth", {
      external: true,
      redirectCode: 301,
    })
  }
})
