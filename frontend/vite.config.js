import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,       // Puerto que elegiste
    host: true,       // Necesario para Docker
    proxy: {
      // Cuando el frontend pida "/random", Vite lo redirigirá al contenedor del backend
      '/random': {
        target: 'http://random-movies-service:8001', // Nombre del servicio en Docker
        changeOrigin: true,
        secure: false,
      }
    }
  }
})