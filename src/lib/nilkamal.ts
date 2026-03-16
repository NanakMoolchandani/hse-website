// ── Nilkamal Shopify API Integration ─────────────────────────────────────────
// Fetches real product data from nilkamalfurniture.com (public Shopify JSON API)
// No API key needed — these are public storefront endpoints.

const BASE = 'https://www.nilkamalfurniture.com'

// ── Types ────────────────────────────────────────────────────────────────────

export interface NilkamalImage {
  id: number
  src: string
  width: number
  height: number
  position: number
}

export interface NilkamalVariant {
  id: number
  title: string
  available: boolean
  sku: string
}

export interface NilkamalProduct {
  id: number
  title: string
  handle: string
  body_html: string
  vendor: string
  product_type: string
  tags: string[]
  images: NilkamalImage[]
  variants: NilkamalVariant[]
  published_at: string
  created_at: string
  updated_at: string
}

export interface NilkamalCollection {
  id: number
  handle: string
  title: string
  body_html: string | null
  published_at: string
  image: { src: string } | null
}

// ── Collections we display ───────────────────────────────────────────────────

export interface NilkamalCategory {
  handle: string
  label: string
  description: string
  color: string       // tailwind gradient
  accent: string      // tailwind text color
}

export const NILKAMAL_COLLECTIONS: NilkamalCategory[] = [
  {
    handle: 'chairs',
    label: 'Chairs',
    description: 'Moulded plastic chairs — from the iconic CHR series to premium Crystal and Novella ranges. Stackable, durable, and available in 20+ colours.',
    color: 'from-red-500/10 to-transparent',
    accent: 'text-red-500',
  },
  {
    handle: 'plastic-cabinets',
    label: 'Storage Cabinets',
    description: 'The Freedom Series and more — weather-proof, termite-proof plastic cabinets and wardrobes for homes, offices, and institutions.',
    color: 'from-amber-500/10 to-transparent',
    accent: 'text-amber-600',
  },
  {
    handle: 'dining-sets',
    label: 'Dining Sets',
    description: 'Complete dining sets — table and chairs in matching finishes. Available in 2, 4, and 6-seater configurations.',
    color: 'from-emerald-500/10 to-transparent',
    accent: 'text-emerald-600',
  },
  {
    handle: 'dining-tables',
    label: 'Dining & Centre Tables',
    description: 'Dining tables, centre tables, and side tables in plastic and composite construction. Durable and easy to maintain.',
    color: 'from-green-500/10 to-transparent',
    accent: 'text-green-600',
  },
  {
    handle: 'office-chairs',
    label: 'Office Chairs',
    description: 'Ergonomic high-back executive chairs, mid-back task chairs, and visitor chairs with writing pads for offices and institutions.',
    color: 'from-blue-500/10 to-transparent',
    accent: 'text-blue-600',
  },
  {
    handle: 'office-tables',
    label: 'Office & Study Tables',
    description: 'Office desks, computer tables, and study tables. Compact designs for home offices and commercial workspaces.',
    color: 'from-sky-500/10 to-transparent',
    accent: 'text-sky-600',
  },
  {
    handle: 'outdoor-furniture',
    label: 'Outdoor & Garden',
    description: 'Weather-resistant garden sofas, loungers, swings, and patio sets. The Goa series and Breeze collection for outdoor spaces.',
    color: 'from-teal-500/10 to-transparent',
    accent: 'text-teal-600',
  },
  {
    handle: 'sofas',
    label: 'Sofas & Seating',
    description: 'Living room sofas, sofa sets, recliners, and sofa-cum-beds. Comfortable seating for every space.',
    color: 'from-purple-500/10 to-transparent',
    accent: 'text-purple-600',
  },
  {
    handle: 'beds',
    label: 'Beds & Bedroom',
    description: 'Single, double, queen, and king-size beds in metal, wood, and upholstered finishes. Complete bedroom furniture solutions.',
    color: 'from-indigo-500/10 to-transparent',
    accent: 'text-indigo-600',
  },
  {
    handle: 'wardrobes',
    label: 'Wardrobes',
    description: 'Spacious wardrobes and almirahs in various sizes. Organized storage for bedrooms and dressing areas.',
    color: 'from-violet-500/10 to-transparent',
    accent: 'text-violet-600',
  },
  {
    handle: 'shoe-cabinets',
    label: 'Shoe Racks & Cabinets',
    description: 'Dedicated shoe storage — cabinets, racks, and organisers to keep your entryway tidy.',
    color: 'from-orange-500/10 to-transparent',
    accent: 'text-orange-600',
  },
  {
    handle: 'kids-furniture',
    label: 'Kids Furniture',
    description: 'Safe, colourful furniture for children — study tables, chairs, beds, and storage with child-friendly designs.',
    color: 'from-pink-500/10 to-transparent',
    accent: 'text-pink-600',
  },
  {
    handle: 'stools',
    label: 'Stools',
    description: 'Plastic stools, step stools, and utility stools. Stackable, lightweight, and available in multiple colours.',
    color: 'from-lime-500/10 to-transparent',
    accent: 'text-lime-600',
  },
  {
    handle: 'racks-trolleys',
    label: 'Racks & Trolleys',
    description: 'Kitchen racks, utility trolleys, and multi-purpose storage. Organize any room efficiently.',
    color: 'from-cyan-500/10 to-transparent',
    accent: 'text-cyan-600',
  },
]

// ── Fetch helpers ────────────────────────────────────────────────────────────

/** Shopify CDN image resize — append size param for optimized loading */
export function nilkamalImageUrl(src: string, width: number = 600): string {
  // Shopify CDN supports _WIDTHx suffix or ?width= param
  if (src.includes('cdn.shopify.com')) {
    return src.replace(/(\.\w+)\?/, `_${width}x$1?`)
  }
  return src
}

/** Fetch products for a specific collection */
export async function fetchNilkamalCollection(
  handle: string,
  limit: number = 250,
): Promise<NilkamalProduct[]> {
  try {
    const res = await fetch(`${BASE}/collections/${handle}/products.json?limit=${limit}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.products || []
  } catch {
    console.error(`Failed to fetch Nilkamal collection: ${handle}`)
    return []
  }
}

/** Fetch all products (paginated) */
export async function fetchAllNilkamalProducts(): Promise<NilkamalProduct[]> {
  const allProducts: NilkamalProduct[] = []
  for (let page = 1; page <= 5; page++) {
    try {
      const res = await fetch(`${BASE}/products.json?limit=250&page=${page}`)
      if (!res.ok) break
      const data = await res.json()
      if (!data.products || data.products.length === 0) break
      allProducts.push(...data.products)
    } catch {
      break
    }
  }
  return allProducts
}

/** Get Nilkamal collection info by handle */
export function getNilkamalCollection(handle: string): NilkamalCategory | undefined {
  return NILKAMAL_COLLECTIONS.find((c) => c.handle === handle)
}

/** Clean product title — remove "Nilkamal" prefix and redundant text */
export function cleanProductTitle(title: string): string {
  return title
    .replace(/^Nilkamal\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}
