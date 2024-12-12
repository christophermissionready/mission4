import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for Docker
    strictPort: true,
    port: 5173,
    watch: {
      usePolling: true
    }
  }
})