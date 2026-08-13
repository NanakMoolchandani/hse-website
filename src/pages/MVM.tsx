import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Search } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import { CATEGORIES, getCategoryByEnum } from '@/src/lib/categories'
import { fetchProducts, fetchVariantCounts, type CatalogProduct } from '@/src/lib/supabase'
import { fetchLivePricing } from '@/src/lib/analytics'
import { inr } from '@/src/lib/utils'

const ALL = '__all__'

const SEATING_ENUMS = new Set([
  'EXECUTIVE_CHAIRS',
  'ERGONOMIC_TASK_CHAIRS',
  'CAFETERIA_FURNITURE',
  'VISITOR_RECEPTION',
  'GAMING_CHAIRS',
  'RECLINERS',
  'SALON_CHAIRS',
  'VINTAGE_REVOLVING',
])

/**
 * Two different offerings, deliberately not presented as one.
 *
 * Seating is the MVM Aasanam brand: our own line, made in the factory and
 * carried in stock. The storage and furniture range is built to order against
 * a customer's sizes and finish, so it is shown under its own heading rather
 * than folded into the brand, where it would imply a shelf full of wardrobes
 * ready to ship.
 */
const SEATING_CATEGORIES = CATEGORIES.filter((c) => SEATING_ENUMS.has(c.enum))
const MADE_TO_ORDER_CATEGORIES = CATEGORIES.filter((c) => !SEATING_ENUMS.has(c.enum))

const MADE_TO_ORDER = 'Made to Order'

/** Which of the two lines a category belongs to. */
function lineOf(categoryEnum: string | undefined): string {
  if (!categoryEnum) return 'MVM Aasanam'
  return SEATING_ENUMS.has(categoryEnum) ? 'MVM Aasanam' : MADE_TO_ORDER
}

