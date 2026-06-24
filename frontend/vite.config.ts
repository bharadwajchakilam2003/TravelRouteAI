import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    manifest: {
      name: 'TravelRoute AI',
      short_name: 'TravelRoute',
      description: 'Smart Travel Route Planner - Plan trips with attractions, weather, and cost estimates',
      theme_color: '#2563eb',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait-primary',
      start_url: '/',
      scope: '/',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
          handler: 'CacheFirst',
          options: { cacheName: 'weather-cache', expiration: { maxEntries: 10, maxAgeSeconds: 1800 } }
        },
        {
          urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\/.*/i,
          handler: 'CacheFirst',
          options: { cacheName: 'geocode-cache', expiration: { maxEntries: 50, maxAgeSeconds: 86400 } }
        }
      ]
    }
  })],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'react-icons', 'react-hot-toast'],
          map: ['leaflet', 'react-leaflet']
        }
      }
    }
  }
});
