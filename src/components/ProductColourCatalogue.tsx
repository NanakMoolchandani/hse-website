import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'

// Categories that display the colour catalogue section
export const COLOUR_CATALOGUE_CATEGORIES = new Set([
  'EXECUTIVE_CHAIRS',
  'ERGONOMIC_TASK_CHAIRS',
  'VISITOR_RECEPTION',
  'CAFETERIA_FURNITURE',
])

// Mesh-back categories: colour options apply to the seat only
const SEAT_ONLY_CATEGORIES = new Set([
  'ERGONOMIC_TASK_CHAIRS',
  'VISITOR_RECEPTION',
  'CAFETERIA_FURNITURE',
])

const LUXURY_COLOURS = [
  { name: 'Greige',         hex: '#98927C' },
  { name: 'Taupe',          hex: '#676057' },
  { name: 'Golden Brown',   hex: '#856C4A' },
  { name: 'Deep Drab',      hex: '#413B2E' },
  { name: 'Russet Brown',   hex: '#7A5641' },
  { name: 'Mist Grey',      hex: '#6B6B66' },
  { name: 'Charcoal Grey',  hex: '#373733' },
  { name: 'Petrol Blue',    hex: '#123740' },
  { name: 'Ruby Red',       hex: '#7E021D' },
  { name: 'Plum Grey',      hex: '#3B383C' },
  { name: 'Dusty Cedar',    hex: '#643430' },
  { name: 'Dusty Teal',     hex: '#405E64' },
  { name: 'Teal',           hex: '#1C5F6B' },
  { name: 'Sapphire Blue',  hex: '#053060' },
  { name: 'Hunter Green',   hex: '#1A3E2F' },
  { name: 'Deep Teal',      hex: '#0F4B55' },
  { name: 'Charcoal Black', hex: '#1E2625' },
]

const RENULT_COLOURS = [
  { name: 'Cherry Red',      hex: '#C41A1B' },
  { name: 'Dark Brown',      hex: '#181614' },
  { name: 'Beige',           hex: '#A69A83' },
  { name: 'Jet Black',       hex: '#202220' },
  { name: 'Jet Black II',    hex: '#1F1F1F' },
  { name: 'Chocolate Brown', hex: '#201814' },
  { name: 'Dove Grey',       hex: '#B1B3B2' },
  { name: 'Tobacco Brown',   hex: '#844D2F' },
  { name: 'Mahogany',        hex: '#542D27' },
  { name: 'Maroon',          hex: '#381E22' },
  { name: 'Dark Olive',      hex: '#68695C' },
  { name: 'Wine Red',        hex: '#B31F33' },
  { name: 'Deep Brown',      hex: '#3C3531' },
  { name: 'Midnight Blue',   hex: '#1E2328' },
  { name: 'Bone',            hex: '#D5D5D1' },
  { name: 'Burgundy',        hex: '#50132D' },
  { name: 'Dark Chocolate',  hex: '#291D1A' },
  { name: 'Milk Chocolate',  hex: '#4D3428' },
  { name: 'Espresso',        hex: '#231D1A' },
  { name: 'Jet Black III',   hex: '#21272C' },
  { name: 'Rust Brown',      hex: '#5F2E20' },
  { name: 'Navy Blue',       hex: '#28323C' },
  { name: 'Cocoa',           hex: '#2F2520' },
  { name: 'Red',             hex: '#CE2828' },
  { name: 'Charcoal Grey',   hex: '#313331' },
  { name: 'Ash Grey',        hex: '#232829' },
  { name: 'Mocha',           hex: '#2F261F' },
  { name: 'Warm Brown',      hex: '#343331' },
  { name: 'Navy Teal',       hex: '#1E2626' },
]

// Light-coloured swatches that need dark text overlay
const LIGHT_HEX = new Set(['#A69A83', '#B1B3B2', '#D5D5D1', '#98927C'])

