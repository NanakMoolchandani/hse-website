#!/usr/bin/env tsx
/**
 * Expanded Particle Board Products Seeder
 *
 * Seeds ~160 new products across 10 categories (20 per category total)
 * and fetches images from Pixabay API.
 *
 * Usage:
 *   PIXABAY_KEY=<your-key> npx tsx scripts/seed-expanded-products.ts
 *
 * Get a FREE Pixabay API key (30 seconds): https://pixabay.com/api/docs/#api_search_images
 *   1. Sign up at pixabay.com
 *   2. Go to https://pixabay.com/api/docs/
 *   3. Your key is shown right on that page
 *
 * Options:
 *   --dry-run     Show what would be created without inserting
 *   --no-images   Skip image fetching, insert products only
 *   --category=X  Only seed a specific category (e.g. --category=TV_UNITS)
 */

import { createClient } from '@supabase/supabase-js'

// ── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://kwxkapanfkviibxjhgps.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzEyMDYwMywiZXhwIjoyMDg4Njk2NjAzfQ.K4qLj9niaFNHgfURLIGbTVEsrBuRt8LmH5bbg6M_pv0'
const PIXABAY_KEY = process.env.PIXABAY_KEY || ''
const DRY_RUN = process.argv.includes('--dry-run')
const NO_IMAGES = process.argv.includes('--no-images')
const CATEGORY_FILTER = process.argv.find(a => a.startsWith('--category='))?.split('=')[1] || ''
const STORAGE_BUCKET = 'catalog'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── Types ───────────────────────────────────────────────────────────────────

interface ProductDef {
  name: string
  slug: string
  category: string
  description: string
  descriptionHindi: string
  searchQuery: string // For Pixabay image search
  features: { icon: string; label: string; detail: string }[]
  materials: string[]
  colors: { name: string; hex: string }[]
}

// ── Helper to build product defs faster ─────────────────────────────────────

function p(
  category: string,
  name: string,
  desc: string,
  descHi: string,
  query: string,
  features: [string, string, string][],
  materials: string[],
  colors: [string, string][],
): ProductDef {
  return {
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category,
    description: desc,
    descriptionHindi: descHi,
    searchQuery: query,
    features: features.map(([icon, label, detail]) => ({ icon, label, detail })),
    materials,
    colors: colors.map(([n, h]) => ({ name: n, hex: h })),
  }
}

const STD_MATERIALS = ['Pre-Laminated Particle Board (PLPB)', 'PVC Edge Banding']
const STD_COLORS: [string, string][] = [['Classic Walnut', '#5C3D2E'], ['White', '#FFFFFF'], ['Wenge', '#3C2415']]
const OAK_COLORS: [string, string][] = [['Walnut', '#5C3D2E'], ['Sonoma Oak', '#C4A35A'], ['White', '#FFFFFF']]
const LIGHT_COLORS: [string, string][] = [['White', '#FFFFFF'], ['Light Oak', '#D2B48C'], ['Ivory', '#FFFFF0']]

// ── ALL NEW PRODUCTS (only products NOT already in the DB) ──────────────────

