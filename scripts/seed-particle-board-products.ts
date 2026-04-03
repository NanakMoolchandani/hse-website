/**
 * Seed Particle Board Products into Supabase
 *
 * This script:
 * 1. Searches Pexels for high-quality, brand-free product images
 * 2. Downloads images and uploads them to Supabase Storage
 * 3. Creates product records in catalog_products table
 *
 * Usage:
 *   PEXELS_API_KEY=<your-key> npx tsx scripts/seed-particle-board-products.ts
 *
 * Get a free Pexels API key at: https://www.pexels.com/api/new/
 *
 * Or to skip Pexels and use placeholder images:
 *   npx tsx scripts/seed-particle-board-products.ts --no-pexels
 */

import { createClient } from '@supabase/supabase-js'
import https from 'https'
import { Buffer } from 'buffer'

// ── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://kwxkapanfkviibxjhgps.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzEyMDYwMywiZXhwIjoyMDg4Njk2NjAzfQ.K4qLj9niaFNHgfURLIGbTVEsrBuRt8LmH5bbg6M_pv0'
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || ''
const SKIP_PEXELS = process.argv.includes('--no-pexels')
const STORAGE_BUCKET = 'catalog'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── Product Definitions ─────────────────────────────────────────────────────

interface ProductDef {
  name: string
  slug: string
  category: string
  description: string
  descriptionHindi: string
  pexelsQuery: string
  features: { icon: string; label: string; detail: string }[]
  materials: string[]
  colors: { name: string; hex: string }[]
}

