import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct, fetchProducts, type CatalogProduct } from '@/src/lib/supabase'
import { getCategoryBySlug, getCategoryByEnum } from '@/src/lib/categories'
import { FullScreenScrollFX, type FullScreenFXAPI } from '@/src/components/ui/full-screen-scroll-fx'
import ImageGallery from '@/src/components/ImageGallery'
import ProductCard from '@/src/components/ProductCard'
import WhatsAppButton from '@/src/components/WhatsAppButton'
import FeatureHighlights from '@/src/components/FeatureHighlights'
import TrustBadges from '@/src/components/TrustBadges'
import ColorSwatches from '@/src/components/ColorSwatches'
import { ChevronRight, ChevronLeft, Share2, Check } from 'lucide-react'
import Footer from '@/src/components/Footer'

const VIEW_LABELS = ['Front View', 'Side View', 'Rear View', 'Detail', 'Close Up']

const CATEGORY_GLOW: Record<string, {
  left: string; leftLight: string
  right: string; rightLight: string
}> = {
  EXECUTIVE_CHAIRS:      { left: '#f59e0b', leftLight: '#fbbf24', right: '#8b5cf6', rightLight: '#a78bfa' },
  ERGONOMIC_TASK_CHAIRS: { left: '#06b6d4', leftLight: '#22d3ee', right: '#f43f5e', rightLight: '#fb7185' },
  CAFETERIA_FURNITURE:   { left: '#f97316', leftLight: '#fb923c', right: '#3b82f6', rightLight: '#60a5fa' },
  VISITOR_RECEPTION:     { left: '#8b5cf6', leftLight: '#a78bfa', right: '#f59e0b', rightLight: '#fbbf24' },
}
const DEFAULT_GLOW = { left: '#06b6d4', leftLight: '#22d3ee', right: '#f43f5e', rightLight: '#fb7185' }

