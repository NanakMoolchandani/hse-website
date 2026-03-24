import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Phone, ArrowLeft, ChevronRight } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import { CATEGORIES } from '@/src/lib/categories'
import { fetchProducts, type CatalogProduct } from '@/src/lib/supabase'

// ── MVM Stats ───────────────────────────────────────────────────────────

const MVM_STATS = [
  { value: '25+', label: 'Years in Business' },
  { value: '500+', label: 'Products Delivered' },
  { value: 'Pan-India', label: 'Delivery Network' },
  { value: 'ISO', label: 'Certified Quality' },
]

// ── Page Component ───────────────────────────────────────────────────────────

export default function MVM() {
  const [categoryProducts, setCategoryProducts] = useState<Record<string, CatalogProduct[]>>({})
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      const results: Record<string, CatalogProduct[]> = {}

      const fetches = CATEGORIES.map(async (cat) => {
        const products = await fetchProducts(cat.enum)
        if (!cancelled) {
          results[cat.enum] = products
        }
      })

      await Promise.all(fetches)
      if (!cancelled) {
        setCategoryProducts(results)
        setLoadingCategories(false)
      }
    }

    loadAll()
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <SEO
        title="MVM Aasanam Office Chairs - Manufacturer in Neemuch | Executive &amp; Ergonomic"
        description="MVM Aasanam by Hari Shewa Enterprises - Premium office chairs & furniture manufacturer in Neemuch, MP. Executive chairs, ergonomic task chairs, cafeteria furniture, visitor seating. Factory-direct pricing. Call +91 99815 16171."
        canonical="/mvm"
        ogImage="https://mvm-furniture.com/og-mvm.jpg"
        keywords="MVM Aasanam, office chairs Neemuch, office furniture manufacturer Neemuch, executive chairs Neemuch, ergonomic chairs Neemuch, cafeteria furniture Neemuch, office furniture Madhya Pradesh, Hari Shewa Enterprises, ऑफिस चेयर नीमच, कार्यालय फर्नीचर नीमच"
        jsonLd={createBreadcrumbSchema([{ name: 'Home', url: '/home' }, { name: 'MVM Aasanam', url: '/mvm' }])}
      />

      {/* Hero */}
      <section className='relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden'>
        <div className='absolute inset-0 opacity-[0.03]' style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className='relative z-10 max-w-5xl mx-auto px-4 sm:px-6'>
          <Link
            to='/home'
            className='inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-8'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Home
          </Link>

          <div className='text-center'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6'>
            <span className='w-2 h-2 rounded-full bg-amber-400 animate-pulse' />
            <span className='text-sm font-medium text-amber-400'>Our Own Manufacturing</span>
          </div>

          <h1 className='font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight'>
            MVM Aasanam
          </h1>
          <p className='text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed'>
            Premium office furniture <span className='text-white font-semibold'>manufactured by Hari Shewa Enterprises</span> in Neemuch, Madhya Pradesh. Built for comfort, designed for professionals.
          </p>
          <p className='text-base text-gray-500 max-w-xl mx-auto mb-10'>
            Factory-direct pricing. Bulk orders, institutional supply, and pan-India delivery available. ISO certified, GeM empanelled.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <a
              href='https://wa.me/919981516171?text=Hi%2C%20I%27m%20interested%20in%20MVM%20Aasanam%20office%20furniture.%20Please%20share%20details.'
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
        </div>
      </section>

      {/* Stats */}
      <section className='bg-gray-950 border-y border-white/5 py-10'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8'>
          {MVM_STATS.map((s) => (
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
              { title: 'Factory-Direct Pricing', desc: 'No middlemen. Get the best rates directly from our manufacturing unit in Neemuch. Bulk and institutional orders welcome.' },
              { title: 'Premium Quality', desc: 'ISO certified manufacturing with rigorous quality control. Every product tested for durability, comfort, and finish.' },
              { title: 'Pan-India Delivery', desc: 'We deliver across India - Madhya Pradesh, Rajasthan, Gujarat, Maharashtra, and beyond. Doorstep delivery for bulk orders.' },
            ].map((item) => (
              <div key={item.title} className='rounded-2xl border border-white/10 bg-white/[0.02] p-6'>
                <h3 className='text-lg font-semibold text-white mb-2'>{item.title}</h3>
                <p className='text-sm text-gray-400 leading-relaxed'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories - real products from Supabase */}
      <section className='bg-gray-950 py-16 md:py-24'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <div className='text-center mb-14'>
            <p className='text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3'>
              Our Product Range
            </p>
            <h2 className='font-display text-3xl md:text-5xl font-bold text-white mb-4'>
              Browse MVM Aasanam Products
            </h2>
            <p className='text-gray-500 max-w-xl mx-auto text-lg'>
              Premium office furniture crafted in our Neemuch manufacturing unit. Tap any category to explore the full collection.
            </p>
          </div>

          <div className='space-y-16'>
            {CATEGORIES.map((cat) => {
              const products = categoryProducts[cat.enum] || []
              const isLoading = loadingCategories && products.length === 0
              const preview = products.slice(0, 6)

              return (
                <div key={cat.slug}>
                  {/* Category Header */}
                  <div className='flex items-end justify-between mb-6'>
                    <div>
                      <h3 className='text-2xl font-bold text-white mb-1'>
                        {cat.label}
                      </h3>
                      <p className='text-sm text-gray-500 max-w-lg'>{cat.description}</p>
                    </div>
                    {products.length > 0 && (
                      <Link
                        to={`/mvm/${cat.slug}`}
                        className='hidden md:inline-flex items-center gap-1 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors shrink-0'
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
                          const imgSrc = product.processed_photo_urls?.[0]
                            || product.raw_photo_urls?.[0]
                            || null

                          return (
                            <Link
                              key={product.id}
                              to={`/mvm/${cat.slug}/${product.slug}`}
                              className='group rounded-2xl bg-white/[0.03] overflow-hidden hover:bg-white/[0.06] transition-all duration-300'
                            >
                              <div className='aspect-square bg-white/[0.02] overflow-hidden'>
                                {imgSrc ? (
                                  <img
                                    src={imgSrc}
                                    alt={product.name || 'Product'}
                                    className='w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500'
                                    loading='lazy'
                                  />
                                ) : (
                                  <div className='w-full h-full flex items-center justify-center text-gray-700'>
                                    <span className='text-2xl font-bold opacity-20'>{(product.name || 'P')[0]}</span>
                                  </div>
                                )}
                              </div>
                              <div className='p-3'>
                                <h4 className='text-xs font-medium text-white leading-snug line-clamp-2 mb-1.5 group-hover:text-amber-300 transition-colors'>
                                  {product.name}
                                </h4>
                                <span className='text-[11px] font-medium text-amber-400 group-hover:text-amber-300 transition-colors'>
                                  View Details →
                                </span>
                              </div>
                            </Link>
                          )
                        })}
                      </div>

                      {products.length > 6 && (
                        <div className='mt-4 text-center md:text-left'>
                          <Link
                            to={`/mvm/${cat.slug}`}
                            className='inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors'
                          >
                            View all {products.length} products in {cat.label}
                            <ChevronRight className='w-4 h-4' />
                          </Link>
                        </div>
                      )}
                      {products.length <= 6 && products.length > 0 && (
                        <div className='mt-4 text-center md:hidden'>
                          <Link
                            to={`/mvm/${cat.slug}`}
                            className='inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors'
                          >
                            View {cat.label}
                            <ChevronRight className='w-4 h-4' />
                          </Link>
                        </div>
                      )}
                    </>
                  ) : !isLoading ? (
                    <div className='rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center'>
                      <p className='text-gray-500 text-sm mb-3'>Products coming soon for this category.</p>
                      <a
                        href={`https://wa.me/919981516171?text=${encodeURIComponent(`Hi, I'm interested in MVM Aasanam ${cat.label}. Please share what's available.`)}`}
                        className='inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors'
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
            Need Office Furniture?
          </h2>
          <p className='text-gray-400 text-lg mb-8 max-w-xl mx-auto'>
            Get factory-direct rates on any MVM Aasanam product. Share your requirements and we'll send you a quote within 24 hours.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <a
              href='https://wa.me/919981516171?text=Hi%2C%20I%20need%20MVM%20Aasanam%20office%20furniture.%20Please%20share%20pricing.'
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
