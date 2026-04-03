#!/usr/bin/env tsx
/**
 * Fetch and upload images for particle board products
 *
 * Supports BOTH Pixabay and Pexels APIs.
 *
 * Usage:
 *   PIXABAY_KEY=<key> npx tsx scripts/fetch-product-images.ts
 *   PEXELS_KEY=<key> npx tsx scripts/fetch-product-images.ts
 *
 * Get free keys:
 *   Pixabay: https://pixabay.com/api/docs/
 *   Pexels:  https://www.pexels.com/api/new/
 *
 * Options:
 *   --category=X   Only fetch for a specific category
 *   --limit=N      Only process first N products (default: all)
 *   --dry-run      Show what would be fetched without downloading
 *   --force        Re-fetch images even for products that already have them
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kwxkapanfkviibxjhgps.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzEyMDYwMywiZXhwIjoyMDg4Njk2NjAzfQ.K4qLj9niaFNHgfURLIGbTVEsrBuRt8LmH5bbg6M_pv0'
const PIXABAY_KEY = process.env.PIXABAY_KEY || ''
const PEXELS_KEY = process.env.PEXELS_KEY || ''
const BUCKET = 'catalog'
const DRY_RUN = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force')
const CATEGORY_FILTER = process.argv.find(a => a.startsWith('--category='))?.split('=')[1] || ''
const LIMIT = parseInt(process.argv.find(a => a.startsWith('--limit='))?.split('=')[1] || '0') || 0

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Search query mapping: category -> search terms for image APIs
const CATEGORY_QUERIES: Record<string, string[]> = {
  WARDROBES_ALMIRAHS: ['wooden wardrobe bedroom', 'modern wardrobe closet', 'almirah furniture wooden'],
  TV_UNITS: ['tv unit living room', 'modern tv stand wooden', 'entertainment center furniture'],
  STUDY_COMPUTER_TABLES: ['wooden desk study table', 'computer desk workspace', 'home office desk wooden'],
  BOOKSHELVES_DISPLAY: ['wooden bookshelf modern', 'display shelf books', 'bookcase interior design'],
  SHOE_RACKS: ['shoe rack cabinet entryway', 'shoe storage wooden', 'shoe cabinet furniture'],
  KITCHEN_PANTRY: ['kitchen cabinet wooden', 'kitchen furniture storage', 'modular kitchen interior'],
  BEDROOM_FURNITURE: ['modern bed bedroom furniture', 'bedroom interior wooden', 'bed storage headboard'],
  DRESSING_TABLES: ['dressing table mirror vanity', 'makeup vanity table bedroom', 'dressing table wooden'],
  OFFICE_WORKSTATIONS: ['office desk workstation', 'modern office furniture', 'office interior desk wooden'],
  MODULAR_STORAGE: ['modular storage cabinet', 'storage unit modern home', 'storage shelf organizer wooden'],
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

// ── Pixabay ─────────────────────────────────────────────────────────────────

interface PixabayPhoto {
  id: number
  largeImageURL: string
  webformatURL: string
  tags: string
}

async function searchPixabay(query: string, page: number = 1): Promise<PixabayPhoto[]> {
  const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=20&page=${page}&safesearch=true&min_width=640`
  try {
    const res = await fetch(url)
    if (res.status === 429) {
      console.log('  ⏳ Pixabay rate limit, waiting 60s...')
      await sleep(60000)
      return searchPixabay(query, page)
    }
    if (!res.ok) return []
    const data = await res.json() as { hits: PixabayPhoto[] }
    return data.hits || []
  } catch { return [] }
}

// ── Pexels ──────────────────────────────────────────────────────────────────

interface PexelsPhoto {
  id: number
  src: { large: string; medium: string; original: string }
  alt: string
}

async function searchPexels(query: string, page: number = 1): Promise<PexelsPhoto[]> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=20&page=${page}`
  try {
    const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } })
    if (res.status === 429) {
      console.log('  ⏳ Pexels rate limit, waiting 60s...')
      await sleep(60000)
      return searchPexels(query, page)
    }
    if (!res.ok) return []
    const data = await res.json() as { photos: PexelsPhoto[] }
    return data.photos || []
  } catch { return [] }
}

// ── Image download + upload ─────────────────────────────────────────────────

async function downloadAndUpload(imageUrl: string, slug: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl)
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 1000) return null // too small, probably error

    const ext = imageUrl.includes('.png') ? 'png' : 'jpg'
    const path = `particle-board/${slug}.${ext}`

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buf, {
        contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
        upsert: true,
      })

    if (error) {
      console.log(`    Upload error: ${error.message}`)
      return null
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  } catch (e) {
    return null
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const provider = PIXABAY_KEY ? 'Pixabay' : PEXELS_KEY ? 'Pexels' : null

  console.log('╔══════════════════════════════════════════════╗')
  console.log('║  Product Image Fetcher                       ║')
  console.log('╚══════════════════════════════════════════════╝\n')

  if (!provider) {
    console.log('❌ No API key provided!\n')
    console.log('Set one of these environment variables:')
    console.log('  PIXABAY_KEY=<key>  (get free: https://pixabay.com/api/docs/)')
    console.log('  PEXELS_KEY=<key>   (get free: https://www.pexels.com/api/new/)\n')
    console.log('Usage:')
    console.log('  PIXABAY_KEY=abc123 npx tsx scripts/fetch-product-images.ts')
    console.log('  PEXELS_KEY=abc123 npx tsx scripts/fetch-product-images.ts')
    process.exit(1)
  }

  console.log(`📷 Using: ${provider} API`)
  if (DRY_RUN) console.log('🏃 DRY RUN mode')
  if (FORCE) console.log('🔄 FORCE mode — re-fetching all images')
  if (CATEGORY_FILTER) console.log(`📋 Category filter: ${CATEGORY_FILTER}`)
  if (LIMIT) console.log(`📋 Limit: ${LIMIT} products`)
  console.log('')

  // Fetch products that need images
  let query = supabase
    .from('catalog_products')
    .select('id, name, slug, category, raw_photo_urls, processed_photo_urls')
    .eq('status', 'PUBLISHED')
    .in('category', Object.keys(CATEGORY_QUERIES))
    .order('category')
    .order('sort_order')

  if (CATEGORY_FILTER) {
    query = query.eq('category', CATEGORY_FILTER)
  }

  const { data: products, error } = await query

  if (error || !products) {
    console.log(`❌ Error fetching products: ${error?.message}`)
    process.exit(1)
  }

  // Filter to products without images (unless --force)
  const needImages = FORCE
    ? products
    : products.filter(p => !p.raw_photo_urls?.length || p.raw_photo_urls.length === 0)

  const toProcess = LIMIT ? needImages.slice(0, LIMIT) : needImages

  console.log(`📦 Total products: ${products.length}`)
  console.log(`🖼️  Need images: ${needImages.length}`)
  console.log(`🎯 Will process: ${toProcess.length}\n`)

  if (toProcess.length === 0) {
    console.log('✅ All products already have images! Use --force to re-fetch.')
    return
  }

  // Pre-fetch image pools per category (batch search for efficiency)
  console.log('🔍 Pre-fetching image pools per category...\n')
  const imagePool: Record<string, string[]> = {}

  const categories = [...new Set(toProcess.map(p => p.category!))]

  for (const cat of categories) {
    const queries = CATEGORY_QUERIES[cat] || [`${cat.toLowerCase().replace(/_/g, ' ')} furniture`]
    const urls: string[] = []

    for (const q of queries) {
      if (provider === 'Pixabay') {
        const hits = await searchPixabay(q)
        urls.push(...hits.map(h => h.largeImageURL))
        await sleep(300) // Rate limit respect
      } else {
        const photos = await searchPexels(q)
        urls.push(...photos.map(p => p.src.large))
        await sleep(250)
      }
    }

    // Deduplicate
    imagePool[cat] = [...new Set(urls)]
    console.log(`  ${cat}: ${imagePool[cat].length} images found`)
  }

  console.log('')

  // Assign images to products
  let success = 0, failed = 0
  const categoryIndex: Record<string, number> = {}

  for (let i = 0; i < toProcess.length; i++) {
    const product = toProcess[i]
    const cat = product.category!
    const pool = imagePool[cat] || []
    const idx = categoryIndex[cat] || 0
    categoryIndex[cat] = idx + 1

    const progress = `[${i + 1}/${toProcess.length}]`

    if (pool.length === 0) {
      console.log(`  ${progress} ⚠️  ${product.name} — no images in pool`)
      failed++
      continue
    }

    // Pick image from pool (cycle through available images)
    const imageUrl = pool[idx % pool.length]

    if (DRY_RUN) {
      console.log(`  ${progress} 🏃 Would fetch: ${product.name} ← ${imageUrl.substring(0, 60)}...`)
      success++
      continue
    }

    console.log(`  ${progress} ⬇️  ${product.name}`)
    const publicUrl = await downloadAndUpload(imageUrl, product.slug!)

    if (publicUrl) {
      // Update product record with image
      const { error: updateErr } = await supabase
        .from('catalog_products')
        .update({
          raw_photo_urls: [publicUrl],
          processed_photo_urls: [publicUrl],
        })
        .eq('id', product.id)

      if (updateErr) {
        console.log(`    ❌ DB update failed: ${updateErr.message}`)
        failed++
      } else {
        console.log(`    ✅ Done`)
        success++
      }
    } else {
      console.log(`    ❌ Download/upload failed`)
      failed++
    }

    // Small delay between downloads
    await sleep(200)
  }

  console.log('\n══════════════════════════════════════════════')
  console.log(`  ✅ Success: ${success}`)
  console.log(`  ❌ Failed:  ${failed}`)
  console.log(`  📦 Total:   ${toProcess.length}`)
  console.log('══════════════════════════════════════════════')
}

main().catch(console.error)
