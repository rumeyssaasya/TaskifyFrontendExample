import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/server.crt')),
    },
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:8080/',  // Backend adresin
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
