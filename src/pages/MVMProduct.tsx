import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Phone, ChevronRight, Share2, Check } from 'lucide-react'
import Footer from '@/src/components/Footer'
import ProductGallery from '@/src/components/ProductGallery'
import SEO, { createBreadcrumbSchema, createProductSchema } from '@/src/components/SEO'
import { getCategoryBySlug, getCategoryByEnum, isParticleBoardCategory } from '@/src/lib/categories'
import ProductColourCatalogue from '@/src/components/ProductColourCatalogue'
import BuyBox from '@/src/components/BuyBox'
import { trackProductView } from '@/src/lib/analytics'
import {
  fetchProductWithVariants,
  fetchProducts,
  type CatalogProduct,
  type ProductWithVariants,
} from '@/src/lib/supabase'

/**
 * One line about the chair, and nothing more.
 *
 * The catalogue descriptions run 1,200 to 1,400 characters of dense bullets
 * about channel stitching and lumbar bridge contours. Nobody buying a chair
 * reads that, and printed in full it pushed the price and the buy button off
 * the bottom of the screen. So: take the opening bullet, cut it at a natural
 * break, and stop. The specs that matter are already listed underneath as
 * materials and key features, where they can be scanned rather than read.
 */
/**
 * A material named, not described.
 *
 * The catalogue writes these as "Thing with qualities": "Soft-Touch Padded
 * Upholstery Fabric with Diamond-Stitch Pattern". Everything after "with" is
 * the same information the photograph already gives, and eight of these turned
 * a row of chips into a paragraph. The full string stays on the `title`, so
 * nothing is lost, it is just not shouted.
 */
function shortMaterial(text: string): string {
  const cut = text.split(/\s+with\s+/i)[0].trim()
  return cut.length >= 8 ? cut : text
}

function shortDescription(text: string | null | undefined, limit = 150): string {
  if (!text) return ''
  const first = text
    .split(/[\n•]/)
    .map((s) => s.trim())
    .find((s) => s.length > 20)
  if (!first) return ''

  const clean = first.replace(/\s+/g, ' ').trim()
  if (clean.length <= limit) return end(clean)

  // Prefer a comma to a bare word break: cutting a list at one of its own
  // separators sounds finished, cutting it mid-clause sounds truncated.
  const cut = clean.slice(0, limit)
  const comma = cut.lastIndexOf(', ')
  const space = cut.lastIndexOf(' ')
  const at = comma > limit * 0.5 ? comma : space
  return end(cut.slice(0, at > 0 ? at : limit))
}

/** Close the sentence. A line that simply stops reads as a loading failure. */
function end(text: string): string {
  const trimmed = text.replace(/[\s,;:]+$/, '')
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
}

