import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/gran-garden-resort/', // Nome do repositório GitHub
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['*.jpg', '*.png', '*.svg', '*.ico'],
          manifest: {
            name: 'Gran Garden Resort - Gestão de Obras',
            short_name: 'GGR Obras',
            description: 'Sistema completo de gestão de obras com BIM, cronograma, materiais e relatórios - v2.0',
            theme_color: '#1e40af',
            background_color: '#0f172a',
            display: 'standalone',
            orientation: 'any',
            scope: '/gran-garden-resort/',
            start_url: '/gran-garden-resort/',
            icons: [
              {
                src: '/gran-garden-resort/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable'
              },
              {
                src: '/gran-garden-resort/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
              }
            ]
          },
          workbox: {
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
            globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff2}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
