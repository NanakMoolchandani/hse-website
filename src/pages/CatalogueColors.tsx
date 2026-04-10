import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Palette } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'

// ── Catalogue definitions ──────────────────────────────────────────

export interface ColourCatalogue {
  slug: string
  name: string
  description: string
  material: string
  colorCount: number
  /** A few representative hex colors for the preview card */
  previewColors: string[]
  image?: string
}

export const COLOUR_CATALOGUES: ColourCatalogue[] = [
  {
    slug: 'luxury',
    name: 'Luxury',
    description: 'Premium velvet and suede upholstery fabrics — rich, deep colors with a soft matte finish. Ideal for executive chairs, recliners, and high-end seating.',
    material: 'Premium Velvet / Suede',
    colorCount: 16,
    previewColors: ['#98927C', '#856C4A', '#7E021D', '#053060', '#0F4B55', '#1A3E2F', '#1C5F6B', '#373733'],
  },
]

// ── Page Component ─────────────────────────────────────────────────

export default function CatalogueColors() {
  return (
    <>
      <SEO
        title="Catalogue Colors - Upholstery Fabric Swatches"
        description="Browse our premium upholstery fabric colour catalogues. Luxury velvet, suede, leatherette and more. Available for all MVM Aasanam chairs and furniture."
        canonical="/catalogue-colors"
        keywords="fabric colors, upholstery swatches, velvet colors, suede colors, furniture fabric, chair colors, MVM Aasanam colors"
        jsonLd={createBreadcrumbSchema([
          { name: 'Home', url: '/home' },
          { name: 'Catalogue Colors', url: '/catalogue-colors' },
        ])}
      />

      {/* Hero */}
      <section className='relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden'>
        <div className='absolute inset-0 opacity-[0.03]' style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className='relative z-10 max-w-5xl mx-auto px-4 sm:px-6'>
          <Link
            to='/mvm'
            className='inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-8'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to MVM Aasanam
          </Link>

          <div className='text-center'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6'>
              <Palette className='w-4 h-4 text-purple-400' />
              <span className='text-sm font-medium text-purple-400'>Colour Catalogues</span>
            </div>

            <h1 className='font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight'>
              Catalogue Colors
            </h1>
            <p className='text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed'>
              Explore our range of <span className='text-white font-semibold'>premium upholstery fabrics</span> available across all MVM Aasanam furniture.
            </p>
            <p className='text-base text-gray-500 max-w-xl mx-auto'>
              Each colour is available for custom orders. Contact us for fabric samples and pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Catalogues Grid */}
      <section className='bg-gray-950 py-16 md:py-24'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {COLOUR_CATALOGUES.map((catalogue) => (
              <Link
                key={catalogue.slug}
                to={`/catalogue-colors/${catalogue.slug}`}
                className='group relative bg-gray-900/60 border border-white/5 rounded-2xl p-6 hover:border-white/15 hover:bg-gray-900/80 transition-all duration-300'
              >
                {/* Color preview grid */}
                <div className='grid grid-cols-4 gap-1.5 mb-5 aspect-[2/1] rounded-xl overflow-hidden'>
                  {catalogue.previewColors.map((hex, i) => (
                    <div
                      key={i}
                      className='rounded-lg'
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>

                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors'>
                      {catalogue.name}
                    </h3>
                    <p className='text-sm text-gray-500 mb-3'>{catalogue.material}</p>
                    <p className='text-sm text-gray-400 leading-relaxed line-clamp-2'>
                      {catalogue.description}
                    </p>
                  </div>
                </div>

                <div className='flex items-center justify-between mt-4 pt-4 border-t border-white/5'>
                  <span className='text-sm font-medium text-gray-400'>
                    {catalogue.colorCount} colours
                  </span>
                  <span className='inline-flex items-center gap-1 text-sm text-purple-400 font-medium group-hover:gap-2 transition-all'>
                    View All <ChevronRight className='w-4 h-4' />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer variant='dark' />
    </>
  )
}
