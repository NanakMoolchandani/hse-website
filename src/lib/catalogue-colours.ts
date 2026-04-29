/**
 * Fabric colour catalogue data.
 *
 * Two material lines (Renult leatherette and Luxury velvet/suede) — these
 * are the actual swatches photographed at the showroom and stored in
 * Supabase. Each entry has a name, hex preview, and full-quality fabric
 * texture image URL.
 */

export type MaterialLine = 'renult' | 'luxury'

export interface FabricColour {
  name: string
  hex: string
  slug: string
  imageUrl: string
}

export interface MaterialCatalogue {
  slug: MaterialLine
  name: string
  material: string
  description: string
  /** A few representative hex colors for the preview card */
  previewColors: string[]
}

const SUPABASE_STORAGE_BASE =
  'https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog-assets'

const renult = (file: string) =>
  `${SUPABASE_STORAGE_BASE}/colour-catalogues/renult/${file}`
const luxury = (file: string) =>
  `${SUPABASE_STORAGE_BASE}/colour-catalogues/luxury/${file}`

export const MATERIALS: Record<MaterialLine, MaterialCatalogue> = {
  renult: {
    slug: 'renult',
    name: 'Renult',
    material: 'Premium Leatherette',
    description:
      'Smooth, durable synthetic leather with a soft sheen. Twenty-nine classic and contemporary shades — built for daily commercial seating.',
    previewColors: [
      '#C41A1B',
      '#181614',
      '#A69A83',
      '#202220',
      '#B1B3B2',
      '#844D2F',
      '#542D27',
      '#B31F33',
    ],
  },
  luxury: {
    slug: 'luxury',
    name: 'Luxury',
    material: 'Premium Velvet & Suede',
    description:
      'Rich velvet and suede upholstery with a soft matte finish. Seventeen deep, considered shades — reserved for executive chairs, recliners, and statement seating.',
    previewColors: [
      '#98927C',
      '#856C4A',
      '#7E021D',
      '#053060',
      '#0F4B55',
      '#1A3E2F',
      '#1C5F6B',
      '#373733',
    ],
  },
}