function CataloguePanel({
  name,
  material,
  colours,
  texture,
  catalogueSlug,
}: {
  name: string
  material: string
  colours: { name: string; hex: string }[]
  texture: 'cloth' | 'leather'
  catalogueSlug: string
}) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const displayIdx = hoveredIdx ?? activeIdx
  const displayColour = colours[displayIdx]

  return (
    <div className='flex-1 min-w-0'>
      {/* Catalogue header */}
      <div className='flex items-end justify-between mb-3'>
        <div>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-0.5'>
            {material}
          </p>
          <h3 className='text-lg font-bold text-gray-900'>{name}</h3>
        </div>
        <Link
          to={`/catalogue-colors/${catalogueSlug}`}
          className='text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors shrink-0 ml-4'
        >
          View all {colours.length} colours →
        </Link>
      </div>

      {/* Active colour preview strip */}
      <div
        className='relative h-16 rounded-2xl mb-4 overflow-hidden transition-colors duration-300'
        style={{ backgroundColor: displayColour.hex }}
      >
        {texture === 'cloth' ? (
          <div
            className='absolute inset-0 opacity-20'
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.12) 2px, rgba(255,255,255,0.12) 4px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.12) 2px, rgba(255,255,255,0.12) 4px)
              `,
              backgroundSize: '5px 5px',
            }}
          />
        ) : (
          <>
            <div
              className='absolute inset-0 opacity-60'
              style={{
                backgroundImage: `
                  radial-gradient(ellipse at 25% 35%, rgba(255,255,255,0.12) 0%, transparent 55%),
                  radial-gradient(ellipse at 75% 65%, rgba(0,0,0,0.1) 0%, transparent 50%)
                `,
              }}
            />
            <div className='absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-black/10' />
          </>
        )}
        <div
          className={`absolute bottom-2.5 left-4 text-sm font-medium tracking-wide transition-opacity duration-150 ${
            LIGHT_HEX.has(displayColour.hex) ? 'text-gray-800/75' : 'text-white/80'
          }`}
        >
          {displayColour.name}
        </div>
      </div>

      {/* Swatch grid */}
      <div className='flex flex-wrap gap-2'>
        {colours.map((colour, i) => (
          <button
            key={colour.name}
            title={colour.name}
            onClick={() => setActiveIdx(i)}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`w-7 h-7 rounded-full transition-all duration-150 cursor-pointer ${
              i === activeIdx
                ? 'ring-2 ring-offset-2 ring-gray-700 scale-110 shadow-md'
                : 'ring-1 ring-inset ring-gray-200 hover:ring-gray-400 hover:scale-110'
            }`}
            style={{ backgroundColor: colour.hex }}
          />
        ))}
      </div>
    </div>
  )
}

export default function ProductColourCatalogue({ category }: { category: string }) {
  if (!COLOUR_CATALOGUE_CATEGORIES.has(category)) return null

  const showSeatOnlyNote = SEAT_ONLY_CATEGORIES.has(category)

  return (
    <section className='border-t border-gray-100 py-14'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
        {/* Section heading */}
        <div className='mb-10'>
          <p className='text-xs font-semibold tracking-widest uppercase text-amber-500 mb-1.5'>
            Customise Your Chair
          </p>
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>
            Upholstery Colour Options
          </h2>
          {showSeatOnlyNote ? (
            <div className='inline-flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 max-w-xl'>
              <Info className='w-4 h-4 shrink-0 mt-0.5 text-amber-500' />
              <p className='text-sm text-gray-600 leading-relaxed'>
                Colour options are available for the{' '}
                <strong className='text-gray-800'>seat only</strong>. The backrest is
                fixed in mesh and is not available in custom colours.
              </p>
            </div>
          ) : (
            <p className='text-sm text-gray-400 max-w-xl'>
              Choose from two premium upholstery catalogues — velvet/suede or leatherette
              — available in a wide range of colours.
            </p>
          )}
        </div>

        {/* Two catalogue panels */}
        <div className='flex flex-col sm:flex-row gap-10 lg:gap-14'>
          <CataloguePanel
            name='Luxury'
            material='Premium Velvet / Suede'
            colours={LUXURY_COLOURS}
            texture='cloth'
            catalogueSlug='luxury'
          />

          {/* Vertical divider (desktop only) */}
          <div className='hidden sm:block w-px bg-gray-100 self-stretch' />

          <CataloguePanel
            name='Renult'
            material='Premium Leatherette'
            colours={RENULT_COLOURS}
            texture='leather'
            catalogueSlug='renult'
          />
        </div>

        {/* Footer note */}
        <p className='mt-10 text-sm text-gray-400'>
          Colour samples and swatches available on request.{' '}
          <a
            href='https://wa.me/919981516171?text=Hi, I would like to see colour samples for my chair.'
            target='_blank'
            rel='noopener noreferrer'
            className='text-amber-600 hover:text-amber-700 transition-colors font-medium'
          >
            Contact us on WhatsApp →
          </a>
        </p>
      </div>
    </section>
  )
}
