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
 *
 * The page is laid out the way the big Indian furniture sites lay theirs out,
 * top to bottom: banner, what we promise, shop by category, then the grid
 * behind a filter and sort bar. That order is not decoration. It answers, in
 * turn, who we are, why buy here, what kind of thing do you want, and finally
 * which one, and a visitor can drop out at any of those points having got what
 * they came for.
 */

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  MessageCircle, Truck, Factory, ShieldCheck, IndianRupee, ArrowRight,
} from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { createBreadcrumbSchema } from '@/src/components/SEO'
import AddToBag from '@/src/components/AddToBag'
import { WishlistHeart } from '@/src/components/WishlistButton'
import CategoryCircles, { useCategoryTiles } from '@/src/components/CategoryCircles'
import ShopToolbar, {
  EMPTY_FILTERS, priceInBands, countActiveFilters,
  type ShopFilters, type SortKey,
} from '@/src/components/ShopToolbar'
import { CATEGORIES, getCategoryByEnum } from '@/src/lib/categories'
import {
  fetchProducts, fetchVariantSwatches,
  type CatalogProduct, type VariantSwatch,
} from '@/src/lib/supabase'
import { fetchLivePricing, track } from '@/src/lib/analytics'
import { inr } from '@/src/lib/utils'

const ALL = ''
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

/**
 * Kept out of the circle rows so the rest hold one line.
 *
 * Ten made-to-order categories wrapped onto a second line with a single
 * orphaned tile under it. Nine fit. This hides the tile only: the category is
 * still in the filter drawer, its products still appear when it is chosen, and
 * every dressing table product page still resolves. Delete the enum from
 * `lib/categories.ts` instead if the range itself is going away.
 */
