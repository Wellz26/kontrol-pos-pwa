import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // Make sure this is installed!

export default defineConfig({
  base: '/kontrol-pos-pos/', // 👈 Your repo name for GitHub Pages (case-sensitive!)
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // auto updates PWA on deploy
      manifest: {
        name: 'Kontrol POS',
        short_name: 'POS',
        description: 'Point of Sale system for Kontrol Techniks',
        theme_color: '#22C55E',
        background_color: '#F9FAFB',
        display: 'standalone',
        start_url: '/', // base path, leave as '/' unless you're fancy
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-api-domain\.com\/api\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400, // 1 day
              },
            },
          },
        ],
      },
    }),
  ],
});
