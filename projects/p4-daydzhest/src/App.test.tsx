import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const news = [
  {
    id: 'mars',
    date: '2026-11-15T09:00:00Z',
    source: 'Хабр',
    title: 'Марс: новая миссия',
    summary: 'Ракета стартовала к Марсу.',
    tags: 'наука, ИИ',
    link: 'https://habr.com/ru/news/',
  },
  {
    id: 'gpu',
    date: '2026-11-16T09:00:00Z',
    source: '3DNews',
    title: 'Видеокарта нового поколения',
    summary: 'Производительность выросла.',
    tags: 'железо',
    link: 'https://3dnews.ru/news/',
  },
  {
    id: 'model',
    date: '2026-11-14T09:00:00Z',
    source: 'iXBT',
    title: 'Нейросеть пересказывает новости',
    summary: 'Модель работает локально.',
    tags: 'ИИ',
    link: 'https://www.ixbt.com/news/',
  },
]

function mockDigest(status = 200, body: unknown = { news }) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status < 400,
    status,
    json: async () => body,
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function headings() {
  return screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
}

function articleOf(title: string): HTMLElement {
  const article = screen.getByRole('heading', { name: title }).closest('article')
  if (article === null) {
    throw new Error(`Карточка «${title}» не найдена`)
  }
  return article
}

beforeEach(() => {
  localStorage.clear()
  vi.stubEnv('VITE_DIGEST_URL', 'https://example.test/exec')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('Дайджест новостей', () => {
  it('показывает сообщение о загрузке, пока данные не пришли', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    )
    render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent('Загрузка дайджеста')
  })

  it('расставляет новости от свежих к старым', async () => {
    mockDigest()
    render(<App />)

    await screen.findByRole('heading', { name: 'Видеокарта нового поколения' })

    expect(headings()).toEqual([
      'Видеокарта нового поколения',
      'Марс: новая миссия',
      'Нейросеть пересказывает новости',
    ])
    expect(screen.getByText('Показано 3 из 3')).toBeInTheDocument()
  })

  it('ищет по заголовку и пересказу без учёта регистра', async () => {
    mockDigest()
    render(<App />)
    await screen.findByRole('heading', { name: 'Видеокарта нового поколения' })

    const search = screen.getByLabelText('Поиск')
    await userEvent.type(search, 'МАРС')
    expect(headings()).toEqual(['Марс: новая миссия'])

    await userEvent.clear(search)
    await userEvent.type(search, 'локально')
    expect(headings()).toEqual(['Нейросеть пересказывает новости'])
  })

  it('фильтрует по выбранному тегу и вместе с «только непрочитанные»', async () => {
    mockDigest()
    render(<App />)
    await screen.findByRole('heading', { name: 'Видеокарта нового поколения' })

    await userEvent.selectOptions(screen.getByLabelText('Тег'), 'ИИ')
    expect(headings()).toEqual(['Марс: новая миссия', 'Нейросеть пересказывает новости'])
    expect(screen.getByText('Показано 2 из 3')).toBeInTheDocument()

    const mars = articleOf('Марс: новая миссия')
    await userEvent.click(within(mars).getByRole('button', { name: 'Отметить прочитанным' }))
    await userEvent.click(screen.getByLabelText('Только непрочитанные'))

    expect(headings()).toEqual(['Нейросеть пересказывает новости'])
    expect(screen.getByText('Показано 1 из 3')).toBeInTheDocument()
  })

  it('сохраняет «прочитано» после перезагрузки и снимает повторным нажатием', async () => {
    mockDigest()
    const first = render(<App />)
    await screen.findByRole('heading', { name: 'Марс: новая миссия' })

    const mars = articleOf('Марс: новая миссия')
    await userEvent.click(within(mars).getByRole('button', { name: 'Отметить прочитанным' }))

    expect(within(mars).getByRole('button', { name: 'Прочитано ✓' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(JSON.parse(localStorage.getItem('digest-read') ?? '[]')).toContain('mars')

    first.unmount()
    mockDigest()
    render(<App />)

    await screen.findByRole('heading', { name: 'Марс: новая миссия' })
    const reloaded = articleOf('Марс: новая миссия')
    expect(within(reloaded).getByRole('button', { name: 'Прочитано ✓' })).toBeInTheDocument()

    await userEvent.click(within(reloaded).getByRole('button', { name: 'Прочитано ✓' }))
    expect(within(reloaded).getByRole('button', { name: 'Отметить прочитанным' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('digest-read') ?? '[]')).not.toContain('mars')
  })

  it('показывает код ответа, если дайджест не загрузился', async () => {
    mockDigest(500)
    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Дайджест не загрузился: код 500.')
  })

  it('пишет «Новостей не найдено», если ничего не подошло', async () => {
    mockDigest()
    render(<App />)
    await screen.findByRole('heading', { name: 'Видеокарта нового поколения' })

    await userEvent.type(screen.getByLabelText('Поиск'), 'абракадабра')

    expect(screen.getByText('Новостей не найдено')).toBeInTheDocument()
    expect(screen.getByText('Показано 0 из 3')).toBeInTheDocument()
  })
})
