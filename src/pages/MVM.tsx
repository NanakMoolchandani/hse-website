import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Search } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import { CATEGORIES, getCategoryByEnum } from '@/src/lib/categories'
import { fetchProducts, type CatalogProduct } from '@/src/lib/supabase'

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

const SEATING_CATEGORIES = CATEGORIES.filter((c) => SEATING_ENUMS.has(c.enum))
const STORAGE_CATEGORIES = CATEGORIES.filter((c) => !SEATING_ENUMS.has(c.enum))

export default function MVM() {
  const [categoryProducts, setCategoryProducts] = useState<Record<string, CatalogProduct[]>>({})
  const [loadingCategories, setLoadingCategories] = useState(true)
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
    return () => {
      cancelled = true
    }
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

      {/* ── Body: Sidebar + Grid ─────────────────────────────────────── */}
      <div className='bg-[#0C0C0C] min-h-screen'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex'>

            {/* Desktop Sidebar */}
            <aside className='hidden md:block w-64 flex-shrink-0 sticky top-16 md:top-[108px] self-start h-[calc(100vh-64px)] md:h-[calc(100vh-108px)] bg-[#0C0C0C] border-r border-white/[0.06]'>
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

                {/* Storage & Furniture group */}
                <SidebarGroup label='Storage & Furniture' />
                {STORAGE_CATEGORIES.map((cat) => (
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
            <main className='flex-1 min-w-0 bg-[#0C0C0C] px-4 sm:px-8 pt-20 md:pt-[120px] pb-12'>

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
              <header className='border-b border-gray-100 pb-6 mb-8'>
                <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-600 mb-2'>
                      {activeCat?.series ?? 'MVM Aasanam'}
                    </p>
                    <h2 className='font-display text-3xl md:text-4xl text-gray-900 leading-[1.1]'>
                      {activeCat?.label ?? 'All Products'}
                    </h2>
                    {activeCat?.description && (
                      <p className='text-sm text-gray-500 mt-2.5 max-w-xl leading-relaxed'>
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
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10'>
                  {filteredProducts.map((product) => {
                    const imgSrc = product.processed_photo_urls?.[0] || product.raw_photo_urls?.[0] || null
                    const catSlug = activeCat?.slug ?? getCategoryByEnum(product.category || '')?.slug

                    return (
                      <Link
                        key={product.id}
                        to={`/mvm/${catSlug}/${product.slug}`}
                        className='group block cursor-pointer'
                      >
                        {/* Square image — dark bg, subtle zoom on hover */}
                        <div className='relative aspect-square bg-[#1a1a1a] overflow-hidden'>
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={product.name || 'Product'}
                              className='w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105'
                              loading='lazy'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center'>
                              <span className='text-4xl font-bold text-white/10'>
                                {(product.name || 'P')[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Name + arrow */}
                        <div className='mt-3 flex items-start justify-between gap-2'>
                          <h4 className='text-[13px] font-medium text-[#9C9C9C] group-hover:text-white transition-colors duration-200 leading-snug line-clamp-2'>
                            {product.name}
                          </h4>
                          <span className='text-[#9C9C9C] group-hover:text-white transition-colors shrink-0 mt-0.5'>→</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : products.length === 0 ? (
                <div className='border border-dashed border-white/10 p-16 text-center'>
                  <p className='text-[#9C9C9C] text-sm mb-4'>Products coming soon for this category.</p>
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
                  <p className='text-[#9C9C9C] text-sm mb-2'>No products match &ldquo;{searchQuery}&rdquo;.</p>
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
