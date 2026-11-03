import { useState } from 'react'
import type { Category, Status } from '../requests'

type RequestCardProps = {
  title: string
  room: string
  category: Category
  details: string
  status: Status
  urgent: boolean
  onNext: () => void
  onPrev: () => void
  onRemove: () => void
}

function RequestCard({ title, room, category, details, status, urgent, onNext, onPrev, onRemove }: RequestCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <article className={urgent ? 'card card--urgent' : 'card'}>
      <div className="card__top">
        <span className="card__room">комн. {room} · {category}</span>
        <span className="card__status">{urgent && 'Срочно · '}{status}</span>
      </div>
      <h3>{title}</h3>
      {open && <p>{details}</p>}
      <div className="card__actions">
        <button className="card__more" onClick={() => setOpen(!open)}>
          {open ? 'Скрыть' : 'Подробнее'}
        </button>
        {status === 'Готово' ? (
          <button onClick={onRemove}>Убрать с доски</button>
        ) : (
          <button onClick={onNext}>{status === 'Новая' ? 'Взять в работу' : 'Завершить'}</button>
        )}
        {status === 'В работе' && <button onClick={onPrev}>Вернуть</button>}
      </div>
    </article>
  )
}

export default RequestCard
