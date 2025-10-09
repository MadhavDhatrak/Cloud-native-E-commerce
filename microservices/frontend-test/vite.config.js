// microservices/frontend-test/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'a864ac35bde6b45db92579d83eed68ad-2141155801.ap-south-1.elb.amazonaws.com',
      'localhost'
    ],
    hmr: false,  // Disable 
    proxy: {
      '/api': {
        target: 'http://api-gateway:3000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '')
      }
    }
  }
});
