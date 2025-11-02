import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sostituisci la porta con quella effettiva del tuo SpringBoot
const SPRINGBOOT_PORT = 8080; 

// https://vitejs.dev/config/
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