export default function ProductPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>()
  const [product, setProduct] = useState<CatalogProduct | null>(null)
  const [related, setRelated] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showHindi, setShowHindi] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [scrollIndex, setScrollIndex] = useState(0)
  const fxApiRef = useRef<FullScreenFXAPI>(null)

  const categoryInfo = getCategoryBySlug(category || '')

  // Detect mobile for conditional rendering
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

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
        document.title = `${data.name} | MVM Aasanam`
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
    const glow = CATEGORY_GLOW[product.category || ''] || DEFAULT_GLOW

    return images.map((img, i) => ({
      id: `img-${i}`,
      background: img,
      leftLabel: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {i === 0 && (
            <span style={{ opacity: 1, fontSize: '1.05em', letterSpacing: '0.06em', fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>
              {product.name?.toUpperCase()}
            </span>
          )}
          <span>{VIEW_LABELS[i] || `View ${i + 1}`}</span>
        </div>
      ),
      title: '',
      rightLabel: i === 0
        ? productCategory?.series || 'MVM Aasanam'
        : features[i - 1]?.label || productCategory?.label || 'Premium Quality',
      renderBackground: () => (
        <>
          {/* Product image backgrounds */}
          <img src={img} alt="" className="fx-bg-fill" />
          <img src={img} alt="" className="fx-bg-img" />
          <div className="fx-bg-overlay" />

          {/* ——— LEFT LAMP ——— */}
          <div style={{ position: 'absolute', left: '2rem', top: 0, bottom: 0, width: '3px', background: glow.leftLight, boxShadow: `0 0 24px 6px ${glow.left}`, zIndex: 30, opacity: 0.9 }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '12rem', background: glow.left, filter: 'blur(40px)', opacity: 0.55, zIndex: 10, pointerEvents: 'none' as const }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40%', background: `linear-gradient(to right, ${glow.left}55, ${glow.left}22 50%, transparent)`, zIndex: 5, pointerEvents: 'none' as const }} />

          {/* ——— RIGHT LAMP ——— */}
          <div style={{ position: 'absolute', right: '2rem', top: 0, bottom: 0, width: '3px', background: glow.rightLight, boxShadow: `0 0 24px 6px ${glow.right}`, zIndex: 30, opacity: 0.9 }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '12rem', background: glow.right, filter: 'blur(40px)', opacity: 0.55, zIndex: 10, pointerEvents: 'none' as const }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%', background: `linear-gradient(to left, ${glow.right}55, ${glow.right}22 50%, transparent)`, zIndex: 5, pointerEvents: 'none' as const }} />
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
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center'>
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

  const productImages = product.processed_photo_urls?.length > 0
    ? product.processed_photo_urls
    : product.raw_photo_urls || []

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {/* Mobile: Simple swipeable gallery | Desktop: Full-screen scroll hero */}
      {isMobile ? (
        productImages.length > 0 && (
          <div className='pt-20 px-4 pb-4'>
            <ImageGallery images={productImages} alt={product.name || 'Product'} />
          </div>
        )
      ) : (
        scrollSections.length > 0 && (
          <div className='relative'>
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
              apiRef={fxApiRef}
              onIndexChange={setScrollIndex}
            />
            {/* Navigation arrows overlay */}
            {scrollSections.length > 1 && (
              <>
                {scrollIndex > 0 && (
                  <button
                    onClick={() => fxApiRef.current?.prev()}
                    className='fixed left-6 top-1/2 -translate-y-1/2 z-[60] flex items-center justify-center w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all group'
                    aria-label='Previous image'
                  >
                    <ChevronLeft className='w-6 h-6 group-hover:-translate-x-0.5 transition-transform' />
                  </button>
                )}
                {scrollIndex < scrollSections.length - 1 && (
                  <button
                    onClick={() => fxApiRef.current?.next()}
                    className='fixed right-6 top-1/2 -translate-y-1/2 z-[60] flex items-center justify-center w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all group'
                    aria-label='Next image'
                  >
                    <ChevronRight className='w-6 h-6 group-hover:translate-x-0.5 transition-transform' />
                  </button>
                )}
              </>
            )}
          </div>
        )
      )}

      {/* Detail Section */}
      <div className='bg-white flex-1 flex flex-col'>
        {/* Breadcrumb */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-4'>
          <nav className='flex items-center gap-1.5 text-sm text-gray-400'>
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

        {/* Product info — name + CTAs */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16'>
            {/* Left: Product name only */}
            <div>
              {productCategory && (
                <Link
                  to={`/products/${productCategory.slug}`}
                  className='text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-gray-600'
                >
                  {productCategory.series} | {productCategory.label}
                </Link>
              )}

              <h1 className='font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-3 leading-tight'>
                {product.name}
              </h1>
            </div>

            {/* Right: Trust badges + CTAs */}
            <div className='flex flex-col justify-center'>
              <div className='mb-8'>
                <TrustBadges />
              </div>

              <div className='flex flex-col sm:flex-row gap-2'>
                <WhatsAppButton productName={product.name || 'this product'} className='flex-1 text-sm px-4 py-2.5' />
                <a
                  href='tel:+919981516171'
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

        {/* Color swatches — immediately after name, before description */}
        {product.category === 'EXECUTIVE_CHAIRS' && (
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 border-t border-gray-100'>
            <ColorSwatches
              isExecutiveChair
              colors={product.metadata?.colors}
              materials={product.metadata?.materials}
            />
          </div>
        )}

        {/* Description — after colors */}
        {(product.description || product.description_hindi) && (
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 border-t border-gray-100'>
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
            <p className='text-gray-600 leading-relaxed text-lg max-w-3xl'>
              {showHindi ? product.description_hindi : product.description}
            </p>
          </div>
        )}

        {/* Feature highlights */}
        {features.length > 0 && (
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 border-t border-gray-100'>
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
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-16 border-t border-gray-100'>
            <h2 className='text-2xl font-bold text-gray-900 mb-8'>More in {productCategory?.label}</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        <Footer />
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
