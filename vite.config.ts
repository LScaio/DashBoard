import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative asset paths so the build works under GitHub Pages' /DashBoard/ sub-path.
  base: './',
  build: {
    // Single-page prototype: charting + animation libraries form one ~900 kB bundle.
    chunkSizeWarningLimit: 1200,
  },
})
