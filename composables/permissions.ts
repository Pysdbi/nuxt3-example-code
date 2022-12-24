// eslint-disable-next-line no-shadow
import { useUserStore } from "@/store/user"

export enum EPermissions {
  ADMIN_ID = 1,
  TESTER_ID = 2,
  ACCEPTOR_GATES_ID = 3,
  ACCEPTOR_TABLES_ID = 4,
  ROOT = 1,
  TEST = 2,
  PASS_VIEW = 3,
  PASS_EDIT = 4,
  PASS_ADD_TO_QUEUE = 5,
  PASS_IMPORT = 6,
  GATES_VIEW = 7,
  GATES_ACCEPTANCE = 8,
  GATES_SETTINGS = 9,
  TABLES_VIEW = 10,
  TABLES_ACCEPTANCE = 11,
  TABLES_SETTINGS = 12,
  MEZZANINE_VIEW = 13,
  MEZZANINE_UP = 14,
  MEZZANINE_APPORTIONMENT = 15,
  MEZZANINE_SETTINGS = 16,
  ASSEMBLY_VIEW = 17,
  ASSEMBLY_UP = 18,
  ASSEMBLY_APPORTIONMENT = 19,
  ASSEMBLY_SETTINGS = 20,
  SORTING_VIEW = 21,
  SORTING_PRESORT = 22,
  SORTING_SORT = 23,
  SORTING_SETTINGS = 24,
  SHIPMENT_VIEW = 25,
  SHIPMENT_SHIPMENT = 26,
  SHIPMENT_SETTINGS = 27,
  TARIFFS_VIEW = 28,
  TARIFFS_EDIT = 29,
  HANDBOOKS_VIEW = 30,
  HANDBOOKS_EDIT = 31,
  REPORTS_VIEW = 32,
  REPORTS_EDIT = 33,
  WORKS_VIEW = 34,
  WORKS_EDIT = 35,
  GENERAL_SETTINGS = 36,
  RESET_PASSWORD = 38,
  TURNSTILE_MANAGE = 39,
  USERS_MANAGE = 44,
  USERS_ASSIGN_ROLES = 45,
  ROLES_EDIT = 46,
}

export type Permission = {
  id: number
  permissionName: string
  permissionDescription?: string
  isDeprecated?: boolean
  canWrite?: boolean
  minAuthMethod?: string
}

export const hasPermission = function (key: keyof typeof EPermissions, permissions?: Permission[]): boolean {
  if ((permissions ?? []).length === 0) console.warn("Permissions in empty.")
  return (permissions ?? []).some((x: Permission) => x.id === EPermissions[key])
}

export const useAllowed = (key: keyof typeof EPermissions): boolean => {
  const userStore = useUserStore()
  return userStore.isPermit(key)
}
