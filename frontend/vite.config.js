import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Api-testing-and-debugger/',
  server: {
    port: 5173,
    host: 'localhost'
  },
  build: {
    outDir: 'docs',
    sourcemap: false
  }
})
