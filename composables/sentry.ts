import { useNuxtApp } from "#imports"
import { useUserStore } from "@/store/user"
import { User } from "@sentry/vue"
import { SeverityLevel } from "@sentry/types/types/severity"

type Options = {
  tags: { [key: string]: any }
  breadcrumb: { message?: string }
  transaction: string
}
const options: Options = {
  tags: {},
  breadcrumb: { message: undefined },
  transaction: "",
}

type SentryExceptionTypes = "sentryError" | "sentryFatal" | "sentryWarning" | "sentryInfo" | "sentryLog" | "sentryDebug"
type SentryException = (name: string, opts?: Options) => void

type UseLocalState = () => Record<SentryExceptionTypes, SentryException>

export const useSentry: UseLocalState = () => {
  const { $sentry } = useNuxtApp()

  const sentryException = (level: SeverityLevel) => async (ex: string, opts = options) => {
    const { user } = useUserStore()
    $sentry.captureException(ex, (scope) => {
      // scope.clear()
      scope.setLevel(level)
      scope.setTags(opts.tags)
      scope.setUser(user as User)
      scope.addBreadcrumb(opts.breadcrumb)
      scope.setTransactionName(opts.transaction)
      // scope.setContext("trace", { a: "123312" })
      return scope
    })
  }

  return {
    sentryError: (...args) => sentryException("error").apply({}, args),
    sentryFatal: (...args) => sentryException("fatal").apply({}, args),
    sentryWarning: (...args) => sentryException("warning").apply({}, args),
    sentryInfo: (...args) => sentryException("info").apply({}, args),
    sentryLog: (...args) => sentryException("log").apply({}, args),
    sentryDebug: (...args) => sentryException("debug").apply({}, args),
  }
}
