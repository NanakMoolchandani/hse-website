import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Phone, ChevronLeft, ChevronRight, Share2, Check } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import {
  fetchNilkamalCollection,
  cleanProductTitle,
  nilkamalImageUrl,
  stripHtml,
  extractColorTags,
  getNilkamalCollection,
  type NilkamalProduct as NilkamalProductType,
} from '@/src/lib/nilkamal'

export default function NilkamalProduct() {
  const { collection, handle } = useParams<{ collection: string; handle: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<NilkamalProductType | null>(null)
  const [related, setRelated] = useState<NilkamalProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [copied, setCopied] = useState(false)

  const cat = collection ? getNilkamalCollection(collection) : undefined

  useEffect(() => {
    if (!handle || !collection) return
    setLoading(true)
    setActiveImage(0)

    // Fetch the full collection and find the product by handle
    // (Shopify's single-product .json endpoint is not available on all stores)
    fetchNilkamalCollection(collection).then((all) => {
      const found = all.find((p) => p.handle === handle) || null
      setProduct(found)
      setRelated(found ? all.filter((p) => p.id !== found.id).slice(0, 4) : [])
      setLoading(false)
    })
  }, [handle, collection])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: product?.title || 'Nilkamal Product', url })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-950 flex items-center justify-center pt-16'>
        <div className='w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin' />
      </div>
    )
  }

  if (!product) {
    return (
      <div className='min-h-screen bg-gray-950 flex flex-col items-center justify-center pt-16 px-4'>
        <p className='text-gray-400 text-lg mb-4'>Product not found</p>
        <Link
          to={cat ? `/nilkamal/${collection}` : '/nilkamal'}
          className='inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to {cat?.label || 'Nilkamal'}
        </Link>
      </div>
    )
  }

  const title = cleanProductTitle(product.title)
  const description = product.body_html ? stripHtml(product.body_html) : ''
  const images = product.images || []
  const colorTags = extractColorTags(product.tags)
  const isAvailable = product.variants.some((v) => v.available)
  const sku = product.variants[0]?.sku || ''

  const whatsappText = encodeURIComponent(
    `Hi, I'm interested in the ${product.title}. Please share wholesale pricing and availability.`,
  )

  return (
    <>
      <SEO
        title={`${title} | Nilkamal - Hari Shewa Enterprises`}
        description={`Buy ${title} at wholesale price from Hari Shewa Enterprises, Authorized Nilkamal Dealer in Neemuch. ${description.slice(0, 140)}`}
        canonical={`/nilkamal/${collection}/${handle}`}
        keywords={`${title}, Nilkamal ${cat?.label || ''} wholesale, Nilkamal dealer Neemuch`}
        jsonLd={createBreadcrumbSchema([{ name: 'Home', url: '/home' }, { name: 'Nilkamal', url: '/nilkamal' }, { name: cat?.label || '', url: '/nilkamal/' + collection }, { name: title, url: '/nilkamal/' + collection + '/' + handle }])}
      />

      <div className='min-h-screen bg-gray-950'>
        {/* Header */}
        <div className='pt-20 md:pt-24 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <Link to='/nilkamal' className='hover:text-gray-300 transition-colors'>Nilkamal</Link>
            <span>/</span>
            {cat && (
              <>
                <Link to={`/nilkamal/${collection}`} className='hover:text-gray-300 transition-colors'>
                  {cat.label}
                </Link>
                <span>/</span>
              </>
            )}
            <span className='text-gray-300 truncate max-w-[200px]'>{title}</span>
          </div>
        </div>

        {/* Main Content */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16'>
          <div className='flex flex-col lg:flex-row gap-10 lg:gap-16'>
            {/* Left - Image Gallery */}
            <div className='flex-1 max-w-2xl'>
              {/* Main Image */}
              <div className='relative aspect-square rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden mb-4'>
                {images.length > 0 ? (
                  <img
                    src={nilkamalImageUrl(images[activeImage].src, 1000)}
                    alt={`${title} - Image ${activeImage + 1}`}
                    className='w-full h-full object-contain p-6'
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      if (target.src !== images[activeImage].src) {
                        target.src = images[activeImage].src
                      }
                    }}
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-gray-700'>
                    <span className='text-6xl font-bold opacity-10'>{title[0]}</span>
                  </div>
                )}

                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                      className='absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors'
                    >
                      <ChevronLeft className='w-5 h-5' />
                    </button>
                    <button
                      onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors'
                    >
                      <ChevronRight className='w-5 h-5' />
                    </button>
                    <div className='absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full'>
                      {activeImage + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className='flex gap-2 overflow-x-auto pb-2'>
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        i === activeImage
                          ? 'border-blue-500 ring-1 ring-blue-500/30'
                          : 'border-white/10 hover:border-white/25'
                      }`}
                    >
                      <img
                        src={nilkamalImageUrl(img.src, 100)}
                        alt={`${title} thumbnail ${i + 1}`}
                        className='w-full h-full object-contain p-1'
                        loading='lazy'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          if (target.src !== img.src) target.src = img.src
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Product Info */}
            <div className='flex-1 lg:max-w-md'>
              {/* Badges */}
              <div className='flex flex-wrap items-center gap-2 mb-4'>
                <span className='text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium'>
                  Nilkamal
                </span>
                {!isAvailable && (
                  <span className='text-xs px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-medium'>
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className='text-2xl md:text-3xl font-bold text-white mb-3 leading-tight'>
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
                      <span key={c} className='text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300'>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className='mb-6'>
                  <p className='text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2'>
                    Tags
                  </p>
                  <div className='flex flex-wrap gap-1.5'>
                    {product.tags
                      .filter((t) => !colorTags.includes(t) && !['lessmrp', 'abovemrp', 'instock'].includes(t.toLowerCase()))
                      .slice(0, 12)
                      .map((t) => (
                        <span key={t} className='text-xs px-2 py-0.5 rounded-full bg-white/[0.04] text-gray-400'>
                          {t}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {description && (
                <div className='mb-8'>
                  <p className='text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2'>
                    Description
                  </p>
                  <p className='text-sm text-gray-400 leading-relaxed'>
                    {description}
                  </p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className='space-y-3 mb-8'>
                <a
                  href={`https://wa.me/919981516171?text=${whatsappText}`}
                  className='w-full inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3.5 rounded-full hover:bg-gray-100 transition-colors'
                >
                  <MessageCircle className='w-5 h-5' />
                  Enquire for Wholesale Price
                </a>
                <div className='flex gap-3'>
                  <a
                    href='tel:+919981516171'
                    className='flex-1 inline-flex items-center justify-center gap-2 border border-white/15 text-white font-medium px-4 py-3 rounded-full hover:bg-white/5 transition-colors'
                  >
                    <Phone className='w-4 h-4' />
                    Call Us
                  </a>
                  <button
                    onClick={handleShare}
                    className='inline-flex items-center justify-center gap-2 border border-white/15 text-white font-medium px-5 py-3 rounded-full hover:bg-white/5 transition-colors'
                  >
                    {copied ? <Check className='w-4 h-4 text-green-400' /> : <Share2 className='w-4 h-4' />}
                    {copied ? 'Copied' : 'Share'}
                  </button>
                </div>
              </div>

              {/* Dealer Trust */}
              <div className='rounded-xl border border-white/5 bg-white/[0.02] p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='w-2 h-2 rounded-full bg-blue-400' />
                  <span className='text-sm font-medium text-white'>Authorized Wholesale Dealer</span>
                </div>
                <p className='text-xs text-gray-500 leading-relaxed'>
                  Hari Shewa Enterprises is the Authorized Dealer of Nilkamal in Neemuch, MP.
                  100% genuine products with original warranty. Bulk orders and institutional supply available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className='border-t border-white/5 py-14'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
              <div className='flex items-end justify-between mb-6'>
                <h2 className='text-xl font-bold text-white'>
                  More in {cat?.label || 'this collection'}
                </h2>
                {cat && (
                  <Link
                    to={`/nilkamal/${collection}`}
                    className='text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1'
                  >
                    View all
                    <ChevronRight className='w-3.5 h-3.5' />
                  </Link>
                )}
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {related.map((p) => {
                  const pTitle = cleanProductTitle(p.title)
                  const pImg = p.images[0] ? nilkamalImageUrl(p.images[0].src, 400) : null

                  return (
                    <Link
                      key={p.id}
                      to={`/nilkamal/${collection}/${p.handle}`}
                      className='group rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden hover:border-white/15 transition-all duration-300'
                    >
                      <div className='aspect-square bg-white/[0.02] overflow-hidden'>
                        {pImg ? (
                          <img
                            src={pImg}
                            alt={pTitle}
                            className='w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500'
                            loading='lazy'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-700'>
                            <span className='text-2xl font-bold opacity-20'>{pTitle[0]}</span>
                          </div>
                        )}
                      </div>
                      <div className='p-3'>
                        <h4 className='text-xs font-medium text-white leading-snug line-clamp-2'>{pTitle}</h4>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Back to Collection */}
        <section className='border-t border-white/5 py-10'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link
              to={cat ? `/nilkamal/${collection}` : '/nilkamal'}
              className='inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to {cat?.label || 'Nilkamal'}
            </Link>
            <a
              href={`https://wa.me/919981516171?text=${whatsappText}`}
              className='inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors text-sm'
            >
              <MessageCircle className='w-4 h-4' />
              Get Wholesale Price
            </a>
          </div>
        </section>

        <Footer variant='dark' />
      </div>
    </>
  )
}
