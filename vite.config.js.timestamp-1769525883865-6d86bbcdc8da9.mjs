// vite.config.js
import { defineConfig } from "file:///C:/reactNewmalikProject/mobileapp/node_modules/vite/dist/node/index.js";
import react from "file:///C:/reactNewmalikProject/mobileapp/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///C:/reactNewmalikProject/mobileapp/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true
        // allow PWA in dev
      },
      // 🔥 THIS IS THE FIX
      workbox: {
        // Always serve index.html for SPA navigation
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages"
            }
          },
          {
            urlPattern: ({ request }) => request.destination === "script" || request.destination === "style" || request.destination === "document",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "assets"
            }
          }
        ]
      },
      includeAssets: [
        "index.html",
        "manifest.json",
        "pwa-192x192.png",
        "pwa-512x512.png"
      ],
      manifest: {
        name: "Merchandiser",
        short_name: "Merchandiser",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0A2E61",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxyZWFjdE5ld21hbGlrUHJvamVjdFxcXFxtb2JpbGVhcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHJlYWN0TmV3bWFsaWtQcm9qZWN0XFxcXG1vYmlsZWFwcFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovcmVhY3ROZXdtYWxpa1Byb2plY3QvbW9iaWxlYXBwL3ZpdGUuY29uZmlnLmpzXCI7Ly8gaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbi8vIGltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbi8vIGltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXG5cbi8vIGV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4vLyAgIHBsdWdpbnM6IFtcbi8vICAgICByZWFjdCgpLFxuLy8gICAgIFZpdGVQV0Eoe1xuLy8gICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4vLyAgICAgICBkZXZPcHRpb25zOiB7XG4vLyAgICAgICAgIGVuYWJsZWQ6IHRydWUsIC8vIGFsbG93cyBQV0EgaW4gZGV2IG1vZGVcbi8vICAgICAgIH0sXG4vLyAgICAgICBtYW5pZmVzdDoge1xuLy8gICAgICAgICBuYW1lOiAnTWVyY2hhbmRpc2VyJyxcbi8vICAgICAgICAgc2hvcnRfbmFtZTogJ01lcmNoYW5kaXNlcicsXG4vLyAgICAgICAgIHN0YXJ0X3VybDogJy8nLFxuLy8gICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4vLyAgICAgICAgIGJhY2tncm91bmRfY29sb3I6ICcjZmZmZmZmJyxcbi8vICAgICAgICAgdGhlbWVfY29sb3I6ICcjMEEyRTYxJyxcbi8vICAgICAgICAgaWNvbnM6IFtcbi8vICAgICAgICAgICB7XG4vLyAgICAgICAgICAgICBzcmM6ICcvcHdhLTE5MngxOTIucG5nJyxcbi8vICAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4vLyAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xuLy8gICAgICAgICAgIH0sXG4vLyAgICAgICAgICAge1xuLy8gICAgICAgICAgICAgc3JjOiAnL3B3YS01MTJ4NTEyLnBuZycsXG4vLyAgICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuLy8gICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgIF1cbi8vICAgICAgIH1cbi8vICAgICB9KVxuLy8gICBdXG4vLyB9KVxuXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcblxuICAgICAgZGV2T3B0aW9uczoge1xuICAgICAgICBlbmFibGVkOiB0cnVlLCAvLyBhbGxvdyBQV0EgaW4gZGV2XG4gICAgICB9LFxuXG4gICAgICAvLyBcdUQ4M0RcdUREMjUgVEhJUyBJUyBUSEUgRklYXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIC8vIEFsd2F5cyBzZXJ2ZSBpbmRleC5odG1sIGZvciBTUEEgbmF2aWdhdGlvblxuICAgICAgICBuYXZpZ2F0ZUZhbGxiYWNrOiAnL2luZGV4Lmh0bWwnLFxuXG4gICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogKHsgcmVxdWVzdCB9KSA9PiByZXF1ZXN0Lm1vZGUgPT09ICduYXZpZ2F0ZScsXG4gICAgICAgICAgICBoYW5kbGVyOiAnTmV0d29ya0ZpcnN0JyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAncGFnZXMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46ICh7IHJlcXVlc3QgfSkgPT5cbiAgICAgICAgICAgICAgcmVxdWVzdC5kZXN0aW5hdGlvbiA9PT0gJ3NjcmlwdCcgfHxcbiAgICAgICAgICAgICAgcmVxdWVzdC5kZXN0aW5hdGlvbiA9PT0gJ3N0eWxlJyB8fFxuICAgICAgICAgICAgICByZXF1ZXN0LmRlc3RpbmF0aW9uID09PSAnZG9jdW1lbnQnLFxuICAgICAgICAgICAgaGFuZGxlcjogJ1N0YWxlV2hpbGVSZXZhbGlkYXRlJyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnYXNzZXRzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG5cbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcbiAgICAgICAgJ2luZGV4Lmh0bWwnLFxuICAgICAgICAnbWFuaWZlc3QuanNvbicsXG4gICAgICAgICdwd2EtMTkyeDE5Mi5wbmcnLFxuICAgICAgICAncHdhLTUxMng1MTIucG5nJ1xuICAgICAgXSxcblxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogJ01lcmNoYW5kaXNlcicsXG4gICAgICAgIHNob3J0X25hbWU6ICdNZXJjaGFuZGlzZXInLFxuICAgICAgICBzdGFydF91cmw6ICcvJyxcbiAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxuICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnIzBBMkU2MScsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL3B3YS0xOTJ4MTkyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJy9wd2EtNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSlcbiAgXVxufSlcblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQW9DQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBRXhCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUVkLFlBQVk7QUFBQSxRQUNWLFNBQVM7QUFBQTtBQUFBLE1BQ1g7QUFBQTtBQUFBLE1BR0EsU0FBUztBQUFBO0FBQUEsUUFFUCxrQkFBa0I7QUFBQSxRQUVsQixnQkFBZ0I7QUFBQSxVQUNkO0FBQUEsWUFDRSxZQUFZLENBQUMsRUFBRSxRQUFRLE1BQU0sUUFBUSxTQUFTO0FBQUEsWUFDOUMsU0FBUztBQUFBLFlBQ1QsU0FBUztBQUFBLGNBQ1AsV0FBVztBQUFBLFlBQ2I7QUFBQSxVQUNGO0FBQUEsVUFDQTtBQUFBLFlBQ0UsWUFBWSxDQUFDLEVBQUUsUUFBUSxNQUNyQixRQUFRLGdCQUFnQixZQUN4QixRQUFRLGdCQUFnQixXQUN4QixRQUFRLGdCQUFnQjtBQUFBLFlBQzFCLFNBQVM7QUFBQSxZQUNULFNBQVM7QUFBQSxjQUNQLFdBQVc7QUFBQSxZQUNiO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFFQSxlQUFlO0FBQUEsUUFDYjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUVBLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLFdBQVc7QUFBQSxRQUNYLFNBQVM7QUFBQSxRQUNULGtCQUFrQjtBQUFBLFFBQ2xCLGFBQWE7QUFBQSxRQUNiLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
