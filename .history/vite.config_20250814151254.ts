import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://213.142.148.50/',  // Backend adresin
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
