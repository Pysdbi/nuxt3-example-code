import { Ref, ref } from "vue"

type UseTimer = (seconds: number) => {
  timeLeft: Ref<number>
  start: () => void
  clear: () => void
  onDone: (func: Function) => void
}
export const useTimer: UseTimer = (seconds) => {
  const timeLeft = ref<number>(seconds)
  let interval: NodeJS.Timer

  const start = (): void => {
    timeLeft.value = seconds
    interval = setInterval(() => {
      if (timeLeft.value > 0) timeLeft.value--
      if (timeLeft.value === 0) stop()
    }, 1000)
  }
  const clear = (): void => {
    clearInterval(interval)
  }

  const onDone = (func: Function): void => {
    func()
  }

  return {
    timeLeft,
    start,
    clear,
    onDone,
  }
}
