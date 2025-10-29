import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    plugins: [react(), tailwindcss()],
    base: '/',
   define: {
  'process.env': Object.fromEntries(
    Object.entries(env).filter(([key]) => key.startsWith('VITE_'))
  ),
  'import.meta.env.MODE': JSON.stringify(mode),
  'import.meta.env.PROD': isProduction,
  'import.meta.env.DEV': !isProduction,
},

    server: {
      port: 5173,
      strictPort: true,
      // Fallback to index.html for SPA routing
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/allproducts': env.VITE_API_URL || 'http://localhost:4000',
        '/newcollections': env.VITE_API_URL || 'http://localhost:4000',
        '/popular': env.VITE_API_URL || 'http://localhost:4000',
        '/addtocart': 'http://localhost:4000',
        '/removefromcart': 'http://localhost:4000',
        '/getcart': 'http://localhost:4000',
        '/signup': 'http://localhost:4000',
        '/login': 'http://localhost:4000',
        '/images': 'http://localhost:4000',
        '^/product/.*': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
        }
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        }
      },
      sourcemap: true,
      minify: 'terser',
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  };
});