const PRODUCTS: ProductDef[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // WARDROBES & ALMIRAHS — 15 new (already have 5)
  // ═══════════════════════════════════════════════════════════════════════════

  p('WARDROBES_ALMIRAHS', 'Open Wardrobe System',
    'Modern open wardrobe without doors — exposed hanging rail, shelves and drawers. Minimalist aesthetic for walk-in closets and contemporary bedrooms.',
    'ओपन वार्डरोब सिस्टम — बिना दरवाजे, मिनिमलिस्ट लुक।',
    'open wardrobe closet modern minimalist',
    [['👔', 'Open Hanging', 'Full-width exposed hanging rail'], ['📦', 'Shelves + Drawers', '4 shelves + 2 drawers below'], ['🏗️', 'Modular', 'Add extra modules as needed'], ['✨', 'Modern Look', 'Clean, minimalist open storage']],
    STD_MATERIALS, OAK_COLORS),

  p('WARDROBES_ALMIRAHS', 'Wardrobe with External Drawers',
    'Double-door wardrobe with 3 external drawers at the bottom. No need to open doors for frequently used items.',
    'बाहरी ड्रॉअर वाला वार्डरोब — रोज़ के सामान के लिए दरवाजा खोलने की ज़रूरत नहीं।',
    'wardrobe external drawers bottom wooden',
    [['🚪', 'Double Door', 'Upper wardrobe with doors'], ['🗄️', '3 External Drawers', 'Quick-access bottom drawers'], ['👔', 'Hanging + Shelves', 'Upper section divided into hanging and shelves'], ['📐', 'Full Height', '6.5 ft with drawers']],
    [...STD_MATERIALS, 'Soft-Close Slides'], STD_COLORS),

  p('WARDROBES_ALMIRAHS', 'Kids Wardrobe Colorful',
    'Compact wardrobe designed for children — lower hanging rail, easy-reach shelves and fun color accents. Safe rounded edges.',
    'बच्चों का वार्डरोब — नीची हैंगिंग रॉड, आसान शेल्फ, रंगीन डिज़ाइन।',
    'kids wardrobe colorful children bedroom furniture',
    [['👶', 'Child Height', 'Hanging rail at 3.5 ft for easy reach'], ['📦', 'Easy Shelves', 'Open cubbies for toys and clothes'], ['✨', 'Rounded Edges', 'All edges rounded for safety'], ['🎨', 'Fun Colors', 'Available in bright color combos']],
    STD_MATERIALS, [['Blue & White', '#4A90D9'], ['Pink & White', '#F4A7BB'], ['Green & White', '#66BB6A']]),

  p('WARDROBES_ALMIRAHS', 'Corner Wardrobe L-Shape',
    'L-shaped corner wardrobe that maximizes unused corner space. Two separate sections meeting at a 90-degree angle.',
    'L-शेप कॉर्नर वार्डरोब — कोने की जगह का पूरा इस्तेमाल।',
    'corner wardrobe L shape bedroom modern',
    [['📐', 'L-Shape Design', 'Fits perfectly into room corners'], ['👔', 'Double Hanging', 'Separate hanging in each wing'], ['📦', 'Center Shelves', 'Corner section has rotating shelves'], ['📏', 'Space Saver', 'Uses otherwise dead corner space']],
    [...STD_MATERIALS, 'Heavy-Duty Hinges'], STD_COLORS),

  p('WARDROBES_ALMIRAHS', 'Wardrobe with Shoe Rack Bottom',
    'Practical wardrobe with a built-in pull-out shoe rack at the bottom. Keeps shoes organized inside the wardrobe itself.',
    'शू रैक वाला वार्डरोब — जूते भी वार्डरोब के अंदर।',
    'wardrobe shoe rack bottom storage bedroom',
    [['👟', 'Pull-Out Shoe Rack', 'Bottom section holds 8-10 pairs'], ['👔', 'Upper Hanging', 'Full hanging section above'], ['📦', 'Shelves', 'Adjustable shelves on one side'], ['🔒', 'Lockable', 'Key lock on doors']],
    [...STD_MATERIALS, 'Metal Shoe Rack'], STD_COLORS),

  p('WARDROBES_ALMIRAHS', 'Wardrobe with Safe Locker',
    'Double-door wardrobe with a built-in steel safe locker compartment. Secure storage for valuables, jewelry and documents.',
    'सेफ लॉकर वाला वार्डरोब — गहने, ज़रूरी कागज़ात सुरक्षित।',
    'wardrobe safe locker security wooden bedroom',
    [['🔐', 'Built-In Safe', 'Steel locker inside wardrobe'], ['👔', 'Hanging Rail', 'Full-length hanging section'], ['📦', 'Shelves', 'Adjustable shelves + drawer'], ['🏗️', 'Heavy Duty', 'Reinforced structure around safe']],
    [...STD_MATERIALS, 'Steel Safe Box'], STD_COLORS),

  p('WARDROBES_ALMIRAHS', 'Sliding Wardrobe with Loft',
    'Full wall sliding wardrobe with overhead loft storage. Smooth aluminium track, soft-close mechanism. Floor-to-ceiling coverage.',
    'स्लाइडिंग वार्डरोब + लॉफ्ट — फ्लोर से सीलिंग तक, सॉफ्ट-क्लोज़।',
    'sliding wardrobe loft ceiling bedroom modern',
    [['↔️', 'Sliding Doors', 'Smooth aluminium track with soft-close'], ['🔝', 'Loft Storage', 'Separate overhead compartment'], ['📏', 'Floor to Ceiling', '8 ft total height'], ['🪞', 'Mirror Option', 'Full-height mirror on one panel']],
    [...STD_MATERIALS, 'Aluminium Track', 'Soft-Close Rollers'], OAK_COLORS),

  p('WARDROBES_ALMIRAHS', 'Two-Tone Modern Wardrobe',
    'Contemporary wardrobe with contrasting two-tone color finish. Dark and light panels create a striking visual statement.',
    'टू-टोन मॉडर्न वार्डरोब — दो रंगों का स्टाइलिश कॉम्बो।',
    'modern wardrobe two tone color contemporary',
    [['🎨', 'Two-Tone Finish', 'Contrasting door and body colors'], ['🚪', 'Double Door', 'Full-height hinged doors'], ['👔', 'Full Hanging', 'One side full-length hanging'], ['📦', 'Shelf Side', 'Other side with 5 shelves']],
    STD_MATERIALS, [['Walnut & White', '#5C3D2E'], ['Wenge & Cream', '#3C2415'], ['Grey & Oak', '#808080']]),

  p('WARDROBES_ALMIRAHS', 'Narrow Tall Wardrobe',
    'Slim single-door wardrobe for tight spaces — only 45 cm wide but full height. Perfect for narrow hallways, entryways or small rooms.',
    'पतला लंबा वार्डरोब — सिर्फ 45cm चौड़ा, छोटी जगह के लिए।',
    'narrow tall wardrobe slim small space',
    [['📏', 'Slim Profile', 'Only 45 cm wide'], ['📐', 'Full Height', '6.5 ft tall for maximum storage'], ['👔', 'Compact Hanging', 'Short hanging + shelves'], ['🏠', 'Space Saver', 'Fits narrow gaps and corners']],
    STD_MATERIALS, STD_COLORS),

  p('WARDROBES_ALMIRAHS', 'Wardrobe with Dresser Combo',
    'All-in-one wardrobe with built-in dresser section — fold-out mirror, small drawers for accessories and a dedicated makeup shelf.',
    'ड्रेसर कॉम्बो वार्डरोब — मिरर + मेकअप शेल्फ + ड्रॉअर सब अंदर।',
    'wardrobe dresser combo mirror bedroom',
    [['🪞', 'Fold-Out Mirror', 'Hidden mirror folds out from side'], ['💄', 'Makeup Shelf', 'Pull-out cosmetics shelf'], ['🗄️', 'Jewelry Drawers', 'Small compartment drawers'], ['👔', 'Full Wardrobe', 'Standard hanging and shelf sections']],
    [...STD_MATERIALS, 'Mirror Glass'], LIGHT_COLORS),

  p('WARDROBES_ALMIRAHS', 'Multipurpose Storage Almirah',
    'Versatile almirah with adjustable shelves — use for clothes, linen, groceries or office files. No hanging section, all shelves.',
    'मल्टीपर्पज़ अलमारी — कपड़े, लिनन, राशन, फ़ाइल कुछ भी रखें।',
    'storage almirah multipurpose shelves wooden',
    [['📦', 'All Shelves', '6 adjustable shelves, no hanging rail'], ['🚪', 'Double Door', 'Solid doors with lock'], ['📐', 'Adjustable', 'Shelves reposition for any item size'], ['🏗️', 'Heavy Duty', 'Each shelf holds 25 kg']],
    [...STD_MATERIALS, 'Key Lock'], STD_COLORS),

  p('WARDROBES_ALMIRAHS', 'Wardrobe with Trouser Rack',
    'Premium wardrobe with dedicated pull-out trouser hanger rack. Keeps trousers crease-free and organized.',
    'ट्राउज़र रैक वाला वार्डरोब — पैंट बिना क्रीज़ के ऑर्गनाइज़्ड।',
    'wardrobe trouser rack pull out hanger',
    [['👖', 'Trouser Rack', 'Pull-out rack holds 12 trousers'], ['👔', 'Hanging Rail', 'Full-height hanging section'], ['📦', 'Shelves', '4 adjustable shelves'], ['🗄️', 'Drawer', 'Bottom drawer for accessories']],
    [...STD_MATERIALS, 'Metal Trouser Rack', 'Soft-Close Slides'], STD_COLORS),

  p('WARDROBES_ALMIRAHS', 'Glass Door Display Wardrobe',
    'Wardrobe with one glass door panel for display and one solid door for concealed storage. Show your best outfits, hide the rest.',
    'ग्लास डोर डिस्प्ले वार्डरोब — एक तरफ दिखाएं, दूसरी तरफ छिपाएं।',
    'wardrobe glass door display modern',
    [['🪟', 'Glass Door', 'One tempered glass panel door'], ['🚪', 'Solid Door', 'One concealed storage door'], ['💡', 'LED Ready', 'Internal LED strip groove'], ['📦', 'Mixed Storage', 'Display + hidden sections']],
    [...STD_MATERIALS, 'Tempered Glass', 'LED Channel'], OAK_COLORS),

  p('WARDROBES_ALMIRAHS', '4-Door Large Family Wardrobe',
    'Extra-large 4-door wardrobe for families — separate sections assignable to different family members. Massive internal capacity.',
    '4-डोर फ़ैमिली वार्डरोब — हर सदस्य का अलग सेक्शन, बहुत बड़ा।',
    'large four door wardrobe family bedroom',
    [['🚪', '4 Doors', 'Four separate sections'], ['👨‍👩‍👧‍👦', 'Family Size', '8 ft wide, section per person'], ['📦', 'Mixed Inside', 'Hanging + shelves + drawers in each section'], ['🔒', 'Individual Locks', 'Each section lockable separately']],
    [...STD_MATERIALS, 'Heavy-Duty Hinges', 'Individual Locks'], STD_COLORS),

  p('WARDROBES_ALMIRAHS', 'Wardrobe with Tie & Belt Organizer',
    'Well-organized wardrobe with built-in tie rack, belt hooks, scarf hanger and accessory drawer. Everything in its place.',
    'टाई-बेल्ट ऑर्गनाइज़र वार्डरोब — हर चीज़ की अपनी जगह।',
    'wardrobe organizer tie belt accessories',
    [['👔', 'Tie Rack', 'Pull-out rack holds 20 ties'], ['🪝', 'Belt Hooks', '6 dedicated belt hooks on door'], ['🧣', 'Scarf Hanger', 'Multi-arm scarf/dupatta hanger'], ['🗄️', 'Accessory Drawer', 'Velvet-lined small items drawer']],
    [...STD_MATERIALS, 'Metal Organizer Hardware'], STD_COLORS),

  // ═══════════════════════════════════════════════════════════════════════════
  // TV UNITS — 15 new (already have 5)
  // ═══════════════════════════════════════════════════════════════════════════

  p('TV_UNITS', 'TV Unit with Bookshelf Side Tower',
    'Asymmetric TV unit with a tall bookshelf tower on one side. Combines entertainment center with a book/display section.',
    'बुकशेल्फ टावर वाला TV यूनिट — एक तरफ TV, दूसरी तरफ किताबें।',
    'tv unit bookshelf tower side living room',
    [['📺', 'TV Section', 'Central area for TVs up to 55"'], ['📚', 'Side Tower', 'Tall bookshelf on one side'], ['🗄️', 'Base Storage', 'Drawers and cabinets below TV'], ['📏', 'Compact Width', 'Fits 6 ft wall space']],
    STD_MATERIALS, OAK_COLORS),

  p('TV_UNITS', 'Low Profile TV Console',
    'Ultra-low TV console at just 35 cm height. Sleek, modern design that makes the room feel spacious. Open compartments for devices.',
    'लो प्रोफाइल TV कंसोल — सिर्फ 35cm ऊंचा, स्लीक मॉडर्न लुक।',
    'low profile tv console modern minimalist wooden',
    [['📏', 'Ultra Low', 'Only 35 cm height'], ['📺', 'Wide Top', '180 cm wide, fits large TVs'], ['📦', 'Open Slots', '4 open compartments'], ['🔌', 'Cable Route', 'Rear cable management']],
    STD_MATERIALS, [['Dark Walnut', '#3E2723'], ['White', '#FFFFFF'], ['Black Oak', '#1A1A1A']]),

  p('TV_UNITS', 'TV Cabinet with Sliding Doors',
    'Clean-looking TV cabinet with sliding panel doors. Slide doors left/right to reveal or hide contents. No swing clearance needed.',
    'स्लाइडिंग डोर TV कैबिनेट — दरवाज़े खिसकाएं, स्विंग स्पेस नहीं चाहिए।',
    'tv cabinet sliding doors wooden modern',
    [['↔️', 'Sliding Doors', 'Panel doors slide left-right'], ['📺', 'TV Top', 'Supports up to 60"'], ['📦', 'Hidden Storage', 'Concealed shelves behind doors'], ['🏗️', 'Solid Build', 'Heavy-duty shelf supports']],
    [...STD_MATERIALS, 'Sliding Door Track'], STD_COLORS),

  p('TV_UNITS', 'Floating TV Unit with LED',
    'Wall-mounted floating TV unit with integrated LED backlight strip. Creates ambient lighting effect behind the TV.',
    'फ्लोटिंग TV यूनिट LED लाइट — दीवार पर, एम्बिएंट लाइटिंग।',
    'floating tv unit led light wall mounted',
    [['🖼️', 'Wall Mounted', 'Floats off the floor'], ['💡', 'LED Backlight', 'Warm LED strip included'], ['🗄️', '2 Drawers', 'Soft-close concealed drawers'], ['📏', 'Slim Profile', '150 × 30 × 30 cm']],
    [...STD_MATERIALS, 'LED Strip', 'French Cleat'], [['Charcoal & LED', '#36454F'], ['Walnut & LED', '#5C3D2E'], ['White & LED', '#FFFFFF']]),

  p('TV_UNITS', 'TV Unit with Display Showcase',
    'TV unit with glass-door showcase section for displaying trophies, showpieces and collectibles alongside the entertainment area.',
    'डिस्प्ले शोकेस वाला TV यूनिट — ट्रॉफी और शोपीस दिखाएं।',
    'tv unit display showcase glass door',
    [['📺', 'TV Area', 'Central open TV section'], ['🪟', 'Glass Showcase', 'Tempered glass door display'], ['💡', 'Shelf Lighting', 'LED-ready display shelves'], ['🗄️', 'Base Storage', 'Closed cabinets below']],
    [...STD_MATERIALS, 'Tempered Glass'], OAK_COLORS),

  p('TV_UNITS', 'Compact TV Unit for Bedroom',
    'Small TV unit designed for bedrooms — just 100 cm wide. Fits a 32-40" TV with space for set-top box and remotes.',
    'बेडरूम के लिए छोटा TV यूनिट — 32-40" TV के लिए, कॉम्पैक्ट।',
    'small tv stand bedroom compact wooden',
    [['📺', 'Compact', '100 cm wide, perfect for bedrooms'], ['📦', 'Open Shelf', 'Quick-access shelf for STB'], ['🗄️', 'Drawer', 'Single drawer for remotes'], ['📏', 'Right Height', '55 cm matches bed height']],
    STD_MATERIALS, LIGHT_COLORS),

  p('TV_UNITS', 'TV Unit with Bar Cabinet',
    'Dual-purpose TV entertainment unit with a fold-out bar section. Hidden bar cabinet with bottle holders and glass rack.',
    'बार कैबिनेट वाला TV यूनिट — TV + मिनी बार एक में।',
    'tv unit bar cabinet living room modern',
    [['📺', 'TV Section', 'Standard entertainment area'], ['🍷', 'Bar Cabinet', 'Fold-out door reveals bottle holders'], ['🥂', 'Glass Rack', 'Inverted glass hanging rail'], ['🗄️', 'Regular Storage', 'Drawers and shelves for media']],
    [...STD_MATERIALS, 'Bottle Holders', 'Glass Rail'], [['Dark Walnut', '#3E2723'], ['Wenge', '#3C2415'], ['Mahogany', '#420D09']]),

  p('TV_UNITS', 'Minimal TV Back Panel Board',
    'Simple wall-mounted accent panel that goes behind a wall-mounted TV. Conceals cables and adds visual depth to a plain wall.',
    'मिनिमल TV बैक पैनल — केबल छिपाएं, दीवार को स्टाइलिश बनाएं।',
    'tv back panel wall modern minimalist',
    [['🖼️', 'Accent Panel', 'Decorative wall panel 120 × 180 cm'], ['🔌', 'Cable Channel', 'Built-in cable concealment'], ['📦', 'No Shelves', 'Pure aesthetic panel, clean look'], ['🏗️', 'Easy Mount', 'French cleat system']],
    [...STD_MATERIALS, 'French Cleat Hardware'], [['Walnut', '#5C3D2E'], ['Stone Grey', '#808080'], ['Charcoal', '#36454F']]),

  p('TV_UNITS', 'TV Unit with CD & Media Storage',
    'Entertainment unit with dedicated slots for CDs, DVDs, game cases and media. Retro-modern design for collectors.',
    'CD/DVD स्टोरेज वाला TV यूनिट — मीडिया कलेक्टर्स के लिए।',
    'tv unit media storage dvd rack wooden',
    [['💿', 'Media Slots', 'Grid slots for 100+ discs/cases'], ['📺', 'TV Top', 'Wide top for TVs up to 55"'], ['🗄️', 'Drawers', '2 utility drawers'], ['📦', 'Open Niches', '3 open sections for devices']],
    STD_MATERIALS, STD_COLORS),

  p('TV_UNITS', 'L-Shaped Corner TV Unit',
    'L-shaped TV unit designed for room corners. Wraps around the corner with storage on both sides of the TV area.',
    'L-शेप कॉर्नर TV यूनिट — कोने में फिट, दोनों तरफ स्टोरेज।',
    'L shaped corner tv unit wooden living room',
    [['📐', 'L-Shape', 'Wraps around room corner'], ['📺', 'Corner TV Area', 'Central angled TV section'], ['📦', 'Dual Storage', 'Cabinets on both wings'], ['🏠', 'Space Efficient', 'Uses dead corner area']],
    STD_MATERIALS, OAK_COLORS),

  p('TV_UNITS', 'TV Cabinet with Glass Doors',
    'Elegant TV cabinet with smoked glass doors. Keeps devices dust-free while IR remotes pass through the glass.',
    'ग्लास डोर TV कैबिनेट — डिवाइस धूल से सुरक्षित, रिमोट काम करे।',
    'tv cabinet glass doors elegant wooden',
    [['🪟', 'Glass Doors', 'Smoked tempered glass panels'], ['📺', 'Spacious Top', 'Supports TVs up to 65"'], ['📦', '3 Sections', 'Separate compartments for devices'], ['🔌', 'Ventilated', 'Rear ventilation for heat']],
    [...STD_MATERIALS, 'Smoked Tempered Glass'], [['Dark Walnut', '#3E2723'], ['Black', '#1A1A1A'], ['Wenge', '#3C2415']]),

  p('TV_UNITS', 'Rustic Finish TV Stand',
    'TV stand with a rustic wood-grain finish that adds warmth and character. Open design with industrial-style metal accents.',
    'रस्टिक फिनिश TV स्टैंड — गर्म लकड़ी का लुक, मेटल एक्सेंट।',
    'rustic tv stand wooden industrial style',
    [['🪵', 'Rustic Finish', 'Textured wood-grain laminate'], ['📺', 'Open Design', 'No doors, easy access shelves'], ['🔩', 'Metal Accents', 'Black metal frame elements'], ['📏', 'Sturdy Build', '140 cm wide, supports 50 kg']],
    ['Textured Laminated Particle Board', 'Metal Frame Accents', 'PVC Edge Banding'],
    [['Rustic Oak', '#8B6914'], ['Reclaimed Wood', '#7B5B3A'], ['Pine', '#C9B37C']]),

  p('TV_UNITS', 'TV Unit with Partition Shelf',
    'TV unit that doubles as a room partition. Open shelves on the back allow it to serve as a divider between living and dining areas.',
    'पार्टीशन शेल्फ TV यूनिट — TV यूनिट + रूम डिवाइडर।',
    'tv unit room divider partition shelf',
    [['🧱', 'Room Divider', 'Open from both sides'], ['📺', 'TV Front', 'TV viewing area on one side'], ['📚', 'Back Shelves', 'Display shelves visible from other side'], ['📏', 'Tall Unit', '150 cm height for effective division']],
    STD_MATERIALS, OAK_COLORS),

  p('TV_UNITS', 'Curved Front TV Unit',
    'TV unit with a gently curved front profile for a premium, distinctive look. Rounded edges and flowing lines soften the room.',
    'कर्व्ड फ्रंट TV यूनिट — गोल किनारे, प्रीमियम लुक।',
    'curved tv unit modern premium living room',
    [['🌊', 'Curved Profile', 'Gently curved front face'], ['📺', 'Wide Top', 'Fits TVs up to 55"'], ['🗄️', 'Soft-Close Drawers', '3 curved-front drawers'], ['✨', 'Premium Finish', 'High-gloss or matte laminate']],
    ['High-Quality Laminated Particle Board', 'Curved PVC Banding', 'Soft-Close Slides'],
    [['High Gloss White', '#F5F5F5'], ['Matte Walnut', '#5C3D2E'], ['Grey Gloss', '#B0B0B0']]),

  p('TV_UNITS', 'TV Unit with Fireplace Mantel',
    'TV unit styled as a fireplace mantel surround. Electric fireplace compatible. Creates a cozy focal point in the living room.',
    'फायरप्लेस मैंटल TV यूनिट — लिविंग रूम का फोकल पॉइंट।',
    'tv unit fireplace mantel living room cozy',
    [['🔥', 'Fireplace Surround', 'Fits standard electric fireplace inserts'], ['📺', 'TV Shelf', 'Mantel top supports up to 65" TV'], ['📦', 'Side Cabinets', 'Closed storage on both sides'], ['🏠', 'Statement Piece', 'Becomes room focal point']],
    [...STD_MATERIALS, 'Heat-Resistant Backing'], [['Classic White', '#F5F5F5'], ['Walnut', '#5C3D2E'], ['Cream', '#FFFDD0']]),

  // ═══════════════════════════════════════════════════════════════════════════
  // STUDY & COMPUTER TABLES — 15 new (already have 5)
  // ═══════════════════════════════════════════════════════════════════════════

  p('STUDY_COMPUTER_TABLES', 'Standing Desk Converter Table',
    'Height-adjustable desk topper that converts any table into a standing desk. Manual crank mechanism for smooth height changes.',
    'स्टैंडिंग डेस्क कन्वर्टर — किसी भी टेबल को स्टैंडिंग डेस्क बनाएं।',
    'standing desk converter adjustable height wooden',
    [['📐', 'Adjustable Height', '70-110 cm with manual crank'], ['🖥️', 'Monitor + Keyboard', 'Two-tier: monitor shelf + keyboard area'], ['🏗️', 'Stable', 'Anti-wobble frame at any height'], ['💪', 'Ergonomic', 'Reduces sitting time, improves posture']],
    [...STD_MATERIALS, 'Steel Crank Mechanism'], OAK_COLORS),

  p('STUDY_COMPUTER_TABLES', 'Study Table with 3-Drawer Pedestal',
    'Professional study table with a 3-drawer pedestal unit. File-size bottom drawer for A4 folders. Lockable for document security.',
    'तीन ड्रॉअर पेडस्टल वाला स्टडी टेबल — फ़ाइलें और स्टेशनरी के लिए।',
    'study desk drawer pedestal wooden office',
    [['🗄️', '3 Drawers', 'File drawer + 2 utility drawers'], ['🔒', 'Central Lock', 'One key locks all drawers'], ['📏', 'Work Surface', '120 × 60 cm desk top'], ['📐', 'Standard Height', '75 cm comfortable writing height']],
    [...STD_MATERIALS, 'Metal Slides', 'Central Lock'], STD_COLORS),

  p('STUDY_COMPUTER_TABLES', 'Compact Laptop Table',
    'Small, minimal laptop table that fits anywhere. Just big enough for a laptop and notebook. Light enough to move between rooms.',
    'कॉम्पैक्ट लैपटॉप टेबल — कहीं भी ले जाएं, कम जगह।',
    'compact laptop table small portable wooden',
    [['💻', 'Laptop Sized', '80 × 45 cm — fits laptop + mouse'], ['📏', 'Lightweight', 'Easy to move between rooms'], ['🗄️', 'Small Drawer', 'Single drawer for charger/mouse'], ['🏠', 'Any Room', 'Works in bedroom, balcony, living room']],
    STD_MATERIALS, LIGHT_COLORS),

  p('STUDY_COMPUTER_TABLES', 'Kids Study Table with Storage',
    'Child-friendly study table with colorful finish, pencil holder groove, attached bookshelf and rounded safe edges.',
    'बच्चों का स्टडी टेबल — पेंसिल ग्रूव, बुकशेल्फ, गोल किनारे।',
    'kids study table colorful children desk storage',
    [['👶', 'Child Size', '90 × 50 cm, 60 cm height'], ['✏️', 'Pencil Groove', 'Built-in pencil/pen holder groove'], ['📚', 'Attached Shelf', '2-tier shelf for books'], ['✨', 'Rounded Edges', 'All edges rounded for safety']],
    STD_MATERIALS, [['Blue & White', '#4A90D9'], ['Pink & White', '#F4A7BB'], ['Green & White', '#66BB6A']]),

  p('STUDY_COMPUTER_TABLES', 'Study Table with Pinboard Back',
    'Study table with an attached cork pinboard back panel. Pin notes, schedules, photos and reminders right at your desk.',
    'पिनबोर्ड वाला स्टडी टेबल — नोट्स, शेड्यूल सब पिन करें।',
    'study table pinboard cork board desk',
    [['📌', 'Cork Pinboard', '100 × 60 cm cork panel above desk'], ['📏', 'Work Surface', '100 × 55 cm writing area'], ['🗄️', 'Drawer', 'Full-width desk drawer'], ['📦', 'Open Shelf', 'Shelf below desktop']],
    [...STD_MATERIALS, 'Cork Board Panel'], OAK_COLORS),

  p('STUDY_COMPUTER_TABLES', 'Corner Study Workstation',
    'Wraparound corner study workstation with monitor shelf, printer compartment and side bookshelf. Complete home office in one piece.',
    'कॉर्नर स्टडी वर्कस्टेशन — मॉनिटर शेल्फ, प्रिंटर कम्पार्टमेंट, बुकशेल्फ।',
    'corner desk workstation complete home office',
    [['📐', 'Corner Fit', 'L-shaped design for room corners'], ['🖥️', 'Monitor Riser', 'Elevated shelf for monitor + neck comfort'], ['🖨️', 'Printer Section', 'Dedicated printer compartment'], ['📚', 'Side Bookshelf', 'Integrated 3-tier bookshelf']],
    [...STD_MATERIALS, 'Cable Grommets'], STD_COLORS),

  p('STUDY_COMPUTER_TABLES', 'Minimalist Writing Desk',
    'Clean, scandinavian-style writing desk with slim tapered legs. No drawers, just a beautiful work surface. Less is more.',
    'मिनिमलिस्ट राइटिंग डेस्क — बिना ड्रॉअर, सिर्फ सुंदर टेबल।',
    'minimalist writing desk scandinavian simple wooden',
    [['✨', 'Minimal Design', 'Clean lines, no clutter'], ['📏', 'Wide Surface', '120 × 60 cm for comfortable writing'], ['🦵', 'Tapered Legs', 'Slim angled legs, modern look'], ['🪶', 'Lightweight', 'Easy to reposition']],
    ['Laminated Particle Board', 'Tapered Solid Wood Legs', 'PVC Edge Banding'], LIGHT_COLORS),

  p('STUDY_COMPUTER_TABLES', 'Double Study Table 2-Person',
    'Extra-wide study table for two people to work side by side. Shared table, individual drawers. Great for siblings or couples.',
    'डबल स्टडी टेबल — दो लोग साथ बैठें, अलग-अलग ड्रॉअर।',
    'double study table two person desk wide',
    [['👥', 'Two-Person', '180 cm wide for side-by-side seating'], ['🗄️', 'Individual Drawers', 'One drawer per person on each side'], ['📏', 'Shared Surface', 'Continuous work surface'], ['🏗️', 'Center Support', 'Center leg for stability']],
    [...STD_MATERIALS, 'Metal Center Support'], STD_COLORS),

  p('STUDY_COMPUTER_TABLES', 'Study Table with Hutch Top',
    'Study table with an overhead hutch shelf unit. Multiple cubbies and shelves above the desk for books, files and supplies.',
    'हच टॉप वाला स्टडी टेबल — ऊपर कई शेल्व्ज़ और कब्बी।',
    'study desk hutch top shelves overhead',
    [['📚', 'Hutch Unit', 'Overhead shelf system with 6 cubbies'], ['📏', 'Desk Below', '120 × 60 cm work surface'], ['🗄️', 'Drawers', '2 desk drawers'], ['📦', 'Open + Closed', 'Mix of open and closed shelves above']],
    [...STD_MATERIALS, 'Metal Connectors'], STD_COLORS),

  p('STUDY_COMPUTER_TABLES', 'Gaming Desk with Cable Tray',
    'Wide gaming desk with full-length cable management tray, monitor stand riser, headphone hook and cup holder cutout.',
    'गेमिंग डेस्क — केबल ट्रे, मॉनिटर राइज़र, हेडफ़ोन हुक।',
    'gaming desk setup cable management modern',
    [['🎮', 'Gaming Ready', 'Ergonomic curve, wide 140 × 65 cm surface'], ['🔌', 'Cable Tray', 'Full-width under-desk cable management tray'], ['🖥️', 'Monitor Riser', 'Elevated platform for monitor(s)'], ['🎧', 'Headphone Hook', 'Mounted headphone hanger on side']],
    [...STD_MATERIALS, 'Steel Cable Tray', 'Metal Headphone Hook'],
    [['Carbon Black', '#1A1A1A'], ['Dark Walnut', '#3E2723'], ['Grey', '#808080']]),

  p('STUDY_COMPUTER_TABLES', 'Secretary Desk with Fold-Down',
    'Classic secretary desk with a fold-down writing surface. Close it up when done — all papers hidden inside. Elegant home office piece.',
    'सेक्रेटरी डेस्क — फोल्ड-डाउन राइटिंग सरफ़ेस, बंद करें तो सब छिपा।',
    'secretary desk fold down writing surface classic',
    [['📐', 'Fold-Down Desk', 'Hinged panel folds down to form desk'], ['📦', 'Hidden Inside', 'Internal cubbies and pigeon holes'], ['🗄️', 'Lower Drawers', '2 drawers below desk section'], ['✨', 'Elegant Closed', 'Looks like a cabinet when closed']],
    [...STD_MATERIALS, 'Piano Hinges'], STD_COLORS),

  p('STUDY_COMPUTER_TABLES', 'Adjustable Tilt Drafting Table',
    'Drafting/drawing table with adjustable tilt angle. Ideal for architects, artists and designers. Side shelf for tools.',
    'ड्राफ्टिंग टेबल — एडजस्टेबल टिल्ट एंगल, आर्किटेक्ट्स के लिए।',
    'drafting table tilting adjustable angle drawing desk',
    [['📐', 'Adjustable Tilt', '0-45 degree adjustable angle'], ['🎨', 'Drawing Surface', '90 × 60 cm smooth top'], ['📦', 'Side Shelf', 'Flat shelf for tools and supplies'], ['📏', 'Pencil Ledge', 'Front pencil stop ledge']],
    [...STD_MATERIALS, 'Tilt Mechanism'], OAK_COLORS),

  p('STUDY_COMPUTER_TABLES', 'Study Table with Keyboard Shelf',
    'Dedicated computer desk with sliding keyboard shelf, CPU compartment and monitor stand. Everything organized for desktop use.',
    'कीबोर्ड शेल्फ + CPU कम्पार्टमेंट वाला कंप्यूटर डेस्क।',
    'computer desk keyboard shelf cpu compartment',
    [['⌨️', 'Keyboard Shelf', 'Pull-out keyboard tray'], ['🖥️', 'Monitor Stand', 'Raised platform for eye-level viewing'], ['💻', 'CPU Compartment', 'Side compartment for tower PC'], ['🔌', 'Cable Holes', 'Desk grommet for cable routing']],
    [...STD_MATERIALS, 'Ball-Bearing Slides'], STD_COLORS),

  p('STUDY_COMPUTER_TABLES', 'Convertible Desk-Shelf Unit',
    'Wall unit that converts between a desk and a shelf. Fold down the desk portion when needed, fold it back into a bookshelf.',
    'कन्वर्टिबल डेस्क-शेल्फ — ज़रूरत हो तो डेस्क, वरना बुकशेल्फ।',
    'convertible desk shelf wall unit folding',
    [['🔄', 'Dual Mode', 'Functions as desk or bookshelf'], ['📐', 'Fold Mechanism', 'Sturdy fold-down desk surface'], ['📚', 'Shelf Mode', '3 shelves when desk is folded up'], ['🏠', 'Studio Apartment', 'Ideal for micro-spaces']],
    [...STD_MATERIALS, 'Heavy-Duty Hinges'], LIGHT_COLORS),

  p('STUDY_COMPUTER_TABLES', 'Executive Writing Desk with Leather Top',
    'Premium writing desk with a leatherette-inlaid top surface. 3 drawers, brass-finish handles. Professional home office centerpiece.',
    'लेदर टॉप एग्ज़ीक्यूटिव राइटिंग डेस्क — प्रीमियम होम ऑफिस।',
    'executive writing desk leather top premium',
    [['✨', 'Leatherette Top', 'Smooth leatherette writing surface'], ['🗄️', '3 Drawers', 'Central + 2 side drawers'], ['🔩', 'Brass Handles', 'Premium brass-finish handles'], ['📏', 'Generous Size', '140 × 70 cm surface']],
    ['Laminated Particle Board', 'Leatherette Panel', 'Brass-Finish Handles'],
    [['Walnut & Brown Leather', '#5C3D2E'], ['Mahogany & Black Leather', '#420D09'], ['Oak & Tan Leather', '#C8A951']]),

  // ═══════════════════════════════════════════════════════════════════════════
  // BOOKSHELVES & DISPLAY — 15 new (already have 5)
  // ═══════════════════════════════════════════════════════════════════════════

  p('BOOKSHELVES_DISPLAY', 'Room Divider Bookshelf',
    'Open bookshelf that works as a room partition. Accessible from both sides. Separates living/dining or study/bedroom areas.',
    'रूम डिवाइडर बुकशेल्फ — दोनों तरफ से एक्सेस, कमरा बांटे।',
    'bookshelf room divider partition open both sides',
    [['🧱', 'Room Divider', 'Freestanding partition for open spaces'], ['📚', 'Both Sides', 'Accessible from front and back'], ['📦', '8 Compartments', '4×2 grid of cubbies'], ['📏', 'Full Height', '180 cm tall for effective division']],
    STD_MATERIALS, OAK_COLORS),

  p('BOOKSHELVES_DISPLAY', 'Corner Bookshelf Unit',
    'Triangular corner bookshelf that fits snugly into room corners. 5 tiers of shelf space, makes use of dead corner area.',
    'कॉर्नर बुकशेल्फ — कोने में फिट, 5 शेल्व्ज़।',
    'corner bookshelf triangular wooden modern',
    [['📐', 'Corner Fit', 'Triangular design for 90° corners'], ['📚', '5 Tiers', 'Progressively sized shelves'], ['🏗️', 'Wall Anchor', 'Anti-tip wall mount included'], ['🏠', 'Space Saver', 'Uses neglected corner space']],
    STD_MATERIALS, STD_COLORS),

  p('BOOKSHELVES_DISPLAY', 'Kids Bookshelf with Toy Bins',
    'Child-height bookshelf with front-facing book display on top and colorful fabric toy bins on lower shelves.',
    'बच्चों का बुकशेल्फ — किताब डिस्प्ले + टॉय बिन्स।',
    'kids bookshelf toy storage colorful children',
    [['👶', 'Child Height', 'Easy reach for ages 2-8'], ['📖', 'Front Display', 'Front-facing book sling shelves'], ['🧸', 'Toy Bins', '3 fabric bin compartments below'], ['✨', 'Rounded Edges', 'All corners rounded for safety']],
    STD_MATERIALS, [['White & Pastel', '#FFFFFF'], ['Natural & Blue', '#D2B48C'], ['White & Pink', '#F4A7BB']]),

  p('BOOKSHELVES_DISPLAY', 'Bookshelf with Drawers Below',
    'Traditional bookshelf with open display shelves on top and closed drawers at the bottom. Display books above, hide clutter below.',
    'ड्रॉअर वाला बुकशेल्फ — ऊपर किताबें दिखाएं, नीचे सामान छिपाएं।',
    'bookshelf with drawers bottom wooden classic',
    [['📚', '4 Open Shelves', 'Display section on top half'], ['🗄️', '2 Drawers', 'Concealed storage at bottom'], ['📏', 'Full Size', '80 × 30 × 180 cm'], ['🏗️', 'Sturdy', 'Each shelf holds 20 kg']],
    [...STD_MATERIALS, 'Metal Drawer Slides'], STD_COLORS),

  p('BOOKSHELVES_DISPLAY', 'Tall Narrow Bookshelf',
    'Slim-profile bookshelf only 30 cm wide — fits in narrow gaps between furniture. 6 tiers for vertical storage.',
    'पतला बुकशेल्फ — सिर्फ 30cm चौड़ा, कहीं भी फिट।',
    'narrow tall bookshelf slim space saver',
    [['📏', 'Ultra Narrow', 'Only 30 cm wide, fits any gap'], ['📚', '6 Tiers', '6 shelves in vertical stack'], ['📐', 'Tall', '180 cm height'], ['🏠', 'Gap Filler', 'Perfect between furniture or in corners']],
    STD_MATERIALS, LIGHT_COLORS),

  p('BOOKSHELVES_DISPLAY', 'Hexagonal Wall Shelf Set',
    'Set of 3 hexagonal floating wall shelves in graduated sizes. Geometric design adds modern décor element while providing storage.',
    '3 हेक्सागोनल वॉल शेल्व्ज़ का सेट — मॉडर्न डेकोर + स्टोरेज।',
    'hexagonal wall shelf set geometric modern',
    [['⬡', 'Hexagonal Shape', 'Modern geometric design'], ['📦', 'Set of 3', 'Small, medium and large sizes'], ['🖼️', 'Floating Mount', 'Concealed bracket system'], ['✨', 'Decorative', 'Display plants, books, small décor']],
    [...STD_MATERIALS, 'Concealed Brackets'],
    [['White', '#FFFFFF'], ['Walnut', '#5C3D2E'], ['Black & Walnut', '#1A1A1A']]),

  p('BOOKSHELVES_DISPLAY', 'Display Rack with LED Shelves',
    'Premium display rack with built-in LED lighting on each shelf. Showcase trophies, art pieces and collectibles with dramatic lighting.',
    'LED शेल्व्ज़ वाला डिस्प्ले रैक — ट्रॉफी और शोपीस को लाइट करें।',
    'display shelf led light showcase trophy cabinet',
    [['💡', 'LED Per Shelf', 'Warm white LED strip on each shelf'], ['🪟', 'Glass Shelves', 'Tempered glass shelves for light pass-through'], ['📏', '5 Shelves', 'Graduated spacing for different items'], ['🔌', 'Single Plug', 'One power cord for all LEDs']],
    ['Laminated Particle Board Frame', 'Tempered Glass Shelves', 'LED Strips'],
    [['Black Frame', '#1A1A1A'], ['Walnut Frame', '#5C3D2E'], ['White Frame', '#FFFFFF']]),

  p('BOOKSHELVES_DISPLAY', 'Staircase Style Bookshelf',
    'Step-design bookshelf that ascends like a staircase. Each level is a different height. Creates visual interest on any wall.',
    'सीढ़ी स्टाइल बुकशेल्फ — हर लेवल अलग ऊंचाई, दीवार पर आकर्षक।',
    'staircase step bookshelf ascending design modern',
    [['🪜', 'Step Design', 'Ascending staircase profile'], ['📚', '5 Levels', 'Each step is a shelf'], ['📐', 'Asymmetric', 'Creates dynamic visual interest'], ['🏗️', 'Wall Anchor', 'Anti-tip kit included']],
    STD_MATERIALS, OAK_COLORS),

  p('BOOKSHELVES_DISPLAY', 'Open & Closed Combo Shelf Unit',
    'Versatile shelf unit with a mix of open cubbies and closed cabinets. Display some items, conceal others. Best of both worlds.',
    'ओपन + क्लोज़्ड कॉम्बो शेल्फ — कुछ दिखाएं, कुछ छिपाएं।',
    'bookshelf open closed combo unit modern',
    [['📦', 'Open Sections', '4 open display cubbies'], ['🚪', 'Closed Sections', '2 closed cabinets with doors'], ['📐', 'Asymmetric Layout', 'Arranged for visual balance'], ['📏', 'Medium Size', '120 × 35 × 150 cm']],
    [...STD_MATERIALS, 'Soft-Close Hinges'], STD_COLORS),

  p('BOOKSHELVES_DISPLAY', 'Wide Low Bookcase',
    'Long, low bookcase that sits under a window or along a low wall. 4 sections wide, 2 shelves high. Doubles as a window seat base.',
    'चौड़ा नीचा बुककेस — खिड़की के नीचे या दीवार के साथ।',
    'low wide bookcase under window horizontal',
    [['📏', 'Low & Wide', '160 × 35 × 80 cm'], ['📚', '8 Compartments', '4 wide × 2 high grid'], ['🪑', 'Seat Ready', 'Top strong enough to sit on (100 kg)'], ['🏠', 'Under Window', 'Ideal placement under windows']],
    STD_MATERIALS, LIGHT_COLORS),

  p('BOOKSHELVES_DISPLAY', 'Revolving Bookshelf Tower',
    'Rotating tower bookshelf on a swivel base. Access books from all sides by spinning the tower. Compact footprint, high capacity.',
    'घूमने वाला बुकशेल्फ टावर — स्विवल बेस पर, चारों तरफ से किताबें लें।',
    'revolving bookshelf tower rotating swivel',
    [['🔄', 'Revolving', '360° rotation on swivel base'], ['📚', 'High Capacity', 'Holds 100+ books'], ['📐', 'Compact', 'Only 40 × 40 cm footprint'], ['📏', '4 Tiers', 'Shelves on all four sides']],
    [...STD_MATERIALS, 'Steel Swivel Base'], STD_COLORS),

  p('BOOKSHELVES_DISPLAY', 'Geometric Wall Shelf Set',
    'Set of 5 geometric-shaped wall shelves — squares, rectangles, diamonds. Create your own wall art arrangement while adding storage.',
    '5 ज्योमेट्रिक वॉल शेल्व्ज़ — अपना वॉल आर्ट अरेंजमेंट बनाएं।',
    'geometric wall shelf set decorative modern shapes',
    [['📐', '5 Shapes', 'Square, rectangle, diamond variations'], ['🖼️', 'Wall Art', 'Arrange in any artistic pattern'], ['📦', 'Display Storage', 'Each holds small décor items'], ['🏗️', 'Easy Mount', 'Concealed brackets for each piece']],
    [...STD_MATERIALS, 'Concealed Brackets'],
    [['White', '#FFFFFF'], ['Black', '#1A1A1A'], ['Mix Colors', '#5C3D2E']]),

  p('BOOKSHELVES_DISPLAY', 'Bookshelf with File Cabinet',
    'Home office bookshelf with integrated lateral file cabinet at the bottom. Books on top, organized files below.',
    'फ़ाइल कैबिनेट वाला बुकशेल्फ — ऊपर किताबें, नीचे फ़ाइलें।',
    'bookshelf file cabinet office storage wooden',
    [['📚', '3 Open Shelves', 'Upper display shelves'], ['🗂️', 'File Cabinet', 'Lateral file drawer for A4/legal'], ['🔒', 'Lockable', 'File drawer has key lock'], ['📏', 'Office Size', '80 × 40 × 180 cm']],
    [...STD_MATERIALS, 'Metal File Slides', 'Key Lock'], STD_COLORS),

  p('BOOKSHELVES_DISPLAY', 'Industrial Style Metal-Board Shelf',
    'Industrial-style bookshelf combining particle board shelves with black metal frame. Rugged, urban aesthetic for modern interiors.',
    'इंडस्ट्रियल स्टाइल शेल्फ — मेटल फ्रेम + वुडन शेल्व्ज़।',
    'industrial bookshelf metal frame wooden shelves',
    [['🔩', 'Metal Frame', 'Black powder-coated steel frame'], ['🪵', 'Wood Shelves', '5 particle board shelves'], ['🏗️', 'Heavy Duty', 'Each shelf supports 25 kg'], ['✨', 'Industrial Look', 'Exposed metal, rugged aesthetic']],
    ['Laminated Particle Board', 'Powder-Coated Steel Frame'],
    [['Rustic Oak & Black', '#8B6914'], ['Walnut & Black', '#5C3D2E'], ['White & Black', '#FFFFFF']]),

  p('BOOKSHELVES_DISPLAY', 'Tree-Shaped Bookshelf',
    'Creative tree-shaped bookshelf with branches serving as shelves. A whimsical, eye-catching piece for living rooms or kids rooms.',
    'ट्री-शेप बुकशेल्फ — शाखाओं पर किताबें, क्रिएटिव डिज़ाइन।',
    'tree shaped bookshelf creative design wooden',
    [['🌳', 'Tree Shape', 'Artistic tree silhouette design'], ['📚', '8 Branch Shelves', 'Asymmetric shelves at different heights'], ['📐', 'Freestanding', 'Leans against wall'], ['🎨', 'Statement Piece', 'Conversation-starting furniture']],
    [...STD_MATERIALS, 'Wall Anchor Kit'],
    [['Natural Wood', '#D2B48C'], ['White', '#FFFFFF'], ['Walnut', '#5C3D2E']]),

  // ═══════════════════════════════════════════════════════════════════════════
  // SHOE RACKS — 16 new (already have 4)
  // ═══════════════════════════════════════════════════════════════════════════

  p('SHOE_RACKS', 'Stackable Shoe Rack Module',
    'Modular shoe rack — buy one unit or stack multiple units. Each module holds 6 pairs. Grows with your collection.',
    'स्टैकेबल शू रैक मॉड्यूल — ज़रूरत के हिसाब से जोड़ें।',
    'stackable shoe rack modular wooden expandable',
    [['🔗', 'Stackable', 'Stack 2-4 modules vertically'], ['👟', '6 Pairs Each', 'Each module holds 6 pairs'], ['🔄', 'Expandable', 'Buy more as collection grows'], ['📏', 'Compact', '60 × 30 × 35 cm per module']],
    STD_MATERIALS, LIGHT_COLORS),

  p('SHOE_RACKS', 'Shoe Rack with Umbrella Stand',
    'Entryway shoe rack with an integrated umbrella and walking stick stand on the side. Keeps the entrance organized.',
    'अम्ब्रेला स्टैंड वाला शू रैक — एंट्रेंस पर सब एक जगह।',
    'shoe rack umbrella stand entryway organizer',
    [['👟', '3 Shoe Tiers', 'Holds 9-12 pairs'], ['☂️', 'Umbrella Stand', 'Side section for umbrellas/walking sticks'], ['💧', 'Drip Tray', 'Removable water collection tray'], ['📏', 'Entryway Size', '70 × 30 × 80 cm']],
    [...STD_MATERIALS, 'Removable Drip Tray'], STD_COLORS),

  p('SHOE_RACKS', 'Pull-Out Shoe Rack Insert',
    'Pull-out shoe rack designed to install inside a wardrobe. Telescopic rails, holds 12 pairs. Maximizes wardrobe interior space.',
    'पुल-आउट शू रैक इन्सर्ट — वार्डरोब के अंदर फिट करें।',
    'pull out shoe rack wardrobe insert telescopic',
    [['↔️', 'Pull-Out', 'Telescopic ball-bearing slides'], ['👟', '12 Pairs', '3 tiers inside wardrobe'], ['📐', 'Fits Wardrobes', 'Standard 60 cm wardrobe width'], ['🏗️', 'Easy Install', 'Screw-mount to wardrobe interior']],
    ['Laminated Particle Board', 'Telescopic Ball-Bearing Slides'], STD_COLORS),

  p('SHOE_RACKS', 'Shoe Cabinet with Mirror Front',
    'Shoe cabinet with a full-length mirror on the front door. Check your outfit while grabbing shoes — two functions in one.',
    'मिरर फ्रंट शू कैबिनेट — जूते लें और आउटफिट चेक करें।',
    'shoe cabinet mirror door full length entryway',
    [['🪞', 'Full Mirror', 'Full-length mirror on door front'], ['👟', '5 Shelves', 'Holds 15-20 pairs behind mirror'], ['📐', 'Slim Profile', 'Only 20 cm deep'], ['🔒', 'Magnetic Close', 'Magnetic door catch']],
    [...STD_MATERIALS, 'Mirror Glass', 'Magnetic Catch'], LIGHT_COLORS),

  p('SHOE_RACKS', 'Shoe Rack Tower 6-Tier',
    'Tall 6-tier shoe rack tower. Vertical design holds 18-24 pairs in a narrow footprint. Perfect for large shoe collections.',
    '6-टियर शू रैक टावर — 18-24 जोड़ी, कम जगह में।',
    'tall shoe rack tower six tier vertical',
    [['📏', '6 Tiers', 'Tall vertical design'], ['👟', '24 Pairs', 'Maximum shoe storage capacity'], ['📐', 'Narrow Footprint', 'Only 60 × 30 cm floor space'], ['🏗️', 'Anti-Tip', 'Wall anchor included']],
    [...STD_MATERIALS, 'Wall Anchor Kit'], STD_COLORS),

  p('SHOE_RACKS', 'Shoe Rack with Top Display Shelf',
    'Open shoe rack with a flat display shelf on top for keys, wallet, plants or photo frames. Entryway organization hub.',
    'टॉप डिस्प्ले शेल्फ वाला शू रैक — ऊपर चाबी, पौधे, फ्रेम रखें।',
    'shoe rack top shelf display entryway wooden',
    [['📦', 'Top Shelf', 'Flat display surface on top'], ['👟', '3 Shoe Tiers', 'Open tiers for 9-12 pairs'], ['🔑', 'Entryway Hub', 'Drop zone for keys, wallet, sunglasses'], ['📏', 'Standard', '80 × 30 × 90 cm']],
    STD_MATERIALS, OAK_COLORS),

  p('SHOE_RACKS', 'Compact 2-Tier Shoe Shelf',
    'Minimal 2-tier shoe shelf that slides under a bench or console table. Ultra-compact for small apartments.',
    'कॉम्पैक्ट 2-टियर शू शेल्फ — बेंच या कंसोल के नीचे रखें।',
    'small shoe rack two tier compact minimalist',
    [['📏', 'Ultra Compact', '60 × 30 × 30 cm'], ['👟', '6 Pairs', 'Holds 6 pairs on 2 tiers'], ['🏠', 'Under-Bench', 'Slides under bench or console'], ['🪶', 'Lightweight', 'Easy to move and clean under']],
    STD_MATERIALS, LIGHT_COLORS),

  p('SHOE_RACKS', 'Shoe Cabinet with Drawer',
    'Closed shoe cabinet with a top drawer for shoe care supplies — polish, brushes, insoles. Shoes below, supplies above.',
    'ड्रॉअर वाला शू कैबिनेट — ऊपर पॉलिश-ब्रश, नीचे जूते।',
    'shoe cabinet drawer top storage wooden',
    [['🗄️', 'Top Drawer', 'Drawer for polish, brushes, insoles'], ['👟', 'Cabinet Below', '3 shelves behind doors for 12 pairs'], ['🚪', 'Closed Doors', 'Hide shoes from view'], ['📏', 'Compact', '80 × 35 × 100 cm']],
    [...STD_MATERIALS, 'Metal Drawer Slides'], STD_COLORS),

  p('SHOE_RACKS', 'Entry Bench with Shoe Storage & Hooks',
    'Entryway bench combining shoe storage underneath, cushioned seat on top and coat hooks on the backboard. Complete entryway solution.',
    'एंट्री बेंच — शू स्टोरेज + कुशन सीट + कोट हुक्स।',
    'entry bench shoe storage coat hooks entryway',
    [['🪑', 'Cushioned Seat', 'Comfortable padded bench seat'], ['👟', 'Shoe Cubbies', '3 open shoe compartments below'], ['🪝', 'Coat Hooks', '4 hooks on back panel'], ['🏠', 'All-in-One', 'Complete entryway organization']],
    [...STD_MATERIALS, 'Foam Cushion', 'Metal Coat Hooks'],
    [['Walnut & Beige', '#5C3D2E'], ['White & Grey', '#FFFFFF'], ['Oak & Cream', '#C8A951']]),

  p('SHOE_RACKS', 'Large Family Shoe Cabinet 24-Pair',
    'Extra-large shoe cabinet for families. 4 flip-down compartments hold 24 pairs. Sleek exterior hides the chaos inside.',
    'बड़ा फ़ैमिली शू कैबिनेट — 24 जोड़ी, 4 फ्लिप-डाउन सेक्शन।',
    'large shoe cabinet family flip down compartments',
    [['👟', '24 Pairs', 'Holds up to 24 pairs'], ['🚪', '4 Flip Doors', 'Stacked flip-down compartments'], ['📏', 'Large', '80 × 20 × 150 cm'], ['✨', 'Clean Exterior', 'Flat front, no visible shoe mess']],
    [...STD_MATERIALS, 'Metal Flip Mechanism'], STD_COLORS),

  p('SHOE_RACKS', 'Rotating Carousel Shoe Rack',
    'Rotating circular shoe rack on a lazy Susan base. Spin to find the pair you want. Holds 20+ pairs in a small footprint.',
    'रोटेटिंग शू रैक — घुमाकर जूते खोजें, 20+ जोड़ी।',
    'rotating shoe rack carousel lazy susan',
    [['🔄', 'Rotating Base', '360° spin on lazy Susan'], ['👟', '20+ Pairs', '5 tiers of circular shelving'], ['📐', 'Small Footprint', '45 cm diameter'], ['📏', 'Tall', '120 cm height']],
    [...STD_MATERIALS, 'Steel Lazy Susan Bearing'], OAK_COLORS),

  p('SHOE_RACKS', 'Outdoor Shoe Rack Waterproof',
    'Shoe rack designed for covered outdoor areas — balconies, porches, verandas. Water-resistant laminate and ventilated design.',
    'आउटडोर शू रैक — बालकनी, बरामदे के लिए, पानी-रोधी।',
    'outdoor shoe rack waterproof balcony porch',
    [['💧', 'Water Resistant', 'Special laminate resists moisture'], ['🌬️', 'Ventilated', 'Slatted shelves for air flow'], ['👟', '4 Tiers', 'Holds 12-16 pairs'], ['🏡', 'Outdoor Ready', 'For covered balconies and porches']],
    ['Water-Resistant Laminated Board', 'Stainless Steel Hardware', 'PVC Edge Banding'],
    [['Teak', '#8B6914'], ['Grey', '#808080'], ['Walnut', '#5C3D2E']]),

  p('SHOE_RACKS', 'Shoe Rack with Seating & Storage Box',
    'Shoe bench with a lift-up cushioned seat hiding a storage box inside. Shoes on shelves below, accessories in the hidden box.',
    'स्टोरेज बॉक्स वाला शू बेंच — सीट उठाएं, अंदर सामान रखें।',
    'shoe bench storage box lift seat cushion',
    [['🪑', 'Lift-Up Seat', 'Cushioned seat opens to reveal box'], ['📦', 'Hidden Box', 'Internal storage for bags, gloves etc.'], ['👟', '2 Shoe Tiers', 'Open shelves for 8 pairs'], ['🏗️', 'Sturdy Seat', 'Supports 120 kg']],
    [...STD_MATERIALS, 'Gas Spring', 'Foam Cushion'], STD_COLORS),

  p('SHOE_RACKS', 'Sliding Door Shoe Cabinet',
    'Space-saving shoe cabinet with sliding doors instead of hinged. No swing clearance needed — perfect for tight hallways.',
    'स्लाइडिंग डोर शू कैबिनेट — स्विंग स्पेस नहीं चाहिए।',
    'sliding door shoe cabinet space saving hallway',
    [['↔️', 'Sliding Doors', 'Space-saving sliding mechanism'], ['👟', '4 Shelves', 'Holds 16-20 pairs'], ['📏', 'Hallway Fit', '80 × 20 × 120 cm'], ['🏠', 'Tight Spaces', 'No door swing clearance needed']],
    [...STD_MATERIALS, 'Sliding Door Track'], STD_COLORS),

  p('SHOE_RACKS', 'Wall-Mounted Folding Shoe Shelf',
    'Fold-down wall-mounted shoe shelf — flip it down when entering, fold it back up flush against the wall. Zero floor space.',
    'फोल्डिंग वॉल शू शेल्फ — नीचे करें जूते रखें, ऊपर मोड़ें जगह बचाएं।',
    'wall mounted folding shoe shelf flip down',
    [['🖼️', 'Wall Mounted', 'Mounts directly to wall'], ['📐', 'Folds Flat', 'Flush against wall when not in use'], ['👟', '4 Pairs', 'Holds 4 pairs when open'], ['🏠', 'Zero Floor Space', 'Nothing touches the ground']],
    [...STD_MATERIALS, 'Wall Mounting Hardware', 'Hinges'], LIGHT_COLORS),

  p('SHOE_RACKS', 'Shoe Rack Under Staircase',
    'Custom-profile shoe rack designed to fit under a staircase. Triangular profile matches the staircase angle. Maximizes dead space.',
    'सीढ़ी के नीचे का शू रैक — तिरछा डिज़ाइन, डेड स्पेस का इस्तेमाल।',
    'shoe storage under staircase triangle space',
    [['📐', 'Staircase Profile', 'Triangular shape matches stair angle'], ['👟', 'Variable Height', 'Taller at one end, shorter at other'], ['📦', 'Pull-Out Drawers', 'Easy-access pull-out trays'], ['🏠', 'Dead Space', 'Converts unused area to storage']],
    [...STD_MATERIALS, 'Metal Pull-Out Slides'], STD_COLORS),

  // ═══════════════════════════════════════════════════════════════════════════
  // KITCHEN & PANTRY — 16 new (already have 4)
  // ═══════════════════════════════════════════════════════════════════════════

  p('KITCHEN_PANTRY', 'Kitchen Wall Cabinet Set',
    'Set of 3 wall-mounted kitchen upper cabinets with hinged doors. Standard sizes to cover a full kitchen wall. Stores dishes, spices and dry goods.',
    '3 वॉल कैबिनेट का सेट — बर्तन, मसाले, सूखा सामान रखें।',
    'kitchen wall cabinet upper mounted wooden',
    [['📦', '3 Cabinets', 'Set of 3 standard-width units'], ['🚪', 'Hinged Doors', 'Soft-close door hinges'], ['📐', 'Adjustable Shelves', 'Repositionable internal shelves'], ['🏗️', 'Wall Mount', 'Heavy-duty wall hanging brackets']],
    [...STD_MATERIALS, 'Soft-Close Hinges', 'Wall Brackets'], LIGHT_COLORS),

  p('KITCHEN_PANTRY', 'Under-Sink Storage Cabinet',
    'Cabinet designed to fit around the sink plumbing. U-shaped cutout at the back accommodates pipes. Organizes cleaning supplies.',
    'सिंक के नीचे का कैबिनेट — पाइप के लिए कटआउट, सफाई सामान रखें।',
    'under sink cabinet kitchen storage plumbing',
    [['🔧', 'Plumbing Cutout', 'U-shaped rear cutout for pipes'], ['🚪', 'Double Doors', 'Easy access to contents'], ['📦', 'Internal Shelf', 'Adjustable shelf inside'], ['💧', 'Water Resistant', 'Water-resistant base edge']],
    ['Water-Resistant Laminated Board', 'PVC Edge Banding', 'Soft-Close Hinges'],
    [['White', '#FFFFFF'], ['Light Oak', '#D2B48C'], ['Grey', '#808080']]),

  p('KITCHEN_PANTRY', 'Wall-Mounted Spice Rack',
    'Compact wall-mounted rack with 3 tiers for spice jars and bottles. Keeps all spices visible and within arm\'s reach while cooking.',
    'वॉल-माउंटेड स्पाइस रैक — मसाले नज़र में और हाथ की पहुंच में।',
    'wall mounted spice rack kitchen wooden shelf',
    [['🫙', '3 Tiers', 'Holds 20-25 spice jars'], ['🖼️', 'Wall Mount', 'Easy wall installation'], ['📏', 'Compact', '50 × 10 × 40 cm'], ['👀', 'Visible', 'All labels visible at a glance']],
    STD_MATERIALS, LIGHT_COLORS),

  p('KITCHEN_PANTRY', 'Kitchen Island Unit',
    'Freestanding kitchen island with countertop, lower cabinets, drawer and towel bar. Creates extra prep space and storage.',
    'किचन आइलैंड यूनिट — एक्स्ट्रा काउंटर, कैबिनेट, ड्रॉअर, टॉवल बार।',
    'kitchen island unit counter storage wooden',
    [['🔪', 'Counter Top', 'Durable laminate work surface'], ['🗄️', 'Cabinets', '2 closed cabinet sections'], ['🗄️', 'Drawer', 'Full-width utensil drawer'], ['🧺', 'Towel Bar', 'Side-mounted towel rail']],
    [...STD_MATERIALS, 'SS Towel Bar', 'Heavy-Duty Casters'],
    [['White & Walnut Top', '#FFFFFF'], ['All Walnut', '#5C3D2E'], ['Grey & Oak Top', '#808080']]),

  p('KITCHEN_PANTRY', 'Pull-Out Pantry Cabinet',
    'Narrow pull-out pantry — the entire cabinet slides out on rails, revealing shelves on both sides. Fits in a 15-20 cm gap.',
    'पुल-आउट पैंट्री — पूरा कैबिनेट बाहर खींचें, दोनों तरफ शेल्व्ज़।',
    'pull out pantry cabinet narrow kitchen storage',
    [['↔️', 'Pull-Out Design', 'Entire unit slides out on rails'], ['📏', 'Ultra Narrow', 'Fits 15-20 cm gaps'], ['📦', 'Both Sides', 'Shelves accessible from both sides'], ['🏗️', 'Heavy Duty', 'Full-extension ball-bearing slides']],
    [...STD_MATERIALS, 'Ball-Bearing Slides', 'SS Handle'], LIGHT_COLORS),

  p('KITCHEN_PANTRY', 'Plate Rack & Dish Organizer',
    'Standing plate rack with vertical slots for plates, bowls and cutting boards. Keeps dishes organized and air-dried.',
    'प्लेट रैक — बर्तन खड़े रखें, हवा से सूखें, ऑर्गनाइज़्ड।',
    'plate rack dish organizer wooden kitchen stand',
    [['🍽️', 'Plate Slots', 'Vertical dividers for 15-20 plates'], ['🥣', 'Bowl Section', 'Dedicated bowl compartment'], ['🔪', 'Cutting Board Slot', 'Side slot for cutting boards'], ['💧', 'Air Dry', 'Open design for ventilation']],
    STD_MATERIALS, LIGHT_COLORS),

  p('KITCHEN_PANTRY', 'Grain & Ration Storage Unit',
    'Kitchen storage unit with multiple pull-out bins for grains, pulses, flour and dry rations. Airtight-ready compartments.',
    'अनाज-दाल स्टोरेज यूनिट — पुल-आउट बिन्स, एयरटाइट कम्पार्टमेंट।',
    'kitchen grain storage bin unit wooden pantry',
    [['🫘', 'Pull-Out Bins', '6 removable storage bins'], ['🌾', 'Grain Safe', 'Deep bins for flour, rice, dal'], ['📐', 'Labeled Fronts', 'Space for labels on each bin'], ['🏗️', 'Floor Standing', '60 × 40 × 90 cm']],
    [...STD_MATERIALS, 'Plastic Bin Inserts'], LIGHT_COLORS),

  p('KITCHEN_PANTRY', 'Kitchen Base Cabinet with Drawers',
    'Standard kitchen base cabinet with 2 top drawers and a lower shelf behind a door. Foundation unit for modular kitchen layouts.',
    'किचन बेस कैबिनेट — 2 ड्रॉअर + डोर कैबिनेट, मॉड्यूलर किचन बेस।',
    'kitchen base cabinet drawers door wooden modular',
    [['🗄️', '2 Drawers', 'Top section with 2 drawers'], ['🚪', 'Cabinet Below', 'Lower section with door and shelf'], ['📏', 'Standard Width', '60 cm kitchen module width'], ['🔪', 'Countertop Ready', 'Flat top for countertop installation']],
    [...STD_MATERIALS, 'Soft-Close Hardware'], LIGHT_COLORS),

  p('KITCHEN_PANTRY', 'Kitchen Shelf Unit 4-Tier',
    'Open 4-tier kitchen shelf for storing appliances, jars and cookbooks. No doors — everything visible and accessible.',
    '4-टियर ओपन किचन शेल्फ — अप्लायंसेज़, जार, कुकबुक रखें।',
    'kitchen shelf unit four tier open storage',
    [['📦', '4 Tiers', 'Open shelves for easy access'], ['📏', 'Standard Width', '60 × 35 × 120 cm'], ['🏗️', 'Sturdy', 'Each shelf holds 20 kg'], ['👀', 'Everything Visible', 'No doors, quick grab']],
    STD_MATERIALS, LIGHT_COLORS),

  p('KITCHEN_PANTRY', 'Kitchen Overhead Cabinet with Glass',
    'Wall-mounted kitchen cabinet with frosted glass doors. See contents at a glance without opening. Holds glasses and tea sets.',
    'ग्लास डोर किचन ओवरहेड कैबिनेट — अंदर दिखे बिना खोले।',
    'kitchen overhead cabinet glass door wall mount',
    [['🪟', 'Frosted Glass', 'See-through frosted glass doors'], ['📦', '2 Shelves', 'Adjustable shelves inside'], ['🏗️', 'Wall Mount', 'Secure bracket system'], ['📏', 'Standard', '60 × 30 × 60 cm']],
    [...STD_MATERIALS, 'Frosted Glass', 'Wall Brackets'], LIGHT_COLORS),

  p('KITCHEN_PANTRY', 'Vegetable Basket Trolley',
    'Kitchen trolley with 3 wire basket tiers for vegetables, fruits and root items. Ventilated baskets keep produce fresh longer.',
    'वेजिटेबल बास्केट ट्रॉली — सब्ज़ी-फल ताज़ा रहें, हवादार बास्केट।',
    'vegetable basket trolley kitchen wire rack wooden',
    [['🥬', '3 Wire Baskets', 'Ventilated baskets for produce'], ['🛒', 'Rolling', 'Casters for easy movement'], ['🌬️', 'Ventilated', 'Air circulation keeps food fresh'], ['📏', 'Compact', '45 × 35 × 80 cm']],
    ['Laminated Particle Board Frame', 'Wire Mesh Baskets', 'Locking Casters'], LIGHT_COLORS),

  p('KITCHEN_PANTRY', 'Kitchen Counter Extension Table',
    'Fold-out counter extension that attaches to existing kitchen counters. Flip up for extra prep space, fold down when done.',
    'फोल्ड-आउट किचन काउंटर एक्सटेंशन — ज़रूरत पर खोलें, बाद में बंद करें।',
    'kitchen counter extension fold out table',
    [['📐', 'Fold-Out', 'Extends counter by 40 cm'], ['📏', 'Work Surface', 'Matches existing counter height'], ['🏗️', 'Sturdy Support', 'Folding bracket supports 30 kg'], ['🏠', 'Space Saver', 'Folds flat against wall/counter']],
    [...STD_MATERIALS, 'Steel Folding Bracket'], LIGHT_COLORS),

  p('KITCHEN_PANTRY', 'Bread & Snack Storage Box',
    'Countertop bread box and snack storage with roll-top or flip-lid door. Keeps bread fresh and countertop tidy.',
    'ब्रेड-स्नैक स्टोरेज बॉक्स — काउंटरटॉप पर, ब्रेड ताज़ा रखें।',
    'bread box storage countertop kitchen wooden',
    [['🍞', 'Roll-Top Lid', 'Easy roll-up or flip-lid opening'], ['📦', 'Roomy Interior', 'Fits 2 loaves + snack packets'], ['📏', 'Countertop Size', '40 × 25 × 20 cm'], ['✨', 'Clean Look', 'Hides bread clutter on counter']],
    STD_MATERIALS, LIGHT_COLORS),

  p('KITCHEN_PANTRY', 'Kitchen Appliance Cupboard',
    'Tall cabinet for storing kitchen appliances — mixer, blender, pressure cooker, air fryer. Keeps counter clear, appliances protected.',
    'किचन अप्लायंस कपबोर्ड — मिक्सर, ब्लेंडर, कुकर सब अंदर।',
    'kitchen appliance cabinet tall storage cupboard',
    [['📦', 'Deep Shelves', 'Fits large appliances (mixer, blender)'], ['🚪', 'Double Doors', 'Conceals appliances from view'], ['📐', 'Adjustable Shelves', 'Repositions for different appliance sizes'], ['📏', 'Tall Unit', '60 × 45 × 150 cm']],
    [...STD_MATERIALS, 'Heavy-Duty Hinges'], LIGHT_COLORS),

  p('KITCHEN_PANTRY', 'Dish Drying Cabinet Wall Mount',
    'Wall-mounted dish dryer cabinet that sits above the sink. Place wet dishes on racks inside; water drips into the sink below.',
    'डिश ड्राइंग कैबिनेट — सिंक के ऊपर, बर्तन सुखाएं, पानी सिंक में।',
    'dish drying cabinet wall mount kitchen rack',
    [['💧', 'Drip Design', 'Slatted bottom lets water drain to sink'], ['📦', 'Plate Racks', 'Vertical slots for plates and bowls'], ['🥂', 'Glass Hooks', 'Inverted glass drying hooks'], ['🏗️', 'Wall Mount', 'Secures above sink area']],
    ['Water-Resistant Laminated Board', 'Stainless Steel Racks', 'Wall Brackets'], LIGHT_COLORS),

  p('KITCHEN_PANTRY', 'Refrigerator Side Storage Panel',
    'Narrow shelf unit designed to fit in the gap beside a refrigerator. Pull-out design for easy access to stored items.',
    'फ्रिज साइड स्टोरेज — फ्रिज के बगल की गैप में फिट, पुल-आउट।',
    'refrigerator side storage narrow gap kitchen',
    [['📏', 'Gap Filler', 'Fits 15-25 cm gaps beside fridge'], ['↔️', 'Pull-Out', 'Slides out for easy access'], ['📦', '4 Shelves', 'Narrow shelves for bottles, cans, wraps'], ['🏗️', 'Casters', 'Rolls out on hidden casters']],
    [...STD_MATERIALS, 'Hidden Casters', 'SS Handle'], LIGHT_COLORS),

  // ═══════════════════════════════════════════════════════════════════════════
  // BEDROOM FURNITURE — 16 new (already have 4)
  // ═══════════════════════════════════════════════════════════════════════════

  p('BEDROOM_FURNITURE', 'King Size Bed with Box Storage',
    'King-size bed (6×6.5 ft) with full-area box storage under the mattress. Hydraulic lift mechanism for effortless access.',
    'किंग साइज़ बेड बॉक्स स्टोरेज — 6×6.5 ft, हाइड्रोलिक लिफ्ट।',
    'king size bed storage hydraulic wooden modern',
    [['🛏️', 'King Size', '6 × 6.5 ft mattress area'], ['📦', 'Box Storage', 'Full under-mattress storage cavity'], ['🏗️', 'Hydraulic Lift', 'Gas-spring mechanism'], ['✨', 'Panel Headboard', 'Wide headboard with design panel']],
    [...STD_MATERIALS, 'Hydraulic Gas Springs'], STD_COLORS),

  p('BEDROOM_FURNITURE', 'Single Bed with Side Drawers',
    'Single bed (3×6 ft) with 2 pull-out drawers on the side. Stores bedding, clothes or toys without needing separate storage.',
    'सिंगल बेड साइड ड्रॉअर — 2 ड्रॉअर, बिस्तर या खिलौने रखें।',
    'single bed drawers side storage wooden',
    [['🛏️', 'Single Size', '3 × 6 ft mattress area'], ['🗄️', '2 Side Drawers', 'Pull-out drawers on one side'], ['📐', 'Low Height', 'Easy for children and elderly'], ['🏗️', 'Sturdy', 'Supports up to 200 kg']],
    [...STD_MATERIALS, 'Metal Drawer Slides'], STD_COLORS),

  p('BEDROOM_FURNITURE', 'Bunk Bed with Storage Steps',
    'Space-saving bunk bed with built-in storage drawers in the staircase steps. Each step is a pull-out drawer. Ideal for kids sharing rooms.',
    'बंक बेड स्टोरेज स्टेप्स — हर सीढ़ी एक ड्रॉअर, दो बच्चे एक कमरे में।',
    'bunk bed storage steps drawers kids wooden',
    [['🛏️', 'Double Bunk', 'Upper and lower single beds'], ['🪜', 'Storage Steps', 'Each step is a pull-out drawer'], ['🏗️', 'Safety Rails', 'Upper bunk safety guardrails'], ['📏', 'Single Beds', '3 × 6 ft each']],
    [...STD_MATERIALS, 'Metal Safety Rails', 'Metal Drawer Slides'],
    [['Walnut', '#5C3D2E'], ['White & Blue', '#4A90D9'], ['White & Pink', '#F4A7BB']]),

  p('BEDROOM_FURNITURE', 'Bedside Table with 2 Drawers',
    'Double-drawer nightstand with ample storage for bedside essentials. Slim profile fits beside any bed without taking too much space.',
    'डबल ड्रॉअर बेडसाइड टेबल — फ़ोन, किताब, दवाई सब रखें।',
    'nightstand two drawers bedside modern wooden',
    [['🗄️', '2 Drawers', 'Double soft-close drawers'], ['📏', 'Slim Profile', '40 × 35 × 55 cm'], ['✨', 'Flat Top', 'Surface for lamp and phone'], ['🏗️', 'Bed Height Match', 'Standard bed-matching height']],
    [...STD_MATERIALS, 'Soft-Close Slides'], OAK_COLORS),

  p('BEDROOM_FURNITURE', 'Blanket Box Storage Ottoman',
    'Freestanding blanket box with a flat padded top that doubles as a bench. Store blankets, pillows and seasonal bedding inside.',
    'ब्लैंकेट बॉक्स ऑटोमन — कंबल-तकिए रखें, ऊपर बैठें।',
    'blanket box ottoman storage bench bedroom',
    [['📦', 'Deep Storage', 'Spacious interior for bulky items'], ['🪑', 'Padded Top', 'Sit on it as a bench'], ['📏', 'Bed End', '120 × 45 × 45 cm, sits at foot of bed'], ['🏗️', 'Hydraulic Lid', 'Slow-close lid mechanism']],
    [...STD_MATERIALS, 'Foam Padding', 'Hydraulic Slow-Close'], STD_COLORS),

  p('BEDROOM_FURNITURE', 'Bed with Headboard Shelves',
    'Modern bed with built-in headboard shelves and niches. Replace the nightstand — books, phone and lamp sit right on the headboard.',
    'हेडबोर्ड शेल्व्ज़ वाला बेड — नाइटस्टैंड की ज़रूरत नहीं।',
    'bed headboard shelves storage modern bedroom',
    [['📚', 'Headboard Shelves', '3 niches built into headboard'], ['💡', 'LED Ready', 'Groove for LED reading lights'], ['🛏️', 'Queen Size', '5 × 6.5 ft mattress area'], ['📱', 'Phone Shelf', 'Dedicated shallow phone shelf']],
    [...STD_MATERIALS, 'LED Channel'], OAK_COLORS),

  p('BEDROOM_FURNITURE', 'Platform Bed Minimalist',
    'Low-profile platform bed with no headboard or footboard. Clean, modern aesthetic. Mattress sits directly on the slatted platform.',
    'प्लेटफ़ॉर्म बेड मिनिमलिस्ट — कम ऊंचाई, क्लीन मॉडर्न लुक।',
    'platform bed low modern minimalist wooden',
    [['📐', 'Low Profile', 'Only 25 cm frame height'], ['🛏️', 'Slatted Base', 'Ventilated slatted platform'], ['✨', 'Minimal Design', 'No headboard, no footboard'], ['📏', 'Queen Size', '5 × 6.5 ft mattress area']],
    STD_MATERIALS, [['Light Oak', '#D2B48C'], ['Walnut', '#5C3D2E'], ['White', '#FFFFFF']]),

  p('BEDROOM_FURNITURE', 'Trundle Bed Pull-Out',
    'Bed with a pull-out trundle bed underneath. Main bed + guest bed in one footprint. Trundle rolls out on casters.',
    'ट्रंडल बेड — नीचे से एक और बेड निकालें, मेहमानों के लिए।',
    'trundle bed pull out guest bed wooden',
    [['🛏️', 'Main Bed', 'Single/double size main bed'], ['🛏️', 'Trundle Below', 'Pull-out guest bed on casters'], ['🛒', 'Easy Roll', 'Casters for smooth pull-out'], ['🏠', 'Guest Ready', '2 beds in 1 footprint']],
    [...STD_MATERIALS, 'Metal Casters'], STD_COLORS),

  p('BEDROOM_FURNITURE', 'Loft Bed with Desk Below',
    'Elevated loft bed with a full study desk underneath. Maximizes vertical space — sleep above, study/work below.',
    'लॉफ्ट बेड — ऊपर सोएं, नीचे स्टडी डेस्क।',
    'loft bed desk below elevated study bedroom',
    [['🛏️', 'Elevated Bed', 'Single bed raised to 5.5 ft'], ['📚', 'Desk Below', 'Full desk workspace underneath'], ['🪜', 'Safety Ladder', 'Built-in ladder with guardrails'], ['📦', 'Shelf Unit', 'Side bookshelf included']],
    [...STD_MATERIALS, 'Metal Safety Rails', 'Metal Ladder'],
    [['Walnut', '#5C3D2E'], ['White', '#FFFFFF'], ['Blue & White', '#4A90D9']]),

  p('BEDROOM_FURNITURE', 'Under-Bed Storage Drawer Set',
    'Set of 2 rolling storage drawers designed to slide under any standard bed. No bed modification needed. Stores clothes, shoes or linen.',
    '2 अंडर-बेड रोलिंग ड्रॉअर — किसी भी बेड के नीचे फिट।',
    'under bed storage drawer rolling set',
    [['🗄️', 'Set of 2', 'Two independent drawer units'], ['🛒', 'Rolling', 'Smooth-glide casters'], ['📏', 'Under-Bed Fit', '15 cm height fits under most beds'], ['📐', 'No Modification', 'Slides under without altering bed']],
    [...STD_MATERIALS, 'Low-Profile Casters'], STD_COLORS),

  p('BEDROOM_FURNITURE', 'Bedroom Wall Unit Combo',
    'Full-wall bedroom unit combining wardrobe, overhead loft and bridge unit above the bed. Maximizes every inch of wall space.',
    'बेडरूम वॉल यूनिट कॉम्बो — वार्डरोब + लॉफ्ट + ब्रिज यूनिट।',
    'bedroom wall unit wardrobe overhead bridge',
    [['🏗️', 'Full Wall', 'Side wardrobes + overhead bridge'], ['🛏️', 'Bed Niche', 'Bed sits in the central opening'], ['📦', 'Bridge Storage', 'Overhead cabinet above headboard'], ['📐', 'Integrated', 'One cohesive unit, no gaps']],
    [...STD_MATERIALS, 'Heavy-Duty Hardware'], STD_COLORS),

  p('BEDROOM_FURNITURE', 'Low Platform Bed with Side Tables',
    'Contemporary low bed with matching attached side tables. Floating design with built-in LED strip under the frame.',
    'लो प्लेटफ़ॉर्म बेड + साइड टेबल — LED अंडरग्लो, मॉडर्न लुक।',
    'low platform bed attached side tables led modern',
    [['🛏️', 'Low Frame', 'Ultra-low 20 cm frame height'], ['📱', 'Attached Tables', 'Built-in floating side tables'], ['💡', 'LED Under-glow', 'Warm LED strip under frame'], ['✨', 'Floating Look', 'Recessed base creates floating effect']],
    [...STD_MATERIALS, 'LED Strip', 'Recessed Base'],
    [['Walnut & LED', '#5C3D2E'], ['White & LED', '#FFFFFF'], ['Dark Oak & LED', '#3E2723']]),

  p('BEDROOM_FURNITURE', 'Murphy Wall Bed Fold-Up',
    'Space-saving Murphy bed that folds up into a wall cabinet when not in use. Looks like a cabinet during the day, unfolds to a full bed at night.',
    'मर्फी वॉल बेड — दिन में कैबिनेट, रात में बेड। जगह बचाएं।',
    'murphy bed wall fold up space saving cabinet',
    [['📐', 'Folds Up', 'Bed folds vertically into wall cabinet'], ['🛏️', 'Double Size', '4.5 × 6 ft sleeping area'], ['🏗️', 'Gas Springs', 'Effortless fold/unfold mechanism'], ['🏠', 'Day Cabinet', 'Looks like a regular cabinet when folded']],
    [...STD_MATERIALS, 'Heavy-Duty Gas Springs', 'Metal Frame'], STD_COLORS),

  p('BEDROOM_FURNITURE', 'Kids Bed with Guard Rail',
    'Child-safe single bed with removable guard rail on one side. Prevents falls during sleep. Colorful finishes available.',
    'गार्ड रेल वाला किड्स बेड — नींद में गिरने से बचाए।',
    'kids bed guard rail safety children colorful',
    [['🛏️', 'Single Bed', '3 × 6 ft for children'], ['🛡️', 'Guard Rail', 'Removable safety rail on one side'], ['✨', 'Rounded Corners', 'All edges softened for safety'], ['🎨', 'Fun Colors', 'Available in bright options']],
    [...STD_MATERIALS, 'Removable Metal Guard Rail'],
    [['White & Blue', '#4A90D9'], ['White & Pink', '#F4A7BB'], ['Natural Wood', '#D2B48C']]),

  p('BEDROOM_FURNITURE', 'Bed with Upholstered Headboard',
    'Elegant bed with a cushioned upholstered headboard in fabric or leatherette. Comfortable for sitting up in bed.',
    'कुशन हेडबोर्ड वाला बेड — बैठकर पढ़ने के लिए आरामदायक।',
    'bed upholstered headboard cushion fabric modern',
    [['🛋️', 'Cushioned Headboard', 'Padded fabric or leatherette headboard'], ['🛏️', 'Queen Size', '5 × 6.5 ft mattress area'], ['📦', 'Box Storage', 'Hydraulic under-mattress storage'], ['✨', 'Premium Look', 'Tufted or plain upholstery options']],
    [...STD_MATERIALS, 'Foam Padding', 'Fabric/Leatherette'],
    [['Walnut & Beige', '#5C3D2E'], ['Grey Frame & Grey Fabric', '#808080'], ['White & Cream', '#FFFFFF']]),

  p('BEDROOM_FURNITURE', 'Bed with Foot Storage Bench',
    'Bed with an integrated storage bench at the foot. Open the bench lid to store extra pillows, blankets or luggage.',
    'फुट स्टोरेज बेंच वाला बेड — पैर की तरफ खुलने वाला बेंच।',
    'bed foot bench storage integrated bedroom',
    [['🛏️', 'Full Bed', 'Queen size with headboard'], ['🪑', 'Foot Bench', 'Integrated bench at foot of bed'], ['📦', 'Bench Storage', 'Lid opens to reveal storage inside'], ['📏', 'Extended Length', 'Bench adds 40 cm to bed length']],
    [...STD_MATERIALS, 'Slow-Close Lid'], STD_COLORS),

  // ═══════════════════════════════════════════════════════════════════════════
  // DRESSING TABLES — 16 new (already have 4)
  // ═══════════════════════════════════════════════════════════════════════════

  p('DRESSING_TABLES', 'Compact Corner Dressing Table',
    'Small dressing table designed for room corners. Triangular profile fits snugly into 90-degree corners. Mirror and drawer included.',
    'कॉर्नर ड्रेसिंग टेबल — कोने में फिट, मिरर + ड्रॉअर।',
    'corner dressing table vanity small compact',
    [['📐', 'Corner Fit', 'Triangular shape for 90° corners'], ['🪞', 'Hinged Mirror', 'Adjustable-angle mirror'], ['🗄️', 'Drawer', 'Single cosmetics drawer'], ['📏', 'Compact', '60 × 60 × 75 cm (corner measurements)']],
    [...STD_MATERIALS, 'Mirror Glass'], LIGHT_COLORS),

  p('DRESSING_TABLES', 'Dressing Table with LED Mirror',
    'Modern dressing table with an LED-lit mirror frame. Bright, even lighting for precise makeup application. Touch on/off control.',
    'LED मिरर ड्रेसिंग टेबल — मेकअप के लिए ब्राइट इवन लाइटिंग।',
    'dressing table LED mirror light vanity modern',
    [['💡', 'LED Mirror', 'Ring-lit LED frame around mirror'], ['🔘', 'Touch Control', 'Touch on/off + dimmer'], ['🗄️', '2 Drawers', 'Soft-close cosmetics drawers'], ['🔌', 'USB Port', 'Built-in USB charging port']],
    [...STD_MATERIALS, 'LED Ring Light', 'Touch Dimmer'],
    [['White', '#FFFFFF'], ['Walnut', '#5C3D2E'], ['Rose Gold & White', '#B76E79']]),

  p('DRESSING_TABLES', 'Full-Length Mirror Dressing Unit',
    'Floor-standing dressing unit with full-length mirror door. Behind the mirror: shelves for jewelry, cosmetics and accessories.',
    'फुल-लेंथ मिरर ड्रेसिंग यूनिट — मिरर खोलें, अंदर शेल्व्ज़।',
    'full length mirror cabinet dressing jewelry storage',
    [['🪞', 'Full Mirror', 'Full-length mirror door'], ['📦', 'Hidden Storage', 'Shelves and hooks behind mirror'], ['💍', 'Jewelry Hooks', 'Earring, necklace and ring organizers'], ['📏', 'Floor Standing', '50 × 30 × 160 cm']],
    [...STD_MATERIALS, 'Mirror Glass', 'Velvet Lining'], LIGHT_COLORS),

  p('DRESSING_TABLES', 'Dressing Table with Jewelry Organizer',
    'Dressing table with a flip-top mirror hiding a velvet-lined jewelry compartment. Rings, earrings and necklaces organized inside.',
    'ज्वेलरी ऑर्गनाइज़र ड्रेसिंग टेबल — मिरर खोलें, गहने ऑर्गनाइज़्ड।',
    'dressing table jewelry organizer flip mirror vanity',
    [['💍', 'Jewelry Section', 'Velvet-lined compartments under flip mirror'], ['🪞', 'Flip Mirror', 'Mirror under flip-top lid'], ['🗄️', '2 Drawers', 'Side drawers for cosmetics'], ['📐', 'Elegant Design', 'Clean exterior, treasures inside']],
    [...STD_MATERIALS, 'Mirror Glass', 'Velvet Lining'], LIGHT_COLORS),

  p('DRESSING_TABLES', 'Minimalist Floating Vanity',
    'Wall-mounted floating vanity shelf with a simple mirror above. Ultra-minimal design — a shelf, a drawer, a mirror. Nothing more.',
    'मिनिमलिस्ट फ्लोटिंग वैनिटी — बस शेल्फ, ड्रॉअर, मिरर।',
    'floating vanity shelf wall mounted minimalist',
    [['🖼️', 'Floating', 'Wall-mounted, no legs'], ['🪞', 'Simple Mirror', 'Separate wall mirror above'], ['🗄️', 'Single Drawer', 'One clean drawer'], ['📏', 'Minimal', '80 × 30 × 15 cm shelf only']],
    [...STD_MATERIALS, 'French Cleat'], [['White', '#FFFFFF'], ['Natural Oak', '#D2B48C'], ['Walnut', '#5C3D2E']]),

  p('DRESSING_TABLES', 'Dressing Table with Tri-Fold Mirror',
    'Classic dressing table with a 3-panel folding mirror. Side panels angle inward for viewing from multiple angles.',
    'ट्राई-फोल्ड मिरर ड्रेसिंग टेबल — तीन तरफ से देखें।',
    'dressing table tri fold mirror three panel classic',
    [['🪞', 'Tri-Fold Mirror', '3 panels fold to show multiple angles'], ['🗄️', '3 Drawers', 'Center + 2 side drawers'], ['📏', 'Standard Size', '100 × 45 × 75 cm table'], ['✨', 'Classic Design', 'Timeless dressing table profile']],
    [...STD_MATERIALS, 'Mirror Glass Panels'], STD_COLORS),

  p('DRESSING_TABLES', 'Dressing Table with Lighted Hollywood Mirror',
    'Glamorous dressing table with Hollywood-style lighted mirror — bulb-surrounded frame for shadow-free lighting.',
    'हॉलीवुड मिरर ड्रेसिंग टेबल — बल्ब फ्रेम, शैडो-फ्री लाइटिंग।',
    'dressing table hollywood mirror lights bulbs vanity',
    [['💡', 'Hollywood Mirror', 'Bulb-surrounded mirror frame'], ['🗄️', '2 Drawers', 'Wide makeup drawers'], ['📏', 'Wide Table', '100 × 45 cm surface'], ['🔌', 'Power Strip', 'Built-in power outlet for tools']],
    [...STD_MATERIALS, 'LED Bulb Frame', 'Power Strip'],
    [['White', '#FFFFFF'], ['Black & Gold', '#1A1A1A'], ['Pink & White', '#F4A7BB']]),

  p('DRESSING_TABLES', 'Kids Dressing Table with Mirror',
    'Small, fun dressing table for children with a safe shatter-proof mirror, colorful design and small storage drawers.',
    'बच्चों का ड्रेसिंग टेबल — शैटर-प्रूफ मिरर, रंगीन डिज़ाइन।',
    'kids dressing table mirror children vanity colorful',
    [['👶', 'Child Size', '60 × 35 × 90 cm total height'], ['🪞', 'Safe Mirror', 'Shatter-proof acrylic mirror'], ['🗄️', 'Small Drawers', '2 mini drawers for accessories'], ['🎨', 'Fun Design', 'Colorful themed finish']],
    [...STD_MATERIALS, 'Acrylic Mirror'],
    [['White & Pink', '#F4A7BB'], ['White & Blue', '#4A90D9'], ['White & Lavender', '#A78BFA']]),

  p('DRESSING_TABLES', 'Dressing Table with Ottoman Storage Stool',
    'Dressing table paired with a matching ottoman that has hidden storage inside. Lift the cushion to store hair tools and supplies.',
    'ऑटोमन स्टोरेज स्टूल वाला ड्रेसिंग टेबल — स्टूल में भी स्टोरेज।',
    'dressing table ottoman storage stool vanity set',
    [['🪞', 'Table + Mirror', 'Standard dressing table with mirror'], ['🪑', 'Storage Ottoman', 'Cushioned stool with hidden storage inside'], ['🗄️', 'Table Drawers', '2 cosmetics drawers'], ['📦', 'Stool Storage', 'Hair dryer, tools fit inside stool']],
    [...STD_MATERIALS, 'Foam Cushion', 'Fabric/Leatherette'], LIGHT_COLORS),

  p('DRESSING_TABLES', 'Narrow Space Dressing Table',
    'Ultra-slim dressing table only 30 cm deep — fits against any wall without protruding. Fold-down mirror saves even more space.',
    'पतला ड्रेसिंग टेबल — सिर्फ 30cm गहरा, कहीं भी फिट।',
    'narrow dressing table slim space saving wall',
    [['📏', 'Ultra Slim', 'Only 30 cm depth'], ['🪞', 'Fold-Down Mirror', 'Mirror folds flat when not in use'], ['🗄️', 'Drawer', 'Slim-profile drawer'], ['🏠', 'Any Wall', 'Fits even in narrow hallways']],
    [...STD_MATERIALS, 'Mirror Glass', 'Piano Hinge'], LIGHT_COLORS),

  p('DRESSING_TABLES', 'Dressing Table with Glass Top',
    'Elegant dressing table with a clear glass top over the particle board surface. Easy to clean, protects the surface, premium look.',
    'ग्लास टॉप ड्रेसिंग टेबल — साफ करना आसान, प्रीमियम लुक।',
    'dressing table glass top elegant modern vanity',
    [['🪟', 'Glass Top', 'Clear tempered glass over surface'], ['🪞', 'Wall Mirror', 'Separate large wall mirror'], ['🗄️', '3 Drawers', 'Full-width cosmetics drawers'], ['✨', 'Premium', 'Glass top adds elegance']],
    [...STD_MATERIALS, 'Tempered Glass Top', 'Mirror Glass'], OAK_COLORS),

  p('DRESSING_TABLES', 'Wall Console Dressing Unit',
    'Floating wall-mounted console that serves as a dressing station. Shelf + mirror + hooks — everything wall-mounted, nothing on the floor.',
    'वॉल कंसोल ड्रेसिंग यूनिट — सब दीवार पर, ज़मीन पर कुछ नहीं।',
    'wall console dressing unit floating mount shelf',
    [['🖼️', 'Wall System', 'All components wall-mounted'], ['🪞', 'Mirror Panel', 'Attached wall mirror'], ['📦', 'Console Shelf', 'Floating shelf for essentials'], ['🪝', 'Hooks', 'Side hooks for accessories']],
    [...STD_MATERIALS, 'Mirror Glass', 'French Cleat'], LIGHT_COLORS),

  p('DRESSING_TABLES', 'Dressing Table with Side Cabinet',
    'Dressing table with a tall side cabinet for storing clothes, bags or more cosmetics. Combines vanity with extra storage.',
    'साइड कैबिनेट वाला ड्रेसिंग टेबल — वैनिटी + एक्स्ट्रा स्टोरेज।',
    'dressing table side cabinet storage tall vanity',
    [['🪞', 'Central Mirror', 'Main dressing mirror'], ['🗄️', 'Side Cabinet', 'Tall cabinet on one side'], ['📦', 'Table Drawers', '2 drawers in table section'], ['📐', 'Asymmetric', 'Different heights create interest']],
    [...STD_MATERIALS, 'Soft-Close Hinges'], STD_COLORS),

  p('DRESSING_TABLES', 'Men\'s Grooming Station',
    'Masculine grooming table with mirror, drawer for grooming tools and holder slots for cologne/aftershave bottles.',
    'मेन्स ग्रूमिंग स्टेशन — शेविंग, परफ्यूम, ग्रूमिंग टूल्स के लिए।',
    'mens grooming table masculine vanity mirror',
    [['🪞', 'Mirror', 'Adjustable mirror panel'], ['🗄️', 'Tool Drawer', 'Lined drawer for grooming tools'], ['🫙', 'Bottle Slots', 'Recessed slots for cologne bottles'], ['📏', 'Compact', '80 × 40 cm masculine design']],
    STD_MATERIALS, [['Dark Walnut', '#3E2723'], ['Wenge', '#3C2415'], ['Charcoal', '#36454F']]),

  p('DRESSING_TABLES', 'Double Vanity Dressing Table',
    'Extra-wide dressing table with two mirror stations — for couples or shared bedrooms. Each side has its own mirror and drawers.',
    'डबल वैनिटी ड्रेसिंग टेबल — दो लोगों के लिए, अलग मिरर और ड्रॉअर।',
    'double vanity dressing table two mirror wide',
    [['👫', 'Dual Station', '2 separate mirror sections'], ['🪞', '2 Mirrors', 'Individual adjustable mirrors'], ['🗄️', '4 Drawers', '2 drawers per person'], ['📏', 'Extra Wide', '160 × 45 cm surface']],
    [...STD_MATERIALS, 'Mirror Glass Panels'], LIGHT_COLORS),

  p('DRESSING_TABLES', 'Dressing Table with Towel Rack',
    'Bathroom-friendly dressing table with integrated towel rack on the side. Combines vanity function with practical towel storage.',
    'टॉवल रैक वाला ड्रेसिंग टेबल — बाथरूम फ्रेंडली।',
    'dressing table towel rack bathroom vanity',
    [['🪞', 'Mirror', 'Wall-mounted mirror included'], ['🧺', 'Towel Rack', 'Side-mounted towel bar'], ['🗄️', 'Drawers', '2 utility drawers'], ['💧', 'Water Resistant', 'Moisture-resistant laminate']],
    ['Water-Resistant Laminated Board', 'PVC Edge Banding', 'SS Towel Bar'], LIGHT_COLORS),

  // ═══════════════════════════════════════════════════════════════════════════
  // OFFICE WORKSTATIONS — 16 new (already have 4)
  // ═══════════════════════════════════════════════════════════════════════════

  p('OFFICE_WORKSTATIONS', 'Computer Workstation with Hutch',
    'Complete computer workstation with overhead hutch shelf, keyboard tray, CPU stand and printer shelf. All-in-one office solution.',
    'हच शेल्फ + कीबोर्ड ट्रे + प्रिंटर शेल्फ — कम्प्लीट वर्कस्टेशन।',
    'computer workstation hutch complete office desk',
    [['📚', 'Overhead Hutch', 'Shelf + cubbies above monitor'], ['⌨️', 'Keyboard Tray', 'Pull-out keyboard shelf'], ['🖨️', 'Printer Shelf', 'Dedicated lower shelf for printer'], ['💻', 'CPU Stand', 'Side CPU compartment']],
    [...STD_MATERIALS, 'Ball-Bearing Slides'], STD_COLORS),

  p('OFFICE_WORKSTATIONS', 'Standing Height Counter Desk',
    'Standing-height desk (105 cm) for use as a stand-up workstation or customer counter. Ideal for retail, clinics and reception areas.',
    'स्टैंडिंग हाइट काउंटर — रिटेल, क्लीनिक, रिसेप्शन के लिए।',
    'standing height desk counter office retail',
    [['📐', 'Standing Height', '105 cm counter height'], ['📏', 'Wide Surface', '120 × 60 cm'], ['🗄️', 'Storage Below', 'Shelf + drawer behind counter'], ['🏢', 'Commercial', 'Ideal for retail and clinic counters']],
    [...STD_MATERIALS, 'PVC Edge Banding'], STD_COLORS),

  p('OFFICE_WORKSTATIONS', 'Office Bookcase 4-Shelf Open',
    'Professional open bookcase for office files, binders and reference books. No doors for quick access. Anti-tip wall anchor.',
    'ऑफिस बुककेस — फ़ाइल, बाइंडर, किताबें रखें, वॉल एंकर।',
    'office bookcase open shelf files professional',
    [['📚', '4 Shelves', 'Adjustable shelf height'], ['📏', 'Office Standard', '80 × 35 × 150 cm'], ['🏗️', 'Anti-Tip', 'Wall anchor included'], ['📐', 'Heavy Duty', 'Each shelf holds 25 kg']],
    [...STD_MATERIALS, 'Wall Anchor Kit'], STD_COLORS),

  p('OFFICE_WORKSTATIONS', 'Office Storage Credenza',
    'Low-height office credenza that sits behind the desk or along a wall. 2 cabinets + drawer, flat top for printer or display.',
    'ऑफिस क्रेडेन्ज़ा — डेस्क के पीछे, कैबिनेट + ड्रॉअर + प्रिंटर टॉप।',
    'office credenza low cabinet storage wooden',
    [['📏', 'Low Height', '75 cm matches desk height'], ['🚪', '2 Cabinets', 'Closed storage sections'], ['🗄️', 'Center Drawer', 'Utility drawer in the middle'], ['🖨️', 'Flat Top', 'Surface for printer or display']],
    [...STD_MATERIALS, 'Soft-Close Hardware'], STD_COLORS),

  p('OFFICE_WORKSTATIONS', 'Conference Table 6-Seater',
    'Oval conference table seating 6 people comfortably. Central cable management box for presentations. Professional meeting room essential.',
    '6-सीटर कॉन्फ्रेंस टेबल — सेंट्रल केबल बॉक्स, मीटिंग रूम।',
    'conference table oval six seater office meeting',
    [['👥', '6 Seats', 'Comfortable seating for 6'], ['📏', 'Oval Shape', '180 × 90 cm surface'], ['🔌', 'Cable Box', 'Central flip-lid cable management box'], ['🏢', 'Professional', 'Boardroom-grade finish']],
    [...STD_MATERIALS, 'Cable Management Box', 'Metal Legs'],
    [['Dark Walnut', '#3E2723'], ['Wenge', '#3C2415'], ['Grey Oak', '#9E9E9E']]),

  p('OFFICE_WORKSTATIONS', 'Mobile Pedestal 3-Drawer',
    'Mobile under-desk pedestal on casters. 2 utility drawers + 1 file drawer. Tucks under desk, rolls out when needed.',
    'मोबाइल पेडस्टल — डेस्क के नीचे, 3 ड्रॉअर, कास्टर्स पर।',
    'mobile pedestal drawers office under desk casters',
    [['🗄️', '3 Drawers', '2 utility + 1 A4 file drawer'], ['🔒', 'Central Lock', 'One key locks all drawers'], ['🛒', 'Mobile', 'Casters for easy movement'], ['📐', 'Under-Desk', 'Fits under standard 75 cm desks']],
    [...STD_MATERIALS, 'Metal Slides', 'Central Lock', 'Casters'], LIGHT_COLORS),

  p('OFFICE_WORKSTATIONS', 'Office Locker Unit 6-Door',
    '6-compartment locker unit for employee belongings. Individual lockable doors. Ideal for offices, gyms and shared workspaces.',
    '6-डोर लॉकर यूनिट — कर्मचारियों का सामान सुरक्षित।',
    'office locker unit six door compartment storage',
    [['🔐', '6 Lockers', '3 rows × 2 columns'], ['🔒', 'Individual Locks', 'Each compartment lockable'], ['📦', 'Internal Hook', 'Coat hook inside each locker'], ['📐', 'Compact', '80 × 45 × 180 cm']],
    [...STD_MATERIALS, 'Individual Key Locks', 'Metal Hooks'], [['Light Grey', '#D3D3D3'], ['White', '#FFFFFF'], ['Walnut', '#5C3D2E']]),

  p('OFFICE_WORKSTATIONS', 'Printer Stand with Storage',
    'Dedicated printer stand with paper storage shelf below and a drawer for ink cartridges and supplies.',
    'प्रिंटर स्टैंड — नीचे पेपर शेल्फ, ड्रॉअर में इंक और सप्लाइज़।',
    'printer stand storage shelf office wooden',
    [['🖨️', 'Printer Top', 'Supports printers up to 20 kg'], ['📄', 'Paper Shelf', 'Lower shelf for paper reams'], ['🗄️', 'Supplies Drawer', 'Drawer for cartridges and cables'], ['🛒', 'Optional Casters', 'Add casters for mobility']],
    STD_MATERIALS, LIGHT_COLORS),

  p('OFFICE_WORKSTATIONS', 'Manager Desk with Side Return',
    'L-shaped manager desk with a side return for meetings. Main desk for work, return surface for visitors to sit across.',
    'मैनेजर डेस्क साइड रिटर्न — मीटिंग के लिए एक्स्ट्रा सरफ़ेस।',
    'manager desk L shape side return office executive',
    [['📐', 'L-Shape', 'Main desk + side meeting return'], ['📏', 'Large Surface', '150 × 75 cm main + 100 × 50 cm return'], ['🗄️', 'Pedestal', '3-drawer pedestal on main desk'], ['🔌', 'Cable Management', 'Grommets and rear tray']],
    [...STD_MATERIALS, 'Metal Drawer Slides', 'Cable Grommets'],
    [['Dark Walnut', '#3E2723'], ['Wenge', '#3C2415'], ['Grey Oak', '#9E9E9E']]),

  p('OFFICE_WORKSTATIONS', 'Pigeon-Hole Mail Organizer',
    '12-slot pigeon-hole unit for sorting mail, documents and forms. Wall-mounted or desk-standing. Each slot labeled.',
    '12-स्लॉट पिजन-होल — मेल, डॉक्यूमेंट, फ़ॉर्म सॉर्ट करें।',
    'pigeon hole mail organizer sort office wooden',
    [['📬', '12 Slots', '3 × 4 grid of sorting slots'], ['🏷️', 'Label Holders', 'Name/label slot on each cubby'], ['🖼️', 'Wall or Desk', 'Mounts on wall or stands on desk'], ['📏', 'Standard', '60 × 30 × 45 cm']],
    STD_MATERIALS, LIGHT_COLORS),

  p('OFFICE_WORKSTATIONS', 'Office Pantry Counter',
    'Small kitchen/pantry counter for office break areas. Countertop + lower cabinet + open shelf for microwave. Tea/coffee station.',
    'ऑफिस पैंट्री काउंटर — चाय-कॉफी स्टेशन, माइक्रोवेव शेल्फ।',
    'office pantry counter kitchen small tea coffee',
    [['☕', 'Pantry Counter', 'Countertop for tea/coffee station'], ['📦', 'Microwave Shelf', 'Open shelf for microwave'], ['🚪', 'Cabinet Below', 'Closed storage for supplies'], ['📏', 'Compact', '120 × 50 × 90 cm']],
    [...STD_MATERIALS, 'Water-Resistant Top'], LIGHT_COLORS),

  p('OFFICE_WORKSTATIONS', 'Compact Home Office Desk',
    'Small desk designed for working from home in tight spaces. Just big enough for a laptop and a few essentials.',
    'कॉम्पैक्ट होम ऑफिस डेस्क — छोटी जगह में WFH।',
    'compact home office desk small work from home',
    [['📏', 'Compact', '80 × 50 cm — minimal footprint'], ['🗄️', 'Drawer', 'Single utility drawer'], ['🔌', 'Cable Hole', 'Grommet for charger cable'], ['💻', 'Laptop Ready', 'Perfect for laptop + mouse setup']],
    STD_MATERIALS, LIGHT_COLORS),

  p('OFFICE_WORKSTATIONS', 'Office Partition Panel Desk-Mount',
    'Desk-mounted partition panel for privacy in open-plan offices. Fabric-wrapped for pin/board functionality. Clamps to desk edge.',
    'डेस्क-माउंट पार्टीशन पैनल — ओपन-प्लान ऑफिस में प्राइवेसी।',
    'office desk partition panel fabric divider',
    [['🧱', 'Privacy Panel', 'Desk-mounted divider screen'], ['📌', 'Pinnable Fabric', 'Pin notes and reminders'], ['📏', 'Standard Width', '120 × 45 cm panel'], ['🏗️', 'Clamp Mount', 'Clamps to desk edge, no drilling']],
    ['Particle Board Core', 'Fabric Wrap', 'Metal Clamp Brackets'],
    [['Grey Fabric', '#808080'], ['Blue Fabric', '#4A90D9'], ['Green Fabric', '#66BB6A']]),

  p('OFFICE_WORKSTATIONS', 'Training Room Flip-Top Desk',
    'Training/seminar desk with a flip-top mechanism. Flip the top to nest desks together for compact storage. Casters for mobility.',
    'ट्रेनिंग रूम डेस्क — फ्लिप-टॉप, कॉम्पैक्ट स्टोरेज, कास्टर्स।',
    'training room desk flip top nestable seminar',
    [['📐', 'Flip-Top', 'Table folds up for nesting/storage'], ['🛒', 'Mobile', 'Locking casters for easy rearrangement'], ['📏', 'Training Size', '120 × 45 cm per desk'], ['🔗', 'Nestable', 'Stack multiple desks together']],
    [...STD_MATERIALS, 'Flip Mechanism', 'Locking Casters'], [['Light Grey', '#D3D3D3'], ['White', '#FFFFFF'], ['Light Oak', '#D2B48C']]),

  p('OFFICE_WORKSTATIONS', 'Server & Equipment Cabinet',
    'Enclosed cabinet for network equipment, UPS and small servers. Ventilated sides, lockable door and cable entry points.',
    'सर्वर/इक्विपमेंट कैबिनेट — नेटवर्क गियर, UPS के लिए, वेंटिलेटेड।',
    'server equipment cabinet network storage ventilated',
    [['🖥️', 'Equipment Housing', 'Fits small servers, NAS, UPS'], ['🌬️', 'Ventilated', 'Side vents for heat dissipation'], ['🔒', 'Lockable', 'Keyed lock on front door'], ['🔌', 'Cable Entry', 'Top and rear cable pass-through holes']],
    [...STD_MATERIALS, 'Metal Ventilation Grills', 'Key Lock'],
    [['Charcoal', '#36454F'], ['Black', '#1A1A1A'], ['Grey', '#808080']]),

  p('OFFICE_WORKSTATIONS', 'Cluster Workstation 4-Seater',
    '4-person cluster workstation with center partition cross. Each person gets an L-shaped desk section with mobile pedestal.',
    '4-सीटर क्लस्टर वर्कस्टेशन — सेंटर पार्टीशन, हर व्यक्ति को L-शेप।',
    'cluster workstation four seater office modern open',
    [['👥', '4 Seats', 'Cross-partition layout'], ['📐', 'L-Shaped Each', 'Each person gets corner desk space'], ['🧱', 'Center Partition', 'Fabric-wrapped cross divider'], ['🗄️', 'Mobile Pedestals', 'One pedestal per seat']],
    [...STD_MATERIALS, 'Metal Frame', 'Fabric Partition'],
    [['Light Oak & Grey', '#D2B48C'], ['White & Blue', '#FFFFFF'], ['Walnut & Grey', '#5C3D2E']]),

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULAR STORAGE — 16 new (already have 4)
  // ═══════════════════════════════════════════════════════════════════════════

  p('MODULAR_STORAGE', 'Stacking Box System 4-Unit',
    'Set of 4 individual box units that stack and arrange in any configuration. Horizontal, vertical, L-shape — your design.',
    '4 बॉक्स यूनिट सेट — किसी भी शेप में लगाएं, आपका डिज़ाइन।',
    'stacking box modular storage unit arrange',
    [['🟧', '4 Units', 'Independent stackable boxes'], ['🔄', 'Any Config', 'Stack vertical, horizontal, L-shape'], ['📐', 'Standard Size', '35 × 35 × 35 cm each'], ['🔗', 'Connectors', 'Inter-locking connectors included']],
    [...STD_MATERIALS, 'Metal Connectors'], OAK_COLORS),

  p('MODULAR_STORAGE', 'Corner Shelf Unit Tall',
    'Tall 5-tier corner shelf unit. Quarter-circle shelves fit into room corners. Utilizes vertical space in unused corners.',
    'टॉल कॉर्नर शेल्फ — कोने की जगह का वर्टिकल इस्तेमाल।',
    'corner shelf unit tall quarter circle storage',
    [['📐', 'Corner Design', 'Quarter-circle shelves'], ['📏', '5 Tiers', 'Tall 180 cm height'], ['📦', 'Open Shelves', 'Display from two exposed sides'], ['🏗️', 'Wall Anchor', 'Anti-tip kit included']],
    STD_MATERIALS, OAK_COLORS),

  p('MODULAR_STORAGE', 'Under-Stairs Storage Cabinet',
    'Triangular-profile cabinet designed to fit under staircases. Multiple compartments follow the staircase angle. Maximizes dead space.',
    'सीढ़ी के नीचे स्टोरेज कैबिनेट — तिरछा प्रोफाइल, डेड स्पेस इस्तेमाल।',
    'under stairs storage cabinet triangular staircase',
    [['📐', 'Staircase Profile', 'Follows staircase angle'], ['🚪', 'Multiple Doors', 'Separate sections at different heights'], ['📦', 'Max Storage', 'Converts wasted space to usable'], ['🏗️', 'Custom Fit', 'Adjustable to staircase angle']],
    [...STD_MATERIALS, 'Heavy-Duty Hinges'], STD_COLORS),

  p('MODULAR_STORAGE', 'Laundry Sorter Cabinet',
    'Cabinet with 3 removable laundry bins inside for sorting whites, colors and delicates. Lid opens for easy tossing of clothes.',
    'लॉन्ड्री सॉर्टर कैबिनेट — 3 बिन्स: वाइट, कलर, डेलिकेट।',
    'laundry sorter cabinet three bins bathroom',
    [['🧺', '3 Sort Bins', 'Removable fabric bins for sorting'], ['🚪', 'Tilt-Out Doors', 'Front panels tilt open for tossing'], ['📏', 'Compact', '60 × 40 × 90 cm'], ['✨', 'Clean Exterior', 'Looks like a regular cabinet']],
    [...STD_MATERIALS, 'Fabric Bin Inserts'], LIGHT_COLORS),

  p('MODULAR_STORAGE', 'Broom & Cleaning Cabinet',
    'Tall narrow cabinet for brooms, mops, vacuum cleaner and cleaning supplies. Internal hooks and shelf keep everything organized.',
    'झाड़ू-पोंछा कैबिनेट — ब्रूम, मॉप, वैक्यूम, सफाई सामान।',
    'broom cabinet cleaning supply storage tall narrow',
    [['🧹', 'Tall Interior', 'Fits full-length brooms and mops'], ['🪝', 'Internal Hooks', 'Door-mounted hooks for tools'], ['📦', 'Supply Shelf', 'Upper shelf for cleaning products'], ['📐', 'Narrow', 'Only 50 × 35 cm footprint']],
    [...STD_MATERIALS, 'Metal Hooks'], LIGHT_COLORS),

  p('MODULAR_STORAGE', 'Window Seat Storage Bench',
    'Long storage bench designed to sit under a window. Cushioned top for comfortable seating, lift-up lid reveals deep storage.',
    'विंडो सीट स्टोरेज बेंच — खिड़की के नीचे, कुशन सीट + स्टोरेज।',
    'window seat bench storage cushion under window',
    [['🪑', 'Cushioned Seat', 'Padded top for comfortable sitting'], ['📦', 'Deep Storage', 'Large cavity under seat'], ['📏', 'Window Width', '120 × 40 × 45 cm'], ['🏗️', 'Slow-Close', 'Hydraulic lid prevents slamming']],
    [...STD_MATERIALS, 'Foam Cushion', 'Hydraulic Lid'],
    [['White & Beige', '#FFFFFF'], ['Walnut & Grey', '#5C3D2E'], ['Oak & Cream', '#C8A951']]),

  p('MODULAR_STORAGE', 'Kids Toy Storage Unit',
    'Colorful toy organizer with open bins and cubbies at child height. Front-facing book sling on top, toy bins below.',
    'किड्स टॉय स्टोरेज — रंगीन बिन्स और कब्बी, बच्चों की ऊंचाई पर।',
    'kids toy storage unit organizer colorful bins',
    [['🧸', 'Toy Bins', '6 colorful removable bins'], ['📖', 'Book Sling', 'Front-facing book display on top'], ['👶', 'Child Height', '80 cm tall — easy reach'], ['✨', 'Rounded Edges', 'All corners rounded for safety']],
    [...STD_MATERIALS, 'Fabric Bin Inserts'],
    [['White & Rainbow', '#FFFFFF'], ['Natural & Pastel', '#D2B48C'], ['Grey & Bright', '#808080']]),

  p('MODULAR_STORAGE', 'Medicine Cabinet Wall-Mounted',
    'Lockable wall-mounted medicine cabinet with adjustable shelves. Keeps medicines organized and safely away from children.',
    'मेडिसिन कैबिनेट — दवाइयां सुरक्षित, बच्चों की पहुंच से दूर।',
    'medicine cabinet wall mounted lockable bathroom',
    [['🔒', 'Lockable', 'Key lock for child safety'], ['📦', 'Adjustable Shelves', '3 repositionable shelves'], ['🖼️', 'Wall Mount', 'Secure wall installation'], ['📏', 'Compact', '40 × 15 × 50 cm']],
    [...STD_MATERIALS, 'Key Lock', 'Wall Hardware'], LIGHT_COLORS),

  p('MODULAR_STORAGE', 'Ironing Board Cabinet',
    'Wall-mounted cabinet with a fold-down ironing board inside. Open the door, fold down the board, iron, fold back, close. Invisible when stored.',
    'इस्त्री बोर्ड कैबिनेट — दरवाज़ा खोलें, बोर्ड निकालें, बंद करें।',
    'ironing board cabinet fold down wall mounted',
    [['📐', 'Fold-Down Board', 'Full-size ironing board folds from cabinet'], ['🚪', 'Cabinet Door', 'Closes to hide board completely'], ['📦', 'Internal Shelf', 'Shelf for iron and spray bottle'], ['🏗️', 'Wall Mount', 'Secure wall bracket system']],
    [...STD_MATERIALS, 'Steel Ironing Board', 'Wall Brackets'], LIGHT_COLORS),

  p('MODULAR_STORAGE', 'Wine Rack Storage Unit',
    'Stylish wine rack unit with diamond-grid bottle storage, glass hanging rail and a serving shelf. Entertainment essential.',
    'वाइन रैक यूनिट — बोतल ग्रिड, ग्लास रेल, सर्विंग शेल्फ।',
    'wine rack storage unit bottle glass wooden',
    [['🍷', 'Bottle Grid', 'Diamond slots for 12 bottles'], ['🥂', 'Glass Rail', 'Inverted glass hanging rack'], ['📦', 'Serving Shelf', 'Counter surface for pouring'], ['🗄️', 'Lower Cabinet', 'Closed storage below']],
    STD_MATERIALS, [['Dark Walnut', '#3E2723'], ['Wenge', '#3C2415'], ['Mahogany', '#420D09']]),

  p('MODULAR_STORAGE', 'Bathroom Vanity Cabinet',
    'Under-sink bathroom vanity with soft-close doors and water-resistant finish. Organizes toiletries, towels and cleaning supplies.',
    'बाथरूम वैनिटी कैबिनेट — सिंक के नीचे, वॉटर-रेसिस्टेंट।',
    'bathroom vanity cabinet under sink water resistant',
    [['💧', 'Water Resistant', 'Moisture-resistant laminate finish'], ['🚪', 'Soft-Close', 'Quiet soft-close door hinges'], ['📦', 'Internal Shelf', 'Adjustable shelf inside'], ['🔧', 'Plumbing Access', 'Rear cutout for plumbing']],
    ['Water-Resistant Laminated Board', 'PVC Edge Banding', 'Soft-Close Hinges'], LIGHT_COLORS),

  p('MODULAR_STORAGE', 'Entryway Coat & Storage Unit',
    'All-in-one entryway organizer with coat hooks, mirror, key shelf, shoe storage and an umbrella stand. Welcome home.',
    'एंट्रीवे ऑर्गनाइज़र — कोट हुक्स, मिरर, की शेल्फ, शू स्टोरेज।',
    'entryway organizer coat hook mirror shoe storage',
    [['🪝', 'Coat Hooks', '4 metal coat hooks'], ['🪞', 'Mirror', 'Rectangular mirror panel'], ['🔑', 'Key Shelf', 'Small shelf with key hooks'], ['👟', 'Shoe Rack', 'Lower shoe shelf for 4-6 pairs']],
    [...STD_MATERIALS, 'Mirror Glass', 'Metal Hooks'], OAK_COLORS),

  p('MODULAR_STORAGE', 'Hallway Console with Drawers',
    'Slim hallway console table with 2 drawers and a lower shelf. Decorative piece for entryways, hallways and living room walls.',
    'हॉलवे कंसोल टेबल — 2 ड्रॉअर + लोअर शेल्फ, डेकोरेटिव।',
    'hallway console table drawers shelf entryway',
    [['📏', 'Slim Profile', 'Only 25 cm deep, fits narrow hallways'], ['🗄️', '2 Drawers', 'Soft-close drawers for keys and mail'], ['📦', 'Lower Shelf', 'Display shelf below'], ['✨', 'Decorative', 'Clean lines for any décor style']],
    [...STD_MATERIALS, 'Soft-Close Slides'], OAK_COLORS),

  p('MODULAR_STORAGE', 'Pet Supply Cabinet',
    'Dedicated cabinet for pet food, toys, leashes and grooming supplies. Pull-out food bowl shelf and bag dispenser hook.',
    'पेट सप्लाई कैबिनेट — पेट फूड, खिलौने, लीश, ग्रूमिंग सामान।',
    'pet supply cabinet storage food bowl animal',
    [['🐕', 'Pet Station', 'Organized pet supply storage'], ['🍽️', 'Bowl Shelf', 'Pull-out shelf for food and water bowls'], ['📦', 'Food Storage', 'Upper section for food bags'], ['🪝', 'Leash Hook', 'Door-mounted leash/lead hook']],
    [...STD_MATERIALS, 'Pull-Out Shelf', 'Metal Hook'], LIGHT_COLORS),

  p('MODULAR_STORAGE', 'Record & Vinyl Storage Unit',
    'Storage unit with correctly-sized slots for vinyl records and LP collections. 4 sections with flip-through access.',
    'रिकॉर्ड/वाइनल स्टोरेज — LP कलेक्शन के लिए सही साइज़ स्लॉट।',
    'vinyl record storage unit shelf music collection',
    [['🎵', 'Record Size', 'Slots sized for 12" vinyl LPs'], ['📦', '4 Sections', 'Each holds ~50 records'], ['📐', 'Flip Access', 'Browse records by flipping through'], ['📏', 'Media Height', '35 cm unit, stackable']],
    STD_MATERIALS, [['Walnut', '#5C3D2E'], ['Black', '#1A1A1A'], ['Natural Oak', '#D2B48C']]),

  p('MODULAR_STORAGE', 'Cube Unit with Fabric Inserts',
    '9-cube storage unit (3×3) sold with 4 matching fabric bin inserts. Ready-to-use organized storage out of the box.',
    '9-क्यूब यूनिट + 4 फैब्रिक बिन्स — बॉक्स खोलें और इस्तेमाल करें।',
    'cube storage unit fabric bins inserts organizer',
    [['🟧', '9 Cubes', '3×3 grid with 4 fabric inserts'], ['📦', 'Fabric Bins', '4 matching collapsible fabric bins'], ['🔄', 'Flexible', 'Use bins in any cube, leave others open'], ['📏', 'Standard', '110 × 35 × 110 cm']],
    [...STD_MATERIALS, 'Collapsible Fabric Bins'], LIGHT_COLORS),
]

