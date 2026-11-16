import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadDigest, parseTags } from './digest'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadDigest', () => {
  it('превращает теги из строки в массив и сортирует новости по дате', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          news: [
            {
              id: 'old',
              date: '2026-11-14T09:00:00Z',
              source: 'iXBT',
              title: 'Старая',
              summary: 'Пересказ.',
              tags: 'ИИ, наука',
              link: 'https://www.ixbt.com/news/',
            },
            {
              id: 'new',
              date: '2026-11-16T09:00:00Z',
              source: 'Хабр',
              title: 'Новая',
              summary: 'Пересказ.',
              tags: 'железо',
              link: 'https://habr.com/ru/news/',
            },
          ],
        }),
      }),
    )

    const list = await loadDigest('https://example.test/exec')

    expect(list.map((item) => item.id)).toEqual(['new', 'old'])
    expect(list[1].tags).toEqual(['ИИ', 'наука'])
  })

  it('сообщает код ответа, если сервер вернул ошибку', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }))

    await expect(loadDigest('https://example.test/exec')).rejects.toThrow(
      'Дайджест не загрузился: код 404.',
    )
  })

  it('не делает запрос, если адрес не задан', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadDigest(undefined)).rejects.toThrow('не задан VITE_DIGEST_URL')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('parseTags', () => {
  it('разбирает строку, массив и пустое значение', () => {
    expect(parseTags('ИИ, наука')).toEqual(['ИИ', 'наука'])
    expect(parseTags(['ИИ', ' игры '])).toEqual(['ИИ', 'игры'])
    expect(parseTags(undefined)).toEqual([])
    expect(parseTags(' , ')).toEqual([])
  })
})
