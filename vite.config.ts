import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// ── All routes to prerender ──────────────────────────────────────────────────
// Must stay in sync with App.tsx routes and sitemap generator.
// Individual product pages (dynamic slugs) are NOT prerendered — they rely on
// react-helmet-async for client-side SEO (Googlebot executes JS).

const PRERENDER_ROUTES = [
  // Static pages
  '/',
  '/home',
  '/about',
  '/privacy',
  '/terms',

  // MVM Aasanam — brand + 4 collections
  '/mvm',
  '/mvm/executive-chairs',
  '/mvm/ergonomic-task-chairs',
  '/mvm/cafeteria-furniture',
  '/mvm/visitor-and-reception',

  // Nilkamal — brand + 19 collections
  '/nilkamal',
  '/nilkamal/chairs',
  '/nilkamal/plastic-cabinets',
  '/nilkamal/dining-sets',
  '/nilkamal/dining-tables',
  '/nilkamal/office-chairs',
  '/nilkamal/office-tables',
  '/nilkamal/outdoor-furniture',
  '/nilkamal/sofas',
  '/nilkamal/recliners',
  '/nilkamal/beds',
  '/nilkamal/wardrobes',
  '/nilkamal/shoe-cabinets',
  '/nilkamal/tv-units',
  '/nilkamal/book-cases',
  '/nilkamal/centre-tables',
  '/nilkamal/dressing-tables',
  '/nilkamal/kids-furniture',
  '/nilkamal/stools',
  '/nilkamal/racks-trolleys',

  // Supreme — brand + 8 collections
  '/supreme',
  '/supreme/seating',
  '/supreme/tables',
  '/supreme/kids-range',
  '/supreme/storage',
  '/supreme/multipurpose',
  '/supreme/sets',
  '/supreme/stools',
  '/supreme/beds',

  // Seatex — brand + 5 collections
  '/seatex',
  '/seatex/chairs-standard',
  '/seatex/chairs-premium',
  '/seatex/tables',
  '/seatex/stools',
  '/seatex/kids',
]

// Prerendering is optional — only runs when PRERENDER=true (requires puppeteer)
// Vercel builds without it; local builds can use: PRERENDER=true npm run build
async function getPrerenderPlugin(): Promise<PluginOption | null> {
  if (process.env.PRERENDER !== 'true') return null
  try {
    const mod = await import('@prerenderer/rollup-plugin')
    const prerender = mod.default || mod
    console.log(`[prerender] Prerendering ${PRERENDER_ROUTES.length} routes...`)
    return prerender({
      routes: PRERENDER_ROUTES,
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        maxConcurrentRoutes: 4,
        renderAfterTime: 6000,
      },
      postProcess(renderedRoute: { html: string; route: string }) {
        let html = renderedRoute.html

        // react-helmet-async injects correct per-page <title>, <meta description>,
        // and <link canonical> at the END of <head>. Remove the hardcoded originals
        // from index.html to avoid duplicates.

        // Remove hardcoded title (keep the helmet one)
        html = html.replace(
          /<title>MVM Aasanam by Hari Shewa Enterprises[^<]*<\/title>/,
          ''
        )

        // Remove hardcoded meta description (keep the helmet one)
        html = html.replace(
          /<meta name="description" content="Office furniture manufacturer in Neemuch[^"]*"[^>]*>/,
          ''
        )

        // Remove hardcoded canonical (keep the helmet one which has the full route URL)
        html = html.replace(
          /<link rel="canonical" href="https:\/\/mvm-furniture\.com"[^>]*>/,
          ''
        )

        // Remove hardcoded OG tags (keep the helmet ones which are page-specific)
        html = html.replace(/<meta property="og:title" content="MVM Aasanam[^"]*"[^>]*>/, '')
        html = html.replace(/<meta property="og:description" content="Office furniture manufacturer &amp; wholesale[^"]*"[^>]*>/, '')
        html = html.replace(/<meta property="og:url" content="https:\/\/mvm-furniture\.com"[^>]*>/, '')

        // Remove hardcoded Twitter tags (keep the helmet ones)
        html = html.replace(/<meta name="twitter:title" content="MVM Aasanam[^"]*"[^>]*>/, '')
        html = html.replace(/<meta name="twitter:description" content="Office furniture manufacturer &amp; wholesale[^"]*"[^>]*>/, '')

        renderedRoute.html = html
        return renderedRoute
      },
    })
  } catch (e) {
    console.warn('Prerender plugin not available, skipping prerendering')
    console.warn('  Error:', (e as Error).message)
    return null
  }
}

export default defineConfig(async () => ({
  plugins: [
    react(),
    await getPrerenderPlugin(),
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
}))
