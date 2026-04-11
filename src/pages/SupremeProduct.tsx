import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Phone, ChevronRight, Share2, Check } from 'lucide-react'
import Footer from '@/src/components/Footer'
import ProductImageZoom from '@/src/components/ProductImageZoom'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import {
  fetchSupremeCollection,
  cleanSupremeTitle,
  supremeImageUrl,
  stripSupremeHtml,
  extractSupremeColorTags,
  getSupremeCollection,
  type SupremeProduct as SupremeProductType,
} from '@/src/lib/supreme'

export default function SupremeProduct() {
  const { collection, handle } = useParams<{ collection: string; handle: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<SupremeProductType | null>(null)
  const [related, setRelated] = useState<SupremeProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [copied, setCopied] = useState(false)

  const cat = collection ? getSupremeCollection(collection) : undefined

  useEffect(() => {
    if (!handle || !collection) return
    setLoading(true)
    setActiveImage(0)

    // Fetch the full collection and find the product by handle
    // (Shopify's single-product .json endpoint is not available on all stores)
    fetchSupremeCollection(collection).then((all) => {
      const found = all.find((p) => p.handle === handle) || null
      setProduct(found)
      setRelated(found ? all.filter((p) => p.id !== found.id).slice(0, 4) : [])
      setLoading(false)
    })
  }, [handle, collection])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: product?.title || 'Supreme Product', url })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center pt-16'>
        <div className='w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin' />
      </div>
    )
  }

  if (!product) {
    return (
      <div className='min-h-screen bg-white flex flex-col items-center justify-center pt-16 px-4'>
        <p className='text-gray-600 text-lg mb-4'>Product not found</p>
        <Link
          to={cat ? `/supreme/${collection}` : '/supreme'}
          className='inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to {cat?.label || 'Supreme'}
        </Link>
      </div>
    )
  }

  const title = cleanSupremeTitle(product.title)
  const description = product.body_html ? stripSupremeHtml(product.body_html) : ''
  const images = product.images || []
  const colorTags = extractSupremeColorTags(product.tags)
  const isAvailable = product.variants.some((v) => v.available)
  const sku = product.variants[0]?.sku || ''

  const whatsappText = encodeURIComponent(
    `Hi, I'm interested in the Supreme ${title}. Please share wholesale pricing and availability.`,
  )

  return (
    <>
      <SEO
        title={`${title} | Supreme - Hari Shewa Enterprises`}
        description={`Buy ${title} at wholesale price from Hari Shewa Enterprises, Authorized Supreme Dealer in Neemuch. ${description.slice(0, 140)}`}
        canonical={`/supreme/${collection}/${handle}`}
        keywords={`${title}, Supreme ${cat?.label || ''} wholesale, Supreme dealer Neemuch`}
        jsonLd={createBreadcrumbSchema([{ name: 'Home', url: '/home' }, { name: 'Supreme', url: '/supreme' }, { name: cat?.label || '', url: '/supreme/' + collection }, { name: title, url: '/supreme/' + collection + '/' + handle }])}
      />

      <div className='min-h-screen bg-white'>
        {/* Header */}
        <div className='pt-20 md:pt-24 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <Link to='/supreme' className='hover:text-gray-700 transition-colors'>Supreme</Link>
            <span>/</span>
            {cat && (
              <>
                <Link to={`/supreme/${collection}`} className='hover:text-gray-700 transition-colors'>
                  {cat.label}
                </Link>
                <span>/</span>
              </>
            )}
            <span className='text-gray-900 truncate max-w-[200px]'>{title}</span>
          </div>
        </div>

        {/* Main Content */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16'>
          <div className='flex flex-col lg:flex-row gap-10 lg:gap-16'>
            {/* Left - Image Gallery */}
            <div className='flex-1 max-w-2xl'>
              <ProductImageZoom
                images={images.map((img) => supremeImageUrl(img.src, 1000))}
                alt={title}
                activeIndex={activeImage}
                onActiveIndexChange={setActiveImage}
                accentColor='orange'
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  const originalSrc = images[activeImage]?.src
                  if (originalSrc && target.src !== originalSrc) {
                    target.src = originalSrc
                  }
                }}
              />
            </div>

            {/* Right - Product Info */}
            <div className='flex-1 lg:max-w-md'>
              {/* Badges */}
              <div className='flex flex-wrap items-center gap-2 mb-4'>
                <span className='text-xs px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 font-medium'>
                  Supreme
                </span>
                {!isAvailable && (
                  <span className='text-xs px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-red-500 font-medium'>
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight'>
                {title}
              </h1>

              {/* SKU */}
              {sku && (
                <p className='text-xs text-gray-500 mb-4'>SKU: {sku}</p>
              )}

              {/* Colors */}
              {colorTags.length > 0 && (
                <div className='mb-6'>
                  <p className='text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2'>
                    Available Colours
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {colorTags.map((c) => (
                      <span key={c} className='text-sm px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700'>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className='mb-6 hidden md:block'>
                  <p className='text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2'>
                    Tags
                  </p>
                  <div className='flex flex-wrap gap-1.5'>
                    {product.tags
                      .filter((t) => !colorTags.includes(t) && !['lessmrp', 'abovemrp', 'instock'].includes(t.toLowerCase()))
                      .slice(0, 12)
                      .map((t) => (
                        <span key={t} className='text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600'>
                          {t}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {description && (
                <div className='mb-8 hidden md:block'>
                  <p className='text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2'>
                    Description
                  </p>
                  <p className='text-sm text-gray-600 leading-relaxed'>
                    {description}
                  </p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className='space-y-3 mb-8'>
                <a
                  href={`https://wa.me/919981516171?text=${whatsappText}`}
                  className='w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3.5 rounded-full hover:bg-gray-700 transition-colors'
                >
                  <MessageCircle className='w-5 h-5' />
                  Enquire for Price
                </a>
                <div className='flex gap-3'>
                  <a
                    href='tel:+919981516171'
                    className='flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-medium px-4 py-3 rounded-full hover:bg-gray-50 transition-colors'
                  >
                    <Phone className='w-4 h-4' />
                    Call Us
                  </a>
                  <button
                    onClick={handleShare}
                    className='inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-medium px-5 py-3 rounded-full hover:bg-gray-50 transition-colors'
                  >
                    {copied ? <Check className='w-4 h-4 text-green-500' /> : <Share2 className='w-4 h-4' />}
                    {copied ? 'Copied' : 'Share'}
                  </button>
                </div>
              </div>

              {/* Dealer Trust */}
              <div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='w-2 h-2 rounded-full bg-orange-500' />
                  <span className='text-sm font-medium text-gray-900'>Authorized Wholesale Dealer</span>
                </div>
                <p className='text-xs text-gray-500 leading-relaxed'>
                  Hari Shewa Enterprises is the Authorized Dealer of Supreme in Neemuch, MP.
                  100% genuine products with original warranty. Bulk orders and institutional supply available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className='border-t border-gray-100 py-14'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
              <div className='flex items-end justify-between mb-6'>
                <h2 className='text-xl font-bold text-gray-900'>
                  More in {cat?.label || 'this collection'}
                </h2>
                {cat && (
                  <Link
                    to={`/supreme/${collection}`}
                    className='text-sm text-orange-600 hover:text-orange-700 transition-colors inline-flex items-center gap-1'
                  >
                    View all
                    <ChevronRight className='w-3.5 h-3.5' />
                  </Link>
                )}
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {related.map((p) => {
                  const pTitle = cleanSupremeTitle(p.title)
                  const pImg = p.images[0] ? supremeImageUrl(p.images[0].src, 400) : null

                  return (
                    <Link
                      key={p.id}
                      to={`/supreme/${collection}/${p.handle}`}
                      className='group rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300'
                    >
                      <div className='aspect-square bg-white overflow-hidden'>
                        {pImg ? (
                          <img
                            src={pImg}
                            alt={pTitle}
                            className='w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500'
                            loading='lazy'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-300'>
                            <span className='text-2xl font-bold opacity-40'>{pTitle[0]}</span>
                          </div>
                        )}
                      </div>
                      <div className='p-3'>
                        <h4 className='text-xs font-medium text-gray-800 leading-snug line-clamp-2'>{pTitle}</h4>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Back to Collection */}
        <section className='border-t border-gray-100 py-10'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link
              to={cat ? `/supreme/${collection}` : '/supreme'}
              className='inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to {cat?.label || 'Supreme'}
            </Link>
            <a
              href={`https://wa.me/919981516171?text=${whatsappText}`}
              className='inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-gray-700 transition-colors text-sm'
            >
              <MessageCircle className='w-4 h-4' />
              Enquire for Price
            </a>
          </div>
        </section>

        <Footer variant='dark' />
      </div>
    </>
  )
}
