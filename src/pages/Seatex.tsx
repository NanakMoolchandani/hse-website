import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Phone, ArrowLeft, ChevronRight } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import {
  fetchSeatexCollection,
  cleanSeatexTitle,
  SEATEX_COLLECTIONS,
  type SeatexProduct,
} from '@/src/lib/seatex'

// ── Seatex Stats ────────────────────────────────────────────────────────────

const SEATEX_STATS = [
  { value: '30+', label: 'Years Experience (Team)' },
  { value: '18', label: 'States Coverage' },
  { value: '40+', label: 'Product Designs' },
  { value: '15+', label: 'Colour Options' },
]

// ── Page Component ──────────────────────────────────────────────────────────

export default function Seatex() {
  const [collectionProducts, setCollectionProducts] = useState<Record<string, SeatexProduct[]>>({})
  const [loadingCollections, setLoadingCollections] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      const results: Record<string, SeatexProduct[]> = {}

      const fetches = SEATEX_COLLECTIONS.map(async (col) => {
        const products = await fetchSeatexCollection(col.handle)
        if (!cancelled) {
          results[col.handle] = products
        }
      })

      await Promise.all(fetches)
      if (!cancelled) {
        setCollectionProducts(results)
        setLoadingCollections(false)
      }
    }

    loadAll()
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <SEO
        title="Seatex Furniture in Neemuch - Authorized Dealer | Chairs, Tables, Stools"
        description="Buy Seatex furniture in Neemuch from Hari Shewa Enterprises, authorized wholesale dealer. Premium & economy chairs, tables, stools, kids furniture. Best prices in Neemuch. Bulk orders available. Call +91 99815 16171."
        canonical="/seatex"
        ogImage="https://mvm-furniture.com/og-seatex.jpg"
        keywords="Seatex furniture Neemuch, Seatex dealer Neemuch, Seatex in Neemuch, Seatex chairs Neemuch, Seatex wholesale Madhya Pradesh, Seatex authorized dealer MP, सीटेक्स डीलर नीमच, सीटेक्स फर्नीचर नीमच, नीमच में सीटेक्स"
        jsonLd={createBreadcrumbSchema([{ name: 'Home', url: '/home' }, { name: 'Seatex', url: '/seatex' }])}
      />

      {/* Hero */}
      <section className='relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden'>
        <div className='absolute inset-0 opacity-[0.03]' style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className='relative z-10 max-w-5xl mx-auto px-4 sm:px-6'>
          <Link
            to='/home'
            className='inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-8'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Home
          </Link>

          <div className='text-center'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6'>
            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
            <span className='text-sm font-medium text-emerald-600'>Authorized Wholesale Dealer</span>
          </div>

          <h1 className='font-display text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight'>
            Seatex
          </h1>
          <p className='text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-2 leading-relaxed'>
            <span className='text-emerald-600 font-medium italic'>"Hindustan ka sabse favorite furniture"</span>
          </p>
          <p className='text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed'>
            We are the <span className='text-gray-900 font-semibold'>Authorized Wholesale Dealer</span> of Seatex - a trusted moulded furniture brand from Mumbai - serving Neemuch, Mandsaur, and all of Central India.
          </p>
          <p className='text-base text-gray-500 max-w-xl mx-auto mb-10'>
            Get the complete Seatex range at wholesale prices. Bulk orders, institutional supply, and doorstep delivery available.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <a
              href='https://wa.me/919981516171?text=Hi%2C%20I%27m%20interested%20in%20Seatex%20products.%20Please%20share%20details.'
              className='inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-700 transition-colors'
            >
              <MessageCircle className='w-5 h-5' />
              Enquire on WhatsApp
            </a>
            <a
              href='tel:+919981516171'
              className='inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-50 transition-colors'
            >
              <Phone className='w-5 h-5' />
              Call for Bulk Pricing
            </a>
          </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className='bg-white border-y border-gray-100 py-10'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8'>
          {SEATEX_STATS.map((s) => (
            <div key={s.label} className='text-center'>
              <p className='text-2xl sm:text-3xl font-bold text-gray-900 font-display'>{s.value}</p>
              <p className='text-sm text-gray-500 mt-1'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Buy From Us */}
      <section className='bg-white py-16 md:py-20'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[
              { title: 'Wholesale Pricing', desc: 'Direct dealer pricing on the entire Seatex range. Best rates for bulk and institutional orders.' },
              { title: 'Genuine Products', desc: '100% authentic Seatex products with original warranty. No duplicates, no compromises.' },
              { title: 'Local Availability', desc: 'Ready stock in Neemuch with fast delivery across Mandsaur, Ratlam, Ujjain, and all of MP & Rajasthan.' },
            ].map((item) => (
              <div key={item.title} className='rounded-2xl border border-gray-200 bg-gray-50 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>{item.title}</h3>
                <p className='text-sm text-gray-600 leading-relaxed'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Collections */}
      <section className='bg-white py-16 md:py-24'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <div className='text-center mb-14'>
            <p className='text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-3'>
              Complete Product Range
            </p>
            <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
              Browse Seatex Products
            </h2>
            <p className='text-gray-500 max-w-xl mx-auto text-lg'>
              Explore the full Seatex catalogue. Tap any category to see all products.
            </p>
          </div>

          <div className='space-y-16'>
            {SEATEX_COLLECTIONS.map((col) => {
              const products = collectionProducts[col.handle] || []
              const isLoading = loadingCollections && products.length === 0
              const preview = products.slice(0, 6)

              return (
                <div key={col.handle}>
                  {/* Category Header */}
                  <div className='flex items-end justify-between mb-6'>
                    <div>
                      <h3 className={`text-2xl font-bold text-gray-900 mb-1 ${col.accent}`}>
                        {col.label}
                      </h3>
                      <p className='text-sm text-gray-500 max-w-lg'>{col.description}</p>
                    </div>
                    {products.length > 0 && (
                      <Link
                        to={`/seatex/${col.handle}`}
                        className='hidden md:inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors shrink-0'
                      >
                        View all {products.length} products
                        <ChevronRight className='w-4 h-4' />
                      </Link>
                    )}
                  </div>

                  {/* Product Preview Grid */}
                  {isLoading ? (
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className='rounded-2xl bg-gray-100 border border-gray-100 overflow-hidden animate-pulse'>
                          <div className='aspect-square bg-gray-200' />
                          <div className='p-3 space-y-1.5'>
                            <div className='h-3 bg-gray-200 rounded w-3/4' />
                            <div className='h-2.5 bg-gray-200 rounded w-1/2' />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : preview.length > 0 ? (
                    <>
                      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                        {preview.map((product) => {
                          const title = cleanSeatexTitle(product.title)
                          const imgSrc = product.images[0]?.src || null

                          return (
                            <Link
                              key={product.id}
                              to={`/seatex/${col.handle}/${product.handle}`}
                              className='group rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300'
                            >
                              <div className='aspect-square bg-white overflow-hidden'>
                                {imgSrc ? (
                                  <img
                                    src={imgSrc}
                                    alt={title}
                                    className='w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500'
                                    loading='lazy'
                                  />
                                ) : (
                                  <div className='w-full h-full flex items-center justify-center text-gray-300'>
                                    <span className='text-2xl font-bold opacity-40'>{title[0]}</span>
                                  </div>
                                )}
                              </div>
                              <div className='p-3'>
                                <h4 className='text-xs font-medium text-gray-800 leading-snug line-clamp-2 mb-1.5 group-hover:text-emerald-600 transition-colors'>
                                  {title}
                                </h4>
                                <span className='text-[11px] font-medium text-emerald-500 group-hover:text-emerald-600 transition-colors'>
                                  Enquire for Price →
                                </span>
                              </div>
                            </Link>
                          )
                        })}
                      </div>

                      {products.length > 6 && (
                        <div className='mt-4 text-center md:text-left'>
                          <Link
                            to={`/seatex/${col.handle}`}
                            className='inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors'
                          >
                            View all {products.length} products in {col.label}
                            <ChevronRight className='w-4 h-4' />
                          </Link>
                        </div>
                      )}
                      {products.length <= 6 && products.length > 0 && (
                        <div className='mt-4 text-center md:hidden'>
                          <Link
                            to={`/seatex/${col.handle}`}
                            className='inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors'
                          >
                            View {col.label}
                            <ChevronRight className='w-4 h-4' />
                          </Link>
                        </div>
                      )}
                    </>
                  ) : !isLoading ? (
                    <div className='rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center'>
                      <p className='text-gray-500 text-sm mb-3'>Products coming soon for this category.</p>
                      <a
                        href={`https://wa.me/919981516171?text=${encodeURIComponent(`Hi, I'm interested in Seatex ${col.label}. Please share what's available.`)}`}
                        className='inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors'
                      >
                        <MessageCircle className='w-3.5 h-3.5' />
                        Ask about availability
                      </a>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='bg-gray-50 py-16 md:py-20 border-t border-gray-100'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 text-center'>
          <h2 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Need Seatex Products?
          </h2>
          <p className='text-gray-600 text-lg mb-8 max-w-xl mx-auto'>
            Get wholesale rates on any Seatex product. Share your requirements and we'll send you a quote within 24 hours.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <a
              href='https://wa.me/919981516171?text=Hi%2C%20I%20need%20Seatex%20products.%20Please%20share%20wholesale%20pricing.'
              className='inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-700 transition-colors'
            >
              <MessageCircle className='w-5 h-5' />
              WhatsApp Us
            </a>
            <a
              href='tel:+919981516171'
              className='inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-full hover:bg-white transition-colors'
            >
              <Phone className='w-5 h-5' />
              Call Now
            </a>
          </div>
        </div>
      </section>

      <Footer variant='dark' />
    </>
  )
}
