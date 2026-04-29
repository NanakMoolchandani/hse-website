import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import {
  MATERIALS,
  COLOURS,
  FAMILY_LABELS,
  FAMILY_ORDER,
  groupByFamily,
  TOTAL_COLOURS,
  type FabricColour,
  type MaterialLine,
} from '@/src/lib/catalogue-colours'

type FilterMode = 'all' | MaterialLine

const ALL_COLOURS: (FabricColour & { line: MaterialLine })[] = [
  ...COLOURS.renult.map((c) => ({ ...c, line: 'renult' as const })),
  ...COLOURS.luxury.map((c) => ({ ...c, line: 'luxury' as const })),
]

// ── Re-export legacy type for back-compat (CatalogueDetail import) ─────────
export type { FabricColour } from '@/src/lib/catalogue-colours'

// ── Page ───────────────────────────────────────────────────────────────────

export default function CatalogueColors() {
  const [filter, setFilter] = useState<FilterMode>('all')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())

  // Order of swatches for the lightbox prev/next — depends on the filter.
  const flatList = filter === 'all'
    ? ALL_COLOURS
    : COLOURS[filter].map((c) => ({ ...c, line: filter as MaterialLine }))

  const lightboxColour = lightboxIdx !== null ? flatList[lightboxIdx] : null

  // Keyboard nav inside lightbox
  useEffect(() => {
    if (lightboxIdx === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxIdx(null)
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i! > 0 ? i! - 1 : flatList.length - 1))
      if (e.key === 'ArrowRight') setLightboxIdx((i) => (i! < flatList.length - 1 ? i! + 1 : 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIdx, flatList.length])

  function openLightbox(line: MaterialLine, slug: string) {
    const idx = flatList.findIndex((c) => c.line === line && c.slug === slug)
    if (idx >= 0) setLightboxIdx(idx)
  }

  function markError(key: string) {
    setImgErrors((prev) => {
      const next = new Set(prev)
      next.add(key)
      return next
    })
  }

  return (
    <>
      <SEO
        title='Fabric Catalogue — 46 Premium Upholstery Colours | MVM Aasanam'
        description='Forty-six hand-picked upholstery shades across two material lines: Renult Premium Leatherette and Luxury Velvet & Suede. Every chair in the MVM Aasanam range is available in this curated palette.'
        canonical='/catalogue-colors'
        keywords='fabric catalogue, upholstery colours, leatherette colors, velvet colors, suede, MVM Aasanam fabric, chair upholstery, custom colour furniture'
        jsonLd={createBreadcrumbSchema([
          { name: 'Home', url: '/home' },
          { name: 'Fabric Catalogue', url: '/catalogue-colors' },
        ])}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className='relative min-h-[60vh] md:min-h-[72vh] flex items-end bg-black overflow-hidden pt-32 pb-16 md:pb-24'>
        {/* Background swatch mosaic — subtle, blurred */}
        <div
          aria-hidden
          className='absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-[0.55]'
        >
          {ALL_COLOURS.slice(0, 72).map((c, i) => (
            <div key={i} style={{ backgroundColor: c.hex }} />
          ))}
        </div>
        <div
          aria-hidden
          className='absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/55'
        />
        <div
          aria-hidden
          className='absolute inset-0'
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 60%, rgba(245,158,11,0.06), transparent 55%)',
          }}
        />

        <div className='relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6'>
          <Link
            to='/mvm'
            className='inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-gray-500 hover:text-gray-300 transition-colors mb-10'
          >
            <ArrowLeft className='w-3.5 h-3.5' />
            MVM Aasanam
          </Link>

          <p className='text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400 mb-5'>
            The Material Library
          </p>
          <h1 className='font-display text-5xl sm:text-7xl md:text-8xl text-white leading-[0.95] tracking-tight max-w-4xl'>
            <span className='block italic font-light text-gray-300'>The</span>
            Fabric Catalogue.
          </h1>
          <p className='mt-8 text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl'>
            <span className='text-white'>{TOTAL_COLOURS} hand-selected upholstery shades</span> across two material lines —
            engineered for the way commercial seating is used, photographed where the swatches actually live.
          </p>

          {/* Material counters */}
          <div className='mt-12 flex flex-wrap gap-x-12 gap-y-4 text-gray-400'>
            <div>
              <p className='font-display text-3xl md:text-4xl text-white'>
                {COLOURS.renult.length}
              </p>
              <p className='text-[10px] uppercase tracking-[0.25em] text-amber-400 mt-1'>
                Renult Leatherette
              </p>
            </div>
            <div className='hidden sm:block w-px bg-white/10 self-stretch' />
            <div>
              <p className='font-display text-3xl md:text-4xl text-white'>
                {COLOURS.luxury.length}
              </p>
              <p className='text-[10px] uppercase tracking-[0.25em] text-amber-400 mt-1'>
                Luxury Velvet & Suede
              </p>
            </div>
            <div className='hidden sm:block w-px bg-white/10 self-stretch' />
            <div>
              <p className='font-display text-3xl md:text-4xl text-white'>06</p>
              <p className='text-[10px] uppercase tracking-[0.25em] text-amber-400 mt-1'>
                Colour Families
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ribbon — every swatch as a thin colour stripe ────── */}
      <section aria-hidden className='bg-black border-y border-white/10 overflow-hidden'>
        <div className='flex w-max animate-marquee'>
          {[...ALL_COLOURS, ...ALL_COLOURS].map((c, i) => (
            <span
              key={i}
              title={c.name}
              className='inline-block h-3 w-12 sm:w-16'
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </section>

      {/* ── Sticky filter bar ────────────────────────────────────────── */}
      <div className='sticky top-16 md:top-[108px] z-30 bg-black/95 backdrop-blur-md border-b border-white/10'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6'>
          <div className='flex items-center gap-1 overflow-x-auto -mb-px'>
            <FilterTab
              label='All'
              count={TOTAL_COLOURS}
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            />
            <FilterTab
              label='Renult Leatherette'
              count={COLOURS.renult.length}
              active={filter === 'renult'}
              onClick={() => setFilter('renult')}
            />
            <FilterTab
              label='Luxury Velvet'
              count={COLOURS.luxury.length}
              active={filter === 'luxury'}
              onClick={() => setFilter('luxury')}
            />
          </div>
        </div>
      </div>

      {/* ── Sections per material ────────────────────────────────────── */}
      <main className='bg-black'>
        {(filter === 'all' || filter === 'renult') && (
          <MaterialSection
            line='renult'
            onPick={(slug) => openLightbox('renult', slug)}
            imgErrors={imgErrors}
            onImgError={markError}
          />
        )}
        {(filter === 'all' || filter === 'luxury') && (
          <MaterialSection
            line='luxury'
            onPick={(slug) => openLightbox('luxury', slug)}
            imgErrors={imgErrors}
            onImgError={markError}
          />
        )}

        {/* CTA */}
        <section className='border-t border-white/10 py-20 md:py-28'>
          <div className='max-w-3xl mx-auto px-4 sm:px-6 text-center'>
            <p className='text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-400 mb-4'>
              Custom Enquiry
            </p>
            <h2 className='font-display text-3xl md:text-5xl text-white leading-tight mb-5'>
              Don't see the shade you want?
            </h2>
            <p className='text-base md:text-lg text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto'>
              For institutional and bulk orders, we source custom fabric colours from our partner mills.
              Send us the swatch or pantone — we'll match it.
            </p>
            <a
              href='https://wa.me/919981516171?text=Hi%2C%20I%27m%20looking%20for%20a%20custom%20fabric%20colour%20for%20MVM%20Aasanam%20chairs.'
              className='inline-flex items-center gap-2 bg-amber-500 text-black font-semibold px-8 py-3.5 text-sm uppercase tracking-[0.18em] hover:bg-amber-400 transition-colors'
            >
              <MessageCircle className='w-4 h-4' />
              Enquire on WhatsApp
            </a>
          </div>
        </section>
      </main>

      {/* ── Lightbox ─────────────────────────────────────────────────── */}
      {lightboxColour && (
        <Lightbox
          colour={lightboxColour}
          index={lightboxIdx!}
          total={flatList.length}
          imgErrored={imgErrors.has(`${lightboxColour.line}-${lightboxColour.slug}`)}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx((i) => (i! > 0 ? i! - 1 : flatList.length - 1))}
          onNext={() => setLightboxIdx((i) => (i! < flatList.length - 1 ? i! + 1 : 0))}
          onImgError={() => markError(`${lightboxColour.line}-${lightboxColour.slug}`)}
        />
      )}

      <Footer variant='dark' />
    </>
  )
}

