import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct, fetchProducts, type CatalogProduct } from '@/src/lib/supabase'
import { getCategoryBySlug, getCategoryByEnum } from '@/src/lib/categories'
import ImageGallery from '@/src/components/ImageGallery'
import ProductCard from '@/src/components/ProductCard'
import WhatsAppButton from '@/src/components/WhatsAppButton'
import FeatureHighlights from '@/src/components/FeatureHighlights'
import TrustBadges from '@/src/components/TrustBadges'
import CompareTable from '@/src/components/CompareTable'
import { ChevronRight } from 'lucide-react'

export default function ProductPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>()
  const [product, setProduct] = useState<CatalogProduct | null>(null)
  const [related, setRelated] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showHindi, setShowHindi] = useState(false)

  const categoryInfo = getCategoryBySlug(category || '')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetchProduct(slug).then((data) => {
      setProduct(data)
      setLoading(false)

      // Fetch related products from same category
      if (data?.category) {
        fetchProducts(data.category).then((all) => {
          setRelated(all.filter((p) => p.slug !== slug).slice(0, 4))
        })
      }

      // Update page title and inject Schema.org
      if (data) {
        document.title = `${data.name} — MVM Aasanam`
        injectSchemaOrg(data)
      }
    })

    return () => {
      // Cleanup Schema.org script on unmount
      const script = document.getElementById('schema-product')
      if (script) script.remove()
    }
  }, [slug])

  if (loading) {
    return (
      <div className='min-h-screen bg-white pt-24'>
        <div className='max-w-7xl mx-auto px-6 lg:px-10'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse'>
            <div className='aspect-[3/4] bg-gray-100 rounded-2xl' />
            <div className='space-y-4 pt-8'>
              <div className='h-4 w-24 bg-gray-100 rounded' />
              <div className='h-8 w-64 bg-gray-100 rounded' />
              <div className='h-4 w-full bg-gray-100 rounded' />
              <div className='h-4 w-3/4 bg-gray-100 rounded' />
            </div>
          </div>
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
  const materials = metadata?.materials || []

  return (
    <div className='min-h-screen bg-white pt-20'>
      {/* Breadcrumb */}
      <div className='max-w-7xl mx-auto px-6 lg:px-10 pt-4 pb-2'>
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

      {/* Product detail — Hero section */}
      <div className='max-w-7xl mx-auto px-6 lg:px-10 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Left — Image gallery */}
          <div>
            <ImageGallery
              images={images}
              alt={product.name || 'Product'}
            />
          </div>

          {/* Right — Product info */}
          <div className='pt-2'>
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

            {/* Materials */}
            {materials.length > 0 && (
              <div className='mb-6'>
                <p className='text-xs text-gray-400 uppercase tracking-wider mb-2'>Materials</p>
                <div className='flex flex-wrap gap-2'>
                  {materials.map((m, i) => (
                    <span key={i} className='text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full'>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className='border-t border-gray-100 pt-6 mb-8'>
              <TrustBadges />
            </div>

            {/* CTA buttons */}
            <div className='flex flex-col sm:flex-row gap-3'>
              <WhatsAppButton productName={product.name || 'this product'} />
              <a
                href='tel:+919131438300'
                className='inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-medium px-6 py-3 rounded-full hover:bg-gray-50 transition-colors'
              >
                Call for Quote
              </a>
            </div>
          </div>
        </div>
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
  // Remove existing
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
