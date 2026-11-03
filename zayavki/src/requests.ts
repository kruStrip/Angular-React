export type Status = 'Новая' | 'В работе' | 'Готово'

export type Category = 'Сантехника' | 'Электрика' | 'Мебель' | 'Интернет'

export type RequestItem = {
  id: number
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

export const initialRequests: RequestItem[] = [
  {
    id: 1,
    title: 'Течёт кран в душевой',
    room: '307',
    category: 'Сантехника',
    details: 'Кран в душевой на третьем этаже не закрывается до конца, вода капает всю ночь.',
    urgent: true,
    status: 'Новая',
  },
  {
    id: 2,
    title: 'Не работает розетка',
    room: '214',
    category: 'Электрика',
    details: 'Розетка у окна перестала работать, остальные в комнате в порядке.',
    urgent: false,
    status: 'В работе',
  },
  {
    id: 3,
    title: 'Сломана ножка кровати',
    room: '118',
    category: 'Мебель',
    details: 'У кровати у двери отломилась ножка, кровать стоит на книгах.',
    urgent: false,
    status: 'Готово',
  },
  {
    id: 4,
    title: 'Нет Wi-Fi на этаже',
    room: '402',
    category: 'Интернет',
    details: 'Со вчерашнего вечера сеть общежития не видна ни на одном устройстве.',
    urgent: true,
    status: 'Новая',
  },
  {
    id: 5,
    title: 'Перегорела лампа в коридоре',
    room: '305',
    category: 'Электрика',
    details: 'В коридоре у комнаты 305 не горит лампа, вечером совсем темно.',
    urgent: false,
    status: 'Новая',
  },
]

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
