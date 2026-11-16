import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Адрес сайта на GitHub Pages: репозиторий называется digest.
export default defineConfig({
  base: '/digest/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: { url: 'http://localhost/' },
    },
    setupFiles: './src/setupTests.ts',
  },
})
