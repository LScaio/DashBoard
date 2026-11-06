import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative asset paths so the build works under GitHub Pages' /DashBoard/ sub-path.
  base: './',
  build: {
    // Two pages: the dashboard and the sources page the QR code points to.
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        fontes: fileURLToPath(new URL('./fontes.html', import.meta.url)),
      },
    },
    // Charting + animation libraries form one ~900 kB chunk.
    chunkSizeWarningLimit: 1200,
  },
})
