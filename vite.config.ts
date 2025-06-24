import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/CREO-ERP/',
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@supabase/supabase-js']
  },
  build: {
    commonjsOptions: {
      include: [/@supabase\/supabase-js/, /node_modules/]
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js']
        },
        entryFileNames: `[name]-${Date.now()}.js`,
        chunkFileNames: `[name]-${Date.now()}.js`,
        assetFileNames: `[name]-${Date.now()}.[ext]`
      }
    }
  },
  server: {
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
  define: {
    global: 'globalThis',
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});
