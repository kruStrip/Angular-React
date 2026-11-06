import type { Check, Run } from './types'

export function findCheck(run: Run | undefined, id: string): Check | undefined {
  return run?.checks.find((check) => check.id === id)
}

export function statusText(check: Check | undefined): string {
  if (check === undefined) {
    return 'Не проверялся'
  }
  if (check.ok) {
    return `Работает · ${check.ms} мс`
  }
  return `Не открывается · ${check.status || check.error}`
}
