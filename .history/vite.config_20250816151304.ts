import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://api.taskify.rumer.tr/',  // Backend adresin
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
