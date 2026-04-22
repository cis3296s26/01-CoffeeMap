import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  base: '/01-CoffeeMap/',

  optimizeDeps: {
    exclude: ['cesium', '@cesium/engine', '@zip.js/zip.js']
  },

  ssr: {
    noExternal: ['cesium']
  }
})