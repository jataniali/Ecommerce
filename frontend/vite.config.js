import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react(), tailwindcss()],
    base: isProduction ? '/' : '/',
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        // Proxy API requests in development
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        // Add other API endpoints that need to be proxied
        '/allproducts': 'http://localhost:4000',
        '/newcollections': 'http://localhost:4000',
        '/popular': 'http://localhost:4000',
        '/addtocart': 'http://localhost:4000',
        '/removefromcart': 'http://localhost:4000',
        '/getcart': 'http://localhost:4000',
        '/signup': 'http://localhost:4000',
        '/login': 'http://localhost:4000',
        '/images': 'http://localhost:4000',
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  }
})
