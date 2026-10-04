import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Single-page prototype: charting + animation libraries form one ~900 kB bundle.
    chunkSizeWarningLimit: 1200,
  },
})
