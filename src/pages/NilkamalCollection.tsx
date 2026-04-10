import { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Search, X } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import {
  fetchNilkamalCollection,
  getNilkamalCollection,
  cleanProductTitle,
  nilkamalImageUrl,
  extractColorTags,
  NILKAMAL_COLLECTIONS,
  type NilkamalProduct,
} from '@/src/lib/nilkamal'

export default function NilkamalCollection() {
  const { collection } = useParams<{ collection: string }>()
  const navigate = useNavigate()
  const [products, setProducts] = useState<NilkamalProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const cat = collection ? getNilkamalCollection(collection) : undefined

  useEffect(() => {
    if (!collection || !cat) return
    setLoading(true)
    fetchNilkamalCollection(collection).then((p) => {
      setProducts(p)
      setLoading(false)
    })
  }, [collection])

  // Redirect to /nilkamal if invalid collection
  useEffect(() => {
    if (collection && !cat) navigate('/nilkamal', { replace: true })
  }, [collection, cat, navigate])

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [products, search])

  if (!cat) return null

  return (
    <>
      <SEO
        title={`Nilkamal ${cat.label} | Hari Shewa Enterprises - Authorized Dealer`}
        description={`Buy Nilkamal ${cat.label} at wholesale prices from Hari Shewa Enterprises, Neemuch. ${cat.description} Bulk orders and institutional supply available.`}
        canonical={`/nilkamal/${collection}`}
        keywords={`Nilkamal ${cat.label} wholesale, Nilkamal ${cat.label} Neemuch, Nilkamal dealer MP, ${cat.label} bulk order`}
        jsonLd={createBreadcrumbSchema([{ name: 'Home', url: '/home' }, { name: 'Nilkamal', url: '/nilkamal' }, { name: cat.label, url: '/nilkamal/' + collection }])}
      />

      {/* Header */}
      <section className='bg-white pt-24 pb-12 md:pt-28 md:pb-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
            <Link to='/nilkamal' className='hover:text-gray-700 transition-colors inline-flex items-center gap-1'>
              <ArrowLeft className='w-3.5 h-3.5' />
              Nilkamal
            </Link>
            <span>/</span>
            <span className='text-gray-900'>{cat.label}</span>
          </div>

          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
            <div>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4'>
                <span className='w-1.5 h-1.5 rounded-full bg-blue-500' />
                <span className='text-xs font-medium text-blue-600'>Authorized Wholesale Dealer</span>
              </div>
              <h1 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-2'>
                {cat.label}
              </h1>
              <p className='text-gray-600 text-lg max-w-xl'>{cat.description}</p>
            </div>

            {/* Search */}
            <div className='relative w-full md:w-72 shrink-0'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search products...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-colors'
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  <X className='w-4 h-4' />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className='bg-white py-8 md:py-12 min-h-[60vh]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          {loading ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className='rounded-2xl bg-gray-100 border border-gray-100 overflow-hidden animate-pulse'>
                  <div className='aspect-square bg-gray-200' />
                  <div className='p-4 space-y-2'>
                    <div className='h-4 bg-gray-200 rounded w-3/4' />
                    <div className='h-3 bg-gray-200 rounded w-1/2' />
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
                <button onClick={() => setSearch('')} className='mt-3 text-blue-600 hover:text-blue-700 text-sm'>
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
                  <ProductCard key={product.id} product={product} collection={collection!} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className='bg-gray-50 py-14 border-t border-gray-100'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 text-center'>
          <h2 className='font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3'>
            Interested in {cat.label}?
          </h2>
          <p className='text-gray-600 mb-6'>
            Contact us for wholesale pricing, bulk discounts, and availability. We deliver across Central India.
          </p>
          <a
            href={`https://wa.me/919981516171?text=${encodeURIComponent(`Hi, I'm interested in Nilkamal ${cat.label}. Please share wholesale pricing.`)}`}
            className='inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-7 py-3 rounded-full hover:bg-gray-700 transition-colors'
          >
            <MessageCircle className='w-5 h-5' />
            Get Wholesale Pricing
          </a>
        </div>
      </section>

      {/* Other Collections */}
      <section className='bg-white py-14 border-t border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <h3 className='text-lg font-semibold text-gray-900 mb-6'>Browse Other Categories</h3>
          <div className='flex flex-wrap gap-2'>
            {NILKAMAL_COLLECTIONS.filter((c) => c.handle !== collection).map((c) => (
              <Link
                key={c.handle}
                to={`/nilkamal/${c.handle}`}
                className='text-sm px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors'
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

function ProductCard({ product, collection }: { product: NilkamalProduct; collection: string }) {
  const title = cleanProductTitle(product.title)
  const image = product.images[0]
  const imgSrc = image ? nilkamalImageUrl(image.src, 500) : null
  const isAvailable = product.variants.some((v) => v.available)
  const colorTags = extractColorTags(product.tags)

  return (
    <Link
      to={`/nilkamal/${collection}/${product.handle}`}
      className='group rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300'
    >
      {/* Image */}
      <div className='aspect-square bg-white overflow-hidden relative'>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title}
            className='w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500'
            loading='lazy'
            onError={(e) => {
              const target = e.target as HTMLImageElement
              if (target.src !== product.images[0]?.src) {
                target.src = product.images[0]?.src
              }
            }}
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-gray-300'>
            <span className='text-3xl font-bold opacity-40'>{title[0]}</span>
          </div>
        )}
        {!isAvailable && (
          <div className='absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100'>
            Out of Stock
          </div>
        )}
      </div>

      {/* Info */}
      <div className='p-4'>
        <h3 className='text-sm font-medium text-gray-800 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors'>{title}</h3>
        {colorTags.length > 0 && (
          <p className='text-xs text-gray-500 mb-2 truncate'>
            {colorTags.slice(0, 3).join(', ')}
          </p>
        )}
        <span className='text-xs font-medium text-blue-500 group-hover:text-blue-600 transition-colors'>
          View Details →
        </span>
      </div>
    </Link>
  )
}
