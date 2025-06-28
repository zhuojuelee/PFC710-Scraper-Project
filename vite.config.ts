import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const filesNeedToExclude = ['scraper/**'];

const filesPathToExclude = filesNeedToExclude.map((src) => {
  return fileURLToPath(new URL(src, import.meta.url));
});

// https://vite.dev/config/
export default defineConfig({
  base: './',
  define: {
    global: {},
  },
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      external: [
        ...filesPathToExclude
      ]
    }
  }
})
