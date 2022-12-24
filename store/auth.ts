import { defineStore } from "pinia"
import { ApiResponse, useApiFetch, useLoading } from "@/composables/api"
import { ResponseJwtToken, useJWT } from "@/composables/jwt"

type CheckUser = {
  employeeId: number
  firstname: string
  lastname: string
  middlename: string
  userHavePassword: boolean
}

type PhoneData = {
  eid: number
  tempToken: string
  codeLength: number
}

type State = {
  checkedUser?: CheckUser

  currentPhone?: string
  phoneData?: PhoneData
}
type Actions = {
  checkUser: (eid: number) => Promise<ApiResponse<CheckUser>>
  loginByEidWithPassword: (eid: number, password: string) => Promise<ApiResponse<ResponseJwtToken>>
  setPassword: (eid: number, password: string) => Promise<ApiResponse>

  loginByPhone: (phone?: string) => Promise<ApiResponse<PhoneData>>
  verifyCode: (eid: number, tempToken: string, code: number) => Promise<ApiResponse<ResponseJwtToken>>
}

export const useAuthStore = defineStore("AuthStore", {
  state: (): State => ({
    currentPhone: undefined,
    checkedUser: undefined,
    phoneData: undefined,
  }),

  actions: {
    async checkUser (eid) {
      useLoading().start()
      const res = await useApiFetch("auth-service")<CheckUser>("check_user", {
        method: "POST",
        body: { eid: Number(eid) },
      })
      useLoading().end()
      if (res?.error) {
        this.checkedUser = undefined
      }
      else {
        this.checkedUser = res.data
      }
      return res
    },

    async loginByEidWithPassword (eid, password) {
      useLoading().start()
      const res = await useApiFetch("auth-service")<ResponseJwtToken>("login_by_eid_pwd", {
        method: "POST",
        body: {
          eid: Number(eid),
          password,
        },
      })
      useLoading().end()
      if (res?.error) {
        await useJWT().onLogout()
      }
      else {
        useJWT().onLogin(res.data)
      }
      return res
    },

    async setPassword (eid, password) {
      useLoading().start()
      const res = await useApiFetch("auth-service")("set_pwd", {
        method: "POST",
        body: {
          eid: Number(eid),
          password,
        },
      })
      useLoading().end()
      return res
    },

    async loginByPhone (phone) {
      useLoading().start()
      const res = await useApiFetch("auth-service")<PhoneData>("login_by_phone/", {
        method: "GET",
        params: { phone: phone ?? this.currentPhone },
      })
      useLoading().end()
      if (res?.error) {
        this.currentPhone = undefined
        this.phoneData = undefined
      }
      else {
        this.currentPhone = phone
        this.phoneData = res.data
      }
      return res
    },

    async verifyCode (eid, tempToken, code) {
      useLoading().start()
      const res = await useApiFetch("auth-service")<ResponseJwtToken>("verify_code/", {
        method: "GET",
        params: {
          eid: Number(eid),
          temp_token: tempToken,
          code: Number(code),
        },
      })
      useLoading().end()
      if (res?.error) {
        await useJWT().onLogout()
      }
      else {
        useJWT().onLogin(res.data)
      }
      return res
    },
  } as Actions,
})
