export type Status = 'Новая' | 'В работе' | 'Готово'

export type Category = 'Сантехника' | 'Электрика' | 'Мебель' | 'Интернет'

export type RequestItem = {
  id: string
  title: string
  room: string
  category: Category
  details: string
  urgent: boolean
  status: Status
}

export type NewRequest = {
  title: string
  room: string
  category: Category
  details: string
  urgent: boolean
}

export function nextStatus(status: Status): Status {
  if (status === 'Новая') {
    return 'В работе'
  }
  return 'Готово'
}

export function prevStatus(status: Status): Status {
  if (status === 'Готово') {
    return 'В работе'
  }
  return 'Новая'
}

export function upsertRequest(list: RequestItem[], item: RequestItem): RequestItem[] {
  if (list.some((r) => r.id === item.id)) {
    return list.map((r) => (r.id === item.id ? item : r))
  }
  return [item, ...list]
}
