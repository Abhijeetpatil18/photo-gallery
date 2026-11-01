import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/picsum': {
        target: 'https://picsum.photos',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/picsum/, ''),
      },
    },
  },
})
