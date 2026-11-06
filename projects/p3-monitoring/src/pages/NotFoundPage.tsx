import { Link, useLocation } from 'react-router'

function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <main className="main page">
      <h2>Страница не найдена</h2>
      <p>Адреса {pathname} в приложении нет.</p>
      <Link to="/" className="back">
        ← Все сайты
      </Link>
    </main>
  )
}

export default NotFoundPage
