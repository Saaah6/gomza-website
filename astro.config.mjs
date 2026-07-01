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
      sourcemap: false,
      cssMinify: true,
      minify: 'esbuild',
      chunkSizeWarningLimit: 3000,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'three']
    }
  }
});