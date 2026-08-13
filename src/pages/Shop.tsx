/**
 * Everything that can be bought right now.
 *
 * The brand pages are a catalogue: hundreds of models, most of them sold
 * wholesale on a quoted price. This page is the shop, and the difference is the
 * whole point of it existing. A chair appears here only when it has a published
 * `web_products` row, which means it has a price, a stock count and someone has
 * decided it is for sale to the public.
 *
 * The live feed is the source of the list. The catalogue is then asked for the
 * photos and the category of exactly those slugs, which is what lets each card
 * link back into the full product page rather than dead-ending in the shop.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Check, ArrowRight, Truck } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO from '@/src/components/SEO'
import { supabase } from '@/src/lib/supabase'
import { fetchLivePricing, track } from '@/src/lib/analytics'
import { addToCart } from '@/src/lib/cart'
import { getCategoryByEnum } from '@/src/lib/categories'
import { inr } from '@/src/lib/utils'

interface ShopItem {
  id: number
  slug: string
  name: string
  price: number
  compareAtPrice: number | null
  inStock: boolean
  availableQty: number | null
  colorName: string | null
  image: string | null
  /** Path into the full product page, when the catalogue knows its category. */
  href: string
}

interface CatalogRow {
  slug: string | null
  category: string | null
  thumbnail_url: string | null
  processed_photo_urls: string[] | null
  raw_photo_urls: string[] | null
}

