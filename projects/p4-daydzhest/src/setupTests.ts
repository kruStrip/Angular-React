import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Node 26 объявляет глобальный localStorage, но без --localstorage-file он не работает,
// и jsdom из-за этого не подставляет свой. Для тестов достаточно хранилища в памяти.
if (typeof globalThis.localStorage === 'undefined') {
  const items = new Map<string, string>()
  const storage: Storage = {
    get length() {
      return items.size
    },
    key: (index: number) => [...items.keys()][index] ?? null,
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => {
      items.set(key, String(value))
    },
    removeItem: (key: string) => {
      items.delete(key)
    },
    clear: () => {
      items.clear()
    },
  }
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })
}

afterEach(() => {
  cleanup()
})
