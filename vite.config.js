import { defineConfig } from 'vite'
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://accounts.esn.org/',
        changeOrigin: true,
      }
    }
  },
  plugins: [yaml()]
})
