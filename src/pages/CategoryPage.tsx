import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCategoryBySlug, CATEGORIES } from '@/src/lib/categories'
import { fetchProducts, type CatalogProduct } from '@/src/lib/supabase'
import ProductCard from '@/src/components/ProductCard'
import { BeamsBackground } from '@/src/components/ui/beams-background'
import { ChevronRight, FileDown, Search, SlidersHorizontal, ArrowUpDown, X, Grid2x2, Grid3x3 } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'newest' | 'featured'
type GridSize = 'compact' | 'normal'

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [gridSize, setGridSize] = useState<GridSize>('normal')
  const [showFilters, setShowFilters] = useState(false)
  const [featureFilter, setFeatureFilter] = useState<string | null>(null)

  const categoryInfo = getCategoryBySlug(category || '')

  useEffect(() => {
    if (!categoryInfo) return
    setLoading(true)
    setSearch('')
    setFeatureFilter(null)
    setSortBy('default')
    fetchProducts(categoryInfo.enum).then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [categoryInfo?.enum])

  // Extract unique feature labels for filter chips
  const availableFeatures = useMemo(() => {
    const features = new Set<string>()
    products.forEach((p) => {
      p.metadata?.features?.forEach((f) => features.add(f.label))
    })
    return Array.from(features).sort()
  }, [products])

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) =>
        (p.name?.toLowerCase().includes(q)) ||
        (p.description?.toLowerCase().includes(q))
      )
    }

    // Feature filter
    if (featureFilter) {
      result = result.filter((p) =>
        p.metadata?.features?.some((f) => f.label === featureFilter)
      )
    }

    // Sort
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      case 'name-desc':
        result.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
        break
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'featured':
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
        break
    }

    return result
  }, [products, search, sortBy, featureFilter])

  const activeFilterCount = (search.trim() ? 1 : 0) + (featureFilter ? 1 : 0) + (sortBy !== 'default' ? 1 : 0)

  if (!categoryInfo) {
    return (
      <div className='min-h-screen bg-black pt-24'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center'>
          <h1 className='text-3xl font-bold text-white mb-4'>Category not found</h1>
          <p className='text-gray-400 mb-8'>The category you're looking for doesn't exist.</p>
          <Link to='/' className='text-white font-medium hover:underline'>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const categoryKeywords: Record<string, string> = {
    'executive-chairs': 'executive chairs manufacturer, boss chairs wholesale, leather office chairs Neemuch, premium office chairs MP, executive seating supplier India',
    'ergonomic-task-chairs': 'ergonomic chairs manufacturer, mesh office chairs wholesale, task chairs Neemuch, computer chairs supplier MP, ergonomic seating India',
    'cafeteria-furniture': 'cafeteria furniture manufacturer, canteen chairs wholesale, cafeteria tables supplier Neemuch, commercial dining furniture MP, stackable chairs India',
    'visitor-and-reception': 'visitor chairs manufacturer, reception furniture wholesale, waiting area chairs Neemuch, lobby furniture supplier MP, guest chairs India',
  }

  return (
    <BeamsBackground intensity='medium' className='min-h-screen text-white flex flex-col'>
      <SEO
        title={`${categoryInfo.label} — Office Furniture Manufacturer Neemuch`}
        description={`${categoryInfo.description}. Premium ${categoryInfo.label.toLowerCase()} by MVM Aasanam (Hari Shewa Enterprises), Neemuch, Madhya Pradesh. Factory-direct pricing, bulk orders, pan-India delivery. ISO certified, GeM empanelled.`}
        canonical={`/products/${category}`}
        keywords={categoryKeywords[category || ''] || `${categoryInfo.label} manufacturer Neemuch, office furniture wholesale Madhya Pradesh`}
        jsonLd={createBreadcrumbSchema([
          { name: 'Home', url: '/home' },
          { name: categoryInfo.label, url: `/products/${category}` },
        ])}
      />
      <div className='pt-20 flex-1'>
        {/* Breadcrumb */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-2'>
          <nav className='flex items-center gap-1 text-sm text-gray-500'>
            <Link to='/' className='hover:text-gray-300 transition-colors'>Home</Link>
            <ChevronRight className='w-3 h-3' />
            <span className='text-gray-300'>{categoryInfo.label}</span>
          </nav>
        </div>

        {/* Header */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8'>
          <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-6'>
            <div>
              <p className='text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2'>
                {categoryInfo.series}
              </p>
              <h1 className='font-display text-3xl md:text-6xl font-bold text-white mb-3 tracking-tight'>
                {categoryInfo.label}
              </h1>
              <p className='text-gray-400 text-base md:text-lg max-w-xl'>
                {categoryInfo.description}
              </p>
            </div>

            {/* Documents */}
            <div className='shrink-0 md:mt-2'>
              <p className='text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2'>Documents</p>
              <a
                href='https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog-assets/documents/HSE-Catalog.pdf'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all'
              >
                <FileDown className='w-4 h-4' />
                Product Catalog PDF
              </a>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-8'>
          <div className='flex gap-2 overflow-x-auto pb-2'>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products/${cat.slug}`}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  cat.slug === category
                    ? 'bg-white text-black border-white/20'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-gray-200'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-4'>
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
            {/* Search */}
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500' />
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search products...'
                className='w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all'
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className='absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300'
                >
                  <X className='w-3.5 h-3.5' />
                </button>
              )}
            </div>

            <div className='flex items-center gap-2'>
              {/* Sort dropdown */}
              <div className='relative'>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className='appearance-none pl-8 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 focus:outline-none focus:border-white/25 cursor-pointer hover:bg-white/8 transition-all'
                >
                  <option value='default'>Default Order</option>
                  <option value='name-asc'>Name: A to Z</option>
                  <option value='name-desc'>Name: Z to A</option>
                  <option value='newest'>Newest First</option>
                  <option value='featured'>Featured First</option>
                </select>
                <ArrowUpDown className='absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none' />
              </div>

              {/* Feature filter toggle */}
              {availableFeatures.length > 0 && (
                <button
                  onClick={() => setShowFilters((o) => !o)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    showFilters || featureFilter
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/8 hover:text-gray-300'
                  }`}
                >
                  <SlidersHorizontal className='w-3.5 h-3.5' />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className='ml-1 w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center'>
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              )}

              {/* Grid size toggle */}
              <div className='hidden md:flex items-center border border-white/10 rounded-xl overflow-hidden'>
                <button
                  onClick={() => setGridSize('normal')}
                  className={`p-2.5 transition-colors ${gridSize === 'normal' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                  title='Normal grid'
                >
                  <Grid2x2 className='w-4 h-4' />
                </button>
                <button
                  onClick={() => setGridSize('compact')}
                  className={`p-2.5 transition-colors ${gridSize === 'compact' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                  title='Compact grid'
                >
                  <Grid3x3 className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>

          {/* Feature chips */}
          {showFilters && availableFeatures.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5'>
              <button
                onClick={() => setFeatureFilter(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  !featureFilter
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                }`}
              >
                All
              </button>
              {availableFeatures.map((f) => (
                <button
                  key={f}
                  onClick={() => setFeatureFilter(featureFilter === f ? null : f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    featureFilter === f
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          {!loading && products.length > 0 && (
            <div className='mt-3 text-xs text-gray-500'>
              {filteredProducts.length === products.length
                ? `${products.length} products`
                : `${filteredProducts.length} of ${products.length} products`}
            </div>
          )}
        </div>

        {/* Product grid */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-20'>
          {loading ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5'>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className='animate-pulse'>
                  <div className='aspect-square bg-white/5 rounded-2xl' />
                  <div className='p-4 space-y-2'>
                    <div className='h-3 w-16 bg-white/5 rounded' />
                    <div className='h-4 w-32 bg-white/5 rounded' />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className='text-center py-20'>
              <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center'>
                <Search className='w-10 h-10 text-gray-600' />
              </div>
              <h3 className='text-lg font-semibold text-white mb-2'>
                {products.length === 0 ? 'No products yet' : 'No matching products'}
              </h3>
              <p className='text-gray-500'>
                {products.length === 0
                  ? 'Products in this category will appear here once published.'
                  : 'Try adjusting your search or filters.'}
              </p>
              {(search || featureFilter) && (
                <button
                  onClick={() => { setSearch(''); setFeatureFilter(null); setSortBy('default') }}
                  className='mt-4 text-sm text-indigo-400 hover:text-indigo-300 font-medium'
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className={`grid gap-3 sm:gap-5 ${
              gridSize === 'compact'
                ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} variant='dark' />
              ))}
            </div>
          )}
        </div>

        <Footer variant='dark' />
      </div>
    </BeamsBackground>
  )
}
