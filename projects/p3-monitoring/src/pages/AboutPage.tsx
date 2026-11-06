import { useMonitoring } from '../monitoring'

function AboutPage() {
  const { sites, history, loading } = useMonitoring()

  return (
    <main className="main page">
      <h2>О проверке</h2>
      <p>
        Каждую ночь в 00:00 по Москве GitHub Actions запрашивает {sites.length} сайтов из списка и записывает
        результат в <code>results.json</code>.
      </p>
      <p>
        Сайт считается работающим, если сервер ответил кодом 200–299. Код 404, ошибка сети или ответ дольше
        15 секунд означают, что сайт не открывается.
      </p>
      <p>
        При изменениях бот отправляет сообщение в Telegram: красное — сайт перестал открываться, зелёное — снова
        работает. Если ничего не изменилось, сообщения нет.
      </p>
      <p>В истории хранятся последние 30 проверок, на странице сайта видна каждая из них.</p>

      <dl className="facts">
        <div>
          <dt>Сайтов в списке</dt>
          <dd>{loading ? '…' : sites.length}</dd>
        </div>
        <div>
          <dt>Проверок в истории</dt>
          <dd>{loading ? '…' : history.length}</dd>
        </div>
        <div>
          <dt>Расписание</dt>
          <dd>0 21 * * * UTC</dd>
        </div>
        <div>
          <dt>Хранение</dt>
          <dd>GitHub Pages</dd>
        </div>
      </dl>
    </main>
  )
}

export default AboutPage
