import { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Search, X } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import { getCategoryBySlug, CATEGORIES } from '@/src/lib/categories'
import { fetchProducts, fetchVariantCounts, type CatalogProduct } from '@/src/lib/supabase'

export default function MVMCollection() {
  const { collection } = useParams<{ collection: string }>()
  const navigate = useNavigate()
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [variantCounts, setVariantCounts] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const cat = collection ? getCategoryBySlug(collection) : undefined

  useEffect(() => {
    if (!collection || !cat) return
    setLoading(true)
    Promise.all([fetchProducts(cat.enum), fetchVariantCounts()]).then(([p, vc]) => {
      setProducts(p)
      setVariantCounts(vc)
      setLoading(false)
    })
  }, [collection])

  // Redirect to /mvm if invalid collection
  useEffect(() => {
    if (collection && !cat) navigate('/mvm', { replace: true })
  }, [collection, cat, navigate])

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter(
      (p) =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q),
    )
  }, [products, search])

  if (!cat) return null

  return (
    <>
      <SEO
        title={`${cat.label} - MVM Aasanam | Hari Shewa Enterprises`}
        description={`Buy ${cat.label} at factory-direct prices from MVM Aasanam (Hari Shewa Enterprises), Neemuch. ${cat.description} Bulk orders and institutional supply available.`}
        canonical={`/mvm/${collection}`}
        keywords={`MVM Aasanam ${cat.label}, ${cat.label} manufacturer Neemuch, ${cat.label} wholesale MP, office furniture factory direct`}
        jsonLd={createBreadcrumbSchema([{ name: 'Home', url: '/home' }, { name: 'MVM Aasanam', url: '/mvm' }, { name: cat.label, url: '/mvm/' + collection }])}
      />

      {/* Header */}
      <section className='bg-gray-950 pt-24 pb-12 md:pt-28 md:pb-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
            <Link to='/mvm' className='hover:text-gray-300 transition-colors inline-flex items-center gap-1'>
              <ArrowLeft className='w-3.5 h-3.5' />
              MVM Aasanam
            </Link>
            <span>/</span>
            <span className='text-gray-300'>{cat.label}</span>
          </div>

          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
            <div>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4'>
                <span className='w-1.5 h-1.5 rounded-full bg-amber-400' />
                <span className='text-xs font-medium text-amber-400'>Our Own Manufacturing</span>
              </div>
              <h1 className='font-display text-3xl md:text-5xl font-bold text-white mb-2'>
                {cat.label}
              </h1>
              <p className='text-gray-400 text-lg max-w-xl'>{cat.description}</p>
            </div>

            {/* Search */}
            <div className='relative w-full md:w-72 shrink-0'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500' />
              <input
                type='text'
                placeholder='Search products...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full pl-10 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-colors'
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300'
                >
                  <X className='w-4 h-4' />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className='bg-gray-950 py-8 md:py-12 min-h-[60vh]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          {loading ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className='rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden animate-pulse'>
                  <div className='aspect-square bg-white/[0.05]' />
                  <div className='p-4 space-y-2'>
                    <div className='h-4 bg-white/[0.05] rounded w-3/4' />
                    <div className='h-3 bg-white/[0.05] rounded w-1/2' />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className='text-center py-20'>
              <p className='text-gray-500 text-lg'>
                {search ? `No products matching "${search}"` : 'No products found in this collection.'}
              </p>
              {search && (
                <button onClick={() => setSearch('')} className='mt-3 text-amber-400 hover:text-amber-300 text-sm'>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <p className='text-sm text-gray-500 mb-6'>
                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                {search && ` matching "${search}"`}
              </p>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    collection={collection!}
                    variantCount={variantCounts[product.id] || 0}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className='bg-gray-900 py-14 border-t border-white/5'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 text-center'>
          <h2 className='font-display text-2xl md:text-3xl font-bold text-white mb-3'>
            Interested in {cat.label}?
          </h2>
          <p className='text-gray-400 mb-6'>
            Contact us for factory-direct pricing, bulk discounts, and availability. We deliver across India.
          </p>
          <a
            href={`https://wa.me/919981516171?text=${encodeURIComponent(`Hi, I'm interested in MVM Aasanam ${cat.label}. Please share pricing.`)}`}
            className='inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-7 py-3 rounded-full hover:bg-gray-100 transition-colors'
          >
            <MessageCircle className='w-5 h-5' />
            Get Factory-Direct Pricing
          </a>
        </div>
      </section>

      {/* Other Categories */}
      <section className='bg-gray-950 py-14 border-t border-white/5'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <h3 className='text-lg font-semibold text-white mb-6'>Browse Other Categories</h3>
          <div className='flex flex-wrap gap-2'>
            {CATEGORIES.filter((c) => c.slug !== collection).map((c) => (
              <Link
                key={c.slug}
                to={`/mvm/${c.slug}`}
                className='text-sm px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors'
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer variant='dark' />
    </>
  )
}

// ── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  collection,
  variantCount,
}: {
  product: CatalogProduct
  collection: string
  variantCount: number
}) {
  const imgSrc = product.processed_photo_urls?.[0]
    || product.raw_photo_urls?.[0]
    || null
  const features = product.metadata?.features || []
  // +1 because the product card represents the parent (which counts as 1 colour),
  // plus all child variants. Only show when ≥ 1 actual variant exists.
  const totalColours = variantCount + 1

  return (
    <Link
      to={`/mvm/${collection}/${product.slug}`}
      className='group rounded-2xl bg-white/[0.03] overflow-hidden hover:bg-white/[0.06] transition-all duration-300'
    >
      {/* Image */}
      <div className='aspect-square bg-white/[0.02] overflow-hidden relative'>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name || 'Product'}
            className='w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500'
            loading='lazy'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-gray-700'>
            <span className='text-3xl font-bold opacity-20'>{(product.name || 'P')[0]}</span>
          </div>
        )}
        {product.is_featured && (
          <div className='absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400'>
            Featured
          </div>
        )}
        {variantCount > 0 && (
          <div className='absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-white border border-white/20'>
            {totalColours} colours
          </div>
        )}
      </div>

      {/* Info */}
      <div className='p-4'>
        <h3 className='text-sm font-medium text-white leading-snug mb-2 line-clamp-2 group-hover:text-amber-300 transition-colors'>
          {product.name}
        </h3>
        {features.length > 0 && (
          <p className='text-xs text-gray-500 mb-2 truncate'>
            {features.slice(0, 3).map((f) => f.label).join(', ')}
          </p>
        )}
        <span className='text-xs font-medium text-amber-400 group-hover:text-amber-300 transition-colors'>
          View Details →
        </span>
      </div>
    </Link>
  )
}
