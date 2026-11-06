export type Site = {
  id: string
  name: string
  url: string
}

export type Check = {
  id: string
  ok: boolean
  status: number
  ms: number
  error: string
  title?: string
}

export type Run = {
  time: string
  checks: Check[]
}
