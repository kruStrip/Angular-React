import { useEffect, useState } from 'react'
import { loadDigest, type NewsItem } from './digest'
import { loadRead, saveRead } from './read'

type LoadState = 'loading' | 'ready' | 'error'

const ALL_TAGS = 'Все теги'

function formatDate(date: string): string {
  const value = new Date(date)
  if (Number.isNaN(value.getTime())) {
    return ''
  }
  return value.toLocaleString('ru', { dateStyle: 'long', timeStyle: 'short' })
}

function App() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [state, setState] = useState<LoadState>('loading')
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState(ALL_TAGS)
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [read, setRead] = useState<string[]>(loadRead)

  useEffect(() => {
    let cancelled = false

    loadDigest(import.meta.env.VITE_DIGEST_URL)
      .then((list) => {
        if (!cancelled) {
          setNews(list)
          setState('ready')
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : String(reason))
          setState('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    saveRead(read)
  }, [read])

  // Отфильтрованный список считается при отрисовке: в состоянии лежат только входные данные.
  const queryText = query.trim().toLowerCase()
  const visible = news.filter((item) => {
    if (onlyUnread && read.includes(item.id)) {
      return false
    }
    if (tag !== ALL_TAGS && !item.tags.includes(tag)) {
      return false
    }
    if (queryText === '') {
      return true
    }
    return item.title.toLowerCase().includes(queryText) || item.summary.toLowerCase().includes(queryText)
  })

  const tags = [...new Set(news.flatMap((item) => item.tags))].sort((a, b) => a.localeCompare(b, 'ru'))

  function toggleRead(id: string) {
    setRead((previous) =>
      previous.includes(id) ? previous.filter((saved) => saved !== id) : [...previous, id],
    )
  }

  return (
    <>
      <header className="header">
        <h1>Дайджест новостей</h1>
        <p>Пересказы, теги и прочитанное — из таблицы автоматизации</p>
      </header>

      <main className="digest">
        <section className="filters" aria-label="Поиск и фильтры">
          <div className="field">
            <label htmlFor="search">Поиск</label>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Заголовок или пересказ"
            />
          </div>

          <div className="field">
            <label htmlFor="tag">Тег</label>
            <select id="tag" value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value={ALL_TAGS}>{ALL_TAGS}</option>
              {tags.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={onlyUnread}
              onChange={(event) => setOnlyUnread(event.target.checked)}
            />
            Только непрочитанные
          </label>
        </section>

        {state === 'loading' && <p role="status">Загрузка дайджеста…</p>}
        {state === 'error' && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {state === 'ready' && (
          <>
            <p className="counter">
              Показано {visible.length} из {news.length}
            </p>

            {visible.length === 0 && <p className="empty">Новостей не найдено</p>}

            <div className="cards">
              {visible.map((item) => {
                const isRead = read.includes(item.id)
                return (
                  <article key={item.id} className={isRead ? 'card card--read' : 'card'}>
                    <h2>
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </h2>
                    <p className="meta">
                      <span>{item.source}</span>
                      {formatDate(item.date) !== '' && (
                        <time dateTime={item.date}>{formatDate(item.date)}</time>
                      )}
                    </p>
                    <p className="summary">{item.summary}</p>
                    <ul className="tags" aria-label="Теги новости">
                      {item.tags.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="read-button"
                      aria-pressed={isRead}
                      onClick={() => toggleRead(item.id)}
                    >
                      {isRead ? 'Прочитано ✓' : 'Отметить прочитанным'}
                    </button>
                  </article>
                )
              })}
            </div>
          </>
        )}
      </main>
    </>
  )
}

export default App
