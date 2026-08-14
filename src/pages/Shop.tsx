/**
 * The shop. One page for browsing everything MVM Aasanam makes.
 *
 * This replaced a pair of near-identical pages. `/mvm` listed the whole
 * catalogue with prices; `/shop` listed the buyable slice of the same
 * catalogue with the same prices. Two routes showing the same grid of the same
 * chairs is a choice the customer should never have been asked to make, so
 * `/mvm` now redirects here and this is the only product index.
 *
 * Two ranges live here and they are deliberately not blended:
 *
 *   Seating        the MVM Aasanam line. Made in the factory, held in stock,
 *                  priced, buyable now.
 *   Made to order  storage and case goods, built to a customer's sizes and
 *                  finish. No price, because there is not one until the sizes
 *                  are known: these carry an enquiry button, never a number.
 *
 * The catalogue supplies the grid (every product, its photographs, its
 * category) and the live feed supplies price and stock for the slugs that are
 * actually listed. A card shows a price only when the feed returned one for
 * that exact slug; everything else says so plainly rather than guessing,
 * because a wrong price is either a sale we must honour or an argument we must
 * have.
 */

import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MessageCircle, Search } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import AddToBag from '@/src/components/AddToBag'
import { CATEGORIES, getCategoryByEnum } from '@/src/lib/categories'
import { fetchProducts, fetchVariantCounts, type CatalogProduct } from '@/src/lib/supabase'
import { fetchLivePricing, track } from '@/src/lib/analytics'
import { inr } from '@/src/lib/utils'

const ALL = '__all__'
const WHATSAPP = '919981516171'

/** The eight categories sold online. Mirrors ONLINE_STORE_CATEGORIES server-side. */
const SEATING_ENUMS = new Set([
  'EXECUTIVE_CHAIRS',
  'ERGONOMIC_TASK_CHAIRS',
  'CAFETERIA_FURNITURE',
  'VISITOR_RECEPTION',
  'GAMING_CHAIRS',
  'RECLINERS',
  'SALON_CHAIRS',
  'VINTAGE_REVOLVING',
])

const SEATING_CATEGORIES = CATEGORIES.filter((c) => SEATING_ENUMS.has(c.enum))
const MADE_TO_ORDER_CATEGORIES = CATEGORIES.filter((c) => !SEATING_ENUMS.has(c.enum))

/** Price and availability for one slug, from the live feed. */
interface LiveEntry {
  webProductId: number
  price: number
  compareAtPrice: number | null
  inStock: boolean
  availableQty: number | null
}

