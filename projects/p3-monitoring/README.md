# Мониторинг сайтов группы · проект модуля 3

Многостраничное приложение на React, которое показывает сайты группы на GitHub Pages,
результат последней ночной проверки и историю проверок каждого сайта.

| | |
|---|---|
| Репозиторий | [github.com/kruStrip/monitoring](https://github.com/kruStrip/monitoring) |
| Сайт | [kruStrip.github.io/monitoring](https://kruStrip.github.io/monitoring/) |
| Задание | [проект модуля 3](https://maximbytecamp.github.io/angular_react_makarov/temy/39-proekt-monitoring/index.html) |
| Автоматизация | [ночная проверка и оповещение](https://maximbytecamp.github.io/angular_react_makarov/temy/38-opoveshchenie/index.html) |

Код проекта лежит в отдельном публичном репозитории `monitoring`; в папке курса — этот
README и журнал `ai-log.md`.

![Сообщение бота о сайте, который перестал открываться](screenshots/telegram-404.png)

## Что изменилось после автоматизации

| Что | После автоматизации | Сейчас |
|---|---|---|
| Страницы | одна | сводка, страница сайта, «О проверке», «Не найдено» |
| Данные | загружались в `App.tsx` | загружаются в `MonitoringProvider`, страницы читают `useMonitoring` |
| История | на экране только последняя проверка | таблица всех проверок на странице сайта |
| Прямая ссылка | ссылок не было | работает на Pages через `404.html` и `basename` |
| Проверка и Telegram | ночью, только при изменениях | без изменений, скрипт и конвейер перенесены |

## Обязательные требования

| Требование | Где выполнено |
|---|---|
| Не меньше пяти сайтов с латинским `id` | `public/data/sites.json`; список сайтов группы |
| Маршруты `/`, `/site/:id`, `/about`, `*` | `src/App.tsx` |
| Меню на `NavLink` с выделенным пунктом | `src/components/Header.tsx`, стиль `.nav a.active` |
| Сводка «Не открываются: N из M» | `src/pages/SitesPage.tsx` |
| Карточки со статусом и ссылкой на сайт | `src/pages/SitesPage.tsx` |
| Название, адрес, «открывался X из Y», таблица истории | `src/pages/SitePage.tsx` |
| Неизвестный сайт: сообщение и ссылка на главную | `src/pages/SitePage.tsx` |
| Загрузка двух JSON в провайдере, чтение хуком | `src/MonitoringProvider.tsx`, `src/monitoring.ts` |
| Надпись загрузки и ошибка с кодом ответа | провайдер и страницы |
| `base`, `basename`, `404.html` | `vite.config.ts`, `src/main.tsx`, `.github/workflows/deploy.yml` |
| Публикация на GitHub Pages и прямые ссылки | Source: GitHub Actions; проверено вручную после F5 |
| Ночная проверка, коммит бота и публикация | `.github/workflows/check.yml`, `scripts/check.mjs` |
| Telegram только при изменениях, секреты в настройках | `scripts/check.mjs`, `env` в `check.yml` |
| `npm run build` и `npm run lint` | обе команды проходят без ошибок |

## Дополнительные задания

| Задание | Где |
|---|---|
| Доля работы в процентах | `SitePage.tsx`: «Открывался в X из Y · Z%» |
| Время ответа полосами | `SitePage.tsx`: ширина полосы от наибольшего времени в истории |
| Только неработающие | `SitesPage.tsx`: кнопка-фильтр, состояние сбрасывается при уходе со страницы |
| Заголовок страницы | `scripts/check.mjs` читает `<title>`, `SitePage.tsx` показывает его |

## Ночная проверка и публикация

- `check.yml` — по расписанию `0 21 * * *` (00:00 по Москве) и кнопкой **Run workflow**;
  право `contents: write` нужно для коммита бота.
- `check.mjs` — запрашивает каждый сайт с ограничением 15 секунд, хранит 30 проверок,
  читает `<title>` и сравнивает результат с прошлой проверкой. Сообщение уходит только
  при изменениях: «Не открывается» или «Снова работает».
- Коммит бота не запускает другие конвейеры, поэтому `publish` вызывает `deploy.yml`
  через `workflow_call` с `needs: check`.
- `deploy.yml` собирает сайт, копирует `dist/index.html` в `dist/404.html` и публикует
  `dist` на GitHub Pages.
- Токен бота и номер чата лежат в **Settings → Secrets and variables → Actions**;
  в коде и истории Git их нет.

Проверка оповещения выполнена на запуске
[43530549711](https://github.com/kruStrip/monitoring/actions/runs/43530549711): в журнале
`FAIL 404 … monitoring-test` и `Telegram: 200`, сообщение — на снимке выше. После проверки
тестовый адрес убран из списка.

## Запуск

```bash
npm install
npm run dev
```

Приложение откроется по адресу `http://localhost:5173/monitoring/`: в `vite.config.ts`
задан `base: '/monitoring/'`, как на GitHub Pages.

Проверка сборки:

```bash
npm run build
npm run lint
npm run preview   # http://localhost:4173/monitoring/
```

## Список сайтов

В `public/data/sites.json` сейчас лежат сайты из примера справочника: адресов группы
в этом репозитории нет. Перед сдачей замените их на мониторы однокурсников
(`https://<логин>.github.io/monitoring/`) и другие их сайты на Pages. У каждого сайта
должен остаться короткий `id` латиницей. Тестовый неработающий адрес `staryy`
полезно оставить: на нём видно красную полосу и строку `Не открывается · 404`.

## Структура

```
.github/workflows/
  deploy.yml             — сборка и публикация на Pages
  check.yml              — ночная проверка, коммит и публикация
public/data/
  sites.json             — список сайтов группы
  results.json           — история последних 30 проверок
screenshots/
  telegram-404.png       — сообщение бота о неработающем сайте
scripts/check.mjs        — проверка сайтов и сообщение в Telegram
src/
  App.tsx                — шапка и маршруты
  main.tsx               — BrowserRouter с basename и провайдер
  monitoring.ts          — контекст и хук useMonitoring
  MonitoringProvider.tsx — загрузка sites.json и results.json
  data.ts                — загрузка JSON от BASE_URL
  status.ts              — statusText и поиск проверки сайта
  types.ts               — Site, Check, Run
  components/Header.tsx  — меню на NavLink и время проверки
  pages/
    SitesPage.tsx        — сводка, фильтр и карточки
    SitePage.tsx         — сайт и история проверок
    AboutPage.tsx        — как устроена проверка
    NotFoundPage.tsx     — «Страница не найдена»
```

## Что осталось сделать вручную

- Заменить список сайтов в `public/data/sites.json` на реальные адреса своей группы
  и один раз запустить ночную проверку, чтобы у новых сайтов появился статус.
- В режиме Р1 набрать код вручную и уметь объяснить каждую строку: см. `ai-log.md`.