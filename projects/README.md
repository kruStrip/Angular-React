# Проекты модулей

Одна работа — одна папка `pN-<вариант>`: номер модуля и вариант латиницей. Вариант выбирается
вместе с преподавателем. Строку в таблицу преподаватель добавляет, когда выдаёт проект.

| Папка | Проект | Задание | Основа |
|---|---|---|---|
| `p1-<вариант>` | доска заявок своей службы | [проект модуля 1](https://maximbytecamp.github.io/angular_react_makarov/temy/19-proekt-doska-zayavok/index.html) | `zayavki` после главы 1.7 |
| `p2-<вариант>` | доска заявок с базой | [проект модуля 2](https://maximbytecamp.github.io/angular_react_makarov/temy/29-proekt-doska-s-bazoy/index.html) | `zayavki` после главы 2.5 |
| `p3-monitoring` | мониторинг сайтов группы | [проект модуля 3](https://maximbytecamp.github.io/angular_react_makarov/temy/39-proekt-monitoring/index.html) | отдельный репозиторий `monitoring` после автоматизации модуля 3 |

Варианты: `obshchezhitie` (общежитие), `studsovet` (студсовет) или свой, согласованный с преподавателем.
Пример: `projects/p1-obshchezhitie`.

В папке проекта лежат:

- код проекта без `node_modules` и `dist` — их восстанавливают `npm install` и `npm run build`;
- `README.md` проекта: вариант, что сделано из обязательных требований и дополнительных заданий, как запустить;
- `ai-log.md` — журнал работы с ИИ (правила — на странице проекта, раздел «Работа с ИИ»);
- для проекта 2 — папка `n8n` с двумя процессами, выгруженными кнопкой Export JSON, без номера чата.
- для проекта 3 — код не копируется: он в публичном репозитории `monitoring`. В `projects/p3-monitoring` лежат
  `README.md` со ссылками на репозиторий и сайт на GitHub Pages и `ai-log.md`.
