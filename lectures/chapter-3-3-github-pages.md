# Глава 3.3. Сборка и публикация на GitHub Pages

Глава справочника: [3.3 Сборка и публикация на GitHub Pages](https://maximbytecamp.github.io/angular_react_makarov/temy/33-github-pages/index.html)

## О чём глава

В этой главе начинается второе приложение модуля — «Мониторинг сайтов группы». Пока это одна страница со списком сайтов из файла `sites.json`. Приложение собирается командой `npm run build` в папку готовых файлов `dist`, отправляется в отдельный репозиторий на GitHub и публикуется на GitHub Pages: при каждой отправке кода конвейер GitHub Actions собирает и выкладывает сайт. Первая публикация даёт пустую страницу, вторая — ошибку загрузки списка. Обе ошибки связаны с тем, что сайт на Pages лежит в подпапке, и исправляются настройкой `base` и константой `BASE_URL`.

## Итог

Приложение «Мониторинг сайтов группы» читает список сайтов из `public/data/sites.json` и не зависит от своего сервера, поэтому его можно опубликовать на GitHub Pages. Сборка `npm run build` переводит TypeScript и JSX в готовые файлы папки `dist`: один JavaScript с хешем в имени, один CSS, `index.html` и копию `public`. Такие файлы работают только через веб-сервер — `npm run preview` на компьютере или Pages в интернете. Код хранится в отдельном публичном репозитории `monitoring` без `dist` и `node_modules`; конвейер `.github/workflows/deploy.yml` при каждой отправке в `main` собирает сайт на машине GitHub и передаёт `dist` в Pages, источник которого переключён на GitHub Actions. Сайт на Pages лежит в подпапке с именем репозитория: ссылки сборки исправляет настройка `base`, пути внутри кода собираются от `import.meta.env.BASE_URL`. Для приложений с маршрутами конвейер дополнительно копирует `index.html` в `404.html`.

## Шпаргалка

| Что | Как |
|---|---|
| Собрать | `npm run build` → папка `dist` |
| Проверить сборку | `npm run preview` → `localhost:4173` |
| Файлы как есть | папка `public`, путь от корня сайта |
| Подпапка сайта | `base: '/monitoring/'` в `vite.config.ts` |
| Путь в коде | ``${import.meta.env.BASE_URL}data/sites.json`` |
| Включить Pages | Settings → Pages → Source: GitHub Actions |
| Конвейер | `.github/workflows/deploy.yml`: checkout, setup-node, npm ci, build, upload-pages-artifact, deploy-pages |
| Прямые ссылки | `cp dist/index.html dist/404.html` |
