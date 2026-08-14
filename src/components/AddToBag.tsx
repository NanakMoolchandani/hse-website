/**
 * The buy controls for one product.
 *
 * Three states, and the transition between them is the whole point:
 *
 *   empty      a single "Add to bag" button
 *   in the bag a stepper showing how many, so a second tap adds a second one
 *              rather than re-adding the first
 *   at the cap the plus is spent, and a line appears explaining that ten is
 *              where retail stops and wholesale begins
 *
 * The old shop card said "Add to bag", then said "Added", then said "Add to
 * bag" again, which left no way to tell how many were in the bag or to add
 * another without going to the cart. Showing the count in place fixes both.
 *
 * Quantities come from `cart.quantities`, which is local intent rather than the
 * server's reply, so the number moves in the same frame as the tap.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, MessageCircle } from 'lucide-react'
import { useCart, addToCart, setQuantity, RETAIL_MAX_PER_PRODUCT } from '@/src/lib/cart'
import { track } from '@/src/lib/analytics'

const WHATSAPP = '919981516171'

interface AddToBagProps {
  productId: number
  name: string
  price: number
  inStock: boolean
  /** Stock ceiling from the live feed, when it is lower than the retail cap. */
  availableQty?: number | null
  /** `compact` is the in-card version; `full` is the product page. */
  size?: 'compact' | 'full'
}

export default function AddToBag({
  productId,
  name,
  price,
  inStock,
  availableQty,
  size = 'compact',
}: AddToBagProps) {
  const cart = useCart()
  const navigate = useNavigate()
  const [hitCap, setHitCap] = useState(false)

  const quantity = cart.quantities[productId] ?? 0

  // Whichever runs out first: the retail limit, or what is actually in the godown.
  const ceiling = Math.min(
    RETAIL_MAX_PER_PRODUCT,
    availableQty ?? RETAIL_MAX_PER_PRODUCT,
  )
  const atCap = quantity >= ceiling
  const capIsRetailLimit = ceiling === RETAIL_MAX_PER_PRODUCT

  const compact = size === 'compact'
  const h = compact ? 'h-10' : 'h-12'
  const text = compact ? 'text-xs' : 'text-sm'

  if (!inStock) {
    return (
      <span className={`w-full ${h} inline-flex items-center justify-center rounded-lg border border-black/[0.08] ${text} font-medium text-gray-400`}>
        Out of stock
      </span>
    )
  }

  const bump = (delta: number) => {
    const next = quantity + delta
    if (next > ceiling) {
      setHitCap(true)
      return
    }
    setHitCap(false)
    setQuantity(productId, next)
  }

  const add = () => {
    if (atCap) {
      setHitCap(true)
      return
    }
    addToCart(productId, 1, { name, price })
  }

  const buyNow = () => {
    if (quantity === 0) addToCart(productId, 1, { name, price })
    track('BEGIN_CHECKOUT', { productId, meta: { via: 'buy-now' } })
    navigate('/checkout')
  }

  return (
    <div className='w-full'>
      {/* Side by side wherever there is width for it. These are alternatives,
          not a sequence: stacked, the lower one reads as a consequence of the
          upper, and the pair takes twice the vertical space on a card whose
          height every other card in the row has to match.

          On a phone there is no width to share. Two cards to a row at 390px
          leaves each button about 73px, and "Add to bag" needs 82px, so side
          by side it wrapped onto two lines and the buttons grew to fit. One
          per row is the lesser cost. */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
        {/* These two are one control in the buyer's head, so the swap gets a
            bridge. React remounts on the branch flip, which is what runs the
            entrance; without it the button is simply replaced by a stepper
            between one frame and the next. */}
        {quantity === 0 ? (
          <button
            type='button'
            onClick={add}
            className={`pressable animate-swap-in w-full ${h} inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 ${text} font-semibold text-white whitespace-nowrap hover:bg-gray-800`}
          >
            <ShoppingBag className='w-3.5 h-3.5' />
            Add to bag
          </button>
        ) : (
          <div className={`animate-swap-in w-full ${h} flex items-stretch rounded-lg border border-black/[0.1] overflow-hidden`}>
            <button
              type='button'
              onClick={() => bump(-1)}
              aria-label={quantity === 1 ? `Remove ${name}` : `One fewer ${name}`}
              className='pressable w-11 grid place-items-center text-gray-600 hover:bg-black/[0.04]'
            >
              <Minus className='w-3.5 h-3.5' />
            </button>
            <span className={`flex-1 grid place-items-center ${text} font-semibold tabular-nums text-gray-900`}>
              {quantity} in bag
            </span>
            {/* Deliberately NOT disabled at the cap. A dead plus button gives
                the buyer no idea why the number stopped moving; pressing it is
                how they ask, and the answer is the note below. */}
            <button
              type='button'
              onClick={() => bump(1)}
              aria-label={atCap ? `Why can I not add more ${name}` : `One more ${name}`}
              className={`pressable w-11 grid place-items-center hover:bg-black/[0.04] ${
                atCap ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <Plus className='w-3.5 h-3.5' />
            </button>
          </div>
        )}

        <button
          type='button'
          onClick={buyNow}
          className={`pressable w-full ${h} inline-flex items-center justify-center rounded-lg bg-amber-500 ${text} font-semibold text-white whitespace-nowrap shadow-sm hover:bg-amber-600`}
        >
          Buy now
        </button>
      </div>

      {/* Only after they actually try to go past it. Showing the ceiling
          before anyone has reached it is noise on every card. */}
      {hitCap && atCap && (
        <p className='animate-notice-in mt-2.5 text-[11px] leading-relaxed text-gray-500'>
          {capIsRetailLimit ? (
            <>
              Ten is the most of one item you can order here. For a larger
              quantity we check the stock and the production run first, then
              quote you a wholesale price.{' '}
            </>
          ) : (
            <>
              Only {ceiling} of this one left in stock. We can make more to
              order.{' '}
            </>
          )}
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
              `Hi, I would like more than ${ceiling} of the ${name}. Please check stock and share a price.`,
            )}`}
            onClick={() => track('WHATSAPP_CLICK', { productId, meta: { context: 'retail-cap' } })}
            className='inline-flex items-center gap-1 font-semibold text-amber-700 underline underline-offset-2'
          >
            <MessageCircle className='w-3 h-3' />
            Ask on WhatsApp
          </a>
        </p>
      )}
    </div>
  )
}
