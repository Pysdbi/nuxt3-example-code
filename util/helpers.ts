// Utilities

// Types
import type { Ref } from "vue"
import { mapKeys, pickBy } from "lodash-es"

export function toKebabCase (str = ""): string {
  return str
    .replace(/[^a-z]/gi, "-")
    .replace(/\B([A-Z])/g, "-$1")
    .toLowerCase()
}

export type MaybeRef<T> = T | Ref<T>

export const declOfNum = (n: number, titles: string[]): string =>
  titles[
    n % 10 === 1 && n % 100 !== 11
      ? 0
      : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
        ? 1
        : 2
  ]

export const randInt = (min: number = 0) => (max: number): number => Math.floor(Math.random() * (max - min + 1)) + min

export const rangeApply = (length: number, fn?: (k: any, i: number) => any): any[] => [ ...Array.from({ length }, (k, i) => fn?.(k, i) ?? i) ]

export const formatDate = (date: string, locale: "ru" | "en" = "ru"): string => {
  const d = new Date(date)
  let month = `${d.getMonth() + 1}`
  let day = `${d.getDate()}`
  const year = d.getFullYear()

  if (month.length < 2) month = "0" + month
  if (day.length < 2) day = "0" + day

  return locale === "ru"
    ? [ day, month, year ].join(".")
    : [ year, month, day ].join(".")
}

export const formatDateTime = (date: string, localeEN: boolean = false): string => {
  const d = new Date(date)
  let month = `${d.getMonth() + 1}`
  let day = `${d.getDate()}`
  const year = `${d.getFullYear()}`
  let hours = `${d.getHours()}`
  let minutes = `${d.getMinutes()}`
  let seconds = `${d.getSeconds()}`

  if (month.length < 2) month = "0" + month
  if (day.length < 2) day = "0" + day
  if (hours.length < 2) hours = "0" + hours
  if (minutes.length < 2) minutes = "0" + minutes
  if (seconds.length < 2) seconds = "0" + seconds

  const arrD = [ day, month, year ]
  if (localeEN) arrD.reverse()
  const arrT = [ hours, minutes, seconds ]

  return [ arrD.join(localeEN ? "-" : "."), arrT.join(":") ].join(" ")
}

export const calculateAge = (birthday: string): number => {
  const date = new Date(birthday)
  const ageDifMs = Date.now() - date.getTime()
  const ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export const snakeCase = (str: string): string => {
  return str.split("").map((letter, idx) => {
    return letter.toUpperCase() === letter
      ? `${idx !== 0 ? "_" : ""}${letter.toLowerCase()}`
      : letter
  }).join("")
}

export const snakeCaseObject = (obj: Object): Object => {
  return mapKeys(obj, (v, k) => snakeCase(k))
}

export const pickWithoutBy = (obj: object, predicate: any = undefined): object => pickBy(obj, (v, k) => v !== predicate)
