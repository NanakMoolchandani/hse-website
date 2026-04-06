import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Phone, ChevronRight, Share2, Check } from 'lucide-react'
import Footer from '@/src/components/Footer'
import ProductImageZoom from '@/src/components/ProductImageZoom'
import SEO, { createBreadcrumbSchema, createProductSchema } from '@/src/components/SEO'
import { getCategoryBySlug, getCategoryByEnum, isParticleBoardCategory } from '@/src/lib/categories'
import { fetchProduct, fetchProducts, type CatalogProduct } from '@/src/lib/supabase'
import { FABRIC_COLORS, LEATHERETTE_COLORS, isCushionedChair } from '@/src/lib/customization-colors'

export default function MVMProduct() {
  const { collection, slug } = useParams<{ collection: string; slug: string }>()
  const [product, setProduct] = useState<CatalogProduct | null>(null)
  const [related, setRelated] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showHindi, setShowHindi] = useState(false)

  const cat = collection ? getCategoryBySlug(collection) : undefined

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setActiveImage(0)

    fetchProduct(slug).then((found) => {
      setProduct(found)
      setLoading(false)

      if (found?.category) {
        fetchProducts(found.category).then((all) => {
          setRelated(all.filter((p) => p.slug !== slug).slice(0, 4))
        })
      }
    })
  }, [slug])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: product?.name || 'MVM Aasanam Product', url })
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
          to={cat ? `/mvm/${collection}` : '/mvm'}
          className='inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to {cat?.label || 'MVM Aasanam'}
        </Link>
      </div>
    )
  }

  const productCategory = getCategoryByEnum(product.category || '')
  const images = product.processed_photo_urls?.length > 0
    ? product.processed_photo_urls
    : product.raw_photo_urls || []
  const features = product.metadata?.features || []
  const colors = product.metadata?.colors || []
  const materials = product.metadata?.materials || []

  const whatsappText = encodeURIComponent(
    `Hi, I'm interested in the ${product.name}. Please share factory-direct pricing and availability.`,
  )

  return (
    <>
      <SEO
        title={`${product.name} | MVM Aasanam - Hari Shewa Enterprises`}
        description={`Buy ${product.name} at factory-direct price from MVM Aasanam (Hari Shewa Enterprises), Neemuch. ${product.description?.slice(0, 140) || ''}`}
        canonical={`/mvm/${collection}/${slug}`}
        ogImage={images[0] || undefined}
        ogType="product"
        keywords={`${product.name}, MVM Aasanam ${cat?.label || ''}, office furniture manufacturer Neemuch`}
        jsonLd={[createBreadcrumbSchema([{ name: 'Home', url: '/home' }, { name: 'MVM Aasanam', url: '/mvm' }, { name: cat?.label || '', url: '/mvm/' + collection }, { name: product.name || '', url: '/mvm/' + collection + '/' + slug }]), createProductSchema(product)]}
      />

      <div className='min-h-screen bg-gray-950'>
        {/* Header */}
        <div className='pt-20 md:pt-24 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <Link to='/mvm' className='hover:text-gray-300 transition-colors'>MVM Aasanam</Link>
            <span>/</span>
            {cat && (
              <>
                <Link to={`/mvm/${collection}`} className='hover:text-gray-300 transition-colors'>
                  {cat.label}
                </Link>
                <span>/</span>
              </>
            )}
            <span className='text-gray-300 truncate max-w-[200px]'>{product.name}</span>
          </div>
        </div>

        {/* Main Content */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16'>
          <div className='flex flex-col lg:flex-row gap-10 lg:gap-16'>
            {/* Left - Image Gallery */}
            <div className='flex-1 max-w-2xl'>
              <ProductImageZoom
                images={images}
                alt={product.name || 'Product'}
                activeIndex={activeImage}
                onActiveIndexChange={setActiveImage}
                accentColor='amber'
              />
            </div>

            {/* Right - Product Info */}
            <div className='flex-1 lg:max-w-md'>
              {/* Badges */}
              <div className='flex flex-wrap items-center gap-2 mb-4'>
                <span className='text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium'>
                  MVM Aasanam
                </span>
                {productCategory && (
                  <span className='text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 font-medium'>
                    {productCategory.series}
                  </span>
                )}
                {product.is_featured && (
                  <span className='text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium'>
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className='text-2xl md:text-3xl font-bold text-white mb-3 leading-tight'>
                {product.name}
              </h1>

              {/* Colors - only for NON particle board */}
              {colors.length > 0 && !isParticleBoardCategory(product.category || '') && (
                <div className='mb-6'>
                  <p className='text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2'>
                    Available Colours
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {colors.map((c) => (
                      <span key={c.name} className='text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 inline-flex items-center gap-2'>
                        <span className='w-3 h-3 rounded-full border border-white/20' style={{ backgroundColor: c.hex }} />
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Colour Customisation - only for cushioned chairs, NEVER particle board */}
              {!isParticleBoardCategory(product.category || '') && isCushionedChair(product.category || '', materials, features) && (
                <div className='mb-6'>
                  <p className='text-xs font-semibold tracking-wider uppercase text-amber-400 mb-3'>
                    Colour Customisation
                  </p>

                  {/* Fabric */}
                  <p className='text-[10px] font-semibold tracking-wider uppercase text-gray-500 mb-2'>
                    Fabric Options
                  </p>
                  <div className='flex flex-wrap gap-1.5 mb-4'>
                    {FABRIC_COLORS.map((c) => (
                      <span
                        key={c.name}
                        title={c.name}
                        className='w-6 h-6 rounded-full border border-white/15 hover:scale-125 transition-transform cursor-default'
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>

                  {/* Leatherette */}
                  <p className='text-[10px] font-semibold tracking-wider uppercase text-gray-500 mb-2'>
                    Leatherette Options
                  </p>
                  <div className='flex flex-wrap gap-1.5 mb-3'>
                    {LEATHERETTE_COLORS.map((c) => (
                      <span
                        key={c.name}
                        title={c.name}
                        className='w-6 h-6 rounded-full border border-white/15 hover:scale-125 transition-transform cursor-default'
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>

                  <p className='text-xs text-amber-400/70 italic'>
                    Customisation available as per customer's requirement. Contact us for specific colour samples.
                  </p>
                </div>
              )}

              {/* Materials - only for NON particle board */}
              {materials.length > 0 && !isParticleBoardCategory(product.category || '') && (
                <div className='mb-6'>
                  <p className='text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2'>
                    Materials
                  </p>
                  <div className='flex flex-wrap gap-1.5'>
                    {materials.map((m) => (
                      <span key={m} className='text-xs px-2 py-0.5 rounded-full bg-white/[0.04] text-gray-400'>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features - shown separately only for NON particle board */}
              {features.length > 0 && !isParticleBoardCategory(product.category || '') && (
                <div className='mb-6'>
                  <p className='text-xs font-semibold tracking-wider uppercase text-gray-500 mb-3'>
                    Key Features
                  </p>
                  <div className='space-y-3'>
                    {features.map((f, i) => (
                      <div key={f.label} className='flex items-start gap-3'>
                        <span className='w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5'>
                          {i + 1}
                        </span>
                        <div>
                          <p className='text-sm text-white font-medium'>{f.label}</p>
                          {f.detail && <p className='text-xs text-gray-500 mt-0.5 leading-relaxed'>{f.detail}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description - for particle board: combine features into bullet points */}
              {(() => {
                const isBoard = isParticleBoardCategory(product.category || '')
                const descText = showHindi ? product.description_hindi : product.description
                const hasDesc = descText || product.description_hindi

                // Build bullet points for particle board: description lines + features
                const bullets: string[] = []
                if (isBoard) {
                  if (descText) {
                    // Split description by sentences or bullet markers
                    descText.split(/[.•\n]/).forEach((s) => {
                      const trimmed = s.trim()
                      if (trimmed.length > 5) bullets.push(trimmed)
                    })
                  }
                  features.forEach((f) => {
                    const text = f.detail ? `${f.label} — ${f.detail}` : f.label
                    if (!bullets.some((b) => b.toLowerCase().includes(f.label.toLowerCase()))) {
                      bullets.push(text)
                    }
                  })
                }

                if (!hasDesc && bullets.length === 0) return null

                return (
                  <div className='mb-8'>
                    <div className='flex items-center gap-2 mb-2'>
                      <p className='text-xs font-semibold tracking-wider uppercase text-gray-500'>
                        Description
                      </p>
                      {!isBoard && product.description_hindi && (
                        <div className='flex gap-1'>
                          <button
                            onClick={() => setShowHindi(false)}
                            className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                              !showHindi ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-500'
                            }`}
                          >
                            EN
                          </button>
                          <button
                            onClick={() => setShowHindi(true)}
                            className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                              showHindi ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-500'
                            }`}
                          >
                            HI
                          </button>
                        </div>
                      )}
                    </div>
                    {isBoard && bullets.length > 0 ? (
                      <ul className='space-y-1.5'>
                        {bullets.map((b, i) => (
                          <li key={i} className='flex items-start gap-2 text-sm text-gray-400 leading-relaxed'>
                            <span className='text-amber-500 mt-1 shrink-0'>&#8226;</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-sm text-gray-400 leading-relaxed'>
                        {descText}
                      </p>
                    )}
                  </div>
                )
              })()}

              {/* CTA Buttons */}
              <div className='space-y-3 mb-8'>
                <a
                  href={`https://wa.me/919981516171?text=${whatsappText}`}
                  className='w-full inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3.5 rounded-full hover:bg-gray-100 transition-colors'
                >
                  <MessageCircle className='w-5 h-5' />
                  Enquire for Factory-Direct Price
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

              {/* Manufacturer Trust */}
              <div className='rounded-xl border border-white/5 bg-white/[0.02] p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='w-2 h-2 rounded-full bg-amber-400' />
                  <span className='text-sm font-medium text-white'>Manufactured by Hari Shewa Enterprises</span>
                </div>
                <p className='text-xs text-gray-500 leading-relaxed'>
                  MVM Aasanam — Premium furniture made in Neemuch, Madhya Pradesh.
                  Factory-direct pricing with ISO certified quality. Bulk orders and institutional supply available.
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
                  More in {cat?.label || productCategory?.label || 'this collection'}
                </h2>
                {cat && (
                  <Link
                    to={`/mvm/${collection}`}
                    className='text-sm text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1'
                  >
                    View all
                    <ChevronRight className='w-3.5 h-3.5' />
                  </Link>
                )}
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {related.map((p) => {
                  const pImg = p.processed_photo_urls?.[0]
                    || p.raw_photo_urls?.[0]
                    || null
                  const pCat = getCategoryByEnum(p.category || '')

                  return (
                    <Link
                      key={p.id}
                      to={`/mvm/${pCat?.slug || collection}/${p.slug}`}
                      className='group rounded-2xl bg-white/[0.03] overflow-hidden hover:bg-white/[0.06] transition-all duration-300'
                    >
                      <div className='aspect-square bg-white/[0.02] overflow-hidden'>
                        {pImg ? (
                          <img
                            src={pImg}
                            alt={p.name || 'Product'}
                            className='w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500'
                            loading='lazy'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-700'>
                            <span className='text-2xl font-bold opacity-20'>{(p.name || 'P')[0]}</span>
                          </div>
                        )}
                      </div>
                      <div className='p-3'>
                        <h4 className='text-xs font-medium text-white leading-snug line-clamp-2'>{p.name}</h4>
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
              to={cat ? `/mvm/${collection}` : '/mvm'}
              className='inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to {cat?.label || 'MVM Aasanam'}
            </Link>
            <a
              href={`https://wa.me/919981516171?text=${whatsappText}`}
              className='inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors text-sm'
            >
              <MessageCircle className='w-4 h-4' />
              Get Factory-Direct Price
            </a>
          </div>
        </section>

        <Footer variant='dark' />
      </div>
    </>
  )
}
