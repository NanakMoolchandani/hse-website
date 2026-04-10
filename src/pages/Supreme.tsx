import { useState, useEffect, useMemo } from 'react'
import { MessageCircle, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import {
  fetchSupremeCollection,
  supremeImageUrl,
  cleanSupremeTitle,
  SUPREME_COLLECTIONS,
  type SupremeProduct,
} from '@/src/lib/supreme'

const ALL = '__all__'

export default function Supreme() {
  const [collectionProducts, setCollectionProducts] = useState<Record<string, SupremeProduct[]>>({})
  const [loadingCollections, setLoadingCollections] = useState(true)
  const [activeHandle, setActiveHandle] = useState(ALL)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadAll() {
      const results: Record<string, SupremeProduct[]> = {}
      await Promise.all(
        SUPREME_COLLECTIONS.map(async (col) => {
          const products = await fetchSupremeCollection(col.handle)
          if (!cancelled) results[col.handle] = products
        }),
      )
      if (!cancelled) { setCollectionProducts(results); setLoadingCollections(false) }
    }
    loadAll()
    return () => { cancelled = true }
  }, [])

  function selectCollection(handle: string) { setActiveHandle(handle); setSearchQuery('') }

  const activeCol = SUPREME_COLLECTIONS.find((c) => c.handle === activeHandle)
  const allProducts = useMemo(() => Object.values(collectionProducts).flat(), [collectionProducts])
  const products = activeHandle === ALL ? allProducts : (collectionProducts[activeHandle] || [])
  const totalCount = allProducts.length
  const isLoading = loadingCollections && products.length === 0

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    const q = searchQuery.toLowerCase()
    return products.filter((p) => cleanSupremeTitle(p.title).toLowerCase().includes(q))
  }, [products, searchQuery])

  return (
    <>
      <SEO
        title="Supreme Furniture in Neemuch - Authorized Dealer | Plastic Chairs, Tables"
        description="Buy Supreme furniture in Neemuch from Hari Shewa Enterprises, authorized wholesale dealer. Complete range of Supreme plastic chairs, tables, kids furniture and more. Call +91 99815 16171."
        canonical="/supreme"
        keywords="Supreme furniture dealer Neemuch, Supreme plastic chairs Neemuch, Supreme furniture wholesale MP"
        jsonLd={createBreadcrumbSchema([{ name: 'Home', url: '/home' }, { name: 'Supreme', url: '/supreme' }])}
      />

      <div className='bg-white min-h-screen'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex'>
            <aside className='hidden md:block w-60 flex-shrink-0 sticky top-16 md:top-[108px] self-start h-screen bg-white border-r border-gray-100'>
              <div className='h-full overflow-y-auto pt-2 pb-4 px-2'>
                <p className='text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5'>Collections</p>
                <nav className='space-y-0.5'>
                  <button onClick={() => selectCollection(ALL)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all duration-150 ${activeHandle === ALL ? 'bg-orange-500 text-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'}`}>
                    <span className='flex items-center justify-between gap-2'>
                      <span className='leading-snug'>All Products</span>
                      {totalCount > 0 && <span className={`text-[11px] flex-shrink-0 font-medium ${activeHandle === ALL ? 'text-orange-100' : 'text-gray-400'}`}>{totalCount}</span>}
                    </span>
                  </button>
                  {SUPREME_COLLECTIONS.map((col) => {
                    const count = collectionProducts[col.handle]?.length
                    const isActive = col.handle === activeHandle
                    return (
                      <button key={col.handle} onClick={() => selectCollection(col.handle)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all duration-150 ${isActive ? 'bg-orange-500 text-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'}`}>
                        <span className='flex items-center justify-between gap-2'>
                          <span className='leading-snug'>{col.label}</span>
                          {count !== undefined && <span className={`text-[11px] flex-shrink-0 font-medium ${isActive ? 'text-orange-100' : 'text-gray-400'}`}>{count}</span>}
                        </span>
                      </button>
                    )
                  })}
                </nav>
                <div className='mt-5 p-3.5 rounded-xl bg-white border border-gray-100 shadow-sm'>
                  <p className='text-xs font-semibold text-gray-800 mb-1'>Need bulk pricing?</p>
                  <p className='text-[11px] text-gray-500 mb-3 leading-relaxed'>Wholesale rates on all Supreme products.</p>
                  <a href='https://wa.me/919981516171?text=Hi%2C%20I%20need%20wholesale%20pricing%20on%20Supreme%20furniture.'
                    className='block w-full text-center text-xs font-semibold bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors'>WhatsApp Us</a>
                </div>
              </div>
            </aside>
            <main className='flex-1 min-w-0 bg-gray-50 px-6 pt-20 md:pt-[120px] pb-8'>
              <div className='md:hidden mb-4'>
                <div className='flex gap-2 overflow-x-auto pb-2'>
                  <button onClick={() => selectCollection(ALL)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${activeHandle === ALL ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600'}`}>
                    All
                  </button>
                  {SUPREME_COLLECTIONS.map((col) => {
                    const isActive = col.handle === activeHandle
                    return (
                      <button key={col.handle} onClick={() => selectCollection(col.handle)}
                        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${isActive ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600'}`}>
                        {col.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className='flex items-center gap-4 mb-4 flex-wrap'>
                <div className='flex-1 min-w-0'>
                  <h2 className='text-lg font-bold text-gray-900'>{activeCol?.label ?? 'All Products'}</h2>
                  {activeCol?.description && <p className='text-xs text-gray-500 mt-0.5 hidden sm:block line-clamp-1'>{activeCol.description}</p>}
                </div>
                <div className='relative flex-shrink-0 w-full sm:w-56'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400' />
                  <input type='text' placeholder='Search products...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent' />
                </div>
              </div>
              {!isLoading && <p className='text-xs text-gray-400 mb-3'>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}{searchQuery.trim() ? ` matching "${searchQuery}"` : ''}</p>}
              {isLoading ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className='rounded-xl bg-white border border-gray-100 overflow-hidden animate-pulse'>
                      <div className='aspect-square bg-gray-100' /><div className='p-3 space-y-2'><div className='h-3 bg-gray-100 rounded w-3/4' /><div className='h-2.5 bg-gray-100 rounded w-1/2' /></div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
                  {filteredProducts.map((product) => {
                    const title = cleanSupremeTitle(product.title)
                    const image = product.images[0]
                    const imgSrc = image ? supremeImageUrl(image.src, 400) : null
                    return (
                      <Link key={product.id} to={`/supreme/${activeHandle === ALL ? (Object.entries(collectionProducts).find(([, ps]) => ps.some(p => p.id === product.id))?.[0] ?? SUPREME_COLLECTIONS[0].handle) : activeHandle}/${product.handle}`}
                        className='group rounded-xl bg-white border border-gray-100 overflow-hidden hover:border-orange-300 hover:shadow-md transition-all duration-200'>
                        <div className='aspect-square bg-gray-50 overflow-hidden'>
                          {imgSrc ? (
                            <img src={imgSrc} alt={title} className='w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300' loading='lazy'
                              onError={(e) => { const t = e.target as HTMLImageElement; if (image && t.src !== image.src) t.src = image.src }} />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center'><span className='text-3xl font-bold text-gray-200'>{title[0]}</span></div>
                          )}
                        </div>
                        <div className='p-3 border-t border-gray-50'>
                          <h4 className='text-sm font-medium text-gray-800 leading-snug line-clamp-2 mb-1.5 group-hover:text-orange-600 transition-colors'>{title}</h4>
                          <span className='text-xs text-orange-500 font-medium group-hover:text-orange-600 transition-colors'>View Details →</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : products.length === 0 ? (
                <div className='rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center'>
                  <p className='text-gray-400 text-sm mb-4'>Products coming soon for this category.</p>
                  <a href={`https://wa.me/919981516171?text=${encodeURIComponent(`Hi, I'm interested in Supreme ${activeCol?.label ?? 'products'}. Please share what's available.`)}`}
                    className='inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors'>
                    <MessageCircle className='w-3.5 h-3.5' /> Ask about availability
                  </a>
                </div>
              ) : (
                <div className='rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center'>
                  <p className='text-gray-400 text-sm mb-2'>No products match &ldquo;{searchQuery}&rdquo;.</p>
                  <button onClick={() => setSearchQuery('')} className='text-xs text-orange-500 hover:text-orange-600 transition-colors'>Clear search</button>
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
