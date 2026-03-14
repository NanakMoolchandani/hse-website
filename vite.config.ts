import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Prerendering is optional — only runs when PRERENDER=true (requires puppeteer)
// Vercel builds without it; local builds can use: PRERENDER=true npm run build
function getPrerenderPlugin(): PluginOption | null {
  if (process.env.PRERENDER !== 'true') return null
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const prerender = require('@prerenderer/rollup-plugin').default
    return prerender({
      routes: [
        '/',
        '/home',
        '/about',
        '/privacy',
        '/terms',
        '/products/executive-chairs',
        '/products/ergonomic-task-chairs',
        '/products/cafeteria-furniture',
        '/products/visitor-and-reception',
      ],
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        maxConcurrentRoutes: 3,
        renderAfterTime: 5000,
      },
      postProcess(renderedRoute: { html: string; route: string }) {
        renderedRoute.html = renderedRoute.html.replace(
          '</head>',
          `<link rel="canonical" href="https://mvm-furniture.com${renderedRoute.route === '/' ? '/home' : renderedRoute.route}" />\n</head>`
        )
        return renderedRoute
      },
    })
  } catch {
    console.warn('Prerender plugin not available, skipping prerendering')
    return null
  }
}

export default defineConfig({
  plugins: [
    react(),
    getPrerenderPlugin(),
  ].filter(Boolean) as PluginOption[],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  build: {
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-gsap': ['gsap'],
          'vendor-motion': ['framer-motion'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
    // esbuild minification (built-in, fast)
    minify: 'esbuild',
  },
})
