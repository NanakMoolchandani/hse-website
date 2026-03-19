import { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Search, X } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import {
  fetchSeatexCollection,
  getSeatexCollection,
  cleanSeatexTitle,
  SEATEX_COLLECTIONS,
  type SeatexProduct,
} from '@/src/lib/seatex'

export default function SeatexCollection() {
  const { collection } = useParams<{ collection: string }>()
  const navigate = useNavigate()
  const [products, setProducts] = useState<SeatexProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const cat = collection ? getSeatexCollection(collection) : undefined

  useEffect(() => {
    if (!collection || !cat) return
    setLoading(true)
    fetchSeatexCollection(collection).then((p) => {
      setProducts(p)
      setLoading(false)
    })
  }, [collection])

  // Redirect to /seatex if invalid collection
  useEffect(() => {
    if (collection && !cat) navigate('/seatex', { replace: true })
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
        title={`Seatex ${cat.label} | Hari Shewa Enterprises - Authorized Dealer`}
        description={`Buy Seatex ${cat.label} at wholesale prices from Hari Shewa Enterprises, Neemuch. ${cat.description} Bulk orders and institutional supply available.`}
        canonical={`/seatex/${collection}`}
        keywords={`Seatex ${cat.label} wholesale, Seatex ${cat.label} Neemuch, Seatex dealer MP, ${cat.label} bulk order`}
        jsonLd={createBreadcrumbSchema([{ name: 'Home', url: '/home' }, { name: 'Seatex', url: '/seatex' }, { name: cat.label, url: '/seatex/' + collection }])}
      />

      {/* Header */}
      <section className='bg-gray-950 pt-24 pb-12 md:pt-28 md:pb-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
            <Link to='/seatex' className='hover:text-gray-300 transition-colors inline-flex items-center gap-1'>
              <ArrowLeft className='w-3.5 h-3.5' />
              Seatex
            </Link>
            <span>/</span>
            <span className='text-gray-300'>{cat.label}</span>
          </div>

          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
            <div>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4'>
                <span className='w-1.5 h-1.5 rounded-full bg-emerald-400' />
                <span className='text-xs font-medium text-emerald-400'>Authorized Wholesale Dealer</span>
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
                className='w-full pl-10 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-colors'
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
                <button onClick={() => setSearch('')} className='mt-3 text-emerald-400 hover:text-emerald-300 text-sm'>
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
      <section className='bg-gray-900 py-14 border-t border-white/5'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 text-center'>
          <h2 className='font-display text-2xl md:text-3xl font-bold text-white mb-3'>
            Interested in {cat.label}?
          </h2>
          <p className='text-gray-400 mb-6'>
            Contact us for wholesale pricing, bulk discounts, and availability. We deliver across Central India.
          </p>
          <a
            href={`https://wa.me/919981516171?text=${encodeURIComponent(`Hi, I'm interested in Seatex ${cat.label}. Please share wholesale pricing.`)}`}
            className='inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-7 py-3 rounded-full hover:bg-gray-100 transition-colors'
          >
            <MessageCircle className='w-5 h-5' />
            Enquire for Price
          </a>
        </div>
      </section>

      {/* Other Collections */}
      <section className='bg-gray-950 py-14 border-t border-white/5'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <h3 className='text-lg font-semibold text-white mb-6'>Browse Other Categories</h3>
          <div className='flex flex-wrap gap-2'>
            {SEATEX_COLLECTIONS.filter((c) => c.handle !== collection).map((c) => (
              <Link
                key={c.handle}
                to={`/seatex/${c.handle}`}
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

function ProductCard({ product, collection }: { product: SeatexProduct; collection: string }) {
  const title = cleanSeatexTitle(product.title)
  const colorCount = product.variants.length

  return (
    <Link
      to={`/seatex/${collection}/${product.handle}`}
      className='group rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden hover:border-white/15 transition-all duration-300'
    >
      {/* Image */}
      <div className='aspect-square bg-white/[0.02] overflow-hidden relative'>
        {product.images[0]?.src ? (
          <img
            src={product.images[0].src}
            alt={title}
            className='w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500'
            loading='lazy'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-gray-700'>
            <span className='text-3xl font-bold opacity-20'>{title[0]}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className='p-4'>
        <h3 className='text-sm font-medium text-white leading-snug mb-2 line-clamp-2 group-hover:text-emerald-300 transition-colors'>{title}</h3>
        {colorCount > 0 && (
          <p className='text-xs text-gray-500 mb-2'>
            {colorCount} colour{colorCount !== 1 ? 's' : ''} available
          </p>
        )}
        <span className='text-xs font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors'>
          Enquire for Price →
        </span>
      </div>
    </Link>
  )
}
