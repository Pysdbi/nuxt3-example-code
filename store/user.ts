import { defineStore } from "pinia"
import { useApiFetch, useApiImage, useLoading } from "@/composables/api"
import { computed, ref } from "vue"
import lodash from "lodash-es"
import { EPermissions, hasPermission, Permission } from "@/composables/permissions"

type Role = {
  id: number
  roleName: string
  roleDescription: string
  permissions: Array<{
    id: number
    permissionName: string
    permissionDescription: string
  }>
}

export type User = {
  employeeId: number
  firstname: string
  middlename: string
  lastname: string
  sex: string
  phone: string | null
  photoUrl: string
  isActive: boolean
  birthdate: string
  banDt: boolean | null
  banReason: string | null
  banFromWms: boolean
  roles: Role[]
  userId: number | null
  authMethod: string
  departmentId: number

  createdAt: string
  updatedAt: string
}

export const getFIOByUser = (user: Record<string, any>): string => Object.values(lodash.pick(user, [
  "lastname",
  "lastName",
  "firstname",
  "firstName",
  "middlename",
  "middleName",
])).join(" ") ?? ""

export const useUserStore = defineStore("UserStore", () => {
  const user = ref<User>()
  const permissions = ref<Permission[]>()

  const userFIO = computed(() => user.value
    && getFIOByUser(user.value),
  )

  const userAvatar = ref<string>()

  const getMe = async (): Promise<User | undefined> => {
    useLoading().start()
    const {
      data,
      error,
    } = await useApiFetch("auth-service")<User>("me")
    useLoading().end()
    user.value = error ? undefined : data
    return user.value
  }

  const getPermissions = async (): Promise<void> => {
    const {
      data,
      error,
    } = await useApiFetch("auth-service")<Permission[]>("permission/get")

    permissions.value = error ? undefined : data
  }

  const isPermit = (key: keyof typeof EPermissions): boolean => hasPermission(key, permissions.value)

  const isEmpty = computed(() => !user.value && !permissions.value)

  return {
    init: async () => {
      if (isEmpty.value) {
        await Promise.all([
          getMe(),
          getPermissions(),
        ])
      }
    },
    $reset: () => {
      user.value = undefined
      permissions.value = undefined
    },

    user,
    permissions,
    userAvatar,
    userFIO,

    getMe,
    getPermissions,
    isPermit,
    getAvatar: async (): Promise<void> => {
      if (user.value?.photoUrl) {
        userAvatar.value = await useApiImage().getImage(user.value?.photoUrl)
      }
    },
  }
})
