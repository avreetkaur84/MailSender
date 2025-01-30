import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',  // Ensure correct base path
  build: {
    outDir: 'dist', // Make sure output directory is 'dist'
  },
  server: {
    historyApiFallback: true,  // Ensures routing works in React SPA
  },
});