// ── Pixabay Image Fetcher ───────────────────────────────────────────────────

interface PixabayHit {
  id: number
  largeImageURL: string
  webformatURL: string
  tags: string
}

async function searchPixabay(query: string, retries = 2): Promise<string | null> {
  if (!PIXABAY_KEY) return null

  const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=5&safesearch=true&min_width=640`

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      if (res.status === 429) {
        console.log('    Rate limited, waiting 30s...')
        await sleep(30000)
        continue
      }
      if (!res.ok) {
        console.log(`    Pixabay error: ${res.status}`)
        return null
      }
      const data = await res.json() as { hits: PixabayHit[] }
      if (data.hits && data.hits.length > 0) {
        // Pick the first result's large image
        return data.hits[0].largeImageURL
      }
      return null
    } catch (e) {
      if (attempt < retries) await sleep(2000)
    }
  }
  return null
}

async function downloadImage(imageUrl: string): Promise<Buffer | null> {
  try {
    const res = await fetch(imageUrl)
    if (!res.ok) return null
    const arrayBuffer = await res.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch {
    return null
  }
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════╗')
  console.log('║  Expanded Particle Board Products Seeder     ║')
  console.log('╚══════════════════════════════════════════════╝\n')

  if (DRY_RUN) console.log('🏃 DRY RUN — no database changes will be made\n')

  const productsToSeed = CATEGORY_FILTER
    ? PRODUCTS.filter(p => p.category === CATEGORY_FILTER)
    : PRODUCTS

  if (CATEGORY_FILTER) {
    console.log(`📋 Filtered to category: ${CATEGORY_FILTER} (${productsToSeed.length} products)\n`)
  } else {
    console.log(`📋 Total new products to seed: ${productsToSeed.length}\n`)
  }

  if (!PIXABAY_KEY && !NO_IMAGES) {
    console.log('⚠️  No PIXABAY_KEY set. Products will be created WITHOUT images.')
    console.log('   Get a free key: https://pixabay.com/api/docs/#api_search_images\n')
    console.log('   Then: PIXABAY_KEY=<key> npx tsx scripts/seed-expanded-products.ts\n')
  }

  // Check existing slugs
  const { data: existing } = await supabase
    .from('catalog_products')
    .select('slug')

  const existingSlugs = new Set((existing || []).map((p: { slug: string }) => p.slug))

  let created = 0, skipped = 0, images = 0, errors = 0
  const categories: Record<string, number> = {}

  for (let i = 0; i < productsToSeed.length; i++) {
    const product = productsToSeed[i]
    const progress = `[${i + 1}/${productsToSeed.length}]`

    if (existingSlugs.has(product.slug)) {
      console.log(`  ${progress} ⏭️  "${product.name}" (exists)`)
      skipped++
      continue
    }

    let imageUrl: string | null = null

    // Fetch image from Pixabay
    if (PIXABAY_KEY && !NO_IMAGES) {
      console.log(`  ${progress} 🔍 Searching: "${product.searchQuery}"`)
      imageUrl = await searchPixabay(product.searchQuery)

      if (imageUrl) {
        console.log(`  ${progress} 📸 Found image, uploading...`)
        const buf = await downloadImage(imageUrl)

        if (buf && buf.length > 0) {
          const ext = imageUrl.includes('.png') ? 'png' : 'jpg'
          const path = `particle-board/${product.slug}.${ext}`
          const { error: upErr } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(path, buf, { contentType: `image/${ext === 'png' ? 'png' : 'jpeg'}`, upsert: true })

          if (!upErr) {
            const { data: urlData } = supabase.storage
              .from(STORAGE_BUCKET)
              .getPublicUrl(path)
            imageUrl = urlData.publicUrl
            images++
          } else {
            console.log(`  ${progress} ⚠️  Upload failed: ${upErr.message}`)
            imageUrl = null
          }
        } else {
          imageUrl = null
        }
      } else {
        console.log(`  ${progress} ⚠️  No image found`)
      }

      // Rate limit: ~200 req/hr for Pixabay
      await sleep(400)
    }

    if (DRY_RUN) {
      console.log(`  ${progress} 🏃 Would create: ${product.name} [${product.category}]`)
      created++
      categories[product.category] = (categories[product.category] || 0) + 1
      continue
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
      sort_order: 100 + i,
      is_featured: false,
    })

    if (error) {
      console.log(`  ${progress} ❌ ${product.name}: ${error.message}`)
      errors++
    } else {
      console.log(`  ${progress} ✅ ${product.name}`)
      created++
      categories[product.category] = (categories[product.category] || 0) + 1
    }
  }

  console.log('\n══════════════════════════════════════════════')
  console.log('  Results:')
  console.log(`    Created:  ${created}`)
  console.log(`    Skipped:  ${skipped} (already exist)`)
  console.log(`    Images:   ${images}`)
  console.log(`    Errors:   ${errors}`)
  console.log('\n  Per category:')
  for (const [cat, count] of Object.entries(categories).sort()) {
    console.log(`    ${cat}: +${count}`)
  }
  console.log('══════════════════════════════════════════════')
}

main().catch(console.error)
