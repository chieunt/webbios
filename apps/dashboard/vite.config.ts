import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'webbiosDashboard',
      remotes: {
        platformSuite: process.env.NODE_ENV === 'development' ? 'http://localhost:5174/assets/remoteEntry.js' : 'https://god-platform-suite-ui-23j.pages.dev/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@webbios/ui']
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
