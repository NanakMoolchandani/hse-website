import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Palette, X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import { COLOUR_CATALOGUES } from './CatalogueColors'

// ── Colour data per catalogue ──────────────────────────────────────

export interface FabricColour {
  name: string
  hex: string
  slug: string
  /** Image URL in Supabase storage */
  imageUrl: string
}

const SUPABASE_STORAGE_BASE = 'https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog-assets'

function luxuryImageUrl(filename: string): string {
  return `${SUPABASE_STORAGE_BASE}/colour-catalogues/luxury/${filename}`
}

export const CATALOGUE_COLOURS: Record<string, FabricColour[]> = {
  luxury: [],
}

// ── Page Component ─────────────────────────────────────────────────

export default function CatalogueDetail() {
  const { slug } = useParams<{ slug: string }>()
  const catalogue = COLOUR_CATALOGUES.find((c) => c.slug === slug)
  const colours = slug ? CATALOGUE_COLOURS[slug] || [] : []
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  if (!catalogue) {
    return (
      <div className='min-h-screen bg-gray-950 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-white mb-4'>Catalogue Not Found</h1>
          <Link to='/catalogue-colors' className='text-purple-400 hover:text-purple-300'>
            Back to Catalogues
          </Link>
        </div>
      </div>
    )
  }

  const selectedColour = selectedIdx !== null ? colours[selectedIdx] : null

  function handlePrev() {
    if (selectedIdx === null) return
    setSelectedIdx(selectedIdx > 0 ? selectedIdx - 1 : colours.length - 1)
  }

  function handleNext() {
    if (selectedIdx === null) return
    setSelectedIdx(selectedIdx < colours.length - 1 ? selectedIdx + 1 : 0)
  }

  function handleImageError(idx: number) {
    setImageErrors((prev) => new Set(prev).add(idx))
  }

  return (
    <>
      <SEO
        title={`${catalogue.name} Fabric Colors - ${catalogue.material}`}
        description={catalogue.description}
        canonical={`/catalogue-colors/${catalogue.slug}`}
        keywords={`${catalogue.name} fabric, ${catalogue.material}, upholstery colors, furniture fabric swatches, ${colours.map(c => c.name).join(', ')}`}
        jsonLd={createBreadcrumbSchema([
          { name: 'Home', url: '/home' },
          { name: 'Catalogue Colors', url: '/catalogue-colors' },
          { name: catalogue.name, url: `/catalogue-colors/${catalogue.slug}` },
        ])}
      />

      {/* Hero */}
      <section className='relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6'>
          <Link
            to='/catalogue-colors'
            className='inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-8'
          >
            <ArrowLeft className='w-4 h-4' />
            All Catalogues
          </Link>

          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
            <div>
              <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4'>
                <Palette className='w-3.5 h-3.5 text-purple-400' />
                <span className='text-xs font-medium text-purple-400'>{catalogue.material}</span>
              </div>
              <h1 className='font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight'>
                {catalogue.name} Collection
              </h1>
              <p className='text-gray-400 max-w-xl leading-relaxed'>
                {catalogue.description}
              </p>
            </div>
            <div className='flex-shrink-0'>
              <span className='text-sm text-gray-500'>{colours.length} colours available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Colour Grid */}
      <section className='bg-gray-950 pb-16 md:pb-24'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6'>
            {colours.map((colour, idx) => (
              <button
                key={colour.slug}
                onClick={() => setSelectedIdx(idx)}
                className='group text-left focus:outline-none'
              >
                <div className='relative aspect-square rounded-xl overflow-hidden border-2 border-transparent group-hover:border-purple-500/50 group-focus:border-purple-500/50 transition-all duration-200'>
                  {!imageErrors.has(idx) ? (
                    <img
                      src={colour.imageUrl}
                      alt={`${colour.name} fabric swatch`}
                      className='w-full h-full object-cover'
                      loading='lazy'
                      onError={() => handleImageError(idx)}
                    />
                  ) : (
                    /* Fallback: solid color with subtle texture */
                    <div
                      className='w-full h-full'
                      style={{
                        backgroundColor: colour.hex,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    />
                  )}
                  {/* Hover overlay */}
                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center'>
                    <span className='opacity-0 group-hover:opacity-100 text-white text-sm font-medium bg-black/60 px-3 py-1.5 rounded-full transition-opacity'>
                      View
                    </span>
                  </div>
                </div>

                {/* Label */}
                <div className='mt-3 flex items-center gap-2'>
                  <span
                    className='w-4 h-4 rounded-full border border-white/10 flex-shrink-0'
                    style={{ backgroundColor: colour.hex }}
                  />
                  <span className='text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate'>
                    {colour.name}
                  </span>
                </div>
                <p className='mt-0.5 text-xs text-gray-600 uppercase tracking-wider ml-6'>
                  {colour.hex}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='bg-gray-950 pb-16'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 text-center'>
          <div className='bg-gray-900/60 border border-white/5 rounded-2xl p-8 md:p-12'>
            <h2 className='text-2xl md:text-3xl font-bold text-white mb-3'>
              Need a Custom Colour?
            </h2>
            <p className='text-gray-400 mb-6 max-w-lg mx-auto'>
              Can't find the shade you're looking for? We can source custom fabric colours for bulk orders. Contact us with your requirements.
            </p>
            <a
              href='https://wa.me/919981516171?text=Hi%2C%20I%27m%20interested%20in%20the%20Luxury%20fabric%20catalogue.%20Please%20share%20more%20details.'
              className='inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors'
            >
              <MessageCircle className='w-5 h-5' />
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedColour && (
        <div
          className='fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4'
          onClick={() => setSelectedIdx(null)}
        >
          <div
            className='relative max-w-2xl w-full'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedIdx(null)}
              className='absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors p-2'
            >
              <X className='w-6 h-6' />
            </button>

            {/* Image */}
            <div className='aspect-square rounded-2xl overflow-hidden bg-gray-900'>
              {!imageErrors.has(selectedIdx!) ? (
                <img
                  src={selectedColour.imageUrl}
                  alt={`${selectedColour.name} fabric swatch`}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div
                  className='w-full h-full'
                  style={{
                    backgroundColor: selectedColour.hex,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              )}
            </div>

            {/* Info bar */}
            <div className='mt-4 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <span
                  className='w-8 h-8 rounded-full border-2 border-white/20'
                  style={{ backgroundColor: selectedColour.hex }}
                />
                <div>
                  <h3 className='text-lg font-bold text-white'>{selectedColour.name}</h3>
                  <p className='text-sm text-gray-500 uppercase tracking-wider'>{selectedColour.hex}</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={handlePrev}
                  className='p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors'
                >
                  <ChevronLeft className='w-5 h-5' />
                </button>
                <span className='text-sm text-gray-500 min-w-[3rem] text-center'>
                  {selectedIdx! + 1} / {colours.length}
                </span>
                <button
                  onClick={handleNext}
                  className='p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors'
                >
                  <ChevronRight className='w-5 h-5' />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer variant='dark' />
    </>
  )
}
