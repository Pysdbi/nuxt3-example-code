import { computed, reactive, Ref } from "vue"

type AlertResult = {
  onOk: (func: Function) => void
  onYes: (func: Function) => void
  onNo: (func: Function) => void
}
type AlertType = "error" | "warn" | "info" | "success" | "question"
type AlertAction = (msg: string, isConfirm?: boolean) => AlertResult
type AlertCreate = (type: AlertType, title?: string) => AlertAction

type Alert = {
  isShow: boolean

  title?: string
  type: AlertType
  msg: string
  isConfirm: boolean

  onOkFunc: Function
  onYesFunc: Function
  onNoFunc: Function
}

type AlertCallback = (func?: Function) => void
type AlertCallbackType = "onOk" | "onYes" | "onNo"

type UseAlerts = () => (Record<Exclude<AlertType, "question">, AlertAction> & {
  question: (title: string, msg?: string, isConfirm?: boolean) => AlertResult
  getActiveAlert: Ref<Alert | undefined>
  closeActive: () => void
})

const alerts = reactive<Alert[]>([])

export const useAlerts: UseAlerts = () => {
  const createAlert: AlertCreate = (type, title) =>
    (msg, isConfirm) => {
      const alert: Alert = {
        isShow: true,

        title,
        type,
        msg,
        isConfirm: isConfirm ?? false,
        onOkFunc: () => {
        },
        onYesFunc: () => {
        },
        onNoFunc: () => {
        },
      }

      const callbackWrapper = (func: Function): Function => () => {
        func()
      }
      const callbacks: Record<AlertCallbackType, AlertCallback> = {
        onOk: (func) => {
          if (typeof func === "function") alert.onOkFunc = callbackWrapper(func)
        },
        onYes: (func) => {
          if (typeof func === "function") alert.onYesFunc = callbackWrapper(func)
        },
        onNo: (func) => {
          if (typeof func === "function") alert.onNoFunc = callbackWrapper(func)
        },
      }

      alerts.push(alert)

      return { ...callbacks }
    }

  return {
    getActiveAlert: computed(() => alerts.slice(-1)?.[0]),
    closeActive: () => {
      alerts.slice(-1)[0].isShow = false
    },
    alerts,
    error: createAlert("error"),
    warn: createAlert("warn"),
    info: createAlert("info"),
    success: createAlert("success"),
    question: (title, msg, isConfirm) =>
      createAlert("question", title)(msg ?? "", isConfirm ?? true),
  }
}
