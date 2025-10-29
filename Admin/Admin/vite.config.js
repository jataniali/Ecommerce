// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
    preview: {
    host: true,
    port: process.env.PORT || 3000,
    strictPort: true,
    allowedHosts: [
      'ecommerce-admin-hnzh.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ecommerce-backend-7lkk.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      }
    }
  }
})