export const COLOURS: Record<MaterialLine, FabricColour[]> = {
  renult: [
    { name: 'Cherry Red',         hex: '#C41A1B', slug: 'cherry-red',          imageUrl: renult('01-cherry-red.webp') },
    { name: 'Dark Brown',         hex: '#181614', slug: 'dark-brown',          imageUrl: renult('02-dark-brown.webp') },
    { name: 'Beige',              hex: '#A69A83', slug: 'beige',               imageUrl: renult('03-beige.webp') },
    { name: 'Jet Black',          hex: '#202220', slug: 'jet-black',           imageUrl: renult('04-jet-black.webp') },
    { name: 'Jet Black',          hex: '#1F1F1F', slug: 'jet-black-5',         imageUrl: renult('05-jet-black-5.webp') },
    { name: 'Chocolate Brown',    hex: '#201814', slug: 'chocolate-brown',     imageUrl: renult('06-chocolate-brown.webp') },
    { name: 'Dove Grey',          hex: '#B1B3B2', slug: 'dove-grey',           imageUrl: renult('07-dove-grey.webp') },
    { name: 'Tobacco Brown',      hex: '#844D2F', slug: 'dark-brown-8',        imageUrl: renult('08-dark-brown-8.webp') },
    { name: 'Mahogany',           hex: '#542D27', slug: 'mahogany',            imageUrl: renult('09-mahogany.webp') },
    { name: 'Maroon',             hex: '#381E22', slug: 'maroon',              imageUrl: renult('10-maroon.webp') },
    { name: 'Dark Olive',         hex: '#68695C', slug: 'dark-olive',          imageUrl: renult('11-dark-olive.webp') },
    { name: 'Wine Red',           hex: '#B31F33', slug: 'wine-red',            imageUrl: renult('12-wine-red.webp') },
    { name: 'Espresso',           hex: '#3C3531', slug: 'dark-brown-13',       imageUrl: renult('13-dark-brown-13.webp') },
    { name: 'Midnight Blue',      hex: '#1E2328', slug: 'midnight-blue',       imageUrl: renult('14-midnight-blue.webp') },
    { name: 'Bone',               hex: '#D5D5D1', slug: 'bone',                imageUrl: renult('15-bone.webp') },
    { name: 'Burgundy',           hex: '#50132D', slug: 'burgundy',            imageUrl: renult('16-burgundy.webp') },
    { name: 'Walnut',             hex: '#291D1A', slug: 'chocolate-brown-17',  imageUrl: renult('17-chocolate-brown-17.webp') },
    { name: 'Cocoa',              hex: '#4D3428', slug: 'chocolate-brown-18',  imageUrl: renult('18-chocolate-brown-18.webp') },
    { name: 'Bitter Chocolate',   hex: '#231D1A', slug: 'chocolate-brown-19',  imageUrl: renult('19-chocolate-brown-19.webp') },
    { name: 'Onyx',               hex: '#21272C', slug: 'jet-black-20',        imageUrl: renult('20-jet-black-20.webp') },
    { name: 'Tan',                hex: '#5F2E20', slug: 'chocolate-brown-21',  imageUrl: renult('21-chocolate-brown-21.webp') },
    { name: 'Navy Blue',          hex: '#28323C', slug: 'navy-blue',           imageUrl: renult('22-navy-blue.webp') },
    { name: 'Pecan',              hex: '#2F2520', slug: 'chocolate-brown-23',  imageUrl: renult('23-chocolate-brown-23.webp') },
    { name: 'Crimson Red',        hex: '#CE2828', slug: 'red',                 imageUrl: renult('24-red.webp') },
    { name: 'Charcoal Grey',      hex: '#313331', slug: 'charcoal-grey',       imageUrl: renult('25-charcoal-grey.webp') },
    { name: 'Slate Grey',         hex: '#232829', slug: 'charcoal-grey-26',    imageUrl: renult('26-charcoal-grey-26.webp') },
    { name: 'Mocha',              hex: '#2F261F', slug: 'chocolate-brown-27',  imageUrl: renult('27-chocolate-brown-27.webp') },
    { name: 'Graphite',           hex: '#343331', slug: 'dark-brown-28',       imageUrl: renult('28-dark-brown-28.webp') },
    { name: 'Deep Navy',          hex: '#1E2626', slug: 'navy-blue-29',        imageUrl: renult('29-navy-blue-29.webp') },
  ],
  luxury: [
    { name: 'Greige',         hex: '#98927C', slug: 'greige',         imageUrl: luxury('01-greige.webp') },
    { name: 'Taupe',          hex: '#676057', slug: 'taupe',          imageUrl: luxury('02-taupe.webp') },
    { name: 'Golden Brown',   hex: '#856C4A', slug: 'golden-brown',   imageUrl: luxury('02-golden-brown.webp') },
    { name: 'Deep Drab',      hex: '#413B2E', slug: 'deep-drab',      imageUrl: luxury('03-deep-drab.webp') },
    { name: 'Russet Brown',   hex: '#7A5641', slug: 'russet-brown',   imageUrl: luxury('04-russet-brown.webp') },
    { name: 'Mist Grey',      hex: '#6B6B66', slug: 'mist-grey',      imageUrl: luxury('05-mist-grey.webp') },
    { name: 'Charcoal Grey',  hex: '#373733', slug: 'charcoal-grey',  imageUrl: luxury('06-charcoal-grey.webp') },
    { name: 'Petrol Blue',    hex: '#123740', slug: 'petrol-blue',    imageUrl: luxury('07-petrol-blue.webp') },
    { name: 'Ruby Red',       hex: '#7E021D', slug: 'ruby-red',       imageUrl: luxury('08-ruby-red.webp') },
    { name: 'Plum Grey',      hex: '#3B383C', slug: 'plum-grey',      imageUrl: luxury('09-plum-grey.webp') },
    { name: 'Dusty Cedar',    hex: '#643430', slug: 'dusty-cedar',    imageUrl: luxury('10-dusty-cedar.webp') },
    { name: 'Dusty Teal',     hex: '#405E64', slug: 'dusty-teal',     imageUrl: luxury('11-dusty-teal.webp') },
    { name: 'Teal',           hex: '#1C5F6B', slug: 'teal',           imageUrl: luxury('12-teal.webp') },
    { name: 'Sapphire Blue',  hex: '#053060', slug: 'sapphire-blue',  imageUrl: luxury('13-sapphire-blue.webp') },
    { name: 'Hunter Green',   hex: '#1A3E2F', slug: 'hunter-green',   imageUrl: luxury('14-hunter-green.webp') },
    { name: 'Deep Teal',      hex: '#0F4B55', slug: 'deep-teal',      imageUrl: luxury('15-deep-teal.webp') },
    { name: 'Charcoal Black', hex: '#1E2625', slug: 'charcoal-black', imageUrl: luxury('16-charcoal-black.webp') },
  ],
}

// ── Color family categorisation ────────────────────────────────────────────
//
// Used to break the long flat lists into editorial subsections.

export type ColourFamily =
  | 'reds'
  | 'browns'
  | 'neutrals'
  | 'blacks'
  | 'blues'
  | 'greens'

export const FAMILY_LABELS: Record<ColourFamily, string> = {
  reds: 'Reds & Wines',
  browns: 'Browns & Earth',
  neutrals: 'Neutrals & Beiges',
  blacks: 'Blacks & Charcoals',
  blues: 'Blues & Teals',
  greens: 'Greens & Olives',
}

export const FAMILY_ORDER: ColourFamily[] = [
  'browns',
  'reds',
  'blacks',
  'neutrals',
  'blues',
  'greens',
]

export function familyOf(c: FabricColour): ColourFamily {
  const n = c.name.toLowerCase()
  if (/red|wine|cherry|mahogany|maroon|burgundy|ruby|cedar|crimson/.test(n)) return 'reds'
  if (/blue|navy|sapphire|petrol|teal/.test(n)) return 'blues'
  if (/green|olive/.test(n)) return 'greens'
  if (/brown|chocolate|tobacco|russet|drab|golden|walnut|cocoa|bitter|tan|pecan|mocha|espresso/.test(n)) return 'browns'
  if (/beige|bone|greige|taupe/.test(n)) return 'neutrals'
  // Black, charcoal, plum, midnight, slate, graphite, onyx, dove, mist, dark grey
  return 'blacks'
}

export function colours(line: MaterialLine): FabricColour[] {
  return COLOURS[line]
}

export function groupByFamily(line: MaterialLine): Record<ColourFamily, FabricColour[]> {
  const out: Record<ColourFamily, FabricColour[]> = {
    reds: [], browns: [], neutrals: [], blacks: [], blues: [], greens: [],
  }
  for (const c of COLOURS[line]) out[familyOf(c)].push(c)
  return out
}

export const TOTAL_COLOURS = COLOURS.renult.length + COLOURS.luxury.length
