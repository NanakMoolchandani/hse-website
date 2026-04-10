import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Search } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import { CATEGORIES, getCategoryByEnum } from '@/src/lib/categories'
import { fetchProducts, type CatalogProduct } from '@/src/lib/supabase'

const ALL = '__all__'

export default function MVM() {
  const [categoryProducts, setCategoryProducts] = useState<Record<string, CatalogProduct[]>>({})
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [activeCategoryEnum, setActiveCategoryEnum] = useState(ALL)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      const results: Record<string, CatalogProduct[]> = {}
      await Promise.all(
        CATEGORIES.map(async (cat) => {
          const products = await fetchProducts(cat.enum)
          if (!cancelled) results[cat.enum] = products
        }),
      )
      if (!cancelled) {
        setCategoryProducts(results)
        setLoadingCategories(false)
      }
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

      {/* Spacer to clear the fixed navbar (main nav 64px + brand bar 44px desktop) */}
      <div className='h-16 md:h-[108px]' />

      {/* ── Body: Sidebar + Grid ─────────────────────────────────────── */}
      <div className='bg-gray-50 min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex gap-6 items-start'>

            {/* Desktop Sidebar */}
            <aside className='hidden md:block w-52 flex-shrink-0'>
              <div className='sticky top-[112px] max-h-[calc(100vh-120px)] overflow-y-auto pr-1'>
                <p className='text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1'>
                  Categories
                </p>
                <nav className='space-y-0.5'>
                  {/* All Products */}
                  <button
                    onClick={() => selectCategory(ALL)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                      activeCategoryEnum === ALL
                        ? 'bg-amber-500 text-white font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <span className='flex items-center justify-between gap-2'>
                      <span className='leading-snug'>All Products</span>
                      {totalCount > 0 && (
                        <span className={`text-[11px] flex-shrink-0 font-medium ${activeCategoryEnum === ALL ? 'text-amber-100' : 'text-gray-400'}`}>
                          {totalCount}
                        </span>
                      )}
                    </span>
                  </button>
                  {CATEGORIES.map((cat) => {
                    const count = categoryProducts[cat.enum]?.length
                    const isActive = cat.enum === activeCategoryEnum
                    return (
                      <button
                        key={cat.enum}
                        onClick={() => selectCategory(cat.enum)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                          isActive
                            ? 'bg-amber-500 text-white font-semibold shadow-sm'
                            : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                        }`}
                      >
                        <span className='flex items-center justify-between gap-2'>
                          <span className='leading-snug'>{cat.label}</span>
                          {count !== undefined && (
                            <span
                              className={`text-[11px] flex-shrink-0 font-medium ${
                                isActive ? 'text-amber-100' : 'text-gray-400'
                              }`}
                            >
                              {count}
                            </span>
                          )}
                        </span>
                      </button>
                    )
                  })}
                </nav>

                <div className='mt-5 p-3.5 rounded-xl bg-white border border-gray-100 shadow-sm'>
                  <p className='text-xs font-semibold text-gray-800 mb-1'>Need bulk pricing?</p>
                  <p className='text-[11px] text-gray-500 mb-3 leading-relaxed'>
                    Share your requirements and get a quote within 24 hours.
                  </p>
                  <a
                    href='https://wa.me/919981516171?text=Hi%2C%20I%20need%20a%20bulk%20quote%20for%20MVM%20Aasanam%20furniture.'
                    className='block w-full text-center text-xs font-semibold bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors'
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className='flex-1 min-w-0'>

              {/* Mobile: horizontal category strip */}
              <div className='md:hidden mb-4 -mx-4 px-4'>
                <div className='flex gap-2 overflow-x-auto pb-2'>
                  <button
                    onClick={() => selectCategory(ALL)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeCategoryEnum === ALL ? 'bg-amber-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600'
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((cat) => {
                    const isActive = cat.enum === activeCategoryEnum
                    return (
                      <button
                        key={cat.enum}
                        onClick={() => selectCategory(cat.enum)}
                        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-600'
                        }`}
                      >
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Category title + search row */}
              <div className='flex items-center gap-4 mb-4 flex-wrap'>
                <div className='flex-1 min-w-0'>
                  <h2 className='text-lg font-bold text-gray-900'>{activeCat?.label ?? 'All Products'}</h2>
                  {activeCat?.description && (
                    <p className='text-xs text-gray-500 mt-0.5 hidden sm:block line-clamp-1'>
                      {activeCat.description}
                    </p>
                  )}
                </div>
                <div className='relative flex-shrink-0 w-full sm:w-56'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400' />
                  <input
                    type='text'
                    placeholder='Search products...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent'
                  />
                </div>
              </div>

              {/* Count */}
              {!isLoading && (
                <p className='text-xs text-gray-400 mb-3'>
                  {filteredProducts.length}{' '}
                  {filteredProducts.length === 1 ? 'product' : 'products'}
                  {searchQuery.trim() ? ` matching "${searchQuery}"` : ''}
                </p>
              )}

              {/* Grid */}
              {isLoading ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className='rounded-xl bg-white border border-gray-100 overflow-hidden animate-pulse'
                    >
                      <div className='aspect-square bg-gray-100' />
                      <div className='p-3 space-y-2'>
                        <div className='h-3 bg-gray-100 rounded w-3/4' />
                        <div className='h-2.5 bg-gray-100 rounded w-1/2' />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
                  {filteredProducts.map((product) => {
                    const imgSrc =
                      product.processed_photo_urls?.[0] || product.raw_photo_urls?.[0] || null

                    return (
                      <Link
                        key={product.id}
                        to={`/mvm/${activeCat?.slug ?? getCategoryByEnum(product.category || '')?.slug}/${product.slug}`}
                        className='group rounded-xl bg-white border border-gray-100 overflow-hidden hover:border-amber-300 hover:shadow-md transition-all duration-200'
                      >
                        <div className='aspect-square bg-gray-50 overflow-hidden'>
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={product.name || 'Product'}
                              className='w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300'
                              loading='lazy'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center'>
                              <span className='text-3xl font-bold text-gray-200'>
                                {(product.name || 'P')[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className='p-3 border-t border-gray-50'>
                          <h4 className='text-sm font-medium text-gray-800 leading-snug line-clamp-2 mb-1.5 group-hover:text-amber-600 transition-colors'>
                            {product.name}
                          </h4>
                          <span className='text-xs text-amber-500 font-medium group-hover:text-amber-600 transition-colors'>
                            View Details →
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : products.length === 0 ? (
                <div className='rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center'>
                  <p className='text-gray-400 text-sm mb-4'>Products coming soon for this category.</p>
                  <a
                    href={`https://wa.me/919981516171?text=${encodeURIComponent(
                      `Hi, I'm interested in MVM Aasanam ${activeCat?.label ?? 'furniture'}. Please share what's available.`,
                    )}`}
                    className='inline-flex items-center gap-1.5 text-sm font-medium text-amber-500 hover:text-amber-600 transition-colors'
                  >
                    <MessageCircle className='w-3.5 h-3.5' />
                    Ask about availability
                  </a>
                </div>
              ) : (
                <div className='rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center'>
                  <p className='text-gray-400 text-sm mb-2'>
                    No products match &ldquo;{searchQuery}&rdquo;.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className='text-xs text-amber-500 hover:text-amber-600 transition-colors'
                  >
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
