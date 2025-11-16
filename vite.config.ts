import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    // Emit pre-compressed assets for static hosts/CDNs
    viteCompression({ algorithm: 'brotliCompress', ext: '.br', deleteOriginFile: false }),
    viteCompression({ algorithm: 'gzip', ext: '.gz', deleteOriginFile: false }),
  ],
  build: {
    target: 'es2020',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Put heavy libs in separate cached chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor_motion'
            if (id.includes('react-router')) return 'vendor_router'
            if (id.includes('react')) return 'vendor_react'
            return 'vendor'
          }
        },
      },
    },
  },
})
