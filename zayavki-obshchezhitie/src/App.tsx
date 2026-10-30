import { useEffect, useState } from 'react'
import Header from './components/Header'
import RequestForm from './components/RequestForm'
import RequestCard from './components/RequestCard'
import type { NewRequest, Status } from './requests'
import { useRequests } from './useRequests'
import { sendRequest } from './notify'

type Filter = 'Все' | Status

const FILTERS: Filter[] = ['Все', 'Новая', 'В работе', 'Готово']

function App() {
  const { requests, loading, error, retry, add, next, prev, remove } = useRequests()
  const [filter, setFilter] = useState<Filter>('Все')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')

  const newCount = requests.filter((r) => r.status === 'Новая').length
  const query = search.trim().toLowerCase()
  const visible = requests.filter(
    (r) => (filter === 'Все' || r.status === filter) && r.title.toLowerCase().includes(query),
  )

  useEffect(() => {
    document.title = `Новых: ${newCount} · Доска заявок`
  }, [newCount])

  useEffect(() => {
    if (notice === '') {
      return
    }
    const timer = setTimeout(() => setNotice(''), 5000)
    return () => clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setFilter('Все')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  function countFor(f: Filter) {
    if (f === 'Все') {
      return requests.length
    }
    return requests.filter((r) => r.status === f).length
  }

  async function handleNext(id: string, status: Status) {
    try {
      await next(id, status)
    } catch (e) {
      setNotice((e as Error).message)
    }
  }

  async function handlePrev(id: string, status: Status) {
    try {
      await prev(id, status)
    } catch (e) {
      setNotice((e as Error).message)
    }
  }

  async function handleAdd(data: NewRequest) {
    try {
      const created = await add(data)
      setNotice('Заявка добавлена. Отправляем уведомление…')
      const sent = await sendRequest(created)
      if (sent) {
        setNotice('Заявка добавлена, уведомление отправлено.')
      } else {
        setNotice('Заявка добавлена, но уведомление не отправлено: сервер автоматизации недоступен.')
      }
    } catch (e) {
      setNotice((e as Error).message)
    }
  }

  async function handleRemove(id: string) {
    try {
      await remove(id)
    } catch (e) {
      setNotice((e as Error).message)
    }
  }

  return (
    <>
      <Header newCount={newCount} />
      <main className="board">
        <RequestForm onAdd={handleAdd} />
        <section className="list">
          <h2>Заявки</h2>
          {notice !== '' && <p className="notice">{notice}</p>}
          <div className="filters">
            {FILTERS.map((f) => (
              <button key={f} className={f === filter ? 'active' : ''} onClick={() => setFilter(f)}>
                {f} ({countFor(f)})
              </button>
            ))}
          </div>
          <input
            className="search"
            type="search"
            placeholder="Поиск по названию"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {loading && <p className="empty">Загрузка заявок…</p>}
          {error !== '' && (
            <div className="load-error">
              <p>{error}</p>
              <button onClick={retry}>Повторить</button>
            </div>
          )}
          {!loading && error === '' && visible.length === 0 && <p className="empty">Заявок не найдено</p>}
          {visible.map((r) => (
            <RequestCard
              key={r.id}
              title={r.title}
              room={r.room}
              category={r.category}
              details={r.details}
              status={r.status}
              urgent={r.urgent}
              onNext={() => handleNext(r.id, r.status)}
              onPrev={() => handlePrev(r.id, r.status)}
              onRemove={() => handleRemove(r.id)}
            />
          ))}
        </section>
      </main>
    </>
  )
}

export default App
