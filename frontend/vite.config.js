import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/random': {
        target: 'http://random-movies-service:8001',
        changeOrigin: true
      },
      '/search': {
        target: 'http://search-movies-service:8005',
        changeOrigin: true
      },
      '/login': {
        target: 'http://auth-service:8002',
        changeOrigin: true
      },
      '/register': {
        target: 'http://auth-service:8002',
        changeOrigin: true
      },
      '/profiles': {
        target: 'http://auth-service:8002',
        changeOrigin: true
      },
      '/calificar': {
        target: 'http://calification-service:8003',
        changeOrigin: true
      },
      '/ratings': {
        target: 'http://ratings-service:8004',
        changeOrigin: true
      }
    }
  }
})