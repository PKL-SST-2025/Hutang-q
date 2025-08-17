import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin(), tailwindcss()],
  server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // Your Axum backend address
          changeOrigin: true,
        },
      },
    },
  build: {
    target: 'esnext',
  },
});
