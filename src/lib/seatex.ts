// ── Seatex Product Data (Hardcoded) ─────────────────────────────────────────
// Seatex has no API (Wix website) — all product data is hardcoded here.
// Uses the same interfaces as Nilkamal for consistency across brand pages.

// ── Types (same shape as Nilkamal for consistent rendering) ─────────────────

export interface SeatexImage {
  id: number
  src: string
  width: number
  height: number
  position: number
}

export interface SeatexVariant {
  id: number
  title: string
  available: boolean
  sku: string
}

export interface SeatexProduct {
  id: number
  title: string
  handle: string
  body_html: string
  vendor: string
  product_type: string
  tags: string[]
  images: SeatexImage[]
  variants: SeatexVariant[]
  published_at: string
  created_at: string
  updated_at: string
}

// ── Collections ─────────────────────────────────────────────────────────────

export interface SeatexCategory {
  handle: string
  label: string
  description: string
  color: string       // tailwind gradient
  accent: string      // tailwind text color
}

export const SEATEX_COLLECTIONS: SeatexCategory[] = [
  {
    handle: 'chairs-standard',
    label: 'Chairs — Standard Line',
    description: 'Economy moulded plastic chairs in gloss and matt finishes. Durable, stackable, and available in multiple colours. Perfect for everyday use.',
    color: 'from-emerald-500/10 to-transparent',
    accent: 'text-emerald-500',
  },
  {
    handle: 'chairs-premium',
    label: 'Chairs — Premium Line',
    description: 'Heavy-duty premium plastic chairs with superior finish, comfort, and design. Built for long-lasting use in homes, offices, and events.',
    color: 'from-green-500/10 to-transparent',
    accent: 'text-green-500',
  },
  {
    handle: 'tables',
    label: 'Tables',
    description: 'Plastic dining tables and centre tables — lightweight, durable, and easy to maintain. Available in multiple sizes and finishes.',
    color: 'from-teal-500/10 to-transparent',
    accent: 'text-teal-500',
  },
  {
    handle: 'stools',
    label: 'Stools',
    description: 'Sturdy plastic stools with leg support. Stackable and compact — ideal for kitchens, shops, and outdoor use.',
    color: 'from-lime-500/10 to-transparent',
    accent: 'text-lime-500',
  },
  {
    handle: 'kids',
    label: 'Kids Furniture',
    description: 'Colourful and safe plastic furniture designed for children — study tables, play tables, and kid-sized chairs.',
    color: 'from-cyan-500/10 to-transparent',
    accent: 'text-cyan-500',
  },
]

// ── Available Colours ───────────────────────────────────────────────────────

export const SEATEX_STANDARD_COLORS = ['Beige', 'M. Yellow', 'P. Green', 'Rose Wood', 'S. Wood']
export const SEATEX_PREMIUM_COLORS = ['A.Gold', 'Beige', 'Black', 'Choco Cream', 'Fusion Grey']

// ── Hardcoded Product Data ──────────────────────────────────────────────────

let nextId = 9000 // arbitrary starting ID for hardcoded products

function makeSeatexProduct(
  name: string,
  handle: string,
  description: string,
  type: string,
  colors: string[],
): SeatexProduct {
  const id = nextId++
  return {
    id,
    title: `Seatex ${name}`,
    handle,
    body_html: `<p>${description}</p>`,
    vendor: 'Seatex',
    product_type: type,
    tags: [...colors, type],
    images: [],
    variants: colors.map((color, i) => ({
      id: id * 100 + i,
      title: color,
      available: true,
      sku: `STX-${handle.toUpperCase()}-${i + 1}`,
    })),
    published_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }
}

// ── Standard Chairs ─────────────────────────────────────────────────────────

const CHAIRS_STANDARD: SeatexProduct[] = [
  makeSeatexProduct('Crazy', 'crazy', 'Gloss finish economy plastic chair. Lightweight, stackable, and built for everyday use.', 'Chair', SEATEX_STANDARD_COLORS),
  makeSeatexProduct('Elba', 'elba', 'Matt finished economy plastic chair. Sleek matte texture with comfortable seating.', 'Chair', SEATEX_STANDARD_COLORS),
  makeSeatexProduct('Fantasy', 'fantasy', 'Armless gloss finish plastic chair. Clean design without arms for easy stacking and compact storage.', 'Chair', SEATEX_STANDARD_COLORS),
  makeSeatexProduct('Rainbow', 'rainbow', 'Plastic chair with arms and gloss finish. Medium back design for comfortable everyday seating.', 'Chair', SEATEX_STANDARD_COLORS),
  makeSeatexProduct('Diamond', 'diamond', 'Armless medium back plastic chair. Simple and sturdy design for homes, shops, and events.', 'Chair', SEATEX_STANDARD_COLORS),
  makeSeatexProduct('Kinder', 'kinder', "Kid's plastic chair. Small, colourful, and safe — designed specifically for children.", 'Chair', SEATEX_STANDARD_COLORS),
]

