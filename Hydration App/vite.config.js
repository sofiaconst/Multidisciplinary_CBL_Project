import { defineConfig } from 'vite';
import { resolve } from 'path';

// Multi-page setup so each HTML entry is its own page route.
// Vite serves the project at http://localhost:5173 by default.
// `npm run build` produces a static dist/ ready to deploy to any static host.
export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: true,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        signin: resolve(process.cwd(), 'signin.html'),
        signup: resolve(process.cwd(), 'signup.html'),
        dashboard: resolve(process.cwd(), 'dashboard.html'),
        settings: resolve(process.cwd(), 'settings.html'),
      },
    },
  },
});
