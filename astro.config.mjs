import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  build: {
    inlineStylesheets: 'always',
    assets: '_assets',
  },
  vite: {
    build: {
      sourcemap: false, // disabled in prod — saves significant bandwidth
      cssMinify: true,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000, // Suppress warnings for known-large chunks (rapier WASM)
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split rapier physics (heaviest, ~1.8MB — WASM binary)
            if (id.includes('@react-three/rapier') || id.includes('@dimforge')) {
              return 'rapier-physics';
            }
            // Split three.js ecosystem
            if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) {
              return 'r3f-core';
            }
            // Split meshline
            if (id.includes('meshline')) {
              return 'meshline';
            }
            // Split React runtime
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            // Split three.js itself
            if (id.includes('node_modules/three')) {
              return 'three';
            }
          }
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'three']
    }
  }
});