const HIDDEN_FROM_TILES = new Set(['DRESSING_TABLES'])
const MADE_TO_ORDER_TILE_CATEGORIES = MADE_TO_ORDER_CATEGORIES.filter(
  (c) => !HIDDEN_FROM_TILES.has(c.enum),
)

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
  const [swatches, setSwatches] = useState<Record<number, VariantSwatch[]>>({})
  const [live, setLive] = useState<Record<string, LiveEntry>>({})
  const [filters, setFilters] = useState<ShopFilters>(EMPTY_FILTERS)
  const [sort, setSort] = useState<SortKey>('featured')

  // Category and search both live in the URL, so a filtered shop can be linked,
  // shared, and returned to with the back button instead of resetting to All.
  // The header's search box writes `q` here from anywhere on the site.
  const activeEnum = params.get('category') ?? ALL
  const query = params.get('q') ?? ''

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

  useEffect(() => { fetchVariantSwatches().then(setSwatches) }, [])

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
    // Choosing a category drops the search: the two together almost always
    // produce nothing, and an empty grid reads as a broken shop rather than as
    // two filters that happen not to overlap.
    setParams(enumVal === ALL ? {} : { category: enumVal })
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function clearSearch() {
    const next = new URLSearchParams(params)
    next.delete('q')
    setParams(next)
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

  const counts = useMemo(() => {
    const out: Record<string, number> = {}
    for (const cat of CATEGORIES) out[cat.enum] = byCategory[cat.enum]?.length ?? 0
    return out
  }, [byCategory])

  const seatingTiles = useCategoryTiles(SEATING_CATEGORIES, byCategory)
  const madeToOrderTiles = useCategoryTiles(MADE_TO_ORDER_TILE_CATEGORIES, byCategory)

  /**
   * Search, then filter, then sort.
   *
   * Filters that depend on a price only apply to products that have one. A
   * made-to-order wardrobe has no price until it is quoted, so a price band
   * cannot include or exclude it honestly: it stays out of a price-filtered
   * result rather than being ranked at zero.
   */
  const visible = useMemo(() => {
    let out = products

    if (query.trim()) {
      const q = query.toLowerCase()
      out = out.filter((p) => (p.name ?? '').toLowerCase().includes(q))
    }

    if (filters.inStockOnly) {
      out = out.filter((p) => (p.slug ? live[p.slug]?.inStock : false))
    }

    if (filters.priceBands.length > 0) {
      out = out.filter((p) => {
        const entry = p.slug ? live[p.slug] : undefined
        return entry ? priceInBands(entry.price, filters.priceBands) : false
      })
    }

    if (filters.hasColours) {
      out = out.filter((p) => (swatches[p.id]?.length ?? 0) > 0)
    }

    if (sort === 'featured') return out

    const sorted = [...out]
    if (sort === 'name-asc') {
      sorted.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
      return sorted
    }

    // Unpriced pieces sink to the bottom of a price sort in both directions.
    // Sorting them as free would put every made-to-order wardrobe above every
    // chair on "low to high", which is the opposite of what was asked for.
    const priceOf = (p: CatalogProduct) => (p.slug ? live[p.slug]?.price : undefined)
    sorted.sort((a, b) => {
      const pa = priceOf(a)
      const pb = priceOf(b)
      if (pa === undefined && pb === undefined) return 0
      if (pa === undefined) return 1
      if (pb === undefined) return -1
      return sort === 'price-asc' ? pa - pb : pb - pa
    })
    return sorted
  }, [products, query, filters, sort, live, swatches])

  /**
   * A short rail above the grid, shown only on the unfiltered shop. Once
   * someone has picked a category or typed a search they have told us what
   * they want, and a rail of something else on top of the answer is an
   * interruption.
   *
   * What the rail contains, and therefore what it is called, depends on what
   * the data can actually support. `is_featured` is the owner's own shelf and
   * wins whenever anything is on it; today nothing is, so the fallback is the
   * pieces genuinely marked down, which the price feed knows for certain. If
   * neither exists there is no rail: a row headed "Best sellers" filled with
   * whatever sorted first would be a claim we cannot stand behind.
   */
  const rail = useMemo(() => {
    if (activeEnum !== ALL || query.trim() || !seating.length) return null

    const picked = seating.filter((p) => p.is_featured && p.slug && live[p.slug])
    if (picked.length >= 4) {
      return { eyebrow: 'Our pick', title: 'Featured chairs', products: picked.slice(0, 12) }
    }

    const discounted = seating.filter((p) => {
      const e = p.slug ? live[p.slug] : undefined
      return e && e.compareAtPrice !== null && e.compareAtPrice > e.price
    })
    if (discounted.length >= 4) {
      return { eyebrow: 'Reduced right now', title: 'On offer', products: discounted.slice(0, 12) }
    }

    return null
  }, [activeEnum, query, seating, live])

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

      <div className='bg-white pt-32 md:pt-40'>
        <HeroBanner />
        <PromiseStrip />

        {/* ── Shop by category ────────────────────────────────────────────── */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-14 sm:pt-20'>
          <div className='text-center mb-8 sm:mb-10'>
            <p className='text-eyebrow text-amber-600 mb-3'>Browse the range</p>
            <h2 className='text-section text-gray-900'>Shop by category</h2>
          </div>

          <CategoryCircles
            tiles={seatingTiles}
            activeKey={activeEnum}
            onSelect={selectCategory}
            loading={loading}
          />
        </section>

        {rail && (
          <FeaturedRail
            eyebrow={rail.eyebrow}
            title={rail.title}
            products={rail.products}
            live={live}
            swatches={swatches}
          />
        )}

        {/* ── The grid ────────────────────────────────────────────────────── */}
        <div id='catalogue' className='scroll-mt-32 md:scroll-mt-40 pt-14 sm:pt-20 pb-20'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
            <header className='pb-7'>
              <p className='text-eyebrow text-amber-600 mb-3'>
                {showingMadeToOrder ? 'Made to order' : 'MVM Aasanam'}
                {activeCat && <span className='text-gray-400'> &middot; {activeCat.series}</span>}
              </p>
              <h1 className='text-section text-gray-900'>
                {query.trim() ? `“${query}”` : (activeCat?.label ?? 'All seating')}
              </h1>
              <p className='text-base text-gray-500 mt-4 max-w-xl leading-relaxed'>
                {query.trim()
                  ? 'Everything in the range matching what you searched for.'
                  : showingMadeToOrder
                    ? 'Built to your sizes and finish. Send us the dimensions and we will quote it.'
                    : (activeCat?.description ?? 'Chairs we make in Neemuch, in stock and ready to ship. All prices include GST.')}
              </p>
              {query.trim() && (
                <button
                  type='button'
                  onClick={clearSearch}
                  className='mt-4 text-xs font-semibold text-amber-600 hover:text-amber-700'
                >
                  Clear search and show everything
                </button>
              )}
            </header>
          </div>

          {/* Outside the content column on purpose: the bar is chrome, and
              chrome runs the full width of the window. */}
          <ShopToolbar
            total={visible.length}
            filters={filters}
            onFiltersChange={setFilters}
            sort={sort}
            onSortChange={setSort}
            categories={SEATING_CATEGORIES}
            madeToOrderCategories={MADE_TO_ORDER_CATEGORIES}
            activeCategory={activeEnum}
            onCategoryChange={selectCategory}
            counts={counts}
            allLabel='All seating'
            allCount={seating.length}
          />

          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
            <div className='pt-8'>
              {loading ? (
                <ProductGrid>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className='bg-white p-3 sm:p-4'>
                      <div className='aspect-square rounded-xl bg-gray-50 animate-pulse' />
                      <div className='pt-4 space-y-2'>
                        <div className='h-2 w-1/3 bg-gray-50 rounded animate-pulse' />
                        <div className='h-3.5 w-3/4 bg-gray-50 rounded animate-pulse' />
                        <div className='h-4 w-1/3 bg-gray-50 rounded animate-pulse' />
                      </div>
                    </div>
                  ))}
                </ProductGrid>
              ) : visible.length > 0 ? (
                <ProductGrid>
                  {visible.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      entry={product.slug ? live[product.slug] : undefined}
                      swatches={swatches[product.id] ?? []}
                      madeToOrder={!SEATING_ENUMS.has(product.category ?? '')}
                    />
                  ))}
                </ProductGrid>
              ) : (
                <EmptyState
                  query={query}
                  onClearSearch={clearSearch}
                  filtersOn={countActiveFilters(filters) > 0}
                  onClearFilters={() => setFilters(EMPTY_FILTERS)}
                  categoryLabel={activeCat?.label}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Made to order ───────────────────────────────────────────────────
            Below the grid, deliberately. It used to sit directly under "Shop
            by category", which put ten categories of unpriced wardrobes
            between a buyer and the chairs they came for, and made the two
            ranges look like one long list. Down here it reads as what it is:
            what else we can do, once you have seen what we sell. */}
        <section className='border-t border-black/[0.07] bg-[#faf9f7]'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20'>
            <div className='text-center mb-8 sm:mb-10'>
              <p className='text-eyebrow text-amber-600 mb-3'>Built to your sizes</p>
              <h2 className='text-section text-gray-900'>Made to order</h2>
              <p className='mt-4 text-base text-gray-500 max-w-lg mx-auto leading-relaxed'>
                Wardrobes, desks and storage cut to the dimensions of your room and
                finished the way you want it. Send us the sizes and we will quote it.
              </p>
            </div>

            <CategoryCircles
              tiles={madeToOrderTiles}
              activeKey={activeEnum}
              onSelect={selectCategory}
              loading={loading}
            />

            <div className='mt-10 text-center'>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hi, I would like a quote for made to order furniture. Here are my sizes:')}`}
                onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'made-to-order-section' } })}
                className='pressable inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800'
              >
                <MessageCircle className='w-4 h-4' />
                Send us your sizes
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer variant='light' />
    </>
  )
}

