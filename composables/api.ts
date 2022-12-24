import { useRuntimeConfig } from "#app"
import { $fetch, FetchOptions } from "ohmyfetch"
import { ref, Ref } from "vue"
import { v4 as uuidv4 } from "uuid"
import { useJWT } from "@/composables/jwt"
import camelcaseKeys from "camelcase-keys"
import { useAlerts } from "@/composables/alerts"

// ============== API ==============

export type ApiResponse<T = any> = {
  data: T
  detail?: string
  error?: string
  type?: string
}

type ApiServices = "auth-service" | "web-admin-backend" | "wms-tasks" | "wms-statuses" | "electronic-queue-service" | "wms-workplaces" | "wms-package"
type ApiVersion = "api/v1" | "api/v2"
type ApiRequest =
  string
  | "login_by_eid"
  | "login_by_eid_pwd"
  | "set_pwd"
  | "check_user"
  | "reset_pwd"
  | "refresh"
  | "protected"
  | "me"
  | "login_by_phone"
  | "verify_code"
  | "logout"
  | "set_user_wh_loc"
  | "get_user_info/123" // TODO set eid
  | "get_users_info"
  | "get_user_photo/123" // TODO set eid
  | "get_user_terminal_history/123" // TODO set eid
  | "search_users"
  | "role/get"
  | "role/get_by_id"
  | "role/create_with_permissions"
  | "role/edit_with_permissions/{role_id}"
  | "role/delete/{role_id}"
  | "permission/get"
  | "permission/get_by_id"
  | "emp-role/set_roles"
  | "role-permission/set_permissions"
  | "tsd/confirm_logout"
  // wms-statuses
  | "tarifier/data"
  // web-admin-backend
  | "users"
  | "blocks"
  | "blocks/get_group_by_block/"
  // wms-tasks
  | "incidents/list?page=1&pageSize=99999&sortType=asc&status=created"
  // wms-workplaces
  | "work/get_workers"
  | "work/get_employee_info"
  | "work/revoke_assigned_work"
  | "work/assign_work"
  | "work/get_workplaces"
  | "work/get_workplaces_for_employee"
  // wms-package
  | "packages/wb"
type FetchFunction = <T = any>(request: ApiRequest, opts?: FetchOptions<"json">) => Promise<ApiResponse<T>>

type ApiFetchOptions = {
  version?: ApiVersion
  apiBase?: string | null
  contentType?: string
  external?: boolean
  fetchOpts?: FetchOptions
}

const isUpdatingToken = ref(false)

export const useApiFetch = (service?: ApiServices, opt?: ApiFetchOptions): FetchFunction => {
  const config = useRuntimeConfig()

  let apiBase = config.public.apiBase
  if (service) apiBase = [ apiBase, service ].join("/")
  apiBase = [ apiBase, opt?.version ?? "api/v1" ].join("/")

  const fetch = $fetch.create({
    // Base url
    ...(opt?.apiBase !== null && { baseURL: opt?.apiBase ?? apiBase }),
    headers: {
      "Content-Type": opt?.contentType ?? "application/json",
      ...(typeof window !== "undefined" && { "x-device-id": window.navigator?.userAgent }),
      "x-request-id": uuidv4(),
    },

    async onRequest ({ options }): Promise<void> {
      const checkExpires = useJWT().checkExpires()
      if (checkExpires === false && !isUpdatingToken.value) {
        isUpdatingToken.value = true
        await useJWT().updateRefreshToken().then(r => (isUpdatingToken.value = false))
      }
      const { accessToken } = useJWT().getToken()
      if (accessToken) {
        // @ts-expect-error
        options.headers.Authorization = `Bearer ${accessToken}`
      }
    },

    async onResponseError ({ response }): Promise<any> {
      const details = response._data as ApiResponse
      const errors = { 500: "Внутренняя ошибка сервера 500. Попробуйте позже или проверьте состояние интернет подключения." }
      const error = errors[response.status as keyof typeof errors]
      if (error) useAlerts().error(error)

      return Promise.reject(details)
    },
  })

  return async <T = any>(request, opts) => {
    try {
      const url = opt?.external ?? false ? request : `/${request as string}`
      const data = await fetch(url, { ...opts, ...(opt?.fetchOpts ?? {}) })
      return { data: camelcaseKeys(data, { deep: true }) } as ApiResponse<T>
    }
    catch (ex: any) {
      const error: ApiResponse<T> = { ...camelcaseKeys(ex) }
      error.error = error?.error ?? "500. Сервер не отвечает"
      return error
    }
  }
}
// =======================================

// ============== Api Image ==============
type UseApiImage = () => {
  getImage: (url: string) => Promise<string | undefined>
}

export const useApiImage: UseApiImage = () => {
  return {
    getImage: async (url) => {
      try {
        if (process.server) return

        let blob: any
        let isError: boolean = false
        const opt: ApiFetchOptions = {
          apiBase: null,
          external: true,
          fetchOpts: {
            responseType: "blob",
            async onResponse ({ response }) {
              blob = response._data
              isError = response.status !== 200
            },
          },
        }
        await useApiFetch(undefined, opt)(url)
        return isError ? "" : blobToBase64(blob)
      }
      catch (ex: any) {
        // eslint-disable-next-line no-console
        console.warn(`[useApiImage]: Not found: ${url}`)
      }
    },
  }
}

async function blobToBase64 (blob: Blob): Promise<string> {
  // eslint-disable-next-line promise/param-names
  return new Promise((resolve, _) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(String(reader.result))
    reader.readAsDataURL(blob)
  })
}

// =====================================

// ============== Loading ==============
type UseLoading = () => {
  isLoading: Ref<boolean>
  start: () => void
  end: () => void
}

const isLoading = ref<boolean>(false)

export const useLoading: UseLoading = () => {
  return {
    isLoading,
    start: () => (isLoading.value = true),
    end: () => (isLoading.value = false),
  }
}
// =====================================
