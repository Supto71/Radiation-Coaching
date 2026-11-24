import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.VITE_BACKEND_URL || 'https://radiation-coaching-3.onrender.com'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5555,
      strictPort: true,
      host: true, // Listen on all local IPs
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
