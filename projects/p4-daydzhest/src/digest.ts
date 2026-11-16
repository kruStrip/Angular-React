export type NewsItem = {
  id: string
  date: string
  source: string
  title: string
  summary: string
  tags: string[]
  link: string
}

type DigestResponse = {
  news?: Array<Record<string, unknown>>
}

/** Теги приходят строкой «ИИ, наука»; допускаем и готовый массив. */
export function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter((tag) => tag !== '')
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '')
  }
  return []
}

function toNews(raw: Record<string, unknown>): NewsItem {
  return {
    id: String(raw.id ?? ''),
    date: String(raw.date ?? ''),
    source: String(raw.source ?? ''),
    title: String(raw.title ?? ''),
    summary: String(raw.summary ?? ''),
    tags: parseTags(raw.tags),
    link: String(raw.link ?? ''),
  }
}

/** От свежих к старым: дата в таблице — ISO-строка. */
export function sortNews(list: NewsItem[]): NewsItem[] {
  return [...list].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

export async function loadDigest(url: string | undefined): Promise<NewsItem[]> {
  if (!url) {
    throw new Error('Дайджест не загрузился: не задан VITE_DIGEST_URL.')
  }
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Дайджест не загрузился: код ${response.status}.`)
  }
  const data = (await response.json()) as DigestResponse
  return sortNews((data.news ?? []).map(toNews))
}
