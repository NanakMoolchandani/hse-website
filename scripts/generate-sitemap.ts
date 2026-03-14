/**
 * Generates sitemap.xml by fetching published products from Supabase.
 * Run: npx tsx scripts/generate-sitemap.ts
 * Output: dist/sitemap.xml (or public/sitemap.xml if dist doesn't exist)
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://kwxkapanfkviibxjhgps.supabase.co'
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''
const BASE_URL = 'https://mvm-furniture.com'

const CATEGORIES = [
  { slug: 'executive-chairs', enum: 'EXECUTIVE_CHAIRS' },
  { slug: 'ergonomic-task-chairs', enum: 'ERGONOMIC_TASK_CHAIRS' },
  { slug: 'cafeteria-furniture', enum: 'CAFETERIA_FURNITURE' },
  { slug: 'visitor-and-reception', enum: 'VISITOR_RECEPTION' },
]

const STATIC_PAGES = [
  { path: '/home', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
]

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
    urls.push(`  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  }

  // Category pages
  for (const cat of CATEGORIES) {
    urls.push(`  <url>
    <loc>${BASE_URL}/products/${cat.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`)
  }

  // Product pages from Supabase
  const { data: products, error } = await supabase
    .from('catalog_products')
    .select('slug, category, updated_at')
    .eq('status', 'PUBLISHED')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error.message)
    process.exit(1)
  }

  console.log(`Found ${products?.length || 0} published products`)

  for (const product of products || []) {
    if (!product.slug || !product.category) continue
    const catSlug = CATEGORIES.find((c) => c.enum === product.category)?.slug
    if (!catSlug) continue
    const lastmod = product.updated_at
      ? new Date(product.updated_at).toISOString().split('T')[0]
      : today
    urls.push(`  <url>
    <loc>${BASE_URL}/products/${catSlug}/${product.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)
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
