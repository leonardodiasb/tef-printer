import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist-react',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        notification: path.resolve(__dirname, 'notification.html')
      }
    }
  },
  server: {
    port: 5123,
    strictPort: true
  }
})
