import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Phone, ChevronRight, Share2, Check } from 'lucide-react'
import Footer from '@/src/components/Footer'
import ProductImageZoom from '@/src/components/ProductImageZoom'
import SEO, { createBreadcrumbSchema, createProductSchema } from '@/src/components/SEO'
import { getCategoryBySlug, getCategoryByEnum, isParticleBoardCategory } from '@/src/lib/categories'
import ProductColourCatalogue from '@/src/components/ProductColourCatalogue'
import {
  fetchProductWithVariants,
  fetchProducts,
  type CatalogProduct,
  type ProductWithVariants,
} from '@/src/lib/supabase'

export default function MVMProduct() {
  const { collection, slug } = useParams<{ collection: string; slug: string }>()
  const [productData, setProductData] = useState<ProductWithVariants | null>(null)
  const [related, setRelated] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showHindi, setShowHindi] = useState(false)
  const imageColRef = useRef<HTMLDivElement>(null)
  const [imageColHeight, setImageColHeight] = useState<number | null>(null)

  useEffect(() => {
    const el = imageColRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      setImageColHeight(entries[0].contentRect.height)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [loading])

  const cat = collection ? getCategoryBySlug(collection) : undefined
  const product = productData

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setActiveImage(0)

    fetchProductWithVariants(slug).then((found) => {
      setProductData(found)
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
      <div className='min-h-screen bg-white flex items-center justify-center pt-16'>
        <div className='w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin' />
      </div>
    )
  }

  if (!product) {
    return (
      <div className='min-h-screen bg-white flex flex-col items-center justify-center pt-16 px-4'>
        <p className='text-gray-400 text-lg mb-4'>Product not found</p>
        <Link
          to={cat ? `/mvm/${collection}` : '/mvm'}
          className='inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to {cat?.label || 'MVM Aasanam'}
        </Link>
      </div>
    )
  }

  const productCategory = getCategoryByEnum(product.category || '')

  // Detect mesh-back chairs by product name only — materials metadata can be unreliable
  const isMeshBack = /\bmesh\b/i.test(product.name || '')

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

      <div className='min-h-screen bg-white'>
        {/* Header */}
        <div className='pt-20 md:pt-[116px] pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <Link to='/mvm' className='hover:text-gray-700 transition-colors'>MVM Aasanam</Link>
            <span>/</span>
            {cat && (
              <>
                <Link to={`/mvm/${collection}`} className='hover:text-gray-700 transition-colors'>
                  {cat.label}
                </Link>
                <span>/</span>
              </>
            )}
            <span className='text-gray-700 truncate max-w-[200px]'>{product.name}</span>
          </div>
        </div>

        {/* Main Content */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16'>
          <div className='flex flex-col lg:flex-row gap-10 lg:gap-16 lg:items-start'>
            {/* Left - Image Gallery — ref so we can measure its rendered height */}
            <div className='flex-1 max-w-2xl' ref={imageColRef}>
              <ProductImageZoom
                images={images}
                alt={product.name || 'Product'}
                activeIndex={activeImage}
                onActiveIndexChange={setActiveImage}
                accentColor='amber'
              />
            </div>

            {/* Right - Product Info — height locked to image column, scrolls internally */}
            <div
              className='flex-1 lg:max-w-md lg:overflow-y-auto lg:pr-1'
              style={imageColHeight ? { maxHeight: imageColHeight } : undefined}
            >
              {/* Badges */}
              <div className='flex flex-wrap items-center gap-2 mb-4'>
                <span className='text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium'>
                  MVM Aasanam
                </span>
                {productCategory && (
                  <span className='text-xs px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-400 font-medium'>
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
              <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight'>
                {product.name}
              </h1>

              {/* Color variant selector — shows when this product family has variants */}
              {(() => {
                if (!productData) return null
                // Family = parent + all variants. The current product is one of them.
                const parentInFamily = productData.parent || product
                const familyMembers: CatalogProduct[] = [parentInFamily, ...productData.variants]
                if (familyMembers.length <= 1) return null

                const currentSlug = product.slug

                return (
                  <div className='mb-6'>
                    <p className='text-xs font-semibold tracking-wider uppercase text-amber-400 mb-3'>
                      Available in {familyMembers.length} colour{familyMembers.length > 1 ? 's' : ''}
                    </p>
                    <div className='flex flex-wrap gap-2.5'>
                      {familyMembers.map((member) => {
                        const isActive = member.slug === currentSlug
                        // Parent has no color of its own — show as the "default" with a neutral circle.
                        const swatchHex = member.color_hex || '#9CA3AF'
                        const label = member.color_name || 'Original'
                        const memberSlug = member.slug || String(member.id)
                        return (
                          <Link
                            key={member.id}
                            to={`/mvm/${collection}/${memberSlug}`}
                            title={label}
                            className={`group flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border transition-all ${
                              isActive
                                ? 'border-amber-400 bg-amber-500/10'
                                : 'border-gray-200 hover:border-gray-400 bg-gray-50'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full border-2 ${
                                isActive ? 'border-amber-400' : 'border-gray-200'
                              }`}
                              style={{ backgroundColor: swatchHex }}
                            />
                            <span className={`text-xs ${isActive ? 'text-amber-600 font-medium' : 'text-gray-700'}`}>
                              {label}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

              {/* Colors - only for NON particle board */}
              {colors.length > 0 && !isParticleBoardCategory(product.category || '') && (
                <div className='mb-6'>
                  <p className='text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2'>
                    Available Colours
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {colors.map((c) => (
                      <span key={c.name} className='text-sm px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-700 inline-flex items-center gap-2'>
                        <span className='w-3 h-3 rounded-full border border-white/20' style={{ backgroundColor: c.hex }} />
                        {c.name}
                      </span>
                    ))}
                  </div>
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
                      <span key={m} className='text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500'>
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
                  <ul className='space-y-2'>
                    {features.map((f) => (
                      <li key={f.label} className='flex items-start gap-2'>
                        <span className='text-amber-500 shrink-0 mt-1 leading-none'>•</span>
                        <span className='text-sm text-gray-700 leading-snug'>
                          <span className='font-medium text-gray-900'>{f.label}</span>
                          {f.detail && <span className='text-gray-500'> — {f.detail}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
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
                              !showHindi ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            EN
                          </button>
                          <button
                            onClick={() => setShowHindi(true)}
                            className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                              showHindi ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-100 text-gray-500'
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
                  className='w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3.5 rounded-full hover:bg-gray-800 transition-colors'
                >
                  <MessageCircle className='w-5 h-5' />
                  Enquire for Factory-Direct Price
                </a>
                <div className='flex gap-3'>
                  <a
                    href='tel:+919981516171'
                    className='flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-900 font-medium px-4 py-3 rounded-full hover:bg-gray-100 transition-colors'
                  >
                    <Phone className='w-4 h-4' />
                    Call Us
                  </a>
                  <button
                    onClick={handleShare}
                    className='inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-900 font-medium px-5 py-3 rounded-full hover:bg-gray-100 transition-colors'
                  >
                    {copied ? <Check className='w-4 h-4 text-green-400' /> : <Share2 className='w-4 h-4' />}
                    {copied ? 'Copied' : 'Share'}
                  </button>
                </div>
              </div>

              {/* Manufacturer Trust */}
              <div className='rounded-xl border border-gray-100 bg-gray-50 p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='w-2 h-2 rounded-full bg-amber-400' />
                  <span className='text-sm font-medium text-gray-900'>Manufactured by Hari Shewa Enterprises</span>
                </div>
                <p className='text-xs text-gray-500 leading-relaxed'>
                  MVM Aasanam — Premium furniture made in Neemuch, Madhya Pradesh.
                  Factory-direct pricing with ISO certified quality. Bulk orders and institutional supply available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Colour catalogue — shown for seating categories that support upholstery customisation */}
        <ProductColourCatalogue category={product.category || ''} isMeshBack={isMeshBack} />

        {/* Related Products */}
        {related.length > 0 && (
          <section className='border-t border-gray-100 py-14'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
              <div className='flex items-end justify-between mb-6'>
                <h2 className='text-xl font-bold text-gray-900'>
                  More in {cat?.label || productCategory?.label || 'this collection'}
                </h2>
                {cat && (
                  <Link
                    to={`/mvm/${collection}`}
                    className='text-sm text-amber-600 hover:text-amber-700 transition-colors inline-flex items-center gap-1'
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
                      className='group rounded-2xl bg-gray-50 overflow-hidden hover:bg-gray-100 transition-all duration-300'
                    >
                      <div className='aspect-square bg-gray-50 overflow-hidden'>
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
                        <h4 className='text-xs font-medium text-gray-800 leading-snug line-clamp-2'>{p.name}</h4>
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
              to={cat ? `/mvm/${collection}` : '/mvm'}
              className='inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to {cat?.label || 'MVM Aasanam'}
            </Link>
            <a
              href={`https://wa.me/919981516171?text=${whatsappText}`}
              className='inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors text-sm'
            >
              <MessageCircle className='w-4 h-4' />
              Get Factory-Direct Price
            </a>
          </div>
        </section>

        <Footer variant='light' />
      </div>
    </>
  )
}
