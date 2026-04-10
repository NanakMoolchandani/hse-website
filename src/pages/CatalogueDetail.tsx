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

function renultImageUrl(filename: string): string {
  return `${SUPABASE_STORAGE_BASE}/colour-catalogues/renult/${filename}`
}

export const CATALOGUE_COLOURS: Record<string, FabricColour[]> = {
  renult: [
    { name: 'Cherry Red',         hex: '#C41A1B', slug: 'cherry-red',          imageUrl: renultImageUrl('01-cherry-red.webp') },
    { name: 'Dark Brown',         hex: '#181614', slug: 'dark-brown',          imageUrl: renultImageUrl('02-dark-brown.webp') },
    { name: 'Beige',              hex: '#A69A83', slug: 'beige',               imageUrl: renultImageUrl('03-beige.webp') },
    { name: 'Jet Black',          hex: '#202220', slug: 'jet-black',           imageUrl: renultImageUrl('04-jet-black.webp') },
    { name: 'Jet Black',          hex: '#1F1F1F', slug: 'jet-black-5',         imageUrl: renultImageUrl('05-jet-black-5.webp') },
    { name: 'Chocolate Brown',    hex: '#201814', slug: 'chocolate-brown',     imageUrl: renultImageUrl('06-chocolate-brown.webp') },
    { name: 'Dove Grey',          hex: '#B1B3B2', slug: 'dove-grey',           imageUrl: renultImageUrl('07-dove-grey.webp') },
    { name: 'Dark Brown',         hex: '#844D2F', slug: 'dark-brown-8',        imageUrl: renultImageUrl('08-dark-brown-8.webp') },
    { name: 'Mahogany',           hex: '#542D27', slug: 'mahogany',            imageUrl: renultImageUrl('09-mahogany.webp') },
    { name: 'Maroon',             hex: '#381E22', slug: 'maroon',              imageUrl: renultImageUrl('10-maroon.webp') },
    { name: 'Dark Olive',         hex: '#68695C', slug: 'dark-olive',          imageUrl: renultImageUrl('11-dark-olive.webp') },
    { name: 'Wine Red',           hex: '#B31F33', slug: 'wine-red',            imageUrl: renultImageUrl('12-wine-red.webp') },
    { name: 'Dark Brown',         hex: '#3C3531', slug: 'dark-brown-13',       imageUrl: renultImageUrl('13-dark-brown-13.webp') },
    { name: 'Midnight Blue',      hex: '#1E2328', slug: 'midnight-blue',       imageUrl: renultImageUrl('14-midnight-blue.webp') },
    { name: 'Bone',               hex: '#D5D5D1', slug: 'bone',                imageUrl: renultImageUrl('15-bone.webp') },
    { name: 'Burgundy',           hex: '#50132D', slug: 'burgundy',            imageUrl: renultImageUrl('16-burgundy.webp') },
    { name: 'Chocolate Brown',    hex: '#291D1A', slug: 'chocolate-brown-17',  imageUrl: renultImageUrl('17-chocolate-brown-17.webp') },
    { name: 'Chocolate Brown',    hex: '#4D3428', slug: 'chocolate-brown-18',  imageUrl: renultImageUrl('18-chocolate-brown-18.webp') },
    { name: 'Chocolate Brown',    hex: '#231D1A', slug: 'chocolate-brown-19',  imageUrl: renultImageUrl('19-chocolate-brown-19.webp') },
    { name: 'Jet Black',          hex: '#21272C', slug: 'jet-black-20',        imageUrl: renultImageUrl('20-jet-black-20.webp') },
    { name: 'Chocolate Brown',    hex: '#5F2E20', slug: 'chocolate-brown-21',  imageUrl: renultImageUrl('21-chocolate-brown-21.webp') },
    { name: 'Navy Blue',          hex: '#28323C', slug: 'navy-blue',           imageUrl: renultImageUrl('22-navy-blue.webp') },
    { name: 'Chocolate Brown',    hex: '#2F2520', slug: 'chocolate-brown-23',  imageUrl: renultImageUrl('23-chocolate-brown-23.webp') },
    { name: 'Red',                hex: '#CE2828', slug: 'red',                 imageUrl: renultImageUrl('24-red.webp') },
    { name: 'Charcoal Grey',      hex: '#313331', slug: 'charcoal-grey',       imageUrl: renultImageUrl('25-charcoal-grey.webp') },
    { name: 'Charcoal Grey',      hex: '#232829', slug: 'charcoal-grey-26',    imageUrl: renultImageUrl('26-charcoal-grey-26.webp') },
    { name: 'Chocolate Brown',    hex: '#2F261F', slug: 'chocolate-brown-27',  imageUrl: renultImageUrl('27-chocolate-brown-27.webp') },
    { name: 'Dark Brown',         hex: '#343331', slug: 'dark-brown-28',       imageUrl: renultImageUrl('28-dark-brown-28.webp') },
    { name: 'Navy Blue',          hex: '#1E2626', slug: 'navy-blue-29',        imageUrl: renultImageUrl('29-navy-blue-29.webp') },
  ],
  luxury: [
    { name: 'Greige',         hex: '#98927C', slug: 'greige',         imageUrl: luxuryImageUrl('01-greige.webp') },
    { name: 'Taupe',          hex: '#676057', slug: 'taupe',          imageUrl: luxuryImageUrl('02-taupe.webp') },
    { name: 'Golden Brown',   hex: '#856C4A', slug: 'golden-brown',   imageUrl: luxuryImageUrl('02-golden-brown.webp') },
    { name: 'Deep Drab',      hex: '#413B2E', slug: 'deep-drab',      imageUrl: luxuryImageUrl('03-deep-drab.webp') },
    { name: 'Russet Brown',   hex: '#7A5641', slug: 'russet-brown',   imageUrl: luxuryImageUrl('04-russet-brown.webp') },
    { name: 'Mist Grey',      hex: '#6B6B66', slug: 'mist-grey',      imageUrl: luxuryImageUrl('05-mist-grey.webp') },
    { name: 'Charcoal Grey',  hex: '#373733', slug: 'charcoal-grey',  imageUrl: luxuryImageUrl('06-charcoal-grey.webp') },
    { name: 'Petrol Blue',    hex: '#123740', slug: 'petrol-blue',    imageUrl: luxuryImageUrl('07-petrol-blue.webp') },
    { name: 'Ruby Red',       hex: '#7E021D', slug: 'ruby-red',       imageUrl: luxuryImageUrl('08-ruby-red.webp') },
    { name: 'Plum Grey',      hex: '#3B383C', slug: 'plum-grey',      imageUrl: luxuryImageUrl('09-plum-grey.webp') },
    { name: 'Dusty Cedar',    hex: '#643430', slug: 'dusty-cedar',    imageUrl: luxuryImageUrl('10-dusty-cedar.webp') },
    { name: 'Dusty Teal',     hex: '#405E64', slug: 'dusty-teal',     imageUrl: luxuryImageUrl('11-dusty-teal.webp') },
    { name: 'Teal',           hex: '#1C5F6B', slug: 'teal',           imageUrl: luxuryImageUrl('12-teal.webp') },
    { name: 'Sapphire Blue',  hex: '#053060', slug: 'sapphire-blue',  imageUrl: luxuryImageUrl('13-sapphire-blue.webp') },
    { name: 'Hunter Green',   hex: '#1A3E2F', slug: 'hunter-green',   imageUrl: luxuryImageUrl('14-hunter-green.webp') },
    { name: 'Deep Teal',      hex: '#0F4B55', slug: 'deep-teal',      imageUrl: luxuryImageUrl('15-deep-teal.webp') },
    { name: 'Charcoal Black', hex: '#1E2625', slug: 'charcoal-black', imageUrl: luxuryImageUrl('16-charcoal-black.webp') },
  ],
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
