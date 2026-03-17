// ── Supreme Shopify API Integration ──────────────────────────────────────────
// Fetches real product data from supremefurniture.co.in (public Shopify JSON API)
// No API key needed — these are public storefront endpoints.

const BASE = 'https://supremefurniture.co.in'

// ── Types ────────────────────────────────────────────────────────────────────

export interface SupremeImage {
  id: number
  src: string
  width: number
  height: number
  position: number
}

export interface SupremeVariant {
  id: number
  title: string
  available: boolean
  sku: string
}

export interface SupremeProduct {
  id: number
  title: string
  handle: string
  body_html: string
  vendor: string
  product_type: string
  tags: string[]
  images: SupremeImage[]
  variants: SupremeVariant[]
  published_at: string
  created_at: string
  updated_at: string
}

// ── Collections we display ───────────────────────────────────────────────────

export interface SupremeCategory {
  handle: string
  label: string
  description: string
  color: string       // tailwind gradient
  accent: string      // tailwind text color
}

export const SUPREME_COLLECTIONS: SupremeCategory[] = [
  {
    handle: 'seating',
    label: 'Seating',
    description: 'Plastic chairs with and without arms, cushioned chairs, and designer seating. Durable, stackable, and weather-resistant.',
    color: 'from-orange-500/10 to-transparent',
    accent: 'text-orange-500',
  },
  {
    handle: 'tables',
    label: 'Tables',
    description: 'Dining tables, centre tables, coffee tables, study tables, and folding tables. Built to last with easy maintenance.',
    color: 'from-amber-500/10 to-transparent',
    accent: 'text-amber-500',
  },
  {
    handle: 'kids-range',
    label: 'Kids Range',
    description: 'Kids chairs, tables, baby chairs, and study sets. Safe, colourful, and designed for little ones.',
    color: 'from-yellow-500/10 to-transparent',
    accent: 'text-yellow-500',
  },
  {
    handle: 'storage',
    label: 'Storage',
    description: 'Cabinets, wardrobes, shoe racks, and drawer cabinets. Termite-proof, weather-resistant plastic storage solutions.',
    color: 'from-orange-600/10 to-transparent',
    accent: 'text-orange-600',
  },
  {
    handle: 'multipurpose',
    label: 'Multipurpose',
    description: 'Multi-purpose storage and utility items for home, office, and commercial use.',
    color: 'from-amber-600/10 to-transparent',
    accent: 'text-amber-600',
  },
  {
    handle: 'sets',
    label: 'Sets',
    description: 'Table and chair combinations — ready-to-use sets for dining, outdoor, and everyday use.',
    color: 'from-orange-400/10 to-transparent',
    accent: 'text-orange-400',
  },
  {
    handle: 'stools',
    label: 'Stools',
    description: 'Multipurpose plastic stools. Stackable, lightweight, and available in multiple colours.',
    color: 'from-amber-400/10 to-transparent',
    accent: 'text-amber-400',
  },
  {
    handle: 'beds',
    label: 'Beds',
    description: 'Folding beds — portable, space-saving, and durable plastic beds for home and travel.',
    color: 'from-orange-700/10 to-transparent',
    accent: 'text-orange-700',
  },
]

// ── Fetch helpers ────────────────────────────────────────────────────────────

/** Shopify CDN image resize — append size param for optimized loading */
export function supremeImageUrl(src: string, width: number = 600): string {
  if (src.includes('cdn.shopify.com')) {
    return src.replace(/(\.\w+)\?/, `_${width}x$1?`)
  }
  return src
}

/** Fetch products for a specific collection (with pagination to get past Shopify's 30/page cap) */
export async function fetchSupremeCollection(handle: string): Promise<SupremeProduct[]> {
  const allProducts: SupremeProduct[] = []
  const seenIds = new Set<number>()

  for (let page = 1; page <= 10; page++) {
    try {
      const res = await fetch(`${BASE}/collections/${handle}/products.json?limit=250&page=${page}`)
      if (!res.ok) break
      const data = await res.json()
      const products: SupremeProduct[] = data.products || []
      if (products.length === 0) break

      for (const p of products) {
        if (!seenIds.has(p.id)) {
          seenIds.add(p.id)
          allProducts.push(p)
        }
      }

      // If we got fewer than 30, no more pages
      if (products.length < 30) break
    } catch {
      break
    }
  }

  return allProducts
}

/** Fetch a single product by handle */
export async function fetchSupremeProduct(handle: string): Promise<SupremeProduct | null> {
  try {
    const res = await fetch(`${BASE}/products/${handle}.json`)
    if (!res.ok) return null
    const data = await res.json()
    return data.product || null
  } catch {
    return null
  }
}

/** Get Supreme collection info by handle */
export function getSupremeCollection(handle: string): SupremeCategory | undefined {
  return SUPREME_COLLECTIONS.find((c) => c.handle === handle)
}

/** Clean product title — remove "Supreme " prefix and redundant text */
export function cleanSupremeTitle(title: string): string {
  return title
    .replace(/^Supreme\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Extract color names from product tags */
export function extractSupremeColorTags(tags: string[]): string[] {
  return tags.filter((t) =>
    /^(red|blue|green|yellow|brown|black|white|grey|gray|pink|orange|purple|beige|cream|ivory|walnut|teak|wenge|mahogany|oak|cherry|maple|natural|biscuit|weathered|bright|dark|light)/i.test(t),
  )
}

/** Strip HTML tags from body_html */
export function stripSupremeHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}
