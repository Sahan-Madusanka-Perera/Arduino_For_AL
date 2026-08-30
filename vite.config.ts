import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve('./src') },
  },
  server: {
    // This project's directory name contains a colon, which Vite's default
    // fs allow-list does not match, producing a 403 on every request. Naming
    // the root explicitly fixes it. Harmless in a directory without one.
    fs: { allow: [path.resolve('.')], strict: false },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
