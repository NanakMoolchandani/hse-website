import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct, fetchProducts, type CatalogProduct } from '@/src/lib/supabase'
import { getCategoryBySlug, getCategoryByEnum } from '@/src/lib/categories'
import { Card } from '@/src/components/ui/card'
import { AspectRatio } from '@/src/components/ui/aspect-ratio'
import ProductCard from '@/src/components/ProductCard'
import WhatsAppButton from '@/src/components/WhatsAppButton'
import FeatureHighlights from '@/src/components/FeatureHighlights'
import TrustBadges from '@/src/components/TrustBadges'
import CompareTable from '@/src/components/CompareTable'
import { ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon, Share2, Check } from 'lucide-react'
import { cn } from '@/src/lib/utils'

export default function ProductPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>()
  const [product, setProduct] = useState<CatalogProduct | null>(null)
  const [related, setRelated] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showHindi, setShowHindi] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [copied, setCopied] = useState(false)

  const categoryInfo = getCategoryBySlug(category || '')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setActiveImage(0)
    fetchProduct(slug).then((data) => {
      setProduct(data)
      setLoading(false)

      if (data?.category) {
        fetchProducts(data.category).then((all) => {
          setRelated(all.filter((p) => p.slug !== slug).slice(0, 4))
        })
      }

      if (data) {
        document.title = `${data.name} — MVM Aasanam`
        injectSchemaOrg(data)
      }
    })

    return () => {
      const script = document.getElementById('schema-product')
      if (script) script.remove()
    }
  }, [slug])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!product) return
      const images = product.processed_photo_urls?.length > 0
        ? product.processed_photo_urls
        : product.raw_photo_urls || []
      if (images.length <= 1) return
      if (e.key === 'ArrowLeft') setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      if (e.key === 'ArrowRight') setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [product])

  if (loading) {
    return (
      <div className='min-h-screen bg-white pt-24'>
        <div className='max-w-7xl mx-auto px-6 lg:px-10'>
          <Card className='rounded-3xl border-gray-200 p-6 animate-pulse'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <div>
                <div className='aspect-[4/5] bg-gray-100 rounded-2xl' />
                <div className='grid grid-cols-5 gap-2 mt-4'>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className='aspect-[4/5] bg-gray-100 rounded-xl' />
                  ))}
                </div>
              </div>
              <div className='space-y-4 pt-4'>
                <div className='h-4 w-24 bg-gray-100 rounded' />
                <div className='h-8 w-64 bg-gray-100 rounded' />
                <div className='h-4 w-full bg-gray-100 rounded' />
                <div className='h-4 w-3/4 bg-gray-100 rounded' />
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='min-h-screen bg-white pt-24'>
        <div className='max-w-7xl mx-auto px-6 lg:px-10 text-center'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Product not found</h1>
          <p className='text-gray-500 mb-8'>The product you're looking for doesn't exist or has been removed.</p>
          <Link to='/' className='text-gray-900 font-medium hover:underline'>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const productCategory = getCategoryByEnum(product.category || '')
  const images = product.processed_photo_urls?.length > 0
    ? product.processed_photo_urls
    : product.raw_photo_urls || []
  const metadata = product.metadata
  const features = metadata?.features || []

  const prevImage = () => setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const nextImage = () => setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  return (
    <div className='min-h-screen bg-white pt-20'>
      {/* Breadcrumb */}
      <div className='max-w-7xl mx-auto px-6 lg:px-10 pt-4 pb-4'>
        <nav className='flex items-center gap-1 text-sm text-gray-400'>
          <Link to='/' className='hover:text-gray-700'>Home</Link>
          <ChevronRight className='w-3 h-3' />
          {categoryInfo && (
            <>
              <Link to={`/products/${categoryInfo.slug}`} className='hover:text-gray-700'>
                {categoryInfo.label}
              </Link>
              <ChevronRight className='w-3 h-3' />
            </>
          )}
          <span className='text-gray-700'>{product.name}</span>
        </nav>
      </div>

      {/* ═══ Single unified product card ═══ */}
      <div className='max-w-7xl mx-auto px-6 lg:px-10 pb-8'>
        <Card className='rounded-3xl border-gray-200 bg-white p-6 lg:p-8 shadow-sm'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10'>

            {/* ── LEFT: Images ── */}
            <div>
              {/* Main image */}
              <div className='relative'>
                <AspectRatio ratio={4 / 5}>
                  <div className='h-full w-full overflow-hidden rounded-2xl bg-gray-50'>
                    <img
                      src={images[activeImage]}
                      alt={`${product.name} — view ${activeImage + 1}`}
                      className='h-full w-full rounded-2xl object-cover'
                    />
                  </div>
                </AspectRatio>

                {/* Prev/Next controls */}
                {images.length > 1 && (
                  <div className='absolute bottom-3 right-3 flex gap-2'>
                    <button
                      onClick={prevImage}
                      className='h-9 w-9 rounded-full bg-white/80 backdrop-blur border border-gray-200 flex items-center justify-center hover:bg-white transition-colors'
                      aria-label='Previous image'
                    >
                      <ChevronLeft className='h-4 w-4 text-gray-700' />
                    </button>
                    <button
                      onClick={nextImage}
                      className='h-9 w-9 rounded-full bg-white/80 backdrop-blur border border-gray-200 flex items-center justify-center hover:bg-white transition-colors'
                      aria-label='Next image'
                    >
                      <ChevronRightIcon className='h-4 w-4 text-gray-700' />
                    </button>
                  </div>
                )}
              </div>

              {/* Horizontal thumbnail strip — evenly spans main image width */}
              {images.length > 1 && (
                <div className='grid mt-4 gap-2' style={{ gridTemplateColumns: `repeat(${images.length}, 1fr)` }}>
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        'w-full aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all',
                        i === activeImage
                          ? 'border-gray-900 shadow-md'
                          : 'border-gray-200 hover:border-gray-400'
                      )}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${i + 1}`}
                        className='w-full h-full object-cover'
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Product info ── */}
            <div className='flex flex-col justify-between'>
              <div>
                {productCategory && (
                  <Link
                    to={`/products/${productCategory.slug}`}
                    className='text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-gray-600'
                  >
                    {productCategory.series} — {productCategory.label}
                  </Link>
                )}

                <h1 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6'>
                  {product.name}
                </h1>

                {/* Description with language toggle */}
                {(product.description || product.description_hindi) && (
                  <div className='mb-6'>
                    {product.description_hindi && (
                      <div className='flex gap-2 mb-3'>
                        <button
                          onClick={() => setShowHindi(false)}
                          className={`text-xs px-3 py-1 rounded-full transition-colors ${
                            !showHindi ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => setShowHindi(true)}
                          className={`text-xs px-3 py-1 rounded-full transition-colors ${
                            showHindi ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          Hindi
                        </button>
                      </div>
                    )}
                    <p className='text-gray-600 leading-relaxed'>
                      {showHindi ? product.description_hindi : product.description}
                    </p>
                  </div>
                )}

                {/* Trust badges */}
                <div className='border-t border-gray-100 pt-6 mb-8'>
                  <TrustBadges />
                </div>
              </div>

              {/* CTA buttons — always one row */}
              <div className='flex flex-row gap-2'>
                <WhatsAppButton productName={product.name || 'this product'} className='flex-1 text-sm px-4 py-2.5' />
                <a
                  href='tel:+919131438300'
                  className='flex-1 inline-flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-full hover:bg-gray-50 transition-colors'
                >
                  Call for Quote
                </a>
                <button
                  onClick={async () => {
                    const url = window.location.href
                    const text = `Check out ${product.name} from MVM Aasanam`
                    if (navigator.share) {
                      try {
                        await navigator.share({ title: product.name || 'Product', text, url })
                      } catch { /* user cancelled */ }
                    } else {
                      await navigator.clipboard.writeText(url)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }
                  }}
                  className='flex-1 inline-flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-full hover:bg-gray-50 transition-colors'
                >
                  {copied ? <Check className='w-4 h-4 text-green-600' /> : <Share2 className='w-4 h-4' />}
                  {copied ? 'Copied!' : 'Share'}
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Feature highlights section */}
      {features.length > 0 && (
        <div className='max-w-7xl mx-auto px-6 lg:px-10 py-12 border-t border-gray-100'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2'>
            Key Features
          </p>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            What makes this product special
          </h2>
          <FeatureHighlights features={features} />
        </div>
      )}

      {/* Compare with related products */}
      {related.length > 0 && (
        <div className='max-w-7xl mx-auto px-6 lg:px-10 py-12 border-t border-gray-100'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2'>
            Compare
          </p>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            How it compares
          </h2>
          <CompareTable current={product} related={related} />
        </div>
      )}

      {/* Related products grid */}
      {related.length > 0 && (
        <div className='max-w-7xl mx-auto px-6 lg:px-10 py-16 border-t border-gray-100'>
          <h2 className='text-2xl font-bold text-gray-900 mb-8'>More in {productCategory?.label}</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Inject Schema.org Product structured data for SEO.
 */
function injectSchemaOrg(product: CatalogProduct) {
  const existing = document.getElementById('schema-product')
  if (existing) existing.remove()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.processed_photo_urls || [],
    brand: {
      '@type': 'Brand',
      name: 'MVM Aasanam',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Hari Shewa Enterprises',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Neemuch',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'IN',
      },
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'INR',
      seller: {
        '@type': 'Organization',
        name: 'Hari Shewa Enterprises',
      },
    },
  }

  const script = document.createElement('script')
  script.id = 'schema-product'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(schema)
  document.head.appendChild(script)
}
