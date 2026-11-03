import { useEffect, useState } from 'react'
import Header from './components/Header'
import RequestForm from './components/RequestForm'
import RequestCard from './components/RequestCard'
import { nextStatus, prevStatus, type NewRequest, type RequestItem, type Status } from './requests'
import { loadRequests, saveRequests } from './storage'
import { sendRequest } from './notify'

type Filter = 'Все' | Status

const FILTERS: Filter[] = ['Все', 'Новая', 'В работе', 'Готово']

function App() {
  const [requests, setRequests] = useState(loadRequests)
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

  function update(list: RequestItem[]) {
    setRequests(list)
    saveRequests(list)
  }

  function handleNext(id: number) {
    const updated = requests.map((r) => {
      if (r.id === id) {
        return { ...r, status: nextStatus(r.status) }
      }
      return r
    })
    update(updated)
  }

  function handlePrev(id: number) {
    const updated = requests.map((r) => {
      if (r.id === id) {
        return { ...r, status: prevStatus(r.status) }
      }
      return r
    })
    update(updated)
  }

  async function handleAdd(data: NewRequest) {
    const created: RequestItem = { ...data, id: Date.now(), status: 'Новая' }
    update([created, ...requests])
    setNotice('Заявка добавлена. Отправляем уведомление…')
    const sent = await sendRequest(created)
    if (sent) {
      setNotice('Заявка добавлена, уведомление отправлено.')
    } else {
      setNotice('Заявка добавлена, но уведомление не отправлено: сервер автоматизации недоступен.')
    }
  }

  function handleRemove(id: number) {
    update(requests.filter((r) => r.id !== id))
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
          {visible.length === 0 && <p className="empty">Заявок не найдено</p>}
          {visible.map((r) => (
            <RequestCard
              key={r.id}
              title={r.title}
              room={r.room}
              category={r.category}
              details={r.details}
              status={r.status}
              urgent={r.urgent}
              onNext={() => handleNext(r.id)}
              onPrev={() => handlePrev(r.id)}
              onRemove={() => handleRemove(r.id)}
            />
          ))}
        </section>
      </main>
    </>
  )
}

export default App
