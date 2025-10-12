import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'src/index.html',
        'zh-hk': 'src/zh-hk/index.html',
        'zh-cn': 'src/zh-cn/index.html',
      },
    },
    target: 'es2015',
    minify: 'terser',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../tests/setup.js'],
  },
})