export default function Shop() {
  const [params, setParams] = useSearchParams()

  const [byCategory, setByCategory] = useState<Record<string, CatalogProduct[]>>({})
  const [loading, setLoading] = useState(true)
  const [variantCounts, setVariantCounts] = useState<Record<number, number>>({})
  const [live, setLive] = useState<Record<string, LiveEntry>>({})
  const [query, setQuery] = useState('')

  // The category lives in the URL, so a filtered shop can be linked, shared,
  // and returned to with the back button instead of resetting to All.
  const activeEnum = params.get('category') ?? ALL

  useEffect(() => {
    let alive = true
    fetchProducts()
      .then((all) => {
        if (!alive) return
        const grouped: Record<string, CatalogProduct[]> = {}
        for (const cat of CATEGORIES) grouped[cat.enum] = []
        for (const p of all) {
          const key = p.category ?? ''
          if (grouped[key]) grouped[key].push(p)
        }
        setByCategory(grouped)
      })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  useEffect(() => { fetchVariantCounts().then(setVariantCounts) }, [])

  useEffect(() => {
    let alive = true
    fetchLivePricing()
      .then(({ products }) => {
        if (!alive) return
        const bySlug: Record<string, LiveEntry> = {}
        for (const p of products) {
          if (!p.slug) continue
          bySlug[p.slug] = {
            webProductId: p.id,
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            inStock: p.inStock,
            availableQty: p.availableQty,
          }
        }
        setLive(bySlug)
      })
      .catch(() => { /* the grid is still worth showing without prices */ })
    return () => { alive = false }
  }, [])

  function selectCategory(enumVal: string) {
    setQuery('')
    setParams(enumVal === ALL ? {} : { category: enumVal })
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const activeCat = CATEGORIES.find((c) => c.enum === activeEnum)
  const showingMadeToOrder = activeCat ? !SEATING_ENUMS.has(activeCat.enum) : false

  // "All" means all *seating*. The made-to-order range is reached by choosing
  // one of its categories: dropping ~200 unpriced wardrobes into the default
  // view would bury the chairs that are actually for sale.
  const seating = useMemo(
    () => SEATING_CATEGORIES.flatMap((c) => byCategory[c.enum] ?? []),
    [byCategory],
  )
  const products = activeEnum === ALL ? seating : (byCategory[activeEnum] ?? [])

  const filtered = useMemo(() => {
    if (!query.trim()) return products
    const q = query.toLowerCase()
    return products.filter((p) => (p.name ?? '').toLowerCase().includes(q))
  }, [products, query])

  return (
    <>
      <SEO
        title='Shop Office Chairs Online'
        description='Buy MVM Aasanam office chairs online, made in Neemuch. Executive chairs, ergonomic task chairs, cafeteria and visitor seating, gaming chairs, recliners and salon chairs. Delivered across India.'
        canonical='/shop'
        ogImage='https://mvm-furniture.com/og-mvm.jpg'
        keywords='buy office chairs online, MVM Aasanam, executive chairs, ergonomic task chairs, gaming chairs, recliners, furniture manufacturer Neemuch'
        jsonLd={createBreadcrumbSchema([
          { name: 'Home', url: '/home' },
          { name: 'Shop', url: '/shop' },
        ])}
      />

      <Hero count={seating.length} />

      <div id='catalogue' className='bg-white min-h-screen scroll-mt-32'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex'>

            {/* ── Sidebar ─────────────────────────────────────────────── */}
            <aside className='hidden md:block w-64 flex-shrink-0 sticky top-16 md:top-32 self-start h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] bg-white border-r border-gray-100'>
              <div className='h-full overflow-y-auto pt-7 pb-6 px-5'>
                <p className='text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-4'>
                  Categories
                </p>

                <SidebarRow
                  label='All Seating'
                  count={seating.length}
                  active={activeEnum === ALL}
                  onClick={() => selectCategory(ALL)}
                  emphasis
                />

                <SidebarGroup label='Shop by category' />
                {SEATING_CATEGORIES.map((cat) => (
                  <SidebarRow
                    key={cat.enum}
                    label={cat.label}
                    count={byCategory[cat.enum]?.length}
                    active={cat.enum === activeEnum}
                    onClick={() => selectCategory(cat.enum)}
                  />
                ))}

                <SidebarGroup label='Made to order' />
                <p className='-mt-1 mb-3 pl-3 pr-2 text-[11px] leading-relaxed text-gray-400'>
                  Built to your sizes and finish. Quoted per order.
                </p>
                {MADE_TO_ORDER_CATEGORIES.map((cat) => (
                  <SidebarRow
                    key={cat.enum}
                    label={cat.label}
                    count={byCategory[cat.enum]?.length}
                    active={cat.enum === activeEnum}
                    onClick={() => selectCategory(cat.enum)}
                  />
                ))}

                <div className='mt-10 relative bg-gray-950 rounded-xl px-5 py-6 overflow-hidden'>
                  <span className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent' />
                  <p className='text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400 mb-2'>
                    Bulk enquiry
                  </p>
                  <p className='font-display text-lg text-white leading-tight mb-1.5'>
                    Buying for an office?
                  </p>
                  <p className='text-[11px] text-gray-400 leading-relaxed mb-4'>
                    Share your requirements: we respond within 24 hours.
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hi, I need a bulk quote for MVM Aasanam furniture.')}`}
                    onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'shop-bulk' } })}
                    className='inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400 hover:text-amber-300 transition-colors'
                  >
                    WhatsApp us
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </aside>

            {/* ── Grid ────────────────────────────────────────────────── */}
            <main className='flex-1 min-w-0 bg-white px-4 sm:px-8 pt-12 md:pt-20 pb-20'>

              <div className='md:hidden mb-6 -mx-4 px-4 border-b border-gray-100'>
                <div className='flex gap-1 overflow-x-auto -mb-px'>
                  <MobileTab label='All' active={activeEnum === ALL} onClick={() => selectCategory(ALL)} />
                  {SEATING_CATEGORIES.map((cat) => (
                    <MobileTab
                      key={cat.enum}
                      label={cat.label}
                      active={cat.enum === activeEnum}
                      onClick={() => selectCategory(cat.enum)}
                    />
                  ))}
                  {MADE_TO_ORDER_CATEGORIES.map((cat) => (
                    <MobileTab
                      key={cat.enum}
                      label={cat.label}
                      active={cat.enum === activeEnum}
                      onClick={() => selectCategory(cat.enum)}
                    />
                  ))}
                </div>
              </div>

              <header className='border-b border-black/[0.06] pb-8 mb-12'>
                <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-eyebrow text-amber-600 mb-3'>
                      {showingMadeToOrder ? 'Made to order' : 'MVM Aasanam'}
                      {activeCat && <span className='text-gray-400'> &middot; {activeCat.series}</span>}
                    </p>
                    <h1 className='text-section text-gray-900'>{activeCat?.label ?? 'Shop'}</h1>
                    <p className='text-base text-gray-500 mt-4 max-w-xl leading-relaxed'>
                      {showingMadeToOrder
                        ? 'Built to your sizes and finish. Send us the dimensions and we will quote it.'
                        : (activeCat?.description ?? 'Chairs we make in Neemuch, in stock and ready to ship. All prices include GST.')}
                    </p>
                    {!loading && (
                      <p className='text-[10px] uppercase tracking-[0.25em] text-gray-400 mt-3'>
                        {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
                        {query.trim() ? ` matching “${query}”` : ''}
                      </p>
                    )}
                  </div>
                  <div className='relative w-full sm:w-56 flex-shrink-0'>
                    <Search className='absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400' />
                    <input
                      type='text'
                      placeholder='Search'
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className='w-full pl-6 pr-2 py-2 bg-transparent border-0 border-b border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-amber-500 transition-colors'
                    />
                  </div>
                </div>
              </header>

              {loading ? (
                <div className='grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8'>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className='rounded-2xl border border-black/[0.06] overflow-hidden'>
                      <div className='aspect-square bg-gray-50 animate-pulse' />
                      <div className='p-4 space-y-2'>
                        <div className='h-3.5 w-3/4 bg-gray-50 rounded animate-pulse' />
                        <div className='h-4 w-1/3 bg-gray-50 rounded animate-pulse' />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length > 0 ? (
                <div className='grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8'>
                  {filtered.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      entry={product.slug ? live[product.slug] : undefined}
                      variantCount={variantCounts[product.id] ?? 0}
                      madeToOrder={!SEATING_ENUMS.has(product.category ?? '')}
                    />
                  ))}
                </div>
              ) : (
                <div className='rounded-2xl border border-dashed border-gray-200 p-16 text-center'>
                  <p className='text-gray-500 text-sm mb-4'>
                    {query.trim() ? `No products match “${query}”.` : 'Nothing in this category yet.'}
                  </p>
                  {query.trim() ? (
                    <button onClick={() => setQuery('')} className='text-xs font-medium text-amber-600 hover:text-amber-700'>
                      Clear search
                    </button>
                  ) : (
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I'm interested in MVM Aasanam ${activeCat?.label ?? 'furniture'}. Please share what's available.`)}`}
                      onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'shop-empty-category' } })}
                      className='inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700'
                    >
                      <MessageCircle className='w-3.5 h-3.5' />
                      Ask about availability
                    </a>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer variant='light' />
    </>
  )
}

