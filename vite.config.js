import { defineConfig } from 'vite';

export default defineConfig({
  // Set base to repository name for GitHub Pages, or '/' for local
  base: process.env.NODE_ENV === 'production' ? '/legends-of-the-rena/' : '/',
  root: '.',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000,
    open: true
  }
});
