import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'
import { CATALOGUE_COLOURS } from '@/src/pages/CatalogueDetail'

// Categories that display the colour catalogue section
export const COLOUR_CATALOGUE_CATEGORIES = new Set([
  'EXECUTIVE_CHAIRS',
  'ERGONOMIC_TASK_CHAIRS',
  'VISITOR_RECEPTION',
  'CAFETERIA_FURNITURE',
])

// Light-coloured swatches that need dark text on the preview
const LIGHT_HEX = new Set(['#A69A83', '#B1B3B2', '#D5D5D1', '#98927C'])

function CataloguePanel({
  catalogueSlug,
  name,
  material,
}: {
  catalogueSlug: 'luxury' | 'renult'
  name: string
  material: string
}) {
  const colours = CATALOGUE_COLOURS[catalogueSlug] ?? []
  const [activeIdx, setActiveIdx] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const displayIdx = hoveredIdx ?? activeIdx
  const displayColour = colours[displayIdx]

  function handleImageError(idx: number) {
    setImageErrors((prev) => new Set(prev).add(idx))
  }

  return (
    <div className='flex-1 min-w-0'>
      {/* Header */}
      <div className='flex items-end justify-between mb-4'>
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
          View all {colours.length} →
        </Link>
      </div>

      {/* Large preview image */}
      <div className='relative aspect-[16/7] rounded-2xl overflow-hidden mb-5 bg-gray-100'>
        {!imageErrors.has(displayIdx) ? (
          <img
            key={displayColour.imageUrl}
            src={displayColour.imageUrl}
            alt={`${displayColour.name} fabric swatch`}
            className='w-full h-full object-cover transition-opacity duration-300'
            onError={() => handleImageError(displayIdx)}
          />
        ) : (
          /* Fallback to hex colour with texture pattern */
          <div
            className='w-full h-full'
            style={{
              backgroundColor: displayColour.hex,
              backgroundImage:
                catalogueSlug === 'luxury'
                  ? `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.07) 2px, rgba(255,255,255,0.07) 4px),
                     repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.07) 2px, rgba(255,255,255,0.07) 4px)`
                  : `radial-gradient(ellipse at 25% 35%, rgba(255,255,255,0.1) 0%, transparent 55%),
                     radial-gradient(ellipse at 75% 65%, rgba(0,0,0,0.08) 0%, transparent 50%)`,
              backgroundSize: catalogueSlug === 'luxury' ? '5px 5px' : 'auto',
            }}
          />
        )}

        {/* Colour name overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />
        <div className='absolute bottom-3 left-4 flex items-center gap-2.5'>
          <span
            className='w-4 h-4 rounded-full border-2 border-white/40 shrink-0'
            style={{ backgroundColor: displayColour.hex }}
          />
          <span
            className={`text-sm font-semibold tracking-wide ${
              LIGHT_HEX.has(displayColour.hex) ? 'text-gray-800' : 'text-white'
            }`}
          >
            {displayColour.name}
          </span>
        </div>
      </div>

      {/* Swatch grid — staggered brick layout */}
      {(() => {
        // Tune columns so rows split cleanly:
        // Luxury (17) → 9 cols = 9+8 (two rows)
        // Renult (29) → 10 cols = 10+10+9 (three rows)
        const cols = colours.length <= 20 ? 9 : 10
        // swatch = 40px, gap = 8px → half-offset = (40+8)/2 = 24px
        const rows: typeof colours[] = []
        for (let i = 0; i < colours.length; i += cols) {
          rows.push(colours.slice(i, i + cols))
        }
        return (
          <div className='flex flex-col gap-2'>
            {rows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className='flex gap-2'
                style={{ marginLeft: rowIdx % 2 === 1 ? '24px' : '0px' }}
              >
                {row.map((colour, colIdx) => {
                  const globalIdx = rowIdx * cols + colIdx
                  return (
                    <button
                      key={colour.slug}
                      title={colour.name}
                      onClick={() => setActiveIdx(globalIdx)}
                      onMouseEnter={() => setHoveredIdx(globalIdx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className={`relative w-10 h-10 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-150 focus:outline-none ${
                        globalIdx === activeIdx
                          ? 'ring-2 ring-offset-2 ring-gray-800 scale-105 shadow-lg'
                          : 'ring-1 ring-gray-200 hover:ring-gray-400 hover:scale-105'
                      }`}
                    >
                      {!imageErrors.has(globalIdx) ? (
                        <img
                          src={colour.imageUrl}
                          alt={colour.name}
                          className='w-full h-full object-cover'
                          loading='lazy'
                          onError={() => handleImageError(globalIdx)}
                        />
                      ) : (
                        <div className='w-full h-full' style={{ backgroundColor: colour.hex }} />
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        )
      })()}
    </div>
  )
}

export default function ProductColourCatalogue({
  category,
  isMeshBack = false,
}: {
  category: string
  isMeshBack?: boolean
}) {
  if (!COLOUR_CATALOGUE_CATEGORIES.has(category)) return null

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
          {isMeshBack ? (
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
            catalogueSlug='luxury'
            name='Luxury'
            material='Premium Velvet / Suede'
          />

          <div className='hidden sm:block w-px bg-gray-100 self-stretch' />

          <CataloguePanel
            catalogueSlug='renult'
            name='Renult'
            material='Premium Leatherette'
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
