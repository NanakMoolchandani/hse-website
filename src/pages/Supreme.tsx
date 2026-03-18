import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Phone, ArrowLeft, ChevronRight } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import {
  fetchSupremeCollection,
  cleanSupremeTitle,
  supremeImageUrl,
  SUPREME_COLLECTIONS,
  type SupremeProduct,
} from '@/src/lib/supreme'

// ── Supreme Stats ───────────────────────────────────────────────────────────

const SUPREME_STATS = [
  { value: '50+', label: 'Years in Business' },
  { value: '8,000+', label: 'Dealers Across India' },
  { value: '#1', label: 'Largest Plastics Company' },
  { value: '200+', label: 'Products in Range' },
]

// ── Page Component ───────────────────────────────────────────────────────────

export default function Supreme() {
  // Fetch preview products for each collection
  const [collectionProducts, setCollectionProducts] = useState<Record<string, SupremeProduct[]>>({})
  const [loadingCollections, setLoadingCollections] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      const results: Record<string, SupremeProduct[]> = {}

      // Fetch all collections in parallel
      const fetches = SUPREME_COLLECTIONS.map(async (col) => {
        const products = await fetchSupremeCollection(col.handle)
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
        title="Supreme Authorized Wholesale Dealer | Hari Shewa Enterprises, Neemuch"
        description="Hari Shewa Enterprises — Authorized Wholesale Dealer of Supreme (by Supreme Industries Ltd) in Neemuch, Madhya Pradesh. Shop the complete range: chairs, tables, storage, kids furniture, stools, beds, and more. Bulk orders and institutional supply available."
        canonical="/supreme"
        keywords="Supreme furniture dealer Neemuch, Supreme wholesale Madhya Pradesh, Supreme furniture Neemuch, Supreme chairs wholesale, Supreme Industries furniture, Supreme authorized dealer MP, Supreme plastic furniture wholesale, सुप्रीम डीलर नीमच, सुप्रीम फर्नीचर थोक"
        jsonLd={createBreadcrumbSchema([{ name: 'Home', url: '/home' }, { name: 'Supreme', url: '/supreme' }])}
      />

      {/* Hero */}
      <section className='relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden'>
        <div className='absolute inset-0 opacity-[0.03]' style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className='relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center'>
          <Link
            to='/home'
            className='inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-8'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Home
          </Link>

          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6'>
            <span className='w-2 h-2 rounded-full bg-orange-400 animate-pulse' />
            <span className='text-sm font-medium text-orange-400'>Authorized Wholesale Dealer</span>
          </div>

          <h1 className='font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight'>
            Supreme
          </h1>
          <p className='text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed'>
            We are the <span className='text-white font-semibold'>Authorized Wholesale Dealer</span> of Supreme — by Supreme Industries Ltd, India's largest plastics company — serving Neemuch, Mandsaur, and all of Central India.
          </p>
          <p className='text-base text-gray-500 max-w-xl mx-auto mb-10'>
            Get the complete Supreme furniture range at wholesale prices. Bulk orders, institutional supply, and doorstep delivery available.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <a
              href='https://wa.me/919981516171?text=Hi%2C%20I%27m%20interested%20in%20Supreme%20products.%20Please%20share%20details.'
              className='inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors'
            >
              <MessageCircle className='w-5 h-5' />
              Enquire on WhatsApp
            </a>
            <a
              href='tel:+919981516171'
              className='inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors'
            >
              <Phone className='w-5 h-5' />
              Call for Bulk Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className='bg-gray-950 border-y border-white/5 py-10'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8'>
          {SUPREME_STATS.map((s) => (
            <div key={s.label} className='text-center'>
              <p className='text-2xl sm:text-3xl font-bold text-white font-display'>{s.value}</p>
              <p className='text-sm text-gray-500 mt-1'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Buy From Us */}
      <section className='bg-gray-950 py-16 md:py-20'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[
              { title: 'Wholesale Pricing', desc: 'Direct dealer pricing on the entire Supreme range. Best rates for bulk and institutional orders.' },
              { title: 'Genuine Products', desc: '100% authentic Supreme products with original warranty. No duplicates, no compromises.' },
              { title: 'Local Availability', desc: 'Ready stock in Neemuch with fast delivery across Mandsaur, Ratlam, Ujjain, and all of MP & Rajasthan.' },
            ].map((item) => (
              <div key={item.title} className='rounded-2xl border border-white/10 bg-white/[0.02] p-6'>
                <h3 className='text-lg font-semibold text-white mb-2'>{item.title}</h3>
                <p className='text-sm text-gray-400 leading-relaxed'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Collections — real products from Shopify API */}
      <section className='bg-gray-950 py-16 md:py-24'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <div className='text-center mb-14'>
            <p className='text-xs font-semibold tracking-widest uppercase text-orange-400 mb-3'>
              Complete Product Range
            </p>
            <h2 className='font-display text-3xl md:text-5xl font-bold text-white mb-4'>
              Browse Supreme Products
            </h2>
            <p className='text-gray-500 max-w-xl mx-auto text-lg'>
              Real products from the Supreme catalogue. Tap any category to explore the full collection.
            </p>
          </div>

          <div className='space-y-16'>
            {SUPREME_COLLECTIONS.map((col) => {
              const products = collectionProducts[col.handle] || []
              const isLoading = loadingCollections && products.length === 0
              // Show up to 6 preview products
              const preview = products.slice(0, 6)

              return (
                <div key={col.handle}>
                  {/* Category Header */}
                  <div className='flex items-end justify-between mb-6'>
                    <div>
                      <h3 className={`text-2xl font-bold text-white mb-1 ${col.accent}`}>
                        {col.label}
                      </h3>
                      <p className='text-sm text-gray-500 max-w-lg'>{col.description}</p>
                    </div>
                    {products.length > 0 && (
                      <Link
                        to={`/supreme/${col.handle}`}
                        className='hidden md:inline-flex items-center gap-1 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors shrink-0'
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
                        <div key={i} className='rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden animate-pulse'>
                          <div className='aspect-square bg-white/[0.05]' />
                          <div className='p-3 space-y-1.5'>
                            <div className='h-3 bg-white/[0.05] rounded w-3/4' />
                            <div className='h-2.5 bg-white/[0.05] rounded w-1/2' />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : preview.length > 0 ? (
                    <>
                      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                        {preview.map((product) => {
                          const title = cleanSupremeTitle(product.title)
                          const image = product.images[0]
                          const imgSrc = image ? supremeImageUrl(image.src, 400) : null

                          return (
                            <Link
                              key={product.id}
                              to={`/supreme/${col.handle}/${product.handle}`}
                              className='group rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden hover:border-white/15 transition-all duration-300'
                            >
                              <div className='aspect-square bg-white/[0.02] overflow-hidden'>
                                {imgSrc ? (
                                  <img
                                    src={imgSrc}
                                    alt={title}
                                    className='w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500'
                                    loading='lazy'
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      if (image && target.src !== image.src) {
                                        target.src = image.src
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className='w-full h-full flex items-center justify-center text-gray-700'>
                                    <span className='text-2xl font-bold opacity-20'>{title[0]}</span>
                                  </div>
                                )}
                              </div>
                              <div className='p-3'>
                                <h4 className='text-xs font-medium text-white leading-snug line-clamp-2 mb-1.5 group-hover:text-orange-300 transition-colors'>
                                  {title}
                                </h4>
                                <span className='text-[11px] font-medium text-orange-400 group-hover:text-orange-300 transition-colors'>
                                  View Details →
                                </span>
                              </div>
                            </Link>
                          )
                        })}
                      </div>

                      {/* View All link (mobile) + desktop when > 6 */}
                      {products.length > 6 && (
                        <div className='mt-4 text-center md:text-left'>
                          <Link
                            to={`/supreme/${col.handle}`}
                            className='inline-flex items-center gap-1.5 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors'
                          >
                            View all {products.length} products in {col.label}
                            <ChevronRight className='w-4 h-4' />
                          </Link>
                        </div>
                      )}
                      {products.length <= 6 && products.length > 0 && (
                        <div className='mt-4 text-center md:hidden'>
                          <Link
                            to={`/supreme/${col.handle}`}
                            className='inline-flex items-center gap-1.5 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors'
                          >
                            View {col.label}
                            <ChevronRight className='w-4 h-4' />
                          </Link>
                        </div>
                      )}
                    </>
                  ) : !isLoading ? (
                    <div className='rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center'>
                      <p className='text-gray-500 text-sm mb-3'>Products coming soon for this category.</p>
                      <a
                        href={`https://wa.me/919981516171?text=${encodeURIComponent(`Hi, I'm interested in Supreme ${col.label}. Please share what's available.`)}`}
                        className='inline-flex items-center gap-1.5 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors'
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
      <section className='bg-gray-900 py-16 md:py-20 border-t border-white/5'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 text-center'>
          <h2 className='font-display text-3xl md:text-4xl font-bold text-white mb-4'>
            Need Supreme Products?
          </h2>
          <p className='text-gray-400 text-lg mb-8 max-w-xl mx-auto'>
            Get wholesale rates on any Supreme product. Share your requirements and we'll send you a quote within 24 hours.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <a
              href='https://wa.me/919981516171?text=Hi%2C%20I%20need%20Supreme%20products.%20Please%20share%20wholesale%20pricing.'
              className='inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors'
            >
              <MessageCircle className='w-5 h-5' />
              WhatsApp Us
            </a>
            <a
              href='tel:+919981516171'
              className='inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors'
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
