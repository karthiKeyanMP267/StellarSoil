import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900, // raise slightly while we iterate
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion', '@react-spring/web', 'react-spring'],
          charts: ['chart.js', 'react-chartjs-2'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
          icons: ['@heroicons/react', 'lucide-react'],
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
    host: 'localhost',
    port: 5174,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5174,
      clientPort: 5174,
      timeout: 30000
    },
  },
})

