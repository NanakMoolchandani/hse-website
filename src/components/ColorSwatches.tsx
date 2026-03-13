import { useState } from 'react'
import type { ProductColor } from '@/src/lib/supabase'

// Cloth (Kapda) colors with fabric-like texture — 30 colors
const CLOTH_COLORS = [
  { name: 'Royal Blue', hex: '#1a3a6b' },
  { name: 'Charcoal Grey', hex: '#3d3d3d' },
  { name: 'Maroon', hex: '#6b1a2a' },
  { name: 'Forest Green', hex: '#1a4d2e' },
  { name: 'Navy Black', hex: '#1a1a2e' },
  { name: 'Burgundy', hex: '#4a0e1e' },
  { name: 'Coffee Brown', hex: '#3e2723' },
  { name: 'Steel Grey', hex: '#5c6370' },
  { name: 'Sky Blue', hex: '#1a6b9a' },
  { name: 'Teal', hex: '#005a5e' },
  { name: 'Olive Green', hex: '#4a5226' },
  { name: 'Mustard', hex: '#b5860d' },
  { name: 'Rust Orange', hex: '#8b3a1a' },
  { name: 'Purple', hex: '#4a1a6b' },
  { name: 'Rose Pink', hex: '#8b2252' },
  { name: 'Camel', hex: '#8b6530' },
  { name: 'Slate Blue', hex: '#2e3f6e' },
  { name: 'Dark Teal', hex: '#1a3d3d' },
  { name: 'Wine Red', hex: '#5c1a2a' },
  { name: 'Graphite', hex: '#2e2e2e' },
  { name: 'Black', hex: '#111111' },
  { name: 'Beige', hex: '#c4a882' },
  { name: 'Cobalt Blue', hex: '#1e3d8f' },
  { name: 'Dark Olive', hex: '#3d3d1a' },
  { name: 'Jade Green', hex: '#1a5a3a' },
  { name: 'Light Grey', hex: '#909090' },
  { name: 'Dark Maroon', hex: '#3d0d1a' },
  { name: 'Chocolate Brown', hex: '#4a2010' },
  { name: 'Teal Green', hex: '#1a5a4a' },
  { name: 'Peacock Blue', hex: '#1a4a5e' },
]

// Leatherette colors with leather-like texture — 30 colors
const LEATHERETTE_COLORS = [
  { name: 'Jet Black', hex: '#1a1a1a' },
  { name: 'Dark Brown', hex: '#3e2213' },
  { name: 'Tan', hex: '#9b6e2e' },
  { name: 'Cream', hex: '#d4c5a9' },
  { name: 'Oxblood', hex: '#4a0000' },
  { name: 'Walnut', hex: '#5c3317' },
  { name: 'Slate', hex: '#4a4a4a' },
  { name: 'Off White', hex: '#f0ede6' },
  { name: 'Caramel', hex: '#a05c28' },
  { name: 'Chocolate', hex: '#3d1c02' },
  { name: 'Burgundy Wine', hex: '#6b0f1a' },
  { name: 'Saddle Brown', hex: '#7a3d1a' },
  { name: 'Navy', hex: '#1a1a4a' },
  { name: 'Mocha', hex: '#6b4226' },
  { name: 'Taupe', hex: '#8c7b6e' },
  { name: 'Vintage Brown', hex: '#6b3a1e' },
  { name: 'Gunmetal', hex: '#2e3336' },
  { name: 'Ivory', hex: '#e8dfc8' },
  { name: 'Forest Green', hex: '#1a3d2e' },
  { name: 'Midnight Blue', hex: '#1a1a3e' },
  { name: 'Espresso', hex: '#2c1005' },
  { name: 'Sandy Beige', hex: '#c9a878' },
  { name: 'Cognac', hex: '#9b4e1a' },
  { name: 'British Green', hex: '#1e3d2a' },
  { name: 'Cherry Red', hex: '#6b0a0a' },
  { name: 'Parchment', hex: '#e8d5b0' },
  { name: 'Steel Blue', hex: '#2a3f6e' },
  { name: 'Tobacco', hex: '#7a4a20' },
  { name: 'Mahogany', hex: '#5c1e0a' },
  { name: 'Platinum', hex: '#9a9a9a' },
]

function SwatchCircle({
  color,
  isActive,
  onClick,
  texture,
}: {
  color: { name: string; hex: string }
  isActive: boolean
  onClick: () => void
  texture: 'cloth' | 'leather'
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-1.5 transition-all duration-200 ${
        isActive ? 'scale-110' : 'hover:scale-105'
      }`}
      title={color.name}
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
}

export default function ColorSwatches({ colors, materials, isExecutiveChair }: ColorSwatchesProps) {
  const [activeCloth, setActiveCloth] = useState(0)
  const [activeLeather, setActiveLeather] = useState(0)

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
                <h3 className='font-semibold text-gray-900 text-base'>Cloth</h3>
                <p className='text-xs text-gray-400'>Breathable fabric upholstery</p>
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

            <div className='grid grid-cols-10 gap-2'>
              {CLOTH_COLORS.map((color, i) => (
                <SwatchCircle
                  key={color.name}
                  color={color}
                  isActive={i === activeCloth}
                  onClick={() => setActiveCloth(i)}
                  texture='cloth'
                />
              ))}
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
                <h3 className='font-semibold text-gray-900 text-base'>Leatherette</h3>
                <p className='text-xs text-gray-400'>Premium synthetic leather finish</p>
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
                ['#f0ede6', '#d4c5a9', '#e8dfc8', '#e8e0d0'].includes(LEATHERETTE_COLORS[activeLeather].hex)
                  ? 'text-gray-800/80'
                  : 'text-white/80'
              }`}>
                {LEATHERETTE_COLORS[activeLeather].name}
              </div>
            </div>

            <div className='grid grid-cols-10 gap-2'>
              {LEATHERETTE_COLORS.map((color, i) => (
                <SwatchCircle
                  key={color.name}
                  color={color}
                  isActive={i === activeLeather}
                  onClick={() => setActiveLeather(i)}
                  texture='leather'
                />
              ))}
            </div>
          </div>
        </div>

        <p className='mt-6 text-sm text-gray-400 text-center'>
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
