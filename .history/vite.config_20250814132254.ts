import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://213.142.148.50:8080/',  // Backend adresin
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
