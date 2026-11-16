const KEY = 'digest-read'

/** id прочитанных новостей. Битая запись в localStorage не должна ломать страницу. */
export function loadRead(): string[] {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === null) {
      return []
    }
    const value: unknown = JSON.parse(saved)
    if (!Array.isArray(value)) {
      return []
    }
    return value.filter((id): id is string => typeof id === 'string')
  } catch {
    return []
  }
}

export function saveRead(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids))
}
