import { Link, useParams } from 'react-router'
import { useMonitoring } from '../monitoring'
import { findCheck, statusText } from '../status'
import type { Check } from '../types'

function SitePage() {
  const { id } = useParams()
  const { sites, history, loading, error, retry } = useMonitoring()

  if (loading) {
    return (
      <main className="main page">
        <p className="empty">Загрузка сайта…</p>
      </main>
    )
  }

  if (error !== '') {
    return (
      <main className="main page">
        <div className="load-error">
          <p>{error}</p>
          <button onClick={retry}>Повторить</button>
        </div>
      </main>
    )
  }

  const site = sites.find((item) => item.id === id)

  if (site === undefined) {
    return (
      <main className="main page">
        <Link to="/" className="back">
          ← Все сайты
        </Link>
        <p className="empty">Сайта с номером {id} нет: его убрали из списка или в адресе ошибка.</p>
      </main>
    )
  }

  const last = findCheck(history[0], site.id)
  const checks = history
    .map((run) => findCheck(run, site.id))
    .filter((check): check is Check => check !== undefined)
  const okCount = checks.filter((check) => check.ok).length
  const total = checks.length
  const percent = total === 0 ? 0 : Math.round((okCount / total) * 100)
  const maxMs = Math.max(...checks.map((check) => check.ms), 1)
  const state = last === undefined ? 'status--unknown' : last.ok ? 'status--ok' : 'status--bad'

  return (
    <main className="main page">
      <Link to="/" className="back">
        ← Все сайты
      </Link>

      <article className={`site-page ${state}`}>
        <span className="status">{statusText(last)}</span>
        <h2>{site.name}</h2>
        <a href={site.url} target="_blank" rel="noreferrer" className="site-page__url">
          {site.url}
        </a>
        {last?.ok === true && last.title !== undefined && last.title !== '' && (
          <p className="site-page__title">{last.title}</p>
        )}
        <p className="site-page__summary">
          Открывался в {okCount} из {total} последних проверок · {percent}%
        </p>
      </article>

      <section className="history">
        <h2>История проверок</h2>
        {total === 0 ? (
          <p className="empty">Этот сайт ещё ни разу не проверялся.</p>
        ) : (
          <div className="history__scroll">
            <table>
              <thead>
                <tr>
                  <th>Проверка</th>
                  <th>Ответ</th>
                  <th>Время ответа</th>
                </tr>
              </thead>
              <tbody>
                {history.map((run) => {
                  const check = findCheck(run, site.id)
                  if (check === undefined) {
                    return null
                  }
                  return (
                    <tr key={`${run.time}-${check.id}`} className={check.ok ? '' : 'row--bad'}>
                      <td>{new Date(run.time).toLocaleString('ru')}</td>
                      <td>{statusText(check)}</td>
                      <td className="history__ms">
                        {check.ms} мс
                        <span className="bar" aria-hidden="true">
                          <span
                            className={check.ok ? 'bar__fill' : 'bar__fill bar__fill--bad'}
                            style={{ width: `${Math.round((check.ms / maxMs) * 100)}%` }}
                          />
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default SitePage