// ── Grid ─────────────────────────────────────────────────────────────────────

/**
 * Cards separated by hairlines rather than each sitting in its own box.
 *
 * `gap-px` over a light background paints a one-pixel rule between every cell
 * and nothing around the outside of any of them, so the grid reads as one
 * ruled sheet. Ten bordered, shadowed cards floating on white all compete for
 * the same attention; ruled cells let the photographs do it instead.
 */
function ProductGrid({ children }: { children: ReactNode }) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-px bg-black/[0.07] rounded-2xl overflow-hidden ring-1 ring-black/[0.07]'>
      {children}
    </div>
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
  swatches,
  madeToOrder,
}: {
  product: CatalogProduct
  entry: LiveEntry | undefined
  swatches: VariantSwatch[]
  madeToOrder: boolean
}) {
  const imgSrc = product.processed_photo_urls?.[0] || product.raw_photo_urls?.[0] || null
  const catSlug = getCategoryByEnum(product.category ?? '')?.slug
  const href = catSlug ? `/mvm/${catSlug}/${product.slug}` : '/shop'

  // Only from a real struck-through price, never computed from a guess. A
  // discount badge is a commercial claim and has to match the invoice.
  const discountPct =
    entry?.compareAtPrice && entry.compareAtPrice > entry.price
      ? Math.round(((entry.compareAtPrice - entry.price) / entry.compareAtPrice) * 100)
      : 0

  return (
    // No `reveal` here, deliberately. The grid paints its hairlines by showing
    // a grey background through one-pixel gaps, so a card faded to `opacity: 0`
    // does not merely stay invisible: it turns into a grey slab, and a hundred
    // of them below the fold read as a broken page rather than as content
    // waiting to animate. Fading in a grid the buyer is scanning is the wrong
    // motion anyway; the photographs arriving is enough.
    <article className='group relative bg-white p-3 sm:p-4 flex flex-col transition-[box-shadow,z-index] duration-250 ease-spring hover:z-10 hover:shadow-xl'>
      <div className='relative'>
        <Link
          to={href}
          className='relative block aspect-square rounded-xl bg-[#f7f6f4] overflow-hidden'
        >
          {imgSrc ? (
            // Filled, not padded. The catalogue photographs are lifestyle
            // renders: the chair is already sitting in a room, and floating
            // that whole picture inside a tinted panel puts a hard square
            // edge in the middle of every card. Letting it reach the corners
            // is what makes the grid read as photography rather than as
            // thumbnails.
            <img
              src={imgSrc}
              alt={product.name ?? 'Product'}
              loading='lazy'
              className='w-full h-full object-cover transition-transform duration-400 ease-spring group-hover:scale-[1.06]'
            />
          ) : (
            <div className='w-full h-full grid place-items-center'>
              <span className='text-5xl font-semibold text-gray-200'>{(product.name ?? 'P')[0]}</span>
            </div>
          )}
          {discountPct >= 5 && (
            <span className='absolute top-2.5 left-2.5 text-[11px] font-bold rounded-md bg-emerald-600 text-white px-2 py-1'>
              {discountPct}% off
            </span>
          )}
        </Link>

        {/* Outside the anchor, so saving a chair does not navigate to it. */}
        {product.slug && (
          <WishlistHeart
            className='absolute top-2 right-2'
            entry={{ slug: product.slug, name: product.name ?? 'Chair', image: imgSrc, href }}
          />
        )}
      </div>

      <div className='pt-3.5 flex flex-col flex-1'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400'>
          {madeToOrder ? 'Made to order' : 'MVM Aasanam'}
        </p>

        <Link to={href} className='block'>
          <h2 className='mt-1.5 text-[13px] sm:text-sm font-medium leading-snug text-gray-900 line-clamp-2 group-hover:text-amber-700 transition-colors'>
            {product.name}
          </h2>
        </Link>

        {swatches.length > 0 && <Swatches swatches={swatches} />}

        <div className='mt-2.5 min-h-[28px]'>
          {madeToOrder ? (
            <p className='text-[13px] text-gray-400'>Made to your size</p>
          ) : entry ? (
            <div className='flex items-baseline gap-2 flex-wrap'>
              <span className='text-lg sm:text-xl font-semibold tracking-[-0.02em] text-gray-900 tabular-nums'>
                {inr(entry.price)}
              </span>
              {entry.compareAtPrice && entry.compareAtPrice > entry.price && (
                <span className='text-xs sm:text-sm text-gray-400 line-through tabular-nums'>
                  {inr(entry.compareAtPrice)}
                </span>
              )}
            </div>
          ) : (
            <p className='text-[13px] text-gray-400'>Price on request</p>
          )}
        </div>

        {entry?.inStock && entry.availableQty !== null && entry.availableQty <= 5 && (
          <p className='mt-1 text-xs font-medium text-amber-600'>
            Only {entry.availableQty} left
          </p>
        )}

        <div className='mt-auto pt-3'>
          {madeToOrder ? (
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I'd like a quote for the ${product.name} (made to order).`)}`}
              onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'shop-made-to-order', product: product.name } })}
              className='pressable h-10 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/[0.12] bg-white text-xs font-semibold text-gray-800 hover:bg-black/[0.03]'
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
              className='pressable h-10 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/[0.12] bg-white text-xs font-semibold text-gray-800 hover:bg-black/[0.03]'
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

