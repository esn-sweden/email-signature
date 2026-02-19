import { defineConfig } from 'vite'


export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://accounts.esn.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