// ── Premium Chairs ──────────────────────────────────────────────────────────

const CHAIRS_PREMIUM: SeatexProduct[] = [
  makeSeatexProduct('Oxford', 'oxford', 'Heavy duty sofa chair with arm. Premium gloss and matt combined finish for superior comfort and style.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Craven', 'craven', 'Matt finished heavy duty premium plastic chair. Built for durability and long-lasting comfort.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Boston', 'boston', 'Premium plastic chair with arm. Elegant design with comfortable armrests for extended seating.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Maxim', 'maxim', 'Premium plastic chair with refined design and superior build quality.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Magic', 'magic', 'Comfortable plastic chair with attractive design and solid construction.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Platinum', 'platinum', 'Premium chair with sophisticated finish and enhanced comfort features.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Resto', 'resto', 'Plastic chair designed for restaurants, cafes, and commercial spaces.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Steelo', 'steelo', 'Armless chair with stainless steel legs. Modern hybrid design combining plastic and metal.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Magnum', 'magnum', 'Premium chair with robust build and generous seating area.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Golf', 'golf', 'Premium plastic chair with elegant contours and comfortable seating.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Neo Champ', 'neo-champ', 'Premium chair with modern design aesthetics and enhanced durability.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Rolex', 'rolex', 'Premium plastic chair with stylish design and superior finish.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Radium', 'radium', 'Premium chair with eye-catching design and solid construction.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Idea', 'idea', 'Premium plastic chair with innovative design and comfortable seating.', 'Chair', SEATEX_PREMIUM_COLORS),
  makeSeatexProduct('Dolby', 'dolby', 'Premium plastic chair with refined aesthetics and durable build.', 'Chair', SEATEX_PREMIUM_COLORS),
]

// ── Tables ──────────────────────────────────────────────────────────────────

const TABLES: SeatexProduct[] = [
  makeSeatexProduct('Dinner', 'dinner', 'Plastic dining table. Spacious surface for family meals, lightweight yet sturdy construction.', 'Table', SEATEX_STANDARD_COLORS),
  makeSeatexProduct('Enjoy', 'enjoy', 'Plastic dining table with comfortable height and durable build. Perfect for everyday dining.', 'Table', SEATEX_STANDARD_COLORS),
  makeSeatexProduct('Jupiter', 'jupiter', 'Plastic centre table. Compact design ideal for living rooms and waiting areas.', 'Table', SEATEX_STANDARD_COLORS),
]

// ── Stools ──────────────────────────────────────────────────────────────────

const STOOLS: SeatexProduct[] = [
  makeSeatexProduct('Boxim', 'boxim', '21-inch plastic stool with leg support. Stackable, sturdy, and perfect for kitchens, shops, and outdoor use.', 'Stool', SEATEX_STANDARD_COLORS),
]

// ── Kids ────────────────────────────────────────────────────────────────────

const KIDS: SeatexProduct[] = [
  makeSeatexProduct('Kiddo Master', 'kiddo-master', "Kids plastic study table. Designed for young learners with ample surface area and child-safe edges.", 'Kids', SEATEX_STANDARD_COLORS),
  makeSeatexProduct('Kiddo Junior', 'kiddo-junior', "Kids plastic table. Compact and colourful — perfect for play, drawing, and light activities.", 'Kids', SEATEX_STANDARD_COLORS),
  makeSeatexProduct('Kinder', 'kinder-kids', "Kids plastic chair. Small, colourful, and safe — designed specifically for children.", 'Kids', SEATEX_STANDARD_COLORS),
]

// ── Collection → Products mapping ───────────────────────────────────────────

const COLLECTION_MAP: Record<string, SeatexProduct[]> = {
  'chairs-standard': CHAIRS_STANDARD,
  'chairs-premium': CHAIRS_PREMIUM,
  'tables': TABLES,
  'stools': STOOLS,
  'kids': KIDS,
}

// ── Public API (mirrors Nilkamal's fetch functions) ─────────────────────────

/** Fetch products for a specific collection (returns hardcoded data) */
export async function fetchSeatexCollection(handle: string): Promise<SeatexProduct[]> {
  // Simulate async to match Nilkamal's interface
  return COLLECTION_MAP[handle] || []
}

/** Fetch a single product by handle from a specific collection */
export async function fetchSeatexProduct(
  collectionHandle: string,
  productHandle: string,
): Promise<SeatexProduct | null> {
  const products = COLLECTION_MAP[collectionHandle] || []
  return products.find((p) => p.handle === productHandle) || null
}

/** Get collection info by handle */
export function getSeatexCollection(handle: string): SeatexCategory | undefined {
  return SEATEX_COLLECTIONS.find((c) => c.handle === handle)
}

/** Clean product title — remove "Seatex" prefix */
export function cleanSeatexTitle(title: string): string {
  return title
    .replace(/^Seatex\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Strip HTML tags from body_html */
export function stripSeatexHtml(html: string): string {
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
