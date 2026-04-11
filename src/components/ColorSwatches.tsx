import { useState } from 'react'
import type { ProductColor, CatalogProduct } from '@/src/lib/supabase'

// Luxury catalogue — Premium Velvet / Suede (17 colors)
const CLOTH_COLORS = [
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

// Renult catalogue — Premium Leatherette (29 colors)
const LEATHERETTE_COLORS = [
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

function SwatchCircle({
  color,
  isActive,
  onClick,
  texture,
  hasVariant,
}: {
  color: { name: string; hex: string }
  isActive: boolean
  onClick: () => void
  texture: 'cloth' | 'leather'
  hasVariant?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-1.5 transition-all duration-200 ${
        isActive ? 'scale-110' : 'hover:scale-105'
      }`}
      title={hasVariant ? `${color.name} — view chair` : color.name}
    >
      <div
        className={`relative w-9 h-9 rounded-full overflow-hidden transition-all duration-200 ${
          isActive
            ? 'ring-2 ring-offset-2 ring-gray-900 ring-offset-white shadow-lg'
            : 'ring-1 ring-gray-200 hover:ring-gray-400'
        }`}
      >
        <div className='absolute inset-0' style={{ backgroundColor: color.hex }} />

        {texture === 'cloth' ? (
          <div
            className='absolute inset-0 opacity-30'
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.08) 1px, rgba(255,255,255,0.08) 2px),
                repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.08) 1px, rgba(255,255,255,0.08) 2px)
              `,
              backgroundSize: '3px 3px',
            }}
          />
        ) : (
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%),
                radial-gradient(ellipse at 40% 80%, rgba(0,0,0,0.12) 0%, transparent 40%)
              `,
            }}
          />
        )}

        <div
          className='absolute inset-0'
          style={{
            background: texture === 'leather'
              ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(0,0,0,0.1) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
          }}
        />
        {/* Small dot indicator: this color has real chair photos */}
        {hasVariant && (
          <div className='absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-white shadow ring-1 ring-gray-300' />
        )}
      </div>

      <span
        className={`text-[10px] md:text-xs font-medium whitespace-nowrap transition-opacity duration-200 ${
          isActive ? 'opacity-100 text-gray-900' : 'opacity-0 group-hover:opacity-100 text-gray-500'
        }`}
      >
        {color.name}
      </span>
    </button>
  )
}

interface ColorSwatchesProps {
  colors?: ProductColor[]
  materials?: string[]
  isExecutiveChair?: boolean
  /** Color variants with actual chair photos — matched by colorHex */
  variants?: CatalogProduct[]
  /** Called when user selects a variant color (null = revert to base product) */
  onVariantSelect?: (variant: CatalogProduct | null) => void
  /** Currently selected variant hex, if any */
  selectedHex?: string | null
}

export default function ColorSwatches({
  colors,
  materials,
  isExecutiveChair,
  variants = [],
  onVariantSelect,
  selectedHex,
}: ColorSwatchesProps) {
  const [activeCloth, setActiveCloth] = useState(0)
  const [activeLeather, setActiveLeather] = useState(0)

  // Build a quick hex→variant lookup
  const variantByHex: Record<string, CatalogProduct> = {}
  for (const v of variants) {
    if (v.color_hex) variantByHex[v.color_hex.toUpperCase()] = v
  }

  // Executive chairs get the premium cloth/leatherette display
  if (isExecutiveChair) {
    return (
      <div>
        <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2'>
          Available Finishes
        </p>
        <h2 className='text-2xl font-bold text-gray-900 mb-8'>
          Choose Your Material &amp; Colour
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12'>
          {/* Cloth (Kapda) */}
          <div>
            <div className='flex items-center gap-2 mb-5'>
              <div className='w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center'>
                <svg className='w-4 h-4 text-gray-600' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
                  <path d='M4 4h16v16H4z' strokeLinejoin='round' />
                  <path d='M4 12h16M12 4v16' />
                  <path d='M4 8h16M4 16h16M8 4v16M16 4v16' opacity='0.3' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 text-base'>Luxury</h3>
                <p className='text-xs text-gray-400'>Premium Velvet / Suede</p>
              </div>
            </div>

            <div
              className='relative h-16 md:h-20 rounded-xl mb-5 overflow-hidden transition-colors duration-300'
              style={{ backgroundColor: CLOTH_COLORS[activeCloth].hex }}
            >
              <div
                className='absolute inset-0 opacity-20'
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px),
                    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)
                  `,
                  backgroundSize: '6px 6px',
                }}
              />
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent' />
              <div className='absolute bottom-3 left-4 text-white/80 text-sm font-medium'>
                {CLOTH_COLORS[activeCloth].name}
              </div>
            </div>

            <div className='grid grid-cols-6 sm:grid-cols-9 gap-2'>
              {CLOTH_COLORS.map((color, i) => {
                const variant = variantByHex[color.hex.toUpperCase()]
                return (
                  <SwatchCircle
                    key={color.name}
                    color={color}
                    isActive={i === activeCloth}
                    hasVariant={!!variant}
                    onClick={() => {
                      setActiveCloth(i)
                      if (onVariantSelect) onVariantSelect(variant ?? null)
                    }}
                    texture='cloth'
                  />
                )
              })}
            </div>
          </div>

          {/* Leatherette */}
          <div>
            <div className='flex items-center gap-2 mb-5'>
              <div className='w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center'>
                <svg className='w-4 h-4 text-gray-600' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
                  <path d='M4 6c0-1.1.9-2 2-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z' />
                  <path d='M7 8c1 2 3 3 5 3s4-1 5-3' opacity='0.4' />
                  <path d='M7 14c1 2 3 3 5 3s4-1 5-3' opacity='0.25' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 text-base'>Renult</h3>
                <p className='text-xs text-gray-400'>Premium Leatherette</p>
              </div>
            </div>

            <div
              className='relative h-16 md:h-20 rounded-xl mb-5 overflow-hidden transition-colors duration-300'
              style={{ backgroundColor: LEATHERETTE_COLORS[activeLeather].hex }}
            >
              <div
                className='absolute inset-0'
                style={{
                  backgroundImage: `
                    radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 50%),
                    radial-gradient(ellipse at 70% 60%, rgba(0,0,0,0.08) 0%, transparent 50%)
                  `,
                }}
              />
              <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10' />
              <div className={`absolute bottom-3 left-4 text-sm font-medium ${
                ['#A69A83', '#B1B3B2', '#D5D5D1'].includes(LEATHERETTE_COLORS[activeLeather].hex)
                  ? 'text-gray-800/80'
                  : 'text-white/80'
              }`}>
                {LEATHERETTE_COLORS[activeLeather].name}
              </div>
            </div>

            <div className='grid grid-cols-6 sm:grid-cols-9 gap-2'>
              {LEATHERETTE_COLORS.map((color, i) => {
                const variant = variantByHex[color.hex.toUpperCase()]
                return (
                  <SwatchCircle
                    key={color.name}
                    color={color}
                    isActive={i === activeLeather}
                    hasVariant={!!variant}
                    onClick={() => {
                      setActiveLeather(i)
                      if (onVariantSelect) onVariantSelect(variant ?? null)
                    }}
                    texture='leather'
                  />
                )
              })}
            </div>
          </div>
        </div>

        {variants.length > 0 && (
          <p className='mt-4 text-xs text-gray-400 text-center'>
            <span className='inline-block w-2 h-2 rounded-full bg-white ring-1 ring-gray-300 mr-1.5 align-middle' />
            Colours with a dot have real chair photos — click to preview
          </p>
        )}
        <p className='mt-2 text-sm text-gray-400 text-center'>
          Custom colours available on request. Contact us on WhatsApp for fabric and colour samples.
        </p>
      </div>
    )
  }

  // Fallback: simple color/material display for non-executive products
  if ((!colors || colors.length === 0) && (!materials || materials.length === 0)) return null

  return (
    <div className='space-y-4'>
      {colors && colors.length > 0 && (
        <div>
          <p className='text-xs text-gray-400 uppercase tracking-wider mb-2'>Colors</p>
          <div className='flex gap-3'>
            {colors.map((color, i) => (
              <div key={i} className='flex items-center gap-2 group cursor-default'>
                <div
                  className='w-7 h-7 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200 group-hover:ring-gray-400 transition-all group-hover:scale-110'
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <span className='text-xs text-gray-600 font-medium'>{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {materials && materials.length > 0 && (
        <div>
          <p className='text-xs text-gray-400 uppercase tracking-wider mb-2'>Materials</p>
          <div className='flex flex-wrap gap-2'>
            {materials.map((material, i) => (
              <span
                key={i}
                className='text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors'
              >
                {material}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
