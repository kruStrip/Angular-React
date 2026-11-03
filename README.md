# Angular-React

Мои работы по дисциплине «Angular и React»: доска заявок из глав справочника, автоматизация
в n8n и проекты модулей. Каждое приложение запускается из своей папки командами
`npm install` и `npm run dev`.

| | |
|---|---|
| Автор | Екатерина Котельникова |
| Группа | |
| Курс | 2026/2027 |
| Стек | React 19, TypeScript, Vite, PocketBase, n8n |
| Редактор | VS Code |

## Лучшие работы

| Работа | Что умеет |
|---|---|
| [Проект модуля 2](projects/p2-obshchezhitie/) | доска заявок на PocketBase: загрузка с ошибкой и повтором, хук `useRequests`, обновление без F5, ИИ-диспетчер в n8n с кнопкой «Взять» в Telegram |
| [Проект модуля 1](projects/p1-obshchezhitie/) | доска заявок общежития на `localStorage`: фильтр и поиск, смена статусов, уведомление о заявке в Telegram через n8n |
| [Доска заявок](zayavki/) | доска по главам справочника: форма, карточки, фильтр, поиск и сохранение заявок |

## Структура

```
Angular-React/
├── zayavki/                  доска заявок по главам справочника
├── avtomatizaciya/           Docker: n8n, PocketBase, Ollama
├── projects/                 проекты модулей
│   ├── p1-obshchezhitie/     проект модуля 1: доска на localStorage
│   └── p2-obshchezhitie/     проект модуля 2: доска на PocketBase и n8n
├── lectures/                 конспекты глав (ведёт преподаватель)
├── materials/                файлы с занятий (ведёт преподаватель)
└── docs/                     правила сдачи и обновления (ведёт преподаватель)
```

## Как запустить

```bash
git clone https://github.com/kruStrip/Angular-React.git
cd Angular-React/zayavki
npm install
npm run dev
```

Проекты модулей запускаются так же из своих папок, например:

```bash
cd projects/p2-obshchezhitie
npm install
npm run dev
```

## Материалы курса

- [Справочник по Angular и React](https://maximbytecamp.github.io/angular_react_makarov/index.html)
- [Конспекты пройденных глав](lectures/README.md)
- [Как сдавать работы](docs/SUBMIT.md) и [как приходят новые материалы](docs/UPDATES.md)
- [Пошаговая инструкция по работе с репозиторием](https://algorthimization-course-vvodnoe.vercel.app/angular-react/repozitoriy/index.html)
- [Страница дисциплины](https://algorthimization-course-vvodnoe.vercel.app/angular-react/index.html) и [стандарт репозитория студента](https://algorthimization-course-vvodnoe.vercel.app/shared/standart-repozitoriya/index.html)