export default function MVM() {
  const [categoryProducts, setCategoryProducts] = useState<Record<string, CatalogProduct[]>>({})
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [variantCounts, setVariantCounts] = useState<Record<number, number>>({})
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [activeCategoryEnum, setActiveCategoryEnum] = useState(ALL)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      // Single round-trip for all published products; group client-side by
      // category. Replaces N parallel queries — same payload, fewer requests.
      const all = await fetchProducts()
      if (cancelled) return
      const results: Record<string, CatalogProduct[]> = {}
      for (const cat of CATEGORIES) results[cat.enum] = []
      for (const p of all) {
        const key = p.category || ''
        if (results[key]) results[key].push(p)
      }
      setCategoryProducts(results)
      setLoadingCategories(false)
    }

    loadAll()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    fetchVariantCounts().then(setVariantCounts)
  }, [])

  // Live prices, keyed by slug. Only a slice of the catalogue is published for
  // sale: the rest is wholesale and quoted per deal, so a card either shows a
  // real price or says so plainly. It never shows a stale or invented number.
  useEffect(() => {
    let cancelled = false
    fetchLivePricing()
      .then(({ products }) => {
        if (cancelled) return
        const byslug: Record<string, number> = {}
        for (const p of products) if (p.slug && p.inStock !== false) byslug[p.slug] = p.price
        setPrices(byslug)
      })
      .catch(() => { /* the grid is still useful without prices */ })
    return () => { cancelled = true }
  }, [])

  function selectCategory(enumVal: string) {
    setActiveCategoryEnum(enumVal)
    setSearchQuery('')
  }

  const activeCat = CATEGORIES.find((c) => c.enum === activeCategoryEnum)
  const allProducts = useMemo(
    () => Object.values(categoryProducts).flat(),
    [categoryProducts],
  )
  const products = activeCategoryEnum === ALL ? allProducts : (categoryProducts[activeCategoryEnum] || [])
  const totalCount = allProducts.length
  const isLoading = loadingCategories && products.length === 0

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    const q = searchQuery.toLowerCase()
    return products.filter((p) => (p.name || '').toLowerCase().includes(q))
  }, [products, searchQuery])

  return (
    <>
      <SEO
        title="MVM Aasanam Furniture - Manufacturer in Neemuch | Office Chairs, Wardrobes, TV Units & More"
        description="MVM Aasanam by Hari Shewa Enterprises - Premium furniture manufacturer in Neemuch, MP. Office chairs, particle board wardrobes, TV units, study tables, bookshelves, shoe racks, kitchen units, bedroom furniture & more. Factory-direct pricing. Call +91 99815 16171."
        canonical="/mvm"
        ogImage="https://mvm-furniture.com/og-mvm.jpg"
        keywords="MVM Aasanam, furniture manufacturer Neemuch, particle board furniture, wardrobes Neemuch, TV units, study tables, bookshelves, shoe racks, kitchen furniture, bedroom furniture, dressing tables, office furniture, modular storage, office chairs Neemuch, Hari Shewa Enterprises"
        jsonLd={createBreadcrumbSchema([
          { name: 'Home', url: '/home' },
          { name: 'MVM Aasanam', url: '/mvm' },
        ])}
      />

      <Hero totalCount={totalCount} />

      {/* ── Body: Sidebar + Grid ─────────────────────────────────────── */}
      <div id='catalogue' className='bg-white min-h-screen'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex'>

            {/* Desktop Sidebar */}
            <aside className='hidden md:block w-64 flex-shrink-0 sticky top-16 md:top-[108px] self-start h-[calc(100vh-64px)] md:h-[calc(100vh-108px)] bg-white border-r border-gray-100'>
              <div className='h-full overflow-y-auto pt-7 pb-6 px-5'>
                <p className='text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-4'>
                  Categories
                </p>

                {/* All Products — top of list */}
                <SidebarRow
                  label='All Products'
                  count={totalCount}
                  active={activeCategoryEnum === ALL}
                  onClick={() => selectCategory(ALL)}
                  emphasis
                />

                {/* Seating group */}
                <SidebarGroup label='Seating' />
                {SEATING_CATEGORIES.map((cat) => (
                  <SidebarRow
                    key={cat.enum}
                    label={cat.label}
                    count={categoryProducts[cat.enum]?.length}
                    active={cat.enum === activeCategoryEnum}
                    onClick={() => selectCategory(cat.enum)}
                  />
                ))}

                {/* Built to order, not part of the branded seating line */}
                <SidebarGroup label={MADE_TO_ORDER} />
                <p className='-mt-1 mb-3 pl-3 pr-2 text-[11px] leading-relaxed text-gray-400'>
                  Built to your sizes and finish.
                </p>
                {MADE_TO_ORDER_CATEGORIES.map((cat) => (
                  <SidebarRow
                    key={cat.enum}
                    label={cat.label}
                    count={categoryProducts[cat.enum]?.length}
                    active={cat.enum === activeCategoryEnum}
                    onClick={() => selectCategory(cat.enum)}
                  />
                ))}

                {/* Bulk pricing — dark catalog-ad treatment */}
                <div className='mt-10 relative bg-gray-950 px-5 py-6 overflow-hidden'>
                  <span className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent' />
                  <p className='text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400 mb-2'>
                    Bulk Enquiry
                  </p>
                  <p className='font-display text-lg text-white leading-tight mb-1.5'>
                    Need a custom quote?
                  </p>
                  <p className='text-[11px] text-gray-400 leading-relaxed mb-4'>
                    Share your requirements — we respond within 24 hours.
                  </p>
                  <a
                    href='https://wa.me/919981516171?text=Hi%2C%20I%20need%20a%20bulk%20quote%20for%20MVM%20Aasanam%20furniture.'
                    className='inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400 hover:text-amber-300 transition-colors'
                  >
                    WhatsApp Us
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className='flex-1 min-w-0 bg-white px-4 sm:px-8 pt-12 md:pt-20 pb-20'>

              {/* Mobile: horizontal category strip — quiet underline-tab style */}
              <div className='md:hidden mb-6 -mx-4 px-4 border-b border-gray-100'>
                <div className='flex gap-1 overflow-x-auto -mb-px'>
                  <MobileTab
                    label='All'
                    active={activeCategoryEnum === ALL}
                    onClick={() => selectCategory(ALL)}
                  />
                  {CATEGORIES.map((cat) => (
                    <MobileTab
                      key={cat.enum}
                      label={cat.label}
                      active={cat.enum === activeCategoryEnum}
                      onClick={() => selectCategory(cat.enum)}
                    />
                  ))}
                </div>
              </div>

              {/* Editorial header */}
              <header className='border-b border-black/[0.06] pb-8 mb-12'>
                <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-eyebrow text-amber-600 mb-3'>
                      {activeCat ? lineOf(activeCat.enum) : 'MVM Aasanam'}
                      {activeCat && <span className='text-gray-400'> &middot; {activeCat.series}</span>}
                    </p>
                    <h2 className='text-section text-gray-900'>
                      {activeCat?.label ?? 'All Products'}
                    </h2>
                    {activeCat?.description && (
                      <p className='text-base text-gray-500 mt-4 max-w-xl leading-relaxed'>
                        {activeCat.description}
                      </p>
                    )}
                    {!isLoading && (
                      <p className='text-[10px] uppercase tracking-[0.25em] text-gray-400 mt-3'>
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
                        {searchQuery.trim() ? ` matching “${searchQuery}”` : ''}
                      </p>
                    )}
                  </div>
                  <div className='relative w-full sm:w-56 flex-shrink-0'>
                    <Search className='absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400' />
                    <input
                      type='text'
                      placeholder='Search'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-full pl-6 pr-2 py-2 bg-transparent border-0 border-b border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-amber-500 transition-colors'
                    />
                  </div>
                </div>
              </header>

              {/* Grid */}
              {isLoading ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10'>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className='animate-pulse'>
                      <div className='aspect-square bg-white/[0.04]' />
                      <div className='mt-3 h-3 bg-white/[0.06] rounded w-3/4' />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className='grid grid-cols-2 lg:grid-cols-3 gap-x-5 sm:gap-x-8 gap-y-12 sm:gap-y-16'>
                  {filteredProducts.map((product, i) => {
                    const imgSrc = product.processed_photo_urls?.[0] || product.raw_photo_urls?.[0] || null
                    const catSlug = activeCat?.slug ?? getCategoryByEnum(product.category || '')?.slug

                    return (
                      <Link
                        key={product.id}
                        to={`/mvm/${catSlug}/${product.slug}`}
                        className='group block cursor-pointer reveal'
                        // Only the first screenful staggers. Past that the delay
                        // would fire on rows the reader has already scrolled to.
                        style={i < 6 ? { transitionDelay: `${i * 50}ms` } : undefined}
                      >
                        <div className='relative aspect-square bg-gray-50 rounded-2xl overflow-hidden transition-[transform,box-shadow] duration-400 ease-spring group-hover:-translate-y-1.5 group-hover:shadow-xl'>
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={product.name || 'Product'}
                              className='w-full h-full object-contain p-5 sm:p-7 transition-transform duration-400 ease-spring group-hover:scale-[1.06]'
                              loading='lazy'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center'>
                              <span className='text-5xl font-semibold text-gray-200'>
                                {(product.name || 'P')[0]}
                              </span>
                            </div>
                          )}
                          {variantCounts[product.id] > 0 && (
                            <span className='absolute bottom-3 right-3 text-[10px] font-medium tracking-wide rounded-full bg-black/60 text-white px-2.5 py-1 backdrop-blur-sm'>
                              +{variantCounts[product.id]} colours
                            </span>
                          )}
                        </div>
                        <div className='mt-5 flex items-start justify-between gap-3'>
                          <h4 className='text-title text-gray-900 line-clamp-2'>
                            {product.name}
                          </h4>
                          <span className='text-gray-300 group-hover:text-gray-900 transition-colors shrink-0 mt-1'>→</span>
                        </div>
                        {product.slug && prices[product.slug] !== undefined ? (
                          <p className='mt-1.5 text-[15px] font-semibold tracking-[-0.01em] text-gray-900 tabular-nums'>
                            {inr(prices[product.slug])}
                            <span className='ml-1.5 text-xs font-normal text-gray-400'>GST included</span>
                          </p>
                        ) : (
                          <p className='mt-1.5 text-[13px] text-gray-400'>Price on request</p>
                        )}
                      </Link>
                    )
                  })}
                </div>
              ) : products.length === 0 ? (
                <div className='border border-dashed border-white/10 p-16 text-center'>
                  <p className='text-gray-400 text-sm mb-4'>Products coming soon for this category.</p>
                  <a
                    href={`https://wa.me/919981516171?text=${encodeURIComponent(`Hi, I'm interested in MVM Aasanam ${activeCat?.label ?? 'furniture'}. Please share what's available.`)}`}
                    className='inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors'
                  >
                    <MessageCircle className='w-3.5 h-3.5' />
                    Ask about availability
                  </a>
                </div>
              ) : (
                <div className='border border-dashed border-white/10 p-16 text-center'>
                  <p className='text-gray-400 text-sm mb-2'>No products match &ldquo;{searchQuery}&rdquo;.</p>
                  <button onClick={() => setSearchQuery('')} className='text-xs text-amber-400 hover:text-amber-300 transition-colors'>
                    Clear search
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer variant='light' />
    </>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────

/**
 * The first screen of the whole site: `/` redirects here.
 *
 * Full bleed and full height on purpose. It runs under the fixed nav rather
 * than starting below it, so the translucent chrome reads as floating over the
 * photograph instead of sitting in a white strip above it.
 *
 * The photograph is the real Neemuch showroom, and it is the argument: a
 * manufacturer with a room like that is worth buying from. It carries
 * `fetchpriority=high` and no lazy attribute because it is the LCP element.
 */
function Hero({ totalCount }: { totalCount: number }) {
  return (
    <section className='relative min-h-[92svh] flex items-end overflow-hidden bg-gray-950'>
      <picture>
        <source srcSet='/hero-showroom.webp' type='image/webp' />
        <img
          src='/hero-showroom.jpg'
          alt='The MVM Aasanam showroom in Neemuch, with chairs and fabric samples laid out'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ fetchpriority: 'high' } as any)}
          decoding='async'
          className='absolute inset-0 w-full h-full object-cover'
        />
      </picture>

      {/* Weighted to the bottom, where the type sits, so the top of the
          photograph stays legible behind the frosted nav. */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25' />

      <div className='relative w-full max-w-7xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24 pt-40'>
        <p className='text-eyebrow text-amber-400 reveal'>MVM Aasanam</p>
        <h1 className='text-mega text-white mt-5 max-w-4xl reveal' style={{ transitionDelay: '60ms' }}>
          Made in Neemuch.
          <br />
          Built to be sat in.
        </h1>
        <p
          className='mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-white/75 reveal'
          style={{ transitionDelay: '140ms' }}
        >
          {totalCount > 0 ? `${totalCount} pieces` : 'Office seating and storage'}, manufactured in
          our own factory and delivered across India. Chairs, wardrobes, tables and storage for
          offices, hospitals and institutions.
        </p>

        <div className='mt-10 flex flex-wrap items-center gap-3 reveal' style={{ transitionDelay: '220ms' }}>
          <Link
            to='/shop'
            className='pressable inline-flex items-center justify-center h-13 px-8 rounded-full bg-white text-[15px] font-semibold text-gray-950 hover:bg-white/90'
          >
            Shop chairs
          </Link>
          <a
            href='#catalogue'
            className='pressable inline-flex items-center justify-center h-13 px-8 rounded-full border border-white/30 text-[15px] font-semibold text-white hover:bg-white/10'
          >
            Browse the range
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Sidebar atoms ──────────────────────────────────────────────────────────

function SidebarGroup({ label }: { label: string }) {
  return (
    <div className='mt-7 mb-3 flex items-center gap-3'>
      <span className='text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400 whitespace-nowrap'>
        {label}
      </span>
      <span className='flex-1 h-px bg-gray-100' />
    </div>
  )
}

interface SidebarRowProps {
  label: string
  count?: number
  active: boolean
  onClick: () => void
  emphasis?: boolean
}

function SidebarRow({ label, count, active, onClick, emphasis }: SidebarRowProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left flex items-center justify-between gap-3 pl-3 pr-2 py-1.5 text-sm transition-colors ${
        active
          ? 'text-gray-900'
          : 'text-gray-600 hover:text-gray-900'
      } ${emphasis ? 'mb-1' : ''}`}
    >
      {/* Left accent bar — only when active */}
      <span
        aria-hidden
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] transition-all ${
          active ? 'h-4 bg-amber-500' : 'h-0 bg-transparent'
        }`}
      />
      <span
        className={`leading-snug truncate ${
          active ? 'font-medium' : ''
        } ${emphasis ? 'font-medium' : ''}`}
      >
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <span
          className={`text-[11px] tabular-nums tracking-wider flex-shrink-0 ${
            active ? 'text-amber-600 font-medium' : 'text-gray-300 group-hover:text-gray-400'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}

// ── Mobile tab ─────────────────────────────────────────────────────────────

function MobileTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 relative px-3 py-2.5 text-xs whitespace-nowrap transition-colors ${
        active ? 'text-gray-900 font-medium' : 'text-gray-500'
      }`}
    >
      {label}
      {active && (
        <span className='absolute bottom-0 left-3 right-3 h-[2px] bg-amber-500' />
      )}
    </button>
  )
}