export default function Shop() {
  const [items, setItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState<number | null>(null)

  useEffect(() => {
    let live = true

    void (async () => {
      try {
        const { products } = await fetchLivePricing()
        if (!live) return

        if (products.length === 0) {
          setItems([])
          setLoading(false)
          return
        }

        const slugs = products.map((p) => p.slug).filter(Boolean)
        const { data } = await supabase
          .from('catalog_products')
          .select('slug, category, thumbnail_url, processed_photo_urls, raw_photo_urls')
          .in('slug', slugs)

        if (!live) return

        const catalogue = new Map<string, CatalogRow>()
        for (const row of (data ?? []) as CatalogRow[]) {
          if (row.slug) catalogue.set(row.slug, row)
        }

        setItems(products.map((p) => {
          const row = catalogue.get(p.slug)
          const category = row?.category ? getCategoryByEnum(row.category) : undefined
          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            inStock: p.inStock,
            availableQty: p.availableQty,
            colorName: p.colorName,
            image:
              row?.processed_photo_urls?.[0] ??
              row?.thumbnail_url ??
              row?.raw_photo_urls?.[0] ??
              p.thumbnailUrl ??
              null,
            href: category ? `/mvm/${category.slug}/${p.slug}` : '/mvm',
          }
        }))
      } catch {
        if (live) setItems([])
      } finally {
        if (live) setLoading(false)
      }
    })()

    return () => { live = false }
  }, [])

  const handleAdd = (item: ShopItem) => {
    addToCart(item.id, 1, { name: item.name, price: item.price })
    setAddedId(item.id)
    window.setTimeout(() => setAddedId((id) => (id === item.id ? null : id)), 2200)
  }

  return (
    <div className='min-h-screen bg-white pt-16'>
      <SEO
        title='Buy Office Chairs Online'
        description='Buy MVM Aasanam office chairs online with delivery across India. Executive chairs, ergonomic task chairs and visitor seating, made in Neemuch, Madhya Pradesh.'
        canonical='/shop'
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14'>
        <header className='mb-8 sm:mb-10'>
          <h1 className='text-3xl sm:text-4xl font-bold tracking-tight text-gray-900'>Shop</h1>
          <p className='mt-2 text-gray-500 max-w-2xl'>
            Chairs we make in Neemuch, in stock and ready to ship. Prices include GST,
            and delivery is free above {inr(15000)}.
          </p>
        </header>

        {loading && (
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='rounded-xl border border-gray-100 overflow-hidden'>
                <div className='aspect-square bg-gray-50 animate-pulse' />
                <div className='p-3 space-y-2'>
                  <div className='h-3.5 w-3/4 bg-gray-50 rounded animate-pulse' />
                  <div className='h-4 w-1/3 bg-gray-50 rounded animate-pulse' />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nothing published yet is a real and expected state on day one, and it
            must not look like the page is broken. */}
        {!loading && items.length === 0 && (
          <div className='rounded-xl border border-dashed border-gray-200 py-16 px-6 text-center'>
            <p className='text-gray-900 font-medium'>Online ordering is opening shortly.</p>
            <p className='mt-1.5 text-sm text-gray-500 max-w-md mx-auto'>
              The full range is in the catalogue, and we quote and deliver anywhere in
              India today. Message us and we will send prices.
            </p>
            <div className='mt-5 flex flex-wrap items-center justify-center gap-3'>
              <a
                href='https://wa.me/919981516171'
                onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'shop-empty' } })}
                className='inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-amber-500 text-sm font-semibold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-amber-600 active:scale-[0.98]'
              >
                WhatsApp us
              </a>
              <Link
                to='/mvm'
                className='inline-flex items-center gap-1.5 h-11 px-5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 transition-transform duration-150 ease-out active:scale-[0.98]'
              >
                Browse the catalogue <ArrowRight className='w-4 h-4' />
              </Link>
            </div>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
            {items.map((item) => (
              <article
                key={item.id}
                className='group rounded-xl border border-gray-100 overflow-hidden flex flex-col hover:border-gray-200 hover:shadow-sm transition-[border-color,box-shadow] duration-200'
              >
                <Link to={item.href} className='block aspect-square bg-gray-50 overflow-hidden'>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      loading='lazy'
                      className='w-full h-full object-contain p-3 transition-transform duration-300 ease-out group-hover:scale-[1.03]'
                    />
                  ) : (
                    <div className='w-full h-full grid place-items-center text-gray-300 text-xs'>
                      No photo
                    </div>
                  )}
                </Link>

                <div className='p-3 sm:p-4 flex flex-col flex-1'>
                  <Link to={item.href} className='block'>
                    <h2 className='text-sm font-semibold text-gray-900 leading-snug line-clamp-2'>
                      {item.name}
                    </h2>
                  </Link>
                  {item.colorName && (
                    <p className='mt-0.5 text-xs text-gray-400'>{item.colorName}</p>
                  )}

                  <div className='mt-2 flex items-baseline gap-2'>
                    <span className='text-base font-bold text-gray-900 tabular-nums'>
                      {inr(item.price)}
                    </span>
                    {item.compareAtPrice && item.compareAtPrice > item.price && (
                      <span className='text-xs text-gray-400 line-through tabular-nums'>
                        {inr(item.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  {item.inStock && item.availableQty !== null && item.availableQty <= 5 && (
                    <p className='mt-1 text-[11px] font-medium text-amber-600'>
                      Only {item.availableQty} left
                    </p>
                  )}

                  <div className='mt-auto pt-3'>
                    {item.inStock ? (
                      <button
                        type='button'
                        onClick={() => handleAdd(item)}
                        className='w-full h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-xs font-semibold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-gray-800 active:scale-[0.98]'
                      >
                        {addedId === item.id ? (
                          <><Check className='w-3.5 h-3.5' /> Added</>
                        ) : (
                          <><ShoppingBag className='w-3.5 h-3.5' /> Add to bag</>
                        )}
                      </button>
                    ) : (
                      <span className='w-full h-10 inline-flex items-center justify-center rounded-lg border border-gray-200 text-xs font-medium text-gray-400'>
                        Out of stock
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && items.length > 0 && (
          <p className='mt-8 inline-flex items-center gap-2 text-xs text-gray-500'>
            <Truck className='w-3.5 h-3.5 text-gray-400' />
            Delivered across India. Free above {inr(15000)}, otherwise a flat {inr(499)}.
          </p>
        )}
      </div>

      <Footer />
    </div>
  )
}
