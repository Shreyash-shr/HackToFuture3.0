import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$|.*\.js$/,
    exclude: [],
  },
  server: {
    port: 3000,
  },
});