// ── Product card ─────────────────────────────────────────────────────────────

/**
 * One product.
 *
 * The whole card is deliberately not a link. A card that navigates on any
 * click cannot hold buttons: every Add to bag becomes a navigation nobody
 * asked for. The photograph and the title are the links; the footer is
 * controls.
 *
 * `mt-auto` on the footer keeps the buttons on one line across a row however
 * many lines the title above them wraps to, which is what stops a grid of
 * mixed-length names from looking ragged.
 */
function ProductCard({
  product,
  entry,
  variantCount,
  madeToOrder,
}: {
  product: CatalogProduct
  entry: LiveEntry | undefined
  variantCount: number
  madeToOrder: boolean
}) {
  const imgSrc = product.processed_photo_urls?.[0] || product.raw_photo_urls?.[0] || null
  const catSlug = getCategoryByEnum(product.category ?? '')?.slug
  const href = catSlug ? `/mvm/${catSlug}/${product.slug}` : '/shop'

  return (
    <article className='group reveal rounded-2xl border border-black/[0.06] bg-white shadow-sm overflow-hidden flex flex-col transition-[transform,box-shadow,border-color] duration-250 ease-spring hover:-translate-y-1.5 hover:border-black/[0.08] hover:shadow-xl'>
      <Link to={href} className='relative block aspect-square bg-gray-50 overflow-hidden'>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name ?? 'Product'}
            loading='lazy'
            className='w-full h-full object-contain p-5 sm:p-7 transition-transform duration-400 ease-spring group-hover:scale-[1.06]'
          />
        ) : (
          <div className='w-full h-full grid place-items-center'>
            <span className='text-5xl font-semibold text-gray-200'>{(product.name ?? 'P')[0]}</span>
          </div>
        )}
        {variantCount > 0 && (
          <span className='absolute bottom-3 right-3 text-[10px] font-medium tracking-wide rounded-full bg-black/60 text-white px-2.5 py-1 backdrop-blur-sm'>
            +{variantCount} colours
          </span>
        )}
      </Link>

      <div className='p-4 sm:p-5 flex flex-col flex-1'>
        <Link to={href} className='block'>
          <h2 className='text-title text-gray-900 line-clamp-2 leading-snug'>{product.name}</h2>
        </Link>

        <div className='mt-2.5 min-h-[30px]'>
          {madeToOrder ? (
            <p className='text-[13px] text-gray-400'>Made to your size</p>
          ) : entry ? (
            <div className='flex items-baseline gap-2'>
              <span className='text-xl font-semibold tracking-[-0.02em] text-gray-900 tabular-nums'>
                {inr(entry.price)}
              </span>
              {entry.compareAtPrice && entry.compareAtPrice > entry.price && (
                <span className='text-sm text-gray-400 line-through tabular-nums'>
                  {inr(entry.compareAtPrice)}
                </span>
              )}
            </div>
          ) : (
            <p className='text-[13px] text-gray-400'>Price on request</p>
          )}
        </div>

        {entry?.inStock && entry.availableQty !== null && entry.availableQty <= 5 && (
          <p className='mt-1.5 text-xs font-medium text-amber-600'>
            Only {entry.availableQty} left
          </p>
        )}

        <div className='mt-auto pt-3'>
          {madeToOrder ? (
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I'd like a quote for the ${product.name} (made to order).`)}`}
              onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'shop-made-to-order', product: product.name } })}
              className='pressable h-10 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/[0.08] bg-white text-xs font-semibold text-gray-800 hover:bg-black/[0.03]'
            >
              <MessageCircle className='w-3.5 h-3.5' />
              Get a quote
            </a>
          ) : entry ? (
            <AddToBag
              productId={entry.webProductId}
              name={product.name ?? 'Product'}
              price={entry.price}
              inStock={entry.inStock}
              availableQty={entry.availableQty}
            />
          ) : (
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, could you send me the price for the ${product.name}?`)}`}
              onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'shop-price-request', product: product.name } })}
              className='pressable h-10 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/[0.08] bg-white text-xs font-semibold text-gray-800 hover:bg-black/[0.03]'
            >
              <MessageCircle className='w-3.5 h-3.5' />
              Ask for price
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

