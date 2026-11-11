import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'android') {
    const apiUrl = loadEnv(mode, process.cwd(), '').VITE_API_URL
    if (!apiUrl || !/^https:\/\/[^/]+/.test(apiUrl)) {
      throw new Error('Defina VITE_API_URL com a URL HTTPS completa da API em .env.android.local.')
    }
  }
  return { plugins: [react()], test: { environment: 'jsdom', setupFiles: './src/test/setup.ts' } }
})
