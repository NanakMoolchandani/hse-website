/**
 * Generates sitemap.xml by fetching published products from Supabase
 * and including all brand/collection pages.
 * Run: npx tsx scripts/generate-sitemap.ts
 * Output: dist/sitemap.xml (or public/sitemap.xml if dist doesn't exist)
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://kwxkapanfkviibxjhgps.supabase.co'
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''
const BASE_URL = 'https://mvm-furniture.com'

// MVM Aasanam (own brand) — categories match src/lib/categories.ts
const MVM_CATEGORIES = [
  { slug: 'executive-chairs', enum: 'EXECUTIVE_CHAIRS' },
  { slug: 'ergonomic-task-chairs', enum: 'ERGONOMIC_TASK_CHAIRS' },
  { slug: 'cafeteria-furniture', enum: 'CAFETERIA_FURNITURE' },
  { slug: 'visitor-and-reception', enum: 'VISITOR_RECEPTION' },
]

// Nilkamal collections — match src/lib/nilkamal.ts
const NILKAMAL_COLLECTIONS = [
  'chairs', 'plastic-cabinets', 'dining-sets', 'dining-tables',
  'office-chairs', 'office-tables', 'outdoor-furniture',
]

// Supreme collections — match src/lib/supreme.ts
const SUPREME_COLLECTIONS = [
  'seating', 'tables', 'kids-range', 'storage', 'multipurpose', 'sets', 'stools', 'beds',
]

// Seatex collections — match src/lib/seatex.ts
const SEATEX_COLLECTIONS = [
  'chairs-standard', 'chairs-premium', 'tables', 'stools', 'kids',
]

const STATIC_PAGES = [
  { path: '/home', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/mvm', priority: '0.9', changefreq: 'weekly' },
  { path: '/nilkamal', priority: '0.9', changefreq: 'weekly' },
  { path: '/supreme', priority: '0.9', changefreq: 'weekly' },
  { path: '/seatex', priority: '0.9', changefreq: 'weekly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
]

function urlEntry(path: string, priority: string, changefreq: string, lastmod: string): string {
  return `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

async function main() {
  if (!SUPABASE_ANON_KEY) {
    console.error('Missing VITE_SUPABASE_ANON_KEY env var')
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const today = new Date().toISOString().split('T')[0]

  const urls: string[] = []

  // Static pages
  for (const page of STATIC_PAGES) {
    urls.push(urlEntry(page.path, page.priority, page.changefreq, today))
  }

  // MVM collection pages
  for (const cat of MVM_CATEGORIES) {
    urls.push(urlEntry(`/mvm/${cat.slug}`, '0.8', 'weekly', today))
  }

  // Nilkamal collection pages
  for (const handle of NILKAMAL_COLLECTIONS) {
    urls.push(urlEntry(`/nilkamal/${handle}`, '0.8', 'weekly', today))
  }

  // Supreme collection pages
  for (const handle of SUPREME_COLLECTIONS) {
    urls.push(urlEntry(`/supreme/${handle}`, '0.8', 'weekly', today))
  }

  // Seatex collection pages
  for (const handle of SEATEX_COLLECTIONS) {
    urls.push(urlEntry(`/seatex/${handle}`, '0.8', 'weekly', today))
  }

  // MVM product pages from Supabase
  const { data: products, error } = await supabase
    .from('catalog_products')
    .select('slug, category, updated_at')
    .eq('status', 'PUBLISHED')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error.message)
    process.exit(1)
  }

  console.log(`Found ${products?.length || 0} published MVM products`)

  for (const product of products || []) {
    if (!product.slug || !product.category) continue
    const catSlug = MVM_CATEGORIES.find((c) => c.enum === product.category)?.slug
    if (!catSlug) continue
    const lastmod = product.updated_at
      ? new Date(product.updated_at).toISOString().split('T')[0]
      : today
    urls.push(urlEntry(`/mvm/${catSlug}/${product.slug}`, '0.7', 'monthly', lastmod))
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`

  // Write to dist/ if it exists (post-build), otherwise public/
  const distDir = resolve(import.meta.dirname, '..', 'dist')
  const publicDir = resolve(import.meta.dirname, '..', 'public')
  const outDir = existsSync(distDir) ? distDir : publicDir
  const outPath = resolve(outDir, 'sitemap.xml')

  writeFileSync(outPath, sitemap, 'utf-8')
  console.log(`Sitemap written to ${outPath} with ${urls.length} URLs`)
}

main()
