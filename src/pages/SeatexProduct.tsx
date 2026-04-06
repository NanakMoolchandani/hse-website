import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Phone, ChevronRight, Share2, Check } from 'lucide-react'
import Footer from '@/src/components/Footer'
import ProductImageZoom from '@/src/components/ProductImageZoom'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import {
  fetchSeatexCollection,
  cleanSeatexTitle,
  stripSeatexHtml,
  getSeatexCollection,
  type SeatexProduct as SeatexProductType,
} from '@/src/lib/seatex'

export default function SeatexProduct() {
  const { collection, handle } = useParams<{ collection: string; handle: string }>()
  const [product, setProduct] = useState<SeatexProductType | null>(null)
  const [related, setRelated] = useState<SeatexProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const cat = collection ? getSeatexCollection(collection) : undefined

  useEffect(() => {
    if (!handle || !collection) return
    setLoading(true)

    fetchSeatexCollection(collection).then((all) => {
      const found = all.find((p) => p.handle === handle) || null
      setProduct(found)
      setRelated(found ? all.filter((p) => p.id !== found.id).slice(0, 4) : [])
      setLoading(false)
    })
  }, [handle, collection])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: product?.title || 'Seatex Product', url })
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
          to={cat ? `/seatex/${collection}` : '/seatex'}
          className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to {cat?.label || 'Seatex'}
        </Link>
      </div>
    )
  }

  const title = cleanSeatexTitle(product.title)
  const description = product.body_html ? stripSeatexHtml(product.body_html) : ''
  const colorVariants = product.variants || []

  const whatsappText = encodeURIComponent(
    `Hi, I'm interested in the Seatex ${title}. Please share wholesale pricing and availability.`,
  )

  return (
    <>
      <SEO
        title={`${title} | Seatex - Hari Shewa Enterprises`}
        description={`Buy Seatex ${title} at wholesale price from Hari Shewa Enterprises, Authorized Seatex Dealer in Neemuch. ${description.slice(0, 140)}`}
        canonical={`/seatex/${collection}/${handle}`}
        keywords={`Seatex ${title}, Seatex ${cat?.label || ''} wholesale, Seatex dealer Neemuch`}
        jsonLd={createBreadcrumbSchema([{ name: 'Home', url: '/home' }, { name: 'Seatex', url: '/seatex' }, { name: cat?.label || '', url: '/seatex/' + collection }, { name: title, url: '/seatex/' + collection + '/' + handle }])}
      />

      <div className='min-h-screen bg-gray-950'>
        {/* Header */}
        <div className='pt-20 md:pt-24 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <Link to='/seatex' className='hover:text-gray-300 transition-colors'>Seatex</Link>
            <span>/</span>
            {cat && (
              <>
                <Link to={`/seatex/${collection}`} className='hover:text-gray-300 transition-colors'>
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
            {/* Left - Image */}
            <div className='flex-1 max-w-2xl'>
              <ProductImageZoom
                images={product.images.map((img) => img.src).filter(Boolean)}
                alt={title}
                activeIndex={0}
                onActiveIndexChange={() => {}}
                accentColor='emerald'
              />
            </div>

            {/* Right - Product Info */}
            <div className='flex-1 lg:max-w-md'>
              {/* Badges */}
              <div className='flex flex-wrap items-center gap-2 mb-4'>
                <span className='text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium'>
                  Seatex
                </span>
              </div>

              {/* Title */}
              <h1 className='text-2xl md:text-3xl font-bold text-white mb-3 leading-tight'>
                {title}
              </h1>

              {/* Available Colours */}
              {colorVariants.length > 0 && (
                <div className='mb-6'>
                  <p className='text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2'>
                    Available Colours
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {colorVariants.map((v) => (
                      <span key={v.id} className='text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300'>
                        {v.title}
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
                  Enquire for Price
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
                  <span className='w-2 h-2 rounded-full bg-emerald-400' />
                  <span className='text-sm font-medium text-white'>Authorized Wholesale Dealer</span>
                </div>
                <p className='text-xs text-gray-500 leading-relaxed'>
                  Hari Shewa Enterprises is the Authorized Dealer of Seatex in Neemuch, MP.
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
                    to={`/seatex/${collection}`}
                    className='text-sm text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1'
                  >
                    View all
                    <ChevronRight className='w-3.5 h-3.5' />
                  </Link>
                )}
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {related.map((p) => {
                  const pTitle = cleanSeatexTitle(p.title)
                  const pImg = p.images[0]?.src || null

                  return (
                    <Link
                      key={p.id}
                      to={`/seatex/${collection}/${p.handle}`}
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
              to={cat ? `/seatex/${collection}` : '/seatex'}
              className='inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to {cat?.label || 'Seatex'}
            </Link>
            <a
              href={`https://wa.me/919981516171?text=${whatsappText}`}
              className='inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors text-sm'
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
