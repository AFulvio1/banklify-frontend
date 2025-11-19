import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const SPRINGBOOT_PORT = 8080; 

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${SPRINGBOOT_PORT}`, 
        changeOrigin: true,
      },
    },
  },
});