// ── Sidebar pieces ───────────────────────────────────────────────────────────

function SidebarGroup({ label }: { label: string }) {
  return (
    <p className='mt-7 mb-2 pl-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400'>
      {label}
    </p>
  )
}

function SidebarRow({
  label, count, active, onClick, emphasis,
}: {
  label: string
  count?: number
  active: boolean
  onClick: () => void
  emphasis?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-2 pl-3 pr-2 py-2 rounded-md text-left transition-colors ${
        active ? 'bg-amber-50' : 'hover:bg-black/[0.03]'
      }`}
    >
      <span
        className={`text-sm truncate ${
          active
            ? 'font-semibold text-gray-900'
            : emphasis
              ? 'font-medium text-gray-800'
              : 'text-gray-600'
        }`}
      >
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <span className={`text-[11px] tabular-nums shrink-0 ${active ? 'text-amber-600' : 'text-gray-300'}`}>
          {count}
        </span>
      )}
    </button>
  )
}

function MobileTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-2.5 text-[13px] whitespace-nowrap border-b-2 transition-colors ${
        active ? 'border-amber-500 font-semibold text-gray-900' : 'border-transparent text-gray-500'
      }`}
    >
      {label}
    </button>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────

/**
 * The first screen of the site: `/` lands here.
 *
 * Full bleed and full height, running under the fixed nav rather than starting
 * below it, so the translucent chrome floats over the photograph instead of
 * sitting in a white strip above it. The photograph is the real Neemuch
 * showroom, and it is the argument: a manufacturer with a room like that is
 * worth buying from. `fetchpriority=high` and no lazy attribute, because it is
 * the LCP element.
 */
function Hero({ count }: { count: number }) {
  return (
    <section className='relative min-h-[92svh] flex items-end overflow-hidden bg-gray-950'>
      <picture>
        <source srcSet='/hero-showroom.webp' type='image/webp' />
        <img
          src='/hero-showroom.jpg'
          alt='The MVM Aasanam showroom in Neemuch, with chairs and fabric samples laid out'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ fetchpriority: 'high' } as any)}
          decoding='async'
          className='absolute inset-0 w-full h-full object-cover'
        />
      </picture>

      <div className='absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/55 to-gray-950/15' />

      <div className='relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20'>
        <p className='text-eyebrow text-amber-400 mb-4'>MVM Aasanam</p>
        <h2 className='text-display text-white max-w-3xl'>
          Chairs made in Neemuch,<br className='hidden sm:block' /> delivered across India.
        </h2>
        <p className='mt-5 text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed'>
          Our own factory line, held in stock, priced with GST included.
          {count > 0 && ` ${count} pieces to choose from.`}
        </p>
        <div className='mt-8 flex flex-wrap items-center gap-3'>
          <a
            href='#catalogue'
            className='pressable inline-flex items-center justify-center h-12 px-7 rounded-lg bg-white text-sm font-semibold text-gray-900 hover:bg-gray-100'
          >
            Browse the shop
          </a>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'shop-hero' } })}
            className='pressable inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg border border-white/20 text-sm font-semibold text-white hover:bg-white/10'
          >
            <MessageCircle className='w-4 h-4' />
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  )
}
