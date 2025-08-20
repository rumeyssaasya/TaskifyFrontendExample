import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://taskifybackendapi-production-eec2.up.railway.app',  // Backend adresin
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