export default function MVMProduct() {
  const { collection, slug } = useParams<{ collection: string; slug: string }>()
  const [productData, setProductData] = useState<ProductWithVariants | null>(null)
  const [related, setRelated] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showHindi, setShowHindi] = useState(false)
  // ID of the colour variant currently displayed. null = parent/default.
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)

  const cat = collection ? getCategoryBySlug(collection) : undefined
  const product = productData

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setActiveImage(0)
    setSelectedVariantId(null)

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

  // Must be before any early returns: Rules of Hooks
  useEffect(() => { setActiveImage(0) }, [selectedVariantId])

  // The event the product-level funnel is built from. Fired on the product,
  // not on the variant: switching swatch is browsing one chair, not viewing a
  // second one, and counting it twice would inflate every view-to-cart rate.
  useEffect(() => {
    if (productData) trackProductView(undefined, productData.name ?? undefined)
  }, [productData])

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
      <div className='min-h-screen bg-white flex items-center justify-center pt-32 md:pt-40'>
        <div className='w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin' />
      </div>
    )
  }

  if (!product) {
    return (
      <div className='min-h-screen bg-white flex flex-col items-center justify-center pt-32 md:pt-40 px-4'>
        <p className='text-gray-500 text-lg mb-4'>Product not found</p>
        <Link
          to='/mvm'
          className='inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to MVM Aasanam
        </Link>
      </div>
    )
  }

  const productCategory = getCategoryByEnum(product.category || '')
  const isMeshBack = /\bmesh\b/i.test(product.name || '')

  // Build the full family for colour swatching: parent + all variants
  const parentInFamily = productData?.parent || product
  const familyMembers: CatalogProduct[] = productData
    ? [parentInFamily, ...productData.variants]
    : [product]

  const activeMember = selectedVariantId
    ? (familyMembers.find((m) => m.id === selectedVariantId) ?? product)
    : product

  // Images come from whichever variant is selected, and swap instantly on click
  const images = activeMember.processed_photo_urls?.length > 0
    ? activeMember.processed_photo_urls
    : activeMember.raw_photo_urls?.length > 0
    ? activeMember.raw_photo_urls
    : product.processed_photo_urls?.length > 0
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
        <div className='pt-32 md:pt-40 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <Link to='/mvm' className='hover:text-gray-500 transition-colors'>MVM Aasanam</Link>
            <span>/</span>
            {cat && (
              <>
                <span className='text-gray-500'>{cat.label}</span>
                <span>/</span>
              </>
            )}
            <span className='text-gray-500 truncate max-w-[200px]'>{product.name}</span>
          </div>
        </div>

        {/* The name gets a band of its own at display scale, above the fold and
            above both columns, the way a product page should open. */}
        <header className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-10 sm:pb-14'>
          <p className='text-eyebrow text-amber-600 mb-4'>
            MVM Aasanam
            {productCategory && <span className='text-gray-400'> &middot; {productCategory.series}</span>}
          </p>
          <h1 className='text-section text-gray-900 max-w-4xl'>
            {product.name}
          </h1>
        </header>

        {/* Main Content */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16'>
          <div className='flex flex-col lg:flex-row gap-10 lg:gap-16 lg:items-start'>
            {/* The photograph holds its place while the detail scrolls past it.
                This replaces a right column whose height was locked to the image
                with a ResizeObserver and scrolled inside its own box: a scrollbar
                within a page that already scrolls, which hid the lower half of
                the specs from anyone who did not think to scroll inside it. */}
            <div className='flex-1 max-w-2xl lg:sticky lg:top-32 self-start'>
              <ProductGallery
                images={images}
                alt={product.name || 'Product'}
                activeIndex={activeImage}
                onActiveIndexChange={setActiveImage}
                accentColor='amber'
              />
            </div>

            <div className='flex-1 lg:max-w-md'>
              {/* Badges */}
              <div className='flex flex-wrap items-center gap-2 mb-6'>
                <span className='text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 font-medium'>
                  MVM Aasanam
                </span>
                {productCategory && (
                  <span className='text-xs px-2.5 py-1 rounded-full bg-gray-100 border border-black/[0.06] text-gray-600 font-medium'>
                    {productCategory.series}
                  </span>
                )}
                {product.is_featured && (
                  <span className='text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 font-medium'>
                    Featured
                  </span>
                )}
              </div>

              {/* Price and Add to bag, for the products that are sold online.
                  Keyed to the colour on screen: each variant is its own web
                  product with its own price and its own stock, so switching
                  swatch has to re-ask rather than sell the parent's stock under
                  a different colour's photo. Renders nothing for the rest of
                  the catalogue, which is quoted on WhatsApp as it always was. */}
              {activeMember.slug && <BuyBox slug={activeMember.slug} />}

              {/* ── Colour variant selector ──────────────────────────────── */}
              {familyMembers.length > 1 && (
                <div className='mb-8'>
                  {/* Active colour name */}
                  <div className='flex items-center gap-2 mb-3'>
                    <p className='text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-500'>
                      Colour
                    </p>
                    <p className='text-[13px] font-medium text-gray-900'>
                      {activeMember.color_name || 'Original'}
                    </p>
                    <p className='text-[10px] text-gray-500 ml-auto'>
                      {familyMembers.length} options
                    </p>
                  </div>

                  {/* Thumbnail swatches: clicking swaps images instantly */}
                  <div className='flex flex-wrap gap-2'>
                    {familyMembers.map((member) => {
                      const isActive = member.id === (selectedVariantId ?? product.id)
                      const swatchImg = member.processed_photo_urls?.[0] || member.raw_photo_urls?.[0]
                      const swatchHex = member.color_hex || '#6B7280'
                      const label = member.color_name || 'Original'

                      return (
                        <button
                          key={member.id}
                          onClick={() => {
                            setSelectedVariantId(member.id)
                            setActiveImage(0)
                          }}
                          title={label}
                          className={`relative w-16 h-16 shrink-0 overflow-hidden transition-all duration-250 ease-spring ${
                            isActive
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-50'
                              : 'ring-1 ring-white/10 hover:ring-white/40'
                          }`}
                        >
                          {swatchImg ? (
                            <img
                              src={swatchImg}
                              alt={label}
                              className='w-full h-full object-contain bg-gray-50 p-1'
                              loading='lazy'
                            />
                          ) : (
                            <span
                              className='block w-full h-full'
                              style={{ backgroundColor: swatchHex }}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Colors - only for NON particle board */}
              {colors.length > 0 && !isParticleBoardCategory(product.category || '') && (
                <div className='mb-6'>
                  <p className='text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2'>
                    Available Colours
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {colors.map((c) => (
                      <span key={c.name} className='text-sm px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-500 inline-flex items-center gap-2'>
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
                      <span
                        key={m}
                        title={m}
                        className='text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600'
                      >
                        {shortMaterial(m)}
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
                  {/* Labels only. Each feature carries a two-sentence "detail"
                      about pressure distribution and pelvic support, and six of
                      those is three screens of prose on a page whose job is to
                      sell a chair. The label alone is the fact; the detail is
                      the copywriting around it. */}
                  <ul className='grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2'>
                    {features.map((f) => (
                      <li key={f.label} className='flex items-start gap-2'>
                        <Check className='w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500' strokeWidth={2.5} />
                        <span
                          title={f.detail || undefined}
                          className='text-sm font-medium text-gray-800 leading-snug'
                        >
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* One line about the chair. No Read more, no accordion: a
                  control that offers to show you 1,200 more characters is
                  still 1,200 characters of page weight, and the specs below
                  already carry everything worth knowing. */}
              {(() => {
                const summary = shortDescription(
                  showHindi ? product.description_hindi : product.description,
                )
                if (!summary) return null

                return (
                  <div className='mb-8'>
                    <div className='flex items-center gap-2 mb-2'>
                      <p className='text-xs font-semibold tracking-wider uppercase text-gray-500'>
                        Description
                      </p>
                      {product.description_hindi && (
                        <div className='flex gap-1'>
                          <button
                            onClick={() => setShowHindi(false)}
                            className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                              !showHindi ? 'bg-amber-100 text-amber-700 font-semibold' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            EN
                          </button>
                          <button
                            onClick={() => setShowHindi(true)}
                            className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                              showHindi ? 'bg-amber-100 text-amber-700 font-semibold' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            HI
                          </button>
                        </div>
                      )}
                    </div>
                    <p className='text-sm text-gray-500 leading-relaxed'>{summary}</p>
                  </div>
                )
              })()}

              {/* CTA Buttons */}
              <div className='space-y-3 mb-8'>
                <a
                  href={`https://wa.me/919981516171?text=${whatsappText}`}
                  className='pressable w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3.5 rounded-full shadow-sm hover:bg-gray-800'
                >
                  <MessageCircle className='w-5 h-5' />
                  Enquire for Factory-Direct Price
                </a>
                <div className='flex gap-3'>
                  <a
                    href='tel:+919981516171'
                    className='pressable flex-1 inline-flex items-center justify-center gap-2 border border-black/[0.08] text-gray-900 font-medium px-4 py-3 rounded-full hover:bg-black/[0.04]'
                  >
                    <Phone className='w-4 h-4' />
                    Call Us
                  </a>
                  <button
                    onClick={handleShare}
                    className='pressable inline-flex items-center justify-center gap-2 border border-black/[0.08] text-gray-900 font-medium px-5 py-3 rounded-full hover:bg-black/[0.04]'
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
                  MVM Aasanam. Premium furniture made in Neemuch, Madhya Pradesh.
                  Factory-direct pricing with ISO certified quality. Bulk orders and institutional supply available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Colour catalogue: shown for seating categories that support upholstery customisation */}
        <ProductColourCatalogue category={product.category || ''} isMeshBack={isMeshBack} />

        {/* Related Products */}
        {related.length > 0 && (
          <section className='border-t border-gray-100 py-14'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
              <div className='flex items-end justify-between mb-6'>
                <h2 className='text-title-lg text-gray-900'>
                  More in {cat?.label || productCategory?.label || 'this collection'}
                </h2>
                {cat && (
                  <Link
                    to='/mvm'
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
                      className='group rounded-2xl bg-gray-50 overflow-hidden transition-[transform,box-shadow,background-color] duration-250 ease-spring hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-lg'
                    >
                      <div className='aspect-square bg-gray-50 overflow-hidden'>
                        {pImg ? (
                          <img
                            src={pImg}
                            alt={p.name || 'Product'}
                            className='w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-400 ease-spring'
                            loading='lazy'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-500'>
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
              to='/mvm'
              className='inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to MVM Aasanam
            </Link>
            <a
              href={`https://wa.me/919981516171?text=${whatsappText}`}
              className='pressable inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-full shadow-sm hover:bg-gray-800 text-sm'
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
