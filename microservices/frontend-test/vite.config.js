// microservices/frontend-test/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://api-gateway:3000',   // ← host can resolve this
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '')
      }
    }
  }
});