/**
 * The colours this chair is also made in.
 *
 * Real hexes off the variant rows, capped at five with a count for the rest.
 * A buyer scanning the grid learns the chair comes in their office's shade
 * without opening anything, which is the whole reason the row is on the card
 * and not only on the product page.
 */
function Swatches({ swatches }: { swatches: VariantSwatch[] }) {
  const shown = swatches.slice(0, 5)
  const extra = swatches.length - shown.length
  return (
    <div className='mt-2.5 flex items-center gap-1.5'>
      {shown.map((s, i) => (
        <span
          key={`${s.hex}-${i}`}
          title={s.name}
          className='w-3.5 h-3.5 rounded-full ring-1 ring-black/[0.12] ring-inset'
          style={{ backgroundColor: s.hex }}
        />
      ))}
      {extra > 0 && (
        <span className='text-[10px] font-medium text-gray-400 tabular-nums'>+{extra}</span>
      )}
    </div>
  )
}

// ── Featured rail ────────────────────────────────────────────────────────────

/**
 * A horizontal row of pieces the owner marked featured.
 *
 * Deliberately a scroller and not a second grid. A grid says "here is
 * everything, work through it"; a rail says "here are a few, have a look", and
 * the difference is what stops the page from being one long wall of chairs.
 */
function FeaturedRail({
  eyebrow, title, products, live, swatches,
}: {
  eyebrow: string
  title: string
  products: CatalogProduct[]
  live: Record<string, LiveEntry>
  swatches: Record<number, VariantSwatch[]>
}) {
  return (
    <section className='pt-14 sm:pt-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
        <div className='flex items-end justify-between gap-4 mb-7'>
          <div>
            <p className='text-eyebrow text-amber-600 mb-3'>{eyebrow}</p>
            <h2 className='text-section text-gray-900'>{title}</h2>
          </div>
          <a
            href='#catalogue'
            className='shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-900 hover:text-amber-600 transition-colors pb-1'
          >
            View all
            <ArrowRight className='w-3.5 h-3.5' />
          </a>
        </div>

        {/* The scroller sits inside the content column and pushes its own
            padding back out, so the first card starts on the same line as the
            heading above it and the last one runs off the edge. Centring a
            wider scroller instead put the row a margin to the left of its own
            title, which reads as a layout fault however good the photographs
            are. */}
        <div className='-mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-10 overflow-x-auto thumbnail-scroll snap-x snap-mandatory'>
          <div className='flex gap-4 sm:gap-5 w-max pr-4 sm:pr-6 lg:pr-10'>
          {products.map((p) => {
            const entry = p.slug ? live[p.slug] : undefined
            const imgSrc = p.processed_photo_urls?.[0] || p.raw_photo_urls?.[0] || null
            const catSlug = getCategoryByEnum(p.category ?? '')?.slug
            const href = catSlug ? `/mvm/${catSlug}/${p.slug}` : '/shop'
            const cols = swatches[p.id] ?? []
            return (
              <Link
                key={p.id}
                to={href}
                className='group snap-start shrink-0 w-[10.5rem] sm:w-56'
              >
                <div className='aspect-square rounded-xl bg-[#f7f6f4] overflow-hidden ring-1 ring-black/[0.05]'>
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={p.name ?? 'Chair'}
                      loading='lazy'
                      className='w-full h-full object-cover transition-transform duration-400 ease-spring group-hover:scale-[1.07]'
                    />
                  ) : (
                    <div className='w-full h-full grid place-items-center text-4xl font-semibold text-gray-200'>
                      {(p.name ?? 'P')[0]}
                    </div>
                  )}
                </div>
                <h3 className='mt-3 text-[13px] font-medium leading-snug text-gray-900 line-clamp-2 group-hover:text-amber-700 transition-colors'>
                  {p.name}
                </h3>
                {entry && (
                  <p className='mt-1 text-sm font-semibold text-gray-900 tabular-nums'>
                    {inr(entry.price)}
                  </p>
                )}
                {cols.length > 0 && <Swatches swatches={cols} />}
              </Link>
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({
  query, onClearSearch, filtersOn, onClearFilters, categoryLabel,
}: {
  query: string
  onClearSearch: () => void
  filtersOn: boolean
  onClearFilters: () => void
  categoryLabel?: string
}) {
  return (
    <div className='rounded-2xl border border-dashed border-gray-200 p-12 sm:p-16 text-center'>
      <p className='text-gray-500 text-sm mb-5'>
        {query.trim()
          ? `Nothing matches “${query}”.`
          : filtersOn
            ? 'Nothing here matches those filters.'
            : 'Nothing in this category yet.'}
      </p>
      <div className='flex flex-wrap items-center justify-center gap-4'>
        {query.trim() && (
          <button onClick={onClearSearch} className='text-xs font-semibold text-amber-600 hover:text-amber-700'>
            Clear search
          </button>
        )}
        {filtersOn && (
          <button onClick={onClearFilters} className='text-xs font-semibold text-amber-600 hover:text-amber-700'>
            Clear filters
          </button>
        )}
        <a
          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I'm interested in MVM Aasanam ${categoryLabel ?? 'furniture'}. Please share what's available.`)}`}
          onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'shop-empty' } })}
          className='inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700'
        >
          <MessageCircle className='w-3.5 h-3.5' />
          Ask about availability
        </a>
      </div>
    </div>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────

/**
 * The banner. `/` lands here.
 *
 * Inset and rounded rather than full bleed. A photograph that runs to all four
 * edges of a shop's first screen is a magazine cover: handsome, and it delays
 * the shop by a scroll. Held inside the page margins with corners on it, it
 * reads as the first card in a catalogue, and the category circles under it
 * are on screen at the same time.
 *
 * The photograph is the real Neemuch showroom, and it is the argument: a
 * manufacturer with a room like that is worth buying from. `fetchpriority=high`
 * and no lazy attribute, because it is the LCP element.
 */
function HeroBanner() {
  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6'>
      <div className='relative overflow-hidden rounded-2xl sm:rounded-[1.75rem] bg-gray-950 min-h-[26rem] sm:min-h-[30rem] lg:min-h-[34rem] flex items-end'>
        <picture>
          <source srcSet='/hero-showroom.webp' type='image/webp' />
          <img
            src='/hero-showroom.jpg'
            alt='The MVM Aasanam showroom in Neemuch, with chairs and fabric samples laid out'
            fetchPriority='high'
            decoding='async'
            className='absolute inset-0 w-full h-full object-cover'
          />
        </picture>

        <div className='absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/55 to-gray-950/10' />

        <div className='relative w-full p-6 sm:p-10 lg:p-14'>
          <p className='text-eyebrow text-amber-400 mb-4'>Our own factory, Neemuch</p>
          <h2 className='text-display text-white max-w-2xl'>
            Chairs made by us,<br className='hidden sm:block' /> delivered across India.
          </h2>
          <p className='mt-5 text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed'>
            No middleman, no showroom markup.
          </p>
          {/* Full width each on a phone, where they stack: two pills of
              different lengths sitting one above the other under a left-aligned
              headline reads as a ragged edge rather than as a pair. */}
          <div className='mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 max-w-sm sm:max-w-none'>
            <a
              href='#catalogue'
              className='pressable inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-white text-sm font-semibold text-gray-900 hover:bg-gray-100'
            >
              Shop the range
              <ArrowRight className='w-4 h-4' />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'shop-hero' } })}
              className='pressable inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full border border-white/25 text-sm font-semibold text-white hover:bg-white/10'
            >
              <MessageCircle className='w-4 h-4' />
              WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Four promises, directly under the banner.
 *
 * Every one of them is a reason a first-time buyer hesitates: will it actually
 * arrive, who made it, what if it breaks, is this price the price. Answering
 * them in one strip is worth more than any amount of adjective further down
 * the page.
 */
const PROMISES = [
  { icon: Factory, title: 'Made in our factory', detail: 'Neemuch, Madhya Pradesh' },
  { icon: Truck, title: 'Delivered across India', detail: 'Packed and freighted by us' },
  { icon: IndianRupee, title: 'GST invoice on every order', detail: 'Price shown includes tax' },
  { icon: ShieldCheck, title: 'One year on the mechanism', detail: 'Repaired or replaced' },
]

function PromiseStrip() {
  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6'>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.07] rounded-2xl overflow-hidden ring-1 ring-black/[0.07]'>
        {PROMISES.map(({ icon: Icon, title, detail }) => (
          <div key={title} className='bg-white px-4 py-5 sm:px-6 sm:py-6 flex items-start gap-3'>
            <Icon className='w-5 h-5 shrink-0 text-amber-600 mt-0.5' strokeWidth={1.75} />
            <div className='min-w-0'>
              <p className='text-[13px] font-semibold text-gray-900 leading-snug'>{title}</p>
              <p className='mt-0.5 text-[11px] text-gray-500 leading-relaxed'>{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
