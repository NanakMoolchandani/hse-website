/**
 * Price, stock and the button that starts a sale.
 *
 * Mounted on the product page under the title. It looks the product up in the
 * live price feed by slug, and everything it shows comes from there: the
 * catalogue in Supabase knows what a chair looks like, but only the admin app
 * knows what it costs today and whether there is one in the godown.
 *
 * When a product is not published for sale it renders nothing at all. Most of
 * the catalogue is wholesale, quoted per deal, and a "₹0" or an "Out of stock"
 * badge on a chair we sell every week would be worse than silence: the page
 * already carries a WhatsApp button, which is how those enquiries have always
 * arrived.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Check, Truck, ShieldCheck } from 'lucide-react'
import { fetchLivePricing, track } from '@/src/lib/analytics'
import { addToCart } from '@/src/lib/cart'
import { inr } from '@/src/lib/utils'

interface LiveProduct {
  id: number
  slug: string
  name: string
  price: number
  compareAtPrice: number | null
  inStock: boolean
  availableQty: number | null
  colorName: string | null
}

interface BuyBoxProps {
  /** Catalogue slug of the variant currently on screen. */
  slug: string
}

export default function BuyBox({ slug }: BuyBoxProps) {
  const [product, setProduct] = useState<LiveProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let live = true
    setLoading(true)
    setQuantity(1)
    setAdded(false)

    fetchLivePricing(slug)
      .then((res) => {
        if (!live) return
        setProduct((res.products[0] as LiveProduct) ?? null)
      })
      .catch(() => { if (live) setProduct(null) })
      .finally(() => { if (live) setLoading(false) })

    return () => { live = false }
  }, [slug])

  // A thin placeholder while the price loads, so the description below does not
  // jump down the page the moment it arrives.
  if (loading) return <div className='h-24 mb-6 rounded-xl bg-gray-50 animate-pulse' />

  // Not sold online. The page's WhatsApp button is the path for this product.
  if (!product) return null

  const max = product.availableQty ?? 10
  const canBuy = product.inStock
  const saving = product.compareAtPrice && product.compareAtPrice > product.price
    ? product.compareAtPrice - product.price
    : 0

  const handleAdd = () => {
    addToCart(product.id, quantity, { name: product.name, price: product.price })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  return (
    <div className='mb-8 rounded-xl border border-black/[0.06] bg-white p-4 sm:p-5 shadow-sm'>
      {/* Price */}
      <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
        <span className='text-3xl font-semibold tracking-[-0.02em] text-gray-900 tabular-nums'>{inr(product.price)}</span>
        {saving > 0 && (
          <>
            <span className='text-base text-gray-400 line-through tabular-nums'>
              {inr(product.compareAtPrice!)}
            </span>
            <span className='text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700'>
              Save {inr(saving)}
            </span>
          </>
        )}
      </div>
      <p className='mt-1 text-xs text-gray-500'>
        GST included{product.colorName ? ` · ${product.colorName}` : ''}
      </p>

      {/* Stock. The exact count appears only when it is low enough to matter. */}
      <div className='mt-3 flex items-center gap-2 text-sm'>
        {canBuy ? (
          <>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
            <span className='text-emerald-700 font-medium'>In stock</span>
            {product.availableQty !== null && product.availableQty <= 5 && (
              <span className='text-amber-600'>
                only {product.availableQty} left
              </span>
            )}
          </>
        ) : (
          <>
            <span className='w-1.5 h-1.5 rounded-full bg-gray-400' />
            <span className='text-gray-500 font-medium'>Out of stock</span>
          </>
        )}
      </div>

      {canBuy && (
        <div className='mt-4 flex flex-wrap items-center gap-3'>
          {/* Quantity */}
          <div className='inline-flex items-center rounded-lg border border-black/[0.08]'>
            <button
              type='button'
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label='Reduce quantity'
              className='pressable w-10 h-11 grid place-items-center text-gray-600 disabled:opacity-30'
            >
              <Minus className='w-4 h-4' />
            </button>
            <span className='w-9 text-center text-sm font-semibold tabular-nums'>{quantity}</span>
            <button
              type='button'
              onClick={() => setQuantity((q) => Math.min(max, q + 1))}
              disabled={quantity >= max}
              aria-label='Increase quantity'
              className='pressable w-10 h-11 grid place-items-center text-gray-600 disabled:opacity-30'
            >
              <Plus className='w-4 h-4' />
            </button>
          </div>

          <button
            type='button'
            onClick={handleAdd}
            className='pressable flex-1 min-w-[180px] h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600'
          >
            {added ? (
              <><Check className='w-4 h-4' /> Added to bag</>
            ) : (
              <><ShoppingBag className='w-4 h-4' /> Add to bag</>
            )}
          </button>
        </div>
      )}

      {added && (
        <Link
          to='/cart'
          onClick={() => track('VIEW_CART')}
          className='mt-3 inline-block text-sm font-medium text-amber-700 underline underline-offset-4'
        >
          Go to bag and check out
        </Link>
      )}

      {!canBuy && (
        <p className='mt-3 text-sm text-gray-500'>
          Message us on WhatsApp for the next production run, or to order in bulk.
        </p>
      )}

      {/* The two things a first-time buyer of a ₹12,000 chair actually wants to
          know before they will type a card number into a site they met through
          an ad an hour ago. */}
      <div className='mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-500'>
        <span className='inline-flex items-center gap-1.5'>
          <Truck className='w-3.5 h-3.5 text-gray-400' />
          Free delivery above {inr(15000)}
        </span>
        <span className='inline-flex items-center gap-1.5'>
          <ShieldCheck className='w-3.5 h-3.5 text-gray-400' />
          Made by us in Neemuch
        </span>
      </div>
    </div>
  )
}
