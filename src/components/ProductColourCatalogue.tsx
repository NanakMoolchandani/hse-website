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

// ── Colour group definitions ─────────────────────────────────────────────────

type ColourGroup = { label: string; slugs: string[] }

const LUXURY_GROUPS: ColourGroup[] = [
  {
    label: 'Neutrals',
    slugs: ['greige', 'taupe', 'mist-grey', 'charcoal-grey', 'plum-grey', 'charcoal-black'],
  },
  {
    label: 'Warm Tones',
    slugs: ['golden-brown', 'deep-drab', 'russet-brown', 'dusty-cedar', 'ruby-red'],
  },
  {
    label: 'Cool Tones',
    slugs: ['petrol-blue', 'dusty-teal', 'teal', 'deep-teal', 'sapphire-blue', 'hunter-green'],
  },
]

const RENULT_GROUPS: ColourGroup[] = [
  {
    label: 'Neutrals',
    slugs: [
      'bone', 'beige', 'dove-grey', 'dark-olive',
      'jet-black', 'jet-black-5', 'jet-black-20',
      'charcoal-grey', 'charcoal-grey-26', 'dark-brown-28',
    ],
  },
  {
    label: 'Warm Tones',
    slugs: [
      'dark-brown', 'chocolate-brown', 'dark-brown-8',
      'mahogany', 'milk-chocolate', 'chocolate-brown-18',
      'chocolate-brown-21', 'chocolate-brown-23',
      'chocolate-brown-27', 'maroon', 'dark-brown-13',
      'burgundy', 'chocolate-brown-17', 'chocolate-brown-19',
      'cherry-red', 'wine-red', 'red',
    ],
  },
  {
    label: 'Cool Tones',
    slugs: ['midnight-blue', 'navy-blue', 'navy-blue-29'],
  },
]

const CATALOGUE_GROUPS: Record<string, ColourGroup[]> = {
  luxury: LUXURY_GROUPS,
  renult: RENULT_GROUPS,
}

// ── Swatch button ────────────────────────────────────────────────────────────

function Swatch({
  colour,
  globalIdx,
  isActive,
  hasError,
  onSelect,
  onHover,
  onHoverEnd,
  onError,
}: {
  colour: { name: string; hex: string; imageUrl: string }
  globalIdx: number
  isActive: boolean
  hasError: boolean
  onSelect: (i: number) => void
  onHover: (i: number) => void
  onHoverEnd: () => void
  onError: (i: number) => void
}) {
  return (
    <button
      title={colour.name}
      onClick={() => onSelect(globalIdx)}
      onMouseEnter={() => onHover(globalIdx)}
      onMouseLeave={onHoverEnd}
      className={`relative w-10 h-10 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-150 focus:outline-none ${
        isActive
          ? 'ring-2 ring-offset-[3px] ring-gray-800 shadow-sm'
          : 'ring-1 ring-gray-200 hover:ring-gray-400 hover:scale-105'
      }`}
    >
      {!hasError ? (
        <img
          src={colour.imageUrl}
          alt={colour.name}
          className='w-full h-full object-cover'
          loading='lazy'
          onError={() => onError(globalIdx)}
        />
      ) : (
        <div className='w-full h-full' style={{ backgroundColor: colour.hex }} />
      )}
    </button>
  )
}

// ── Catalogue panel ───────────────────────────────────────────────────────────

function CataloguePanel({
  catalogueSlug,
  name,
  material,
}: {
  catalogueSlug: 'luxury' | 'renult'
  name: string
  material: string
}) {
  const allColours = CATALOGUE_COLOURS[catalogueSlug] ?? []
  const groups = CATALOGUE_GROUPS[catalogueSlug] ?? []

  // Build a flat ordered list that matches group order, for index tracking
  const orderedColours = groups.flatMap((g) =>
    g.slugs.map((slug) => allColours.find((c) => c.slug === slug)).filter(Boolean),
  ) as typeof allColours

  const [activeIdx, setActiveIdx] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const displayIdx = hoveredIdx ?? activeIdx
  const displayColour = orderedColours[displayIdx] ?? orderedColours[0]

  function handleError(idx: number) {
    setImageErrors((prev) => new Set(prev).add(idx))
  }

  // Build per-group flat index lookup: each slug maps to its position in orderedColours
  const slugToIdx = new Map(orderedColours.map((c, i) => [c.slug, i]))

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
          View all {allColours.length} →
        </Link>
      </div>

      {/* Large preview image */}
      <div className='relative aspect-[16/7] rounded-2xl overflow-hidden mb-6 bg-gray-100'>
        {!imageErrors.has(displayIdx) ? (
          <img
            key={displayColour.imageUrl}
            src={displayColour.imageUrl}
            alt={`${displayColour.name} fabric swatch`}
            className='w-full h-full object-cover transition-opacity duration-300'
            onError={() => handleError(displayIdx)}
          />
        ) : (
          <div
            className='w-full h-full'
            style={{
              backgroundColor: displayColour.hex,
              backgroundImage:
                catalogueSlug === 'luxury'
                  ? `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.07) 2px, rgba(255,255,255,0.07) 4px),
                     repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.07) 2px, rgba(255,255,255,0.07) 4px)`
                  : `radial-gradient(ellipse at 25% 35%, rgba(255,255,255,0.1) 0%, transparent 55%)`,
              backgroundSize: catalogueSlug === 'luxury' ? '5px 5px' : 'auto',
            }}
          />
        )}
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

      {/* Grouped swatch columns — equal-height bordered cards */}
      <div className='grid grid-cols-3 gap-3 items-stretch'>
        {groups.map((group) => {
          const groupColours = group.slugs
            .map((slug) => allColours.find((c) => c.slug === slug))
            .filter(Boolean) as typeof allColours

          return (
            <div
              key={group.label}
              className='border border-gray-100 rounded-2xl p-3 flex flex-col'
            >
              {/* Group label */}
              <p className='text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3'>
                {group.label}
              </p>
              {/* 4-per-row swatch grid with generous gap */}
              <div className='grid grid-cols-4 gap-3'>
                {groupColours.map((colour) => {
                  const globalIdx = slugToIdx.get(colour.slug) ?? 0
                  return (
                    <Swatch
                      key={colour.slug}
                      colour={colour}
                      globalIdx={globalIdx}
                      isActive={globalIdx === activeIdx}
                      hasError={imageErrors.has(globalIdx)}
                      onSelect={setActiveIdx}
                      onHover={setHoveredIdx}
                      onHoverEnd={() => setHoveredIdx(null)}
                      onError={handleError}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Page section ─────────────────────────────────────────────────────────────

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
