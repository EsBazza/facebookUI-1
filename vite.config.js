import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy `/api` requests to the remote API to avoid CORS during development
    proxy: {
      '/api': {
        target: 'https://facebookapi-2txh.onrender.com',
        changeOrigin: true,
        secure: true,
        // keep the `/api` prefix so the backend receives the same path
        rewrite: (path) => path
      }
    }
  }
});