// ── Material section ───────────────────────────────────────────────────────

function MaterialSection({
  line,
  onPick,
  imgErrors,
  onImgError,
}: {
  line: MaterialLine
  onPick: (slug: string) => void
  imgErrors: Set<string>
  onImgError: (key: string) => void
}) {
  const meta = MATERIALS[line]
  const families = groupByFamily(line)

  return (
    <section className='border-t border-white/10 py-20 md:py-28'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        {/* Section header */}
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16'>
          <div>
            <p className='text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-400 mb-3'>
              Line {line === 'renult' ? '01' : '02'} — {meta.material}
            </p>
            <h2 className='font-display text-5xl md:text-7xl text-white leading-[0.95] tracking-tight'>
              {meta.name}
            </h2>
          </div>
          <p className='text-sm md:text-base text-gray-400 leading-relaxed max-w-md md:text-right'>
            {meta.description}
          </p>
        </div>

        {/* Family-grouped grid */}
        <div className='space-y-16'>
          {FAMILY_ORDER.map((family) => {
            const list = families[family]
            if (!list.length) return null
            return (
              <div key={family}>
                <div className='flex items-baseline gap-4 mb-6'>
                  <h3 className='text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500'>
                    {FAMILY_LABELS[family]}
                  </h3>
                  <span className='flex-1 h-px bg-white/10' />
                  <span className='text-[10px] tabular-nums tracking-[0.2em] text-gray-600'>
                    {String(list.length).padStart(2, '0')}
                  </span>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4'>
                  {list.map((c) => {
                    const errKey = `${line}-${c.slug}`
                    return (
                      <SwatchTile
                        key={c.slug}
                        colour={c}
                        errored={imgErrors.has(errKey)}
                        onError={() => onImgError(errKey)}
                        onClick={() => onPick(c.slug)}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── Swatch tile ────────────────────────────────────────────────────────────

function SwatchTile({
  colour,
  errored,
  onError,
  onClick,
}: {
  colour: FabricColour
  errored: boolean
  onError: () => void
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className='group relative text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60'
    >
      <div className='relative aspect-square overflow-hidden bg-gray-900'>
        {!errored ? (
          <img
            src={colour.imageUrl}
            alt={`${colour.name} fabric swatch`}
            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
            loading='lazy'
            onError={onError}
          />
        ) : (
          <div
            className='w-full h-full transition-transform duration-700 group-hover:scale-110'
            style={{
              backgroundColor: colour.hex,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.04' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        )}

        {/* Hover overlay — gradient + hex chip */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity' />
        <div className='absolute bottom-3 left-3 right-3 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300'>
          <span className='text-xs font-medium tracking-wide drop-shadow'>{colour.name}</span>
          <span className='text-[10px] uppercase tracking-[0.2em] text-amber-400 tabular-nums'>
            {colour.hex}
          </span>
        </div>
      </div>

      {/* Persistent label below */}
      <div className='mt-3 flex items-baseline gap-2'>
        <span
          className='w-2 h-2 rounded-full flex-shrink-0 mt-0.5'
          style={{ backgroundColor: colour.hex }}
        />
        <span className='text-[13px] text-gray-300 group-hover:text-white transition-colors truncate'>
          {colour.name}
        </span>
      </div>
    </button>
  )
}

// ── Filter tab ─────────────────────────────────────────────────────────────

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-shrink-0 px-4 py-4 text-xs whitespace-nowrap transition-colors ${
        active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      <span className='font-medium tracking-wide'>{label}</span>
      <span className={`ml-2 text-[10px] tabular-nums tracking-wider ${active ? 'text-amber-400' : 'text-gray-600'}`}>
        {String(count).padStart(2, '0')}
      </span>
      {active && (
        <span className='absolute bottom-0 left-3 right-3 h-[2px] bg-amber-500' />
      )}
    </button>
  )
}

// ── Lightbox ───────────────────────────────────────────────────────────────

function Lightbox({
  colour,
  index,
  total,
  imgErrored,
  onClose,
  onPrev,
  onNext,
  onImgError,
}: {
  colour: FabricColour & { line: MaterialLine }
  index: number
  total: number
  imgErrored: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onImgError: () => void
}) {
  const meta = MATERIALS[colour.line]
  return (
    <div
      className='fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4'
      onClick={onClose}
    >
      <div
        className='relative max-w-3xl w-full'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute -top-12 right-0 text-gray-400 hover:text-white p-2 transition-colors'
          aria-label='Close'
        >
          <X className='w-5 h-5' />
        </button>

        <div className='aspect-square bg-gray-900 overflow-hidden'>
          {!imgErrored ? (
            <img
              src={colour.imageUrl}
              alt={`${colour.name} fabric swatch — high resolution`}
              className='w-full h-full object-cover'
              onError={onImgError}
            />
          ) : (
            <div className='w-full h-full' style={{ backgroundColor: colour.hex }} />
          )}
        </div>

        <div className='mt-6 flex items-end justify-between gap-3'>
          <div className='min-w-0'>
            <p className='text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-400 mb-2'>
              {meta.material}
            </p>
            <h3 className='font-display text-2xl md:text-3xl text-white leading-tight truncate'>
              {colour.name}
            </h3>
            <p className='text-[11px] uppercase tracking-[0.25em] text-gray-500 mt-1.5 tabular-nums'>
              {colour.hex}
            </p>
          </div>
          <div className='flex items-center gap-2 flex-shrink-0'>
            <button
              onClick={onPrev}
              className='p-2 border border-white/15 text-white hover:bg-white/10 transition-colors'
              aria-label='Previous'
            >
              <ChevronLeft className='w-4 h-4' />
            </button>
            <span className='text-[11px] uppercase tracking-[0.2em] text-gray-500 tabular-nums min-w-[3.5rem] text-center'>
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button
              onClick={onNext}
              className='p-2 border border-white/15 text-white hover:bg-white/10 transition-colors'
              aria-label='Next'
            >
              <ChevronRight className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

