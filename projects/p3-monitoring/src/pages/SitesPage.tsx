import { useState } from 'react'
import { Link } from 'react-router'
import { useMonitoring } from '../monitoring'
import { findCheck, statusText } from '../status'

function pluralSites(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) {
    return 'сайт'
  }
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
    return 'сайта'
  }
  return 'сайтов'
}

function SitesPage() {
  const { sites, history, loading, error, retry } = useMonitoring()
  const [onlyBad, setOnlyBad] = useState(false)

  if (loading) {
    return (
      <main className="main">
        <p className="empty">Загрузка данных…</p>
      </main>
    )
  }

  if (error !== '') {
    return (
      <main className="main">
        <div className="load-error">
          <p>{error}</p>
          <button onClick={retry}>Повторить</button>
        </div>
      </main>
    )
  }

  const last = history[0]
  const badCount = sites.filter((site) => {
    const check = findCheck(last, site.id)
    return check !== undefined && !check.ok
  }).length

  const visible = onlyBad
    ? sites.filter((site) => {
        const check = findCheck(last, site.id)
        return check !== undefined && !check.ok
      })
    : sites

  return (
    <main className="main">
      <section className={badCount === 0 ? 'summary summary--ok' : 'summary summary--bad'}>
        <p className="summary__text">
          {badCount === 0
            ? `Все ${sites.length} ${pluralSites(sites.length)} открываются`
            : `Не открываются: ${badCount} из ${sites.length}`}
        </p>
        <p className="summary__hint">
          {last === undefined
            ? 'Проверок ещё не было'
            : `По последней проверке ${new Date(last.time).toLocaleString('ru')}`}
        </p>
      </section>

      <div className="toolbar">
        <h2>Сайты группы</h2>
        <button className={onlyBad ? 'active' : ''} onClick={() => setOnlyBad(!onlyBad)}>
          Только неработающие ({badCount})
        </button>
      </div>

      {visible.length === 0 && <p className="empty">Все сайты открываются — показывать нечего.</p>}

      <ul className="sites">
        {visible.map((site) => {
          const check = findCheck(last, site.id)
          const state = check === undefined ? 'site--unknown' : check.ok ? 'site--ok' : 'site--bad'
          return (
            <li key={site.id} className={`site ${state}`}>
              <Link to={`/site/${site.id}`} className="site__link">
                <span className="site__status">{statusText(check)}</span>
                <h2>{site.name}</h2>
                <span className="site__url">{site.url}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export default SitesPage
