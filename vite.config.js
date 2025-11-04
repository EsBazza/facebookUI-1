import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy /api calls to the Spring Boot backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          // Ensure the backend sees an Origin header it accepts.
          // Some CORS filters reject requests when Origin is missing or unexpected.
          proxy.on('proxyReq', (proxyReq, req, res) => {
            try {
              proxyReq.setHeader('origin', 'http://localhost:8080');
            } catch (e) {
              // noop
            }
          });
        }
      }
    }
  }
});