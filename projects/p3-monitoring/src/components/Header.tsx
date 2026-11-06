import { NavLink } from 'react-router'
import { useMonitoring } from '../monitoring'

function Header() {
  const { history } = useMonitoring()
  const last = history[0]

  return (
    <header className="header">
      <div className="header__row">
        <div>
          <h1>Мониторинг сайтов группы</h1>
          <p>Сайты, которые студенты группы опубликовали на GitHub Pages</p>
        </div>
        <span className="header__time">
          {last === undefined
            ? 'Проверок ещё не было'
            : `Последняя проверка: ${new Date(last.time).toLocaleString('ru')}`}
        </span>
      </div>
      <nav className="nav">
        <NavLink to="/" end>
          Сайты
        </NavLink>
        <NavLink to="/about">О проверке</NavLink>
      </nav>
    </header>
  )
}

export default Header