const PRODUCTS: ProductDef[] = [
  // ── WARDROBES & ALMIRAHS ──────────────────────────────────────────
  {
    name: 'Single Door Wardrobe',
    slug: 'single-door-wardrobe',
    category: 'WARDROBES_ALMIRAHS',
    description: 'Compact single-door wardrobe with hanging rail, shelves and a lockable door. Ideal for small bedrooms, guest rooms and PG accommodations.',
    descriptionHindi: 'छोटे कमरों के लिए सिंगल डोर वार्डरोब — हैंगिंग रॉड, शेल्व्ज़ और लॉक के साथ।',
    pexelsQuery: 'single door wardrobe wooden',
    features: [
      { icon: '🚪', label: 'Single Door', detail: 'Full-height door with 270° hinge' },
      { icon: '👔', label: 'Hanging Rail', detail: 'Stainless steel rail for 20+ garments' },
      { icon: '📦', label: 'Internal Shelves', detail: '3 adjustable shelves for folded clothes' },
      { icon: '🔒', label: 'Lockable', detail: 'Built-in lock for security' },
    ],
    materials: ['Pre-Laminated Particle Board (PLPB)', 'PVC Edge Banding', 'SS Hanging Rail'],
    colors: [
      { name: 'Classic Walnut', hex: '#5C3D2E' },
      { name: 'Ivory White', hex: '#FFFFF0' },
      { name: 'Salem Teak', hex: '#8B6914' },
    ],
  },
  {
    name: 'Double Door Wardrobe',
    slug: 'double-door-wardrobe',
    category: 'WARDROBES_ALMIRAHS',
    description: 'Spacious double-door wardrobe with dual hanging sections, internal drawers and adjustable shelves. Pre-laminated particle board construction with soft-close hinges.',
    descriptionHindi: 'दो दरवाजे वाला वार्डरोब — डबल हैंगिंग सेक्शन, ड्रॉअर और सॉफ्ट-क्लोज़ हिंज।',
    pexelsQuery: 'double door wardrobe bedroom',
    features: [
      { icon: '🚪', label: 'Double Door', detail: 'Two full-height doors with soft-close hinges' },
      { icon: '👔', label: 'Dual Hanging', detail: 'Separate long and short hanging sections' },
      { icon: '🗄️', label: 'Internal Drawers', detail: '2 built-in drawers for small items' },
      { icon: '📐', label: 'Adjustable Shelves', detail: '4 repositionable shelves' },
    ],
    materials: ['Pre-Laminated Particle Board (PLPB)', 'Soft-Close Hinges', 'PVC Edge Banding'],
    colors: [
      { name: 'Classic Walnut', hex: '#5C3D2E' },
      { name: 'Wenge', hex: '#3C2415' },
      { name: 'Oak', hex: '#C8A951' },
      { name: 'White', hex: '#FFFFFF' },
    ],
  },
  {
    name: 'Sliding Door Wardrobe',
    slug: 'sliding-door-wardrobe',
    category: 'WARDROBES_ALMIRAHS',
    description: 'Space-saving sliding door wardrobe — no swing clearance needed. Smooth aluminium track, full-width hanging and shelf compartments.',
    descriptionHindi: 'स्लाइडिंग डोर वार्डरोब — कम जगह में ज़्यादा स्टोरेज, एल्यूमिनियम ट्रैक।',
    pexelsQuery: 'sliding wardrobe modern bedroom',
    features: [
      { icon: '↔️', label: 'Sliding Doors', detail: 'Smooth aluminium track system, no swing space needed' },
      { icon: '📏', label: 'Full Width', detail: '5-6 feet wide for maximum storage' },
      { icon: '🪞', label: 'Mirror Option', detail: 'Available with full-length mirror on door' },
      { icon: '🏗️', label: 'Heavy Duty', detail: 'Load-bearing shelves up to 25 kg each' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Aluminium Track & Rollers', 'Optional Mirror Panel'],
    colors: [
      { name: 'Frosty White', hex: '#F0F0F0' },
      { name: 'Dark Walnut', hex: '#3E2723' },
      { name: 'Sonoma Oak', hex: '#C4A35A' },
    ],
  },
  {
    name: 'Wardrobe with Mirror',
    slug: 'wardrobe-with-mirror',
    category: 'WARDROBES_ALMIRAHS',
    description: 'Double-door wardrobe with a full-length mirror on one door. Combines dressing convenience with ample storage in one unit.',
    descriptionHindi: 'फुल-लेंथ मिरर वाला वार्डरोब — ड्रेसिंग और स्टोरेज एक साथ।',
    pexelsQuery: 'wardrobe mirror bedroom furniture',
    features: [
      { icon: '🪞', label: 'Full-Length Mirror', detail: 'Integrated mirror on door panel' },
      { icon: '👔', label: 'Hanging Section', detail: 'Full-height hanging with top shelf' },
      { icon: '📦', label: 'Shelf Side', detail: '5 shelves for folded garments' },
      { icon: '🔒', label: 'Lockable', detail: 'Key lock on both doors' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Bevelled Mirror Glass', 'PVC Edge Banding'],
    colors: [
      { name: 'Classic Walnut', hex: '#5C3D2E' },
      { name: 'White Marble', hex: '#F5F5F5' },
      { name: 'Honey Oak', hex: '#D4A84B' },
    ],
  },
  {
    name: 'Triple Door Wardrobe with Loft',
    slug: 'triple-door-wardrobe-loft',
    category: 'WARDROBES_ALMIRAHS',
    description: 'Large 3-door wardrobe with overhead loft storage. Separate hanging, shelf and drawer sections. Floor-to-ceiling storage solution.',
    descriptionHindi: 'तीन दरवाजे का वार्डरोब + लॉफ्ट — फ्लोर से सीलिंग तक स्टोरेज।',
    pexelsQuery: 'large wardrobe three door bedroom',
    features: [
      { icon: '🚪', label: 'Three Doors', detail: 'Wide 3-door design for easy access' },
      { icon: '🔝', label: 'Loft Storage', detail: 'Overhead compartment for seasonal items' },
      { icon: '🗄️', label: 'Built-in Drawers', detail: '3 internal drawers for accessories' },
      { icon: '📏', label: 'Floor to Ceiling', detail: '7.5 ft height maximizes vertical space' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Heavy-Duty Hinges', 'PVC Edge Banding', 'SS Handles'],
    colors: [
      { name: 'Classic Walnut', hex: '#5C3D2E' },
      { name: 'Wenge', hex: '#3C2415' },
      { name: 'Saxon Oak', hex: '#B8956A' },
    ],
  },

  // ── TV UNITS ──────────────────────────────────────────────────────
  {
    name: 'Floor Standing TV Unit',
    slug: 'floor-standing-tv-unit',
    category: 'TV_UNITS',
    description: 'Modern floor-standing TV unit with open shelves and cable management. Fits TVs up to 55 inches. Clean-line design in pre-laminated board.',
    descriptionHindi: 'फ्लोर-स्टैंडिंग TV यूनिट — 55 इंच तक के TV के लिए, केबल मैनेजमेंट के साथ।',
    pexelsQuery: 'modern tv stand living room wooden',
    features: [
      { icon: '📺', label: 'TV Support', detail: 'Supports TVs up to 55" / 40 kg' },
      { icon: '🔌', label: 'Cable Management', detail: 'Rear cable routing holes' },
      { icon: '📦', label: 'Open Shelves', detail: '2 open shelves for set-top box and speakers' },
      { icon: '🗄️', label: 'Storage Drawers', detail: '2 soft-close drawers for remotes and accessories' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Soft-Close Drawer Slides', 'PVC Edge Banding'],
    colors: [
      { name: 'Dark Walnut', hex: '#3E2723' },
      { name: 'White & Oak', hex: '#F5E6CA' },
      { name: 'Wenge', hex: '#3C2415' },
    ],
  },
  {
    name: 'Wall Mounted TV Panel',
    slug: 'wall-mounted-tv-panel',
    category: 'TV_UNITS',
    description: 'Sleek wall-mounted TV back panel with floating shelf. Conceals all cables for a clean, modern look. Easy wall installation.',
    descriptionHindi: 'वॉल-माउंटेड TV पैनल — सभी केबल छिपाता है, मॉडर्न लुक।',
    pexelsQuery: 'wall mounted tv panel modern living room',
    features: [
      { icon: '🖼️', label: 'Back Panel', detail: 'Full accent panel behind TV' },
      { icon: '🔌', label: 'Hidden Cables', detail: 'Concealed cable routing channel' },
      { icon: '📦', label: 'Floating Shelf', detail: 'Attached shelf for set-top box' },
      { icon: '💡', label: 'LED Ready', detail: 'Optional LED strip groove for ambient lighting' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Wall Mounting Hardware', 'Cable Channel'],
    colors: [
      { name: 'Charcoal Grey', hex: '#36454F' },
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'White', hex: '#FFFFFF' },
    ],
  },
  {
    name: 'TV Unit with Drawers & Shelves',
    slug: 'tv-unit-drawers-shelves',
    category: 'TV_UNITS',
    description: 'Entertainment unit combining open display shelves with closed drawer storage. Perfect for organizing media, books and décor.',
    descriptionHindi: 'ड्रॉअर + शेल्व्ज़ वाला TV यूनिट — मीडिया और डेकोर के लिए परफेक्ट।',
    pexelsQuery: 'tv cabinet drawers shelves wooden',
    features: [
      { icon: '📺', label: 'Wide Top', detail: 'Supports TVs up to 65"' },
      { icon: '🗄️', label: '4 Drawers', detail: 'Soft-close drawers for organized storage' },
      { icon: '📦', label: 'Open Niches', detail: '3 open compartments for display' },
      { icon: '📏', label: 'Low Profile', detail: 'Modern low-height design (45 cm)' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Soft-Close Slides', 'PVC Edge Banding', 'SS Handles'],
    colors: [
      { name: 'Walnut & White', hex: '#5C3D2E' },
      { name: 'Wenge', hex: '#3C2415' },
      { name: 'Sonoma Oak', hex: '#C4A35A' },
    ],
  },
  {
    name: 'Corner TV Unit',
    slug: 'corner-tv-unit',
    category: 'TV_UNITS',
    description: 'Space-efficient corner TV unit that fits snugly into room corners. Multiple shelves and a triangular design maximize unused corner space.',
    descriptionHindi: 'कॉर्नर TV यूनिट — कोने की जगह का बेहतर इस्तेमाल।',
    pexelsQuery: 'corner tv stand wooden furniture',
    features: [
      { icon: '📐', label: 'Corner Design', detail: 'Triangular shape fits 90° corners' },
      { icon: '📺', label: 'TV Support', detail: 'Fits TVs up to 50"' },
      { icon: '📦', label: '3 Shelves', detail: 'Open shelves for devices and décor' },
      { icon: '🏠', label: 'Space Saver', detail: 'Utilizes otherwise wasted corner space' },
    ],
    materials: ['Pre-Laminated Particle Board', 'PVC Edge Banding'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Oak', hex: '#C8A951' },
      { name: 'White', hex: '#FFFFFF' },
    ],
  },
  {
    name: 'Entertainment Wall Unit',
    slug: 'entertainment-wall-unit',
    category: 'TV_UNITS',
    description: 'Full wall entertainment unit with TV panel, side towers, display shelves, cabinets and LED-ready backpanel. Statement piece for the living room.',
    descriptionHindi: 'पूरी दीवार का एंटरटेनमेंट यूनिट — TV पैनल, शोकेस, कैबिनेट सब एक में।',
    pexelsQuery: 'entertainment wall unit living room modern',
    features: [
      { icon: '🏗️', label: 'Full Wall', detail: '8-10 ft wide modular wall system' },
      { icon: '📺', label: 'Central TV Panel', detail: 'Integrated TV mounting area' },
      { icon: '🗄️', label: 'Side Towers', detail: 'Glass-door display on sides' },
      { icon: '💡', label: 'LED Lighting', detail: 'Built-in LED strip grooves' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Glass Panels', 'LED Strip Channels', 'SS Handles'],
    colors: [
      { name: 'Dark Walnut', hex: '#3E2723' },
      { name: 'Grey & White', hex: '#B0B0B0' },
      { name: 'Wenge & Cream', hex: '#3C2415' },
    ],
  },

  // ── STUDY & COMPUTER TABLES ───────────────────────────────────────
  {
    name: 'Simple Study Table',
    slug: 'simple-study-table',
    category: 'STUDY_COMPUTER_TABLES',
    description: 'Clean, minimal study table with a single drawer. Sturdy particle board top with rounded PVC edges. Perfect for students and home offices.',
    descriptionHindi: 'सिंपल स्टडी टेबल — ड्रॉअर के साथ, स्टूडेंट्स और होम ऑफिस के लिए।',
    pexelsQuery: 'simple wooden study table minimal',
    features: [
      { icon: '📏', label: 'Spacious Top', detail: '120 × 60 cm work surface' },
      { icon: '🗄️', label: 'Drawer', detail: 'Single drawer for stationery' },
      { icon: '🏗️', label: 'Sturdy Build', detail: '25 kg load capacity' },
      { icon: '✨', label: 'Rounded Edges', detail: 'PVC edge banding, child-safe' },
    ],
    materials: ['Pre-Laminated Particle Board', 'PVC Edge Banding', 'Metal Drawer Slides'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Oak', hex: '#C8A951' },
    ],
  },
  {
    name: 'Study Table with Bookshelf',
    slug: 'study-table-with-bookshelf',
    category: 'STUDY_COMPUTER_TABLES',
    description: 'All-in-one study table with integrated upper bookshelf. Keeps books, files and supplies within arm\'s reach. Great for small rooms.',
    descriptionHindi: 'बुकशेल्फ़ वाला स्टडी टेबल — किताबें और सामान हाथ की पहुँच में।',
    pexelsQuery: 'study table bookshelf combined wooden',
    features: [
      { icon: '📚', label: 'Built-in Shelf', detail: '3-tier bookshelf above desk' },
      { icon: '📏', label: 'Work Surface', detail: '100 × 55 cm writing area' },
      { icon: '🗄️', label: 'Storage', detail: 'Drawer + open shelf below desk' },
      { icon: '🏠', label: 'Space Efficient', detail: 'Combines desk and bookshelf in one footprint' },
    ],
    materials: ['Pre-Laminated Particle Board', 'PVC Edge Banding', 'SS Connectors'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Wenge & White', hex: '#3C2415' },
      { name: 'Oak', hex: '#C8A951' },
    ],
  },
  {
    name: 'Computer Table with Keyboard Tray',
    slug: 'computer-table-keyboard-tray',
    category: 'STUDY_COMPUTER_TABLES',
    description: 'Dedicated computer workstation with pull-out keyboard tray, CPU stand and cable management. Ergonomic design for long work sessions.',
    descriptionHindi: 'कीबोर्ड ट्रे और CPU स्टैंड वाला कंप्यूटर टेबल — लंबे काम के लिए।',
    pexelsQuery: 'computer desk keyboard tray wooden',
    features: [
      { icon: '⌨️', label: 'Keyboard Tray', detail: 'Slide-out tray on ball-bearing slides' },
      { icon: '🖥️', label: 'CPU Stand', detail: 'Ventilated CPU platform' },
      { icon: '🔌', label: 'Cable Management', detail: 'Grommet holes and rear cable tray' },
      { icon: '📏', label: 'Monitor Space', detail: 'Fits dual monitors up to 27"' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Ball-Bearing Slides', 'Cable Grommets'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Grey Oak', hex: '#9E9E9E' },
    ],
  },
  {
    name: 'L-Shaped Corner Desk',
    slug: 'l-shaped-corner-desk',
    category: 'STUDY_COMPUTER_TABLES',
    description: 'L-shaped desk that fits into corners, doubling your workspace. One side for the computer, the other for writing or reference materials.',
    descriptionHindi: 'L-शेप कॉर्नर डेस्क — कोने की जगह का पूरा इस्तेमाल, डबल वर्कस्पेस।',
    pexelsQuery: 'L shaped desk corner wooden modern',
    features: [
      { icon: '📐', label: 'L-Shape', detail: '150 × 120 cm total work surface' },
      { icon: '📏', label: 'Corner Fit', detail: 'Designed for room corners' },
      { icon: '🗄️', label: 'Drawers', detail: '3 drawers on pedestal side' },
      { icon: '🔌', label: 'Cable Holes', detail: 'Built-in cable grommets' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Metal Drawer Slides', 'PVC Edge Banding'],
    colors: [
      { name: 'Dark Walnut', hex: '#3E2723' },
      { name: 'White & Oak', hex: '#F5E6CA' },
      { name: 'Wenge', hex: '#3C2415' },
    ],
  },
  {
    name: 'Wall-Mounted Folding Study Table',
    slug: 'wall-mounted-folding-table',
    category: 'STUDY_COMPUTER_TABLES',
    description: 'Space-saving wall-mounted table that folds flat when not in use. Perfect for small apartments, kitchens and utility areas.',
    descriptionHindi: 'फोल्डिंग वॉल-माउंटेड टेबल — इस्तेमाल के बाद मोड़कर दीवार से लगाएं।',
    pexelsQuery: 'wall mounted folding desk small apartment',
    features: [
      { icon: '📐', label: 'Folds Flat', detail: 'Only 5 cm when folded against wall' },
      { icon: '📏', label: 'Work Surface', detail: '80 × 50 cm when open' },
      { icon: '🏗️', label: 'Wall Mount', detail: 'Heavy-duty wall brackets included' },
      { icon: '🏠', label: 'Multi-Use', detail: 'Study desk, kitchen counter, ironing table' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Steel Folding Brackets', 'Wall Hardware'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Oak', hex: '#C8A951' },
    ],
  },

  // ── BOOKSHELVES & DISPLAY ─────────────────────────────────────────
  {
    name: 'Open Bookshelf 5-Tier',
    slug: 'open-bookshelf-5-tier',
    category: 'BOOKSHELVES_DISPLAY',
    description: '5-tier open bookshelf with no back panel for a modern, airy look. Each shelf supports up to 20 kg. Versatile for books, plants and décor.',
    descriptionHindi: '5 शेल्फ वाला ओपन बुकशेल्फ — किताबें, प्लांट्स, डेकोर सबके लिए।',
    pexelsQuery: 'open bookshelf five tier wooden modern',
    features: [
      { icon: '📚', label: '5 Tiers', detail: 'Each shelf: 80 × 30 cm, 20 kg capacity' },
      { icon: '🌿', label: 'Open Design', detail: 'No back panel, visible from both sides' },
      { icon: '🏗️', label: 'Anti-Tip', detail: 'Wall anchor kit included' },
      { icon: '📐', label: 'Compact', detail: '80 × 30 × 180 cm (W × D × H)' },
    ],
    materials: ['Pre-Laminated Particle Board', 'PVC Edge Banding', 'Wall Anchor Kit'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Oak', hex: '#C8A951' },
    ],
  },
  {
    name: 'Bookshelf with Glass Doors',
    slug: 'bookshelf-glass-doors',
    category: 'BOOKSHELVES_DISPLAY',
    description: 'Elegant bookshelf with glass doors to keep books dust-free. Display your collection while protecting it. Magnetic catches for easy access.',
    descriptionHindi: 'ग्लास डोर बुकशेल्फ — किताबें धूल से सुरक्षित, दिखें भी।',
    pexelsQuery: 'bookshelf glass doors display cabinet',
    features: [
      { icon: '🪟', label: 'Glass Doors', detail: 'Tempered glass with magnetic catches' },
      { icon: '📚', label: '4 Shelves', detail: 'Adjustable-height shelves' },
      { icon: '🔒', label: 'Lockable', detail: 'Optional key lock' },
      { icon: '✨', label: 'Dust-Free', detail: 'Sealed doors keep contents clean' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Tempered Glass', 'Magnetic Catches', 'PVC Edge Banding'],
    colors: [
      { name: 'Dark Walnut', hex: '#3E2723' },
      { name: 'Wenge', hex: '#3C2415' },
      { name: 'White', hex: '#FFFFFF' },
    ],
  },
  {
    name: 'Cube Storage Bookshelf',
    slug: 'cube-storage-bookshelf',
    category: 'BOOKSHELVES_DISPLAY',
    description: '9-cube (3×3) grid bookshelf for books, bins and display items. Modular design — stack or arrange horizontally. Works as a room divider too.',
    descriptionHindi: '9-क्यूब ग्रिड बुकशेल्फ — बुक्स, बिन्स, डिस्प्ले सबके लिए। रूम डिवाइडर भी।',
    pexelsQuery: 'cube grid bookshelf storage organizer',
    features: [
      { icon: '🟧', label: '9 Cubes', detail: '3×3 grid, each cube 33 × 33 cm' },
      { icon: '🔄', label: 'Modular', detail: 'Use vertical or horizontal' },
      { icon: '🏠', label: 'Room Divider', detail: 'Open from both sides' },
      { icon: '📦', label: 'Bin Compatible', detail: 'Fits standard storage bins' },
    ],
    materials: ['Pre-Laminated Particle Board', 'PVC Edge Banding', 'Cam & Dowel Assembly'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Oak & White', hex: '#C8A951' },
    ],
  },
  {
    name: 'Ladder Bookshelf',
    slug: 'ladder-bookshelf',
    category: 'BOOKSHELVES_DISPLAY',
    description: 'Trendy ladder-style bookshelf with 4 progressively wider shelves. Leans against the wall for a casual, modern aesthetic.',
    descriptionHindi: 'लैडर स्टाइल बुकशेल्फ — 4 शेल्व्ज़, दीवार से टिकाकर रखें, मॉडर्न लुक।',
    pexelsQuery: 'ladder bookshelf leaning wall modern',
    features: [
      { icon: '🪜', label: 'Ladder Design', detail: 'A-frame leaning style' },
      { icon: '📚', label: '4 Shelves', detail: 'Progressively wider from top to bottom' },
      { icon: '🏗️', label: 'Wall Support', detail: 'Anti-slip pads + wall anchor' },
      { icon: '✨', label: 'Decorative', detail: 'Great for plants, frames and books' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Anti-Slip Rubber Pads', 'PVC Edge Banding'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Natural Oak', hex: '#D2B48C' },
    ],
  },
  {
    name: 'Wall-Mounted Display Shelf Set',
    slug: 'wall-mounted-display-shelves',
    category: 'BOOKSHELVES_DISPLAY',
    description: 'Set of 3 floating wall shelves in graduated sizes. Easy installation with concealed brackets. Display photos, trophies and small plants.',
    descriptionHindi: '3 फ्लोटिंग वॉल शेल्व्ज़ का सेट — फोटो, ट्रॉफी, प्लांट्स के लिए।',
    pexelsQuery: 'floating wall shelves set wooden modern',
    features: [
      { icon: '🖼️', label: 'Set of 3', detail: 'Small (40 cm), Medium (60 cm), Large (80 cm)' },
      { icon: '🏗️', label: 'Floating', detail: 'Concealed bracket mounting system' },
      { icon: '📏', label: 'Load', detail: 'Each shelf supports up to 10 kg' },
      { icon: '✨', label: 'Easy Install', detail: 'All hardware and template included' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Concealed Metal Brackets', 'Wall Plugs'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
  },

  // ── SHOE RACKS ────────────────────────────────────────────────────
  {
    name: 'Open Shoe Rack 4-Tier',
    slug: 'open-shoe-rack-4-tier',
    category: 'SHOE_RACKS',
    description: 'Simple 4-tier open shoe rack for daily footwear. Angled shelves let you see all pairs at a glance. Holds 12-16 pairs.',
    descriptionHindi: '4 टियर ओपन शू रैक — 12-16 जोड़ी जूते, एक नज़र में दिखें।',
    pexelsQuery: 'open shoe rack tier wooden entryway',
    features: [
      { icon: '👟', label: '4 Tiers', detail: 'Holds 12-16 pairs of shoes' },
      { icon: '📐', label: 'Angled', detail: 'Tilted shelves for easy visibility' },
      { icon: '🌬️', label: 'Ventilated', detail: 'Open design for air circulation' },
      { icon: '📏', label: 'Compact', detail: '60 × 30 × 80 cm' },
    ],
    materials: ['Pre-Laminated Particle Board', 'PVC Edge Banding'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Wenge', hex: '#3C2415' },
    ],
  },
  {
    name: 'Shoe Cabinet with Flip-Down Doors',
    slug: 'shoe-cabinet-flip-down',
    category: 'SHOE_RACKS',
    description: 'Slim shoe cabinet with 2 flip-down compartments. Keeps shoes hidden and your entryway neat. Only 17 cm deep — fits narrow hallways.',
    descriptionHindi: 'फ्लिप-डाउन शू कैबिनेट — जूते छिपे रहें, एंट्रीवे साफ दिखे। सिर्फ 17cm गहरा।',
    pexelsQuery: 'slim shoe cabinet flip door narrow hallway',
    features: [
      { icon: '🚪', label: 'Flip-Down Doors', detail: '2 tilting compartments' },
      { icon: '📏', label: 'Ultra Slim', detail: 'Only 17 cm deep, fits narrow hallways' },
      { icon: '👟', label: 'Capacity', detail: 'Holds 12 pairs' },
      { icon: '✨', label: 'Clean Look', detail: 'Concealed storage, sleek exterior' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Metal Flip Mechanism', 'PVC Edge Banding'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Oak', hex: '#C8A951' },
    ],
  },
  {
    name: 'Shoe Rack with Seating Bench',
    slug: 'shoe-rack-bench',
    category: 'SHOE_RACKS',
    description: 'Shoe rack with a cushioned seating bench on top. Sit down to put on shoes comfortably. Open shelves below for 8-12 pairs.',
    descriptionHindi: 'सीटिंग बेंच वाला शू रैक — बैठकर जूते पहनें, नीचे शेल्व्ज़ में रखें।',
    pexelsQuery: 'shoe bench entryway seating storage',
    features: [
      { icon: '🪑', label: 'Bench Seat', detail: 'Cushioned top with upholstery' },
      { icon: '👟', label: '2 Shelves', detail: 'Fits 8-12 pairs below seat' },
      { icon: '🏗️', label: 'Sturdy', detail: 'Supports up to 120 kg seating weight' },
      { icon: '📏', label: 'Comfortable Height', detail: '45 cm seat height' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Foam Cushion', 'Fabric/Leatherette Top'],
    colors: [
      { name: 'Walnut + Beige Cushion', hex: '#5C3D2E' },
      { name: 'White + Grey Cushion', hex: '#FFFFFF' },
      { name: 'Oak + Brown Cushion', hex: '#C8A951' },
    ],
  },
  {
    name: 'Tall Shoe Cabinet with Doors',
    slug: 'tall-shoe-cabinet',
    category: 'SHOE_RACKS',
    description: 'Tall closed shoe cabinet with shelves behind doors. Keeps 20-24 pairs organized and hidden. Top surface doubles as a display area.',
    descriptionHindi: 'टॉल शू कैबिनेट — 20-24 जोड़ी जूते बंद दरवाजों के पीछे, ऊपर डिस्प्ले।',
    pexelsQuery: 'tall shoe storage cabinet closed doors',
    features: [
      { icon: '🚪', label: 'Closed Doors', detail: 'Double doors hide contents' },
      { icon: '👟', label: 'High Capacity', detail: '6 shelves, 20-24 pairs' },
      { icon: '📐', label: 'Adjustable', detail: 'Removable shelves for boots' },
      { icon: '🔝', label: 'Display Top', detail: 'Flat top for keys, wallet, flowers' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Soft-Close Hinges', 'PVC Edge Banding'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Wenge', hex: '#3C2415' },
    ],
  },

  // ── KITCHEN & PANTRY ──────────────────────────────────────────────
  {
    name: 'Kitchen Trolley Cart',
    slug: 'kitchen-trolley-cart',
    category: 'KITCHEN_PANTRY',
    description: 'Mobile kitchen trolley with shelves, drawer and wheels. Roll it wherever you need extra counter space. Locking casters prevent rolling.',
    descriptionHindi: 'मोबाइल किचन ट्रॉली — पहियों पर, कहीं भी ले जाएं, एक्स्ट्रा काउंटर स्पेस।',
    pexelsQuery: 'kitchen trolley cart wheels wooden',
    features: [
      { icon: '🛒', label: 'Mobile', detail: '4 casters, 2 with brakes' },
      { icon: '📦', label: '3 Tiers', detail: 'Top shelf + 2 lower shelves' },
      { icon: '🗄️', label: 'Drawer', detail: 'Pull-out drawer for utensils' },
      { icon: '📏', label: 'Compact', detail: '60 × 40 × 85 cm' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Locking Casters', 'Metal Drawer Slides'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Oak', hex: '#C8A951' },
    ],
  },
  {
    name: 'Microwave & Oven Stand',
    slug: 'microwave-oven-stand',
    category: 'KITCHEN_PANTRY',
    description: 'Dedicated stand for microwave/OTG with shelves above and below. Keeps kitchen appliances organized and at convenient height.',
    descriptionHindi: 'माइक्रोवेव/OTG स्टैंड — ऊपर-नीचे शेल्व्ज़ के साथ, किचन ऑर्गनाइज़्ड रखें।',
    pexelsQuery: 'microwave stand kitchen wooden shelf',
    features: [
      { icon: '📦', label: 'Appliance Shelf', detail: 'Main shelf supports up to 30 kg' },
      { icon: '🔌', label: 'Power Access', detail: 'Rear cutout for power cords' },
      { icon: '📐', label: 'Multi-Level', detail: '3 shelves for different appliances' },
      { icon: '🏗️', label: 'Sturdy', detail: 'Reinforced structure for heavy appliances' },
    ],
    materials: ['Pre-Laminated Particle Board', 'PVC Edge Banding', 'Metal Reinforcement'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Oak', hex: '#C8A951' },
    ],
  },
  {
    name: 'Crockery Unit with Glass Doors',
    slug: 'crockery-unit-glass-doors',
    category: 'KITCHEN_PANTRY',
    description: 'Elegant crockery display unit with glass doors on top and closed storage below. Showcase your best dinnerware while keeping the rest organized.',
    descriptionHindi: 'क्रॉकरी यूनिट — ऊपर ग्लास डोर डिस्प्ले, नीचे बंद स्टोरेज।',
    pexelsQuery: 'crockery cabinet display glass doors kitchen',
    features: [
      { icon: '🪟', label: 'Glass Display', detail: 'Upper section with tempered glass doors' },
      { icon: '🗄️', label: 'Closed Storage', detail: 'Lower section with solid doors' },
      { icon: '📦', label: 'Adjustable Shelves', detail: '3 adjustable shelves in each section' },
      { icon: '📏', label: 'Dimensions', detail: '90 × 40 × 180 cm' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Tempered Glass', 'Soft-Close Hinges'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Wenge & Cream', hex: '#3C2415' },
    ],
  },
  {
    name: 'Pantry Tall Storage Unit',
    slug: 'pantry-tall-storage-unit',
    category: 'KITCHEN_PANTRY',
    description: 'Floor-to-ceiling pantry unit with multiple shelves for groceries, grains and kitchen supplies. Doors keep everything dust-free.',
    descriptionHindi: 'पैंट्री टॉल यूनिट — किराना, अनाज, किचन सामान सब एक जगह।',
    pexelsQuery: 'pantry storage unit tall kitchen wooden',
    features: [
      { icon: '📏', label: 'Tall Unit', detail: '60 × 40 × 200 cm' },
      { icon: '📦', label: '6 Shelves', detail: 'Adjustable shelves for different heights' },
      { icon: '🚪', label: 'Closed Doors', detail: 'Double doors for dust-free storage' },
      { icon: '🏗️', label: 'Heavy Duty', detail: 'Each shelf holds up to 20 kg' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Heavy-Duty Hinges', 'Adjustable Shelf Pins'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Light Oak', hex: '#D2B48C' },
    ],
  },

  // ── BEDROOM FURNITURE ─────────────────────────────────────────────
  {
    name: 'Queen Bed with Hydraulic Storage',
    slug: 'queen-bed-hydraulic-storage',
    category: 'BEDROOM_FURNITURE',
    description: 'Queen-size bed (5×6.5 ft) with hydraulic lift-up storage under the mattress. Massive under-bed space for blankets, suitcases and seasonal items.',
    descriptionHindi: 'क्वीन बेड हाइड्रोलिक स्टोरेज — गद्दे के नीचे बड़ा स्टोरेज, ब्लैंकेट/सूटकेस के लिए।',
    pexelsQuery: 'bed storage hydraulic lift modern bedroom',
    features: [
      { icon: '🛏️', label: 'Queen Size', detail: '5 × 6.5 ft mattress area' },
      { icon: '📦', label: 'Hydraulic Lift', detail: 'Gas-spring mechanism, effortless lifting' },
      { icon: '🏗️', label: 'Under-Bed Storage', detail: 'Full under-mattress storage cavity' },
      { icon: '✨', label: 'Headboard', detail: 'Elegant panel headboard included' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Hydraulic Gas Springs', 'PVC Edge Banding'],
    colors: [
      { name: 'Classic Walnut', hex: '#5C3D2E' },
      { name: 'Wenge', hex: '#3C2415' },
      { name: 'White & Oak', hex: '#F5E6CA' },
    ],
  },
  {
    name: 'Bedside Table with Drawer',
    slug: 'bedside-table-drawer',
    category: 'BEDROOM_FURNITURE',
    description: 'Compact bedside nightstand with a drawer and open shelf. Keep your phone, books, water bottle and essentials within reach.',
    descriptionHindi: 'बेडसाइड टेबल — ड्रॉअर + ओपन शेल्फ, फ़ोन-किताब-पानी हाथ की पहुँच में।',
    pexelsQuery: 'nightstand bedside table drawer wooden',
    features: [
      { icon: '🗄️', label: 'Drawer', detail: 'Soft-close drawer for personal items' },
      { icon: '📦', label: 'Open Shelf', detail: 'Quick-access shelf for books' },
      { icon: '📏', label: 'Perfect Height', detail: '55 cm matches standard bed height' },
      { icon: '✨', label: 'Flat Top', detail: 'Space for lamp, phone charger' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Soft-Close Slides', 'PVC Edge Banding'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Oak', hex: '#C8A951' },
    ],
  },
  {
    name: 'Chest of Drawers 4-Tier',
    slug: 'chest-of-drawers-4-tier',
    category: 'BEDROOM_FURNITURE',
    description: '4-drawer chest for storing folded clothes, accessories and linen. Wide drawers with smooth slides. Classic bedroom essential.',
    descriptionHindi: '4 ड्रॉअर वाला चेस्ट — कपड़े, एक्सेसरीज़, लिनन रखने के लिए।',
    pexelsQuery: 'chest of drawers wooden bedroom modern',
    features: [
      { icon: '🗄️', label: '4 Drawers', detail: 'Full-extension ball-bearing slides' },
      { icon: '📏', label: 'Wide', detail: '80 × 45 × 100 cm' },
      { icon: '🏗️', label: 'Sturdy', detail: 'Each drawer holds up to 15 kg' },
      { icon: '✨', label: 'Flat Top', detail: 'Display surface for mirror or décor' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Ball-Bearing Slides', 'PVC Edge Banding', 'SS Handles'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Wenge', hex: '#3C2415' },
    ],
  },
  {
    name: 'Diwan Bed with Storage',
    slug: 'diwan-bed-storage',
    category: 'BEDROOM_FURNITURE',
    description: 'Multipurpose diwan-cum-bed with box storage underneath and backrest. Use as a sofa during the day and a single bed at night.',
    descriptionHindi: 'दीवान-कम-बेड — नीचे स्टोरेज, दिन में सोफ़ा, रात में बेड।',
    pexelsQuery: 'diwan sofa bed storage wooden modern',
    features: [
      { icon: '🛋️', label: 'Dual Use', detail: 'Sofa by day, bed by night' },
      { icon: '📦', label: 'Box Storage', detail: 'Full under-seat storage with lift' },
      { icon: '🏗️', label: 'Backrest', detail: 'Comfortable panel backrest' },
      { icon: '📏', label: 'Size', detail: '6 × 3 ft sleeping area' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Gas Springs', 'PVC Edge Banding'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Wenge', hex: '#3C2415' },
      { name: 'Oak', hex: '#C8A951' },
    ],
  },

  // ── DRESSING TABLES ───────────────────────────────────────────────
  {
    name: 'Dressing Table with Mirror & Drawers',
    slug: 'dressing-table-mirror-drawers',
    category: 'DRESSING_TABLES',
    description: 'Classic dressing table with large mirror, 3 drawers and open shelves. Dedicated makeup and grooming station with ample storage.',
    descriptionHindi: 'ड्रेसिंग टेबल — बड़ा मिरर, 3 ड्रॉअर, मेकअप और ग्रूमिंग के लिए।',
    pexelsQuery: 'dressing table mirror drawers bedroom wooden',
    features: [
      { icon: '🪞', label: 'Large Mirror', detail: '60 × 80 cm framed mirror' },
      { icon: '🗄️', label: '3 Drawers', detail: 'Soft-close drawers for cosmetics' },
      { icon: '📦', label: 'Open Shelves', detail: 'Side shelves for daily essentials' },
      { icon: '💡', label: 'LED Ready', detail: 'Groove for LED vanity strip' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Mirror Glass', 'Soft-Close Slides', 'PVC Edge Banding'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Rose & White', hex: '#F4C2C2' },
    ],
  },
  {
    name: 'Wall-Mounted Dressing Unit',
    slug: 'wall-mounted-dressing-unit',
    category: 'DRESSING_TABLES',
    description: 'Space-saving wall-mounted dressing unit with fold-down mirror and hidden storage. Takes zero floor space. Perfect for small bedrooms.',
    descriptionHindi: 'वॉल-माउंटेड ड्रेसिंग यूनिट — मिरर मोड़ें, ज़ीरो फ्लोर स्पेस।',
    pexelsQuery: 'wall mounted vanity mirror bedroom small',
    features: [
      { icon: '🖼️', label: 'Wall Mounted', detail: 'No floor space needed' },
      { icon: '🪞', label: 'Fold-Down Mirror', detail: 'Mirror flips open to reveal storage' },
      { icon: '📦', label: 'Hidden Compartments', detail: 'Shelves behind mirror panel' },
      { icon: '📏', label: 'Compact', detail: '80 × 15 × 60 cm when closed' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Mirror Glass', 'Wall Mounting Kit'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Ivory', hex: '#FFFFF0' },
    ],
  },
  {
    name: 'Dressing Table with Side Shelves',
    slug: 'dressing-table-side-shelves',
    category: 'DRESSING_TABLES',
    description: 'Wide dressing table with open side shelves for bags, perfumes and accessories. Mirror and drawers in the center, shelving on sides.',
    descriptionHindi: 'साइड शेल्व्ज़ वाला ड्रेसिंग टेबल — बैग, परफ्यूम, एक्सेसरीज़ सब जगह।',
    pexelsQuery: 'dressing table shelves vanity bedroom modern',
    features: [
      { icon: '🪞', label: 'Center Mirror', detail: 'Large rectangular mirror' },
      { icon: '📦', label: 'Side Shelves', detail: '4 open shelves on each side' },
      { icon: '🗄️', label: 'Drawers', detail: '2 central drawers' },
      { icon: '📏', label: 'Wide Design', detail: '120 × 40 cm top surface' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Mirror Glass', 'Metal Slides', 'PVC Edge Banding'],
    colors: [
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Wenge & Cream', hex: '#3C2415' },
    ],
  },
  {
    name: 'Dressing Table with Stool',
    slug: 'dressing-table-with-stool',
    category: 'DRESSING_TABLES',
    description: 'Complete dressing set with table, mirror and matching cushioned stool. Everything you need for a comfortable grooming setup.',
    descriptionHindi: 'ड्रेसिंग टेबल + मैचिंग स्टूल — कम्प्लीट ग्रूमिंग सेट।',
    pexelsQuery: 'dressing table stool vanity set bedroom',
    features: [
      { icon: '🪞', label: 'Table + Mirror', detail: 'Hinged tilt mirror' },
      { icon: '🪑', label: 'Matching Stool', detail: 'Cushioned stool with fabric/leatherette' },
      { icon: '🗄️', label: 'Drawers', detail: '2 drawers for cosmetics and tools' },
      { icon: '✨', label: 'Complete Set', detail: 'Ready-to-use coordinated set' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Mirror Glass', 'Foam Cushion', 'Fabric/Leatherette'],
    colors: [
      { name: 'White & Pink', hex: '#FFFFFF' },
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Ivory & Gold', hex: '#FFFFF0' },
    ],
  },

  // ── OFFICE WORKSTATIONS ───────────────────────────────────────────
  {
    name: 'Executive Office Desk',
    slug: 'executive-office-desk',
    category: 'OFFICE_WORKSTATIONS',
    description: 'Professional executive desk with 3-drawer pedestal and cable management. Large work surface for monitor, files and desk accessories.',
    descriptionHindi: 'एग्ज़ीक्यूटिव ऑफ़िस डेस्क — 3 ड्रॉअर पेडस्टल, बड़ा वर्क सरफ़ेस।',
    pexelsQuery: 'executive office desk wooden modern professional',
    features: [
      { icon: '📏', label: 'Large Surface', detail: '150 × 75 cm work area' },
      { icon: '🗄️', label: '3-Drawer Pedestal', detail: 'File drawer + 2 storage drawers' },
      { icon: '🔌', label: 'Cable Management', detail: 'Dual grommet holes for cables' },
      { icon: '🏗️', label: 'Professional', detail: 'Modesty panel and cable tray' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Metal Drawer Slides', 'Cable Grommets', 'PVC Edge Banding'],
    colors: [
      { name: 'Dark Walnut', hex: '#3E2723' },
      { name: 'Wenge', hex: '#3C2415' },
      { name: 'Grey Oak', hex: '#9E9E9E' },
    ],
  },
  {
    name: 'Modular Workstation 2-Seater',
    slug: 'modular-workstation-2-seater',
    category: 'OFFICE_WORKSTATIONS',
    description: 'Linear 2-person workstation with shared divider panel. Individual drawers and cable trays for each seat. Ideal for open-plan offices.',
    descriptionHindi: '2-सीटर मॉड्यूलर वर्कस्टेशन — डिवाइडर पैनल, अलग ड्रॉअर, ओपन-प्लान ऑफिस के लिए।',
    pexelsQuery: 'two person office workstation desk modern',
    features: [
      { icon: '👥', label: '2 Seats', detail: 'Side-by-side or face-to-face layout' },
      { icon: '📏', label: 'Per Seat', detail: '120 × 60 cm per workspace' },
      { icon: '🗄️', label: 'Individual Storage', detail: 'Mobile pedestal for each seat' },
      { icon: '🧱', label: 'Divider Panel', detail: 'Fabric or PLPB partition' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Metal Frame', 'Fabric Divider Panel'],
    colors: [
      { name: 'Light Oak & White', hex: '#D2B48C' },
      { name: 'Grey', hex: '#808080' },
      { name: 'Walnut', hex: '#5C3D2E' },
    ],
  },
  {
    name: '3-Drawer Filing Cabinet',
    slug: 'filing-cabinet-3-drawer',
    category: 'OFFICE_WORKSTATIONS',
    description: 'Compact 3-drawer filing cabinet on casters. Fits under desks. Top drawers for stationery, bottom drawer for A4/legal files.',
    descriptionHindi: '3-ड्रॉअर फ़ाइलिंग कैबिनेट — डेस्क के नीचे फिट, फ़ाइल्स और स्टेशनरी के लिए।',
    pexelsQuery: 'filing cabinet office drawers wheels',
    features: [
      { icon: '🗄️', label: '3 Drawers', detail: '2 small + 1 file-size drawer' },
      { icon: '🔒', label: 'Central Lock', detail: 'One key locks all drawers' },
      { icon: '🛒', label: 'Mobile', detail: 'Casters for easy movement' },
      { icon: '📏', label: 'Under-Desk', detail: 'Fits under standard 75 cm desks' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Metal Slides', 'Central Lock', 'Casters'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Light Oak', hex: '#D2B48C' },
      { name: 'Grey', hex: '#808080' },
    ],
  },
  {
    name: 'Reception Counter',
    slug: 'reception-counter',
    category: 'OFFICE_WORKSTATIONS',
    description: 'Professional reception counter with customer-facing panel and internal storage. Built-in keyboard shelf and monitor space. Brand-worthy first impression.',
    descriptionHindi: 'रिसेप्शन काउंटर — कस्टमर-फ़ेसिंग पैनल, इंटरनल स्टोरेज, प्रोफ़ेशनल लुक।',
    pexelsQuery: 'reception desk counter office modern',
    features: [
      { icon: '🏢', label: 'Professional', detail: 'Dual-height counter design' },
      { icon: '🖥️', label: 'Workstation', detail: 'Internal desk with monitor space' },
      { icon: '🗄️', label: 'Storage', detail: 'Drawers and shelves behind counter' },
      { icon: '📏', label: 'Standard Size', detail: '150 × 60 cm, customizable width' },
    ],
    materials: ['Pre-Laminated Particle Board', 'PVC Edge Banding', 'Cable Grommets'],
    colors: [
      { name: 'Walnut & White', hex: '#5C3D2E' },
      { name: 'Grey & White', hex: '#808080' },
      { name: 'Wenge', hex: '#3C2415' },
    ],
  },

  // ── MODULAR STORAGE ───────────────────────────────────────────────
  {
    name: 'Cube Storage Unit 6-Box',
    slug: 'cube-storage-unit-6-box',
    category: 'MODULAR_STORAGE',
    description: '6-cube (2×3) storage unit for any room. Use with fabric bins, baskets or leave open. Vertical or horizontal placement.',
    descriptionHindi: '6-क्यूब स्टोरेज यूनिट — बिन्स या ओपन, वर्टिकल या हॉरिज़ॉन्टल रखें।',
    pexelsQuery: 'cube storage organizer shelves modern home',
    features: [
      { icon: '🟧', label: '6 Cubes', detail: '2×3 grid layout' },
      { icon: '🔄', label: 'Versatile', detail: 'Use vertical or horizontal' },
      { icon: '📦', label: 'Bin Compatible', detail: 'Standard 33 cm cube bins fit' },
      { icon: '🏠', label: 'Multi-Room', detail: 'Bedroom, living room, kids room' },
    ],
    materials: ['Pre-Laminated Particle Board', 'PVC Edge Banding', 'Cam & Dowel Assembly'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Oak', hex: '#C8A951' },
    ],
  },
  {
    name: 'Multipurpose Storage Cabinet',
    slug: 'multipurpose-storage-cabinet',
    category: 'MODULAR_STORAGE',
    description: 'Versatile closed-door cabinet with adjustable shelves. Store anything — clothes, supplies, tools, groceries. Works in any room.',
    descriptionHindi: 'मल्टीपर्पज़ कैबिनेट — कपड़े, सामान, टूल्स, किराना — कुछ भी रखें।',
    pexelsQuery: 'storage cabinet closed doors multipurpose wooden',
    features: [
      { icon: '🚪', label: 'Double Doors', detail: 'Concealed storage behind doors' },
      { icon: '📦', label: 'Adjustable Shelves', detail: '4 repositionable shelves' },
      { icon: '🔒', label: 'Lockable', detail: 'Key lock for security' },
      { icon: '📏', label: 'Standard Size', detail: '80 × 40 × 180 cm' },
    ],
    materials: ['Pre-Laminated Particle Board', 'Heavy-Duty Hinges', 'Key Lock', 'PVC Edge Banding'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'Wenge', hex: '#3C2415' },
    ],
  },
  {
    name: 'Wall-Mounted Storage Unit',
    slug: 'wall-mounted-storage-unit',
    category: 'MODULAR_STORAGE',
    description: 'Wall-mounted box unit with mix of open cubbies and closed compartments. Saves floor space, adds storage above eye level.',
    descriptionHindi: 'वॉल-माउंटेड स्टोरेज यूनिट — फ्लोर स्पेस बचाएं, दीवार पर स्टोरेज।',
    pexelsQuery: 'wall mounted storage cabinet modern living',
    features: [
      { icon: '🖼️', label: 'Wall Mounted', detail: 'No floor footprint' },
      { icon: '📦', label: 'Mixed Storage', detail: '2 open + 2 closed compartments' },
      { icon: '🏗️', label: 'Secure Mount', detail: 'French cleat mounting system' },
      { icon: '📏', label: 'Size', detail: '120 × 30 × 60 cm' },
    ],
    materials: ['Pre-Laminated Particle Board', 'French Cleat Hardware', 'PVC Edge Banding'],
    colors: [
      { name: 'White & Walnut', hex: '#FFFFFF' },
      { name: 'Grey & White', hex: '#808080' },
      { name: 'Oak', hex: '#C8A951' },
    ],
  },
  {
    name: 'Pooja Unit with Storage',
    slug: 'pooja-unit-storage',
    category: 'MODULAR_STORAGE',
    description: 'Wall-mounted or freestanding pooja mandir unit with dedicated shelf for idols, storage below for pooja items, and LED-ready backpanel.',
    descriptionHindi: 'पूजा मंदिर यूनिट — मूर्ति शेल्फ, पूजा सामान का स्टोरेज, LED बैकपैनल।',
    pexelsQuery: 'pooja mandir unit wooden wall mounted',
    features: [
      { icon: '🛕', label: 'Mandir Shelf', detail: 'Dedicated idol placement area' },
      { icon: '📦', label: 'Storage Below', detail: 'Closed compartment for pooja items' },
      { icon: '💡', label: 'LED Backpanel', detail: 'Groove for warm LED strip lighting' },
      { icon: '🖼️', label: 'Mounting Options', detail: 'Wall-mount or freestanding base' },
    ],
    materials: ['Pre-Laminated Particle Board', 'PVC Edge Banding', 'LED Strip Channel', 'Decorative Moulding'],
    colors: [
      { name: 'Teak', hex: '#8B6914' },
      { name: 'Walnut', hex: '#5C3D2E' },
      { name: 'White & Gold', hex: '#FFFFFF' },
    ],
  },
]

// ── Pexels Image Fetcher ────────────────────────────────────────────────────

async function searchPexels(query: string): Promise<string | null> {
  if (!PEXELS_API_KEY) return null

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=square`

  return new Promise((resolve) => {
    const req = https.request(url, {
      headers: { Authorization: PEXELS_API_KEY },
    }, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          const photos = json.photos || []
          if (photos.length > 0) {
            // Use the medium-sized photo (good balance of quality/size)
            resolve(photos[0].src?.large || photos[0].src?.medium || null)
          } else {
            resolve(null)
          }
        } catch {
          resolve(null)
        }
      })
    })
    req.on('error', () => resolve(null))
    req.end()
  })
}

async function downloadImage(imageUrl: string): Promise<Buffer | null> {
  return new Promise((resolve) => {
    https.get(imageUrl, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        const redirectUrl = res.headers.location
        if (redirectUrl) {
          https.get(redirectUrl, (res2) => {
            const chunks: Buffer[] = []
            res2.on('data', (chunk) => chunks.push(chunk))
            res2.on('end', () => resolve(Buffer.concat(chunks)))
            res2.on('error', () => resolve(null))
          }).on('error', () => resolve(null))
        } else {
          resolve(null)
        }
        return
      }
      const chunks: Buffer[] = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', () => resolve(null))
    }).on('error', () => resolve(null))
  })
}

// ── Main Seed Function ──────────────────────────────────────────────────────

async function main() {
  console.log('=== Particle Board Products Seeder ===\n')

  if (!SKIP_PEXELS && !PEXELS_API_KEY) {
    console.log('⚠️  No PEXELS_API_KEY provided. Products will be created without images.')
    console.log('   Get a free key at: https://www.pexels.com/api/new/')
    console.log('   Then run: PEXELS_API_KEY=<key> npx tsx scripts/seed-particle-board-products.ts')
    console.log('   Or use --no-pexels flag to skip image fetching.\n')
  }

  // Check existing products to avoid duplicates
  const { data: existing } = await supabase
    .from('catalog_products')
    .select('slug')

  const existingSlugs = new Set((existing || []).map((p: { slug: string }) => p.slug))

  let created = 0
  let skipped = 0
  let imagesFetched = 0

  for (const product of PRODUCTS) {
    if (existingSlugs.has(product.slug)) {
      console.log(`  ⏭️  Skipping "${product.name}" (already exists)`)
      skipped++
      continue
    }

    let imageUrl: string | null = null

    // Try to fetch image from Pexels
    if (!SKIP_PEXELS && PEXELS_API_KEY) {
      console.log(`  🔍 Searching Pexels for "${product.pexelsQuery}"...`)
      const pexelsUrl = await searchPexels(product.pexelsQuery)

      if (pexelsUrl) {
        console.log(`  📸 Found image, downloading...`)
        const imageBuffer = await downloadImage(pexelsUrl)

        if (imageBuffer) {
          // Upload to Supabase Storage
          const storagePath = `particle-board/${product.slug}.jpg`
          const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(storagePath, imageBuffer, {
              contentType: 'image/jpeg',
              upsert: true,
            })

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from(STORAGE_BUCKET)
              .getPublicUrl(storagePath)
            imageUrl = urlData.publicUrl
            imagesFetched++
            console.log(`  ✅ Uploaded to storage`)
          } else {
            console.log(`  ⚠️  Upload failed: ${uploadError.message}`)
          }
        }
      } else {
        console.log(`  ⚠️  No Pexels results for query`)
      }

      // Rate limit: Pexels allows 200 req/hr
      await new Promise((r) => setTimeout(r, 500))
    }

    // Insert product
    const { error } = await supabase.from('catalog_products').insert({
      name: product.name,
      slug: product.slug,
      category: product.category,
      description: product.description,
      description_hindi: product.descriptionHindi,
      status: 'PUBLISHED',
      raw_photo_urls: imageUrl ? [imageUrl] : [],
      processed_photo_urls: imageUrl ? [imageUrl] : [],
      metadata: {
        features: product.features,
        materials: product.materials,
        colors: product.colors,
      },
      sort_order: created,
      is_featured: false,
    })

    if (error) {
      console.log(`  ❌ Error inserting "${product.name}": ${error.message}`)
    } else {
      console.log(`  ✅ Created: ${product.name}`)
      created++
    }
  }

  console.log(`\n=== Done ===`)
  console.log(`  Created: ${created}`)
  console.log(`  Skipped (existing): ${skipped}`)
  console.log(`  Images fetched: ${imagesFetched}`)
  console.log(`  Total products defined: ${PRODUCTS.length}`)

  if (!PEXELS_API_KEY && !SKIP_PEXELS) {
    console.log(`\n💡 To add images later, get a Pexels API key and re-run this script.`)
    console.log(`   Existing products will be skipped; only new ones will be created.`)
  }
}

main().catch(console.error)
