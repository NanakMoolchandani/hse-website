import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct, fetchProducts, type CatalogProduct } from '@/src/lib/supabase'
import { getCategoryBySlug, getCategoryByEnum } from '@/src/lib/categories'
import { FullScreenScrollFX } from '@/src/components/ui/full-screen-scroll-fx'
import ProductCard from '@/src/components/ProductCard'
import WhatsAppButton from '@/src/components/WhatsAppButton'
import FeatureHighlights from '@/src/components/FeatureHighlights'
import TrustBadges from '@/src/components/TrustBadges'
import { ChevronRight, Share2, Check } from 'lucide-react'

const VIEW_LABELS = ['Front View', 'Side View', 'Rear View', 'Detail', 'Close Up']

const CATEGORY_GLOW: Record<string, { color: string; colorLight: string }> = {
  EXECUTIVE_CHAIRS: { color: '#f59e0b', colorLight: '#fbbf24' },
  ERGONOMIC_TASK_CHAIRS: { color: '#06b6d4', colorLight: '#22d3ee' },
  CAFETERIA_FURNITURE: { color: '#f97316', colorLight: '#fb923c' },
  VISITOR_RECEPTION: { color: '#8b5cf6', colorLight: '#a78bfa' },
  CONFERENCE_MEETING: { color: '#10b981', colorLight: '#34d399' },
}
const DEFAULT_GLOW = { color: '#06b6d4', colorLight: '#22d3ee' }

export default function ProductPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>()
  const [product, setProduct] = useState<CatalogProduct | null>(null)
  const [related, setRelated] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showHindi, setShowHindi] = useState(false)
  const [copied, setCopied] = useState(false)

  const categoryInfo = getCategoryBySlug(category || '')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
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

  // Build scroll sections from product images
  const scrollSections = useMemo(() => {
    if (!product) return []
    const images = product.processed_photo_urls?.length > 0
      ? product.processed_photo_urls
      : product.raw_photo_urls || []
    const features = product.metadata?.features || []
    const productCategory = getCategoryByEnum(product.category || '')
    const { color, colorLight } = CATEGORY_GLOW[product.category || ''] || DEFAULT_GLOW

    return images.map((img, i) => ({
      id: `img-${i}`,
      background: img,
      leftLabel: VIEW_LABELS[i] || `View ${i + 1}`,
      title: product.name || 'Product',
      rightLabel: i === 0
        ? productCategory?.series || 'MVM Aasanam'
        : features[i - 1]?.label || productCategory?.label || 'Premium Quality',
      renderBackground: () => (
        <>
          {/* Product image backgrounds */}
          <img src={img} alt="" className="fx-bg-fill" />
          <img src={img} alt="" className="fx-bg-img" />
          <div className="fx-bg-overlay" />

          {/* Lamp glow — vertical light bar on the left */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '15%',
              bottom: '15%',
              width: '3px',
              background: `linear-gradient(to bottom, transparent, ${colorLight}, ${color}, ${colorLight}, transparent)`,
              boxShadow: `0 0 15px 3px ${color}`,
              zIndex: 30,
            }}
          />

          {/* Lamp glow bloom */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '10%',
              bottom: '10%',
              width: '6rem',
              background: `radial-gradient(ellipse at center, ${color}, transparent 70%)`,
              filter: 'blur(20px)',
              opacity: 0.5,
              transform: 'translateX(-30%)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />

          {/* Cone of light spreading rightward */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '60%',
              background: `linear-gradient(to right, ${color}22, ${color}08 40%, transparent 80%)`,
              zIndex: 5,
              pointerEvents: 'none',
            }}
          />

          {/* Bright hotspot near the bar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translate(-10%, -50%)',
              width: '16rem',
              height: '16rem',
              background: `radial-gradient(circle, ${color}, transparent 60%)`,
              filter: 'blur(30px)',
              opacity: 0.3,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        </>
      ),
    }))
  }, [product])

  if (loading) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-white/40 text-lg tracking-widest uppercase animate-pulse'>
          Loading...
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
  const features = product.metadata?.features || []

  return (
    <div className='min-h-screen bg-white'>
      {/* Full-Screen Scroll Hero */}
      {scrollSections.length > 0 && (
        <FullScreenScrollFX
          sections={scrollSections}
          header={
            <span>{productCategory?.label || 'MVM Aasanam'}</span>
          }
          footer={<div>MVM Aasanam</div>}
          showProgress
          durations={{ change: 0.7, snap: 800 }}
          colors={{
            text: 'rgba(255,255,255,0.9)',
            overlay: 'rgba(0,0,0,0)',
            pageBg: '#ffffff',
            stageBg: '#0a0a0a',
          }}
          fontFamily='"Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif'
        />
      )}

      {/* Detail Section */}
      <div className='bg-white'>
        {/* Breadcrumb */}
        <div className='max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-4'>
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

        {/* Product info */}
        <div className='max-w-7xl mx-auto px-6 lg:px-10 pb-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16'>
            {/* Left: Product name + description */}
            <div>
              {productCategory && (
                <Link
                  to={`/products/${productCategory.slug}`}
                  className='text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-gray-600'
                >
                  {productCategory.series} — {productCategory.label}
                </Link>
              )}

              <h1 className='font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-3 mb-8 leading-tight'>
                {product.name}
              </h1>

              {(product.description || product.description_hindi) && (
                <div className='mb-8'>
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
                  <p className='text-gray-600 leading-relaxed text-lg'>
                    {showHindi ? product.description_hindi : product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Trust badges + CTAs */}
            <div className='flex flex-col justify-center'>
              <div className='mb-8'>
                <TrustBadges />
              </div>

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
        </div>

        {/* Feature highlights */}
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

        {/* Related products */}
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
    </div>
  )
}

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
