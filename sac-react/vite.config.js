import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'coaching-banner-vocational-imaging.trycloudflare.com',
      'pdtnovosacestorno.loca.lt',
      '.trycloudflare.com',
      '.loca.lt',
      'localhost',
      '127.0.0.1'
    ]
  }
})
