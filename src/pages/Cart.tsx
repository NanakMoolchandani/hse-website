/**
 * The bag.
 *
 * Its one job is to be honest about the total before anyone commits to paying
 * it. Delivery is shown as a line here, not revealed on the payment page, and
 * the gap to free delivery is spelled out while there is still time to act on
 * it. Every figure comes from the server, which is the same code path that
 * prices the payment.
 */

import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Truck, Info } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO from '@/src/components/SEO'
import { useCart, loadCart, setQuantity, removeFromCart, dismissNotice } from '@/src/lib/cart'
import { track, adoptCartId } from '@/src/lib/analytics'
import { inr } from '@/src/lib/utils'

export default function Cart() {
  const cart = useCart()
  const [params] = useSearchParams()
  const cancelled = params.get('cancelled') === '1'
  const recover = params.get('cart')

  useEffect(() => {
    // A recovery link carries the cart id, so the basket refills on a phone
    // that has never seen this site.
    if (recover) adoptCartId(recover)
    loadCart()
    track('VIEW_CART')
  }, [recover])

  const empty = cart.status !== 'idle' && cart.lines.length === 0

  return (
    <div className='min-h-screen bg-white pt-16 flex flex-col'>
      <SEO
        title='Your Bag'
        description='Review your MVM Aasanam order before checkout.'
        canonical='/cart'
        noindex
      />

      <div className='flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14'>
        <h1 className='text-display text-gray-900'>Your bag</h1>

        {cancelled && (
          <p className='mt-4 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-900'>
            Payment was cancelled and nothing has been charged. Your bag is exactly as you left it.
          </p>
        )}

        {cart.notice && (
          <div className='mt-4 flex items-start gap-2 rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 text-sm text-gray-700'>
            <Info className='w-4 h-4 mt-0.5 shrink-0 text-gray-400' />
            <span className='flex-1'>{cart.notice}</span>
            <button
              type='button'
              onClick={dismissNotice}
              className='text-xs font-medium text-gray-500 hover:text-gray-900'
            >
              Dismiss
            </button>
          </div>
        )}

        {cart.error && (
          <p className='mt-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-800'>
            {cart.error}
          </p>
        )}

        {cart.status === 'idle' && (
          <div className='mt-8 space-y-3'>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className='h-24 rounded-xl bg-gray-50 animate-pulse' />
            ))}
          </div>
        )}

        {empty && (
          <div className='mt-8 rounded-xl border border-dashed border-gray-200 py-16 px-6 text-center'>
            <ShoppingBag className='w-6 h-6 mx-auto text-gray-300' />
            <p className='mt-3 text-gray-900 font-medium'>Your bag is empty.</p>
            <Link
              to='/shop'
              className='pressable mt-5 inline-flex items-center gap-1.5 h-11 px-5 rounded-lg bg-gray-900 text-sm font-semibold text-white shadow-sm hover:bg-gray-800'
            >
              Browse the shop <ArrowRight className='w-4 h-4' />
            </Link>
          </div>
        )}

        {cart.lines.length > 0 && (
          <div className='mt-8 grid lg:grid-cols-[1fr_320px] gap-8 items-start'>
            {/* Lines */}
            <ul className='divide-y divide-gray-100 border-y border-gray-100'>
              {cart.lines.map((line) => (
                <li key={line.webProductId} className='py-4 flex gap-4'>
                  <div className='w-20 h-20 shrink-0 rounded-lg bg-gray-50 overflow-hidden'>
                    {line.imageUrl && (
                      <img
                        src={line.imageUrl}
                        alt={line.name}
                        loading='lazy'
                        className='w-full h-full object-contain p-1.5'
                      />
                    )}
                  </div>

                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-gray-900 leading-snug'>{line.name}</p>
                    {line.variantLabel && (
                      <p className='text-xs text-gray-400 mt-0.5'>{line.variantLabel}</p>
                    )}
                    <p className='text-xs text-gray-500 mt-1 tabular-nums'>
                      {inr(line.unitPrice)} each
                    </p>

                    <div className='mt-2.5 flex items-center gap-3'>
                      <div className='inline-flex items-center rounded-lg border border-black/[0.08] overflow-hidden'>
                        <button
                          type='button'
                          onClick={() => setQuantity(line.webProductId, line.quantity - 1)}
                          aria-label='Reduce quantity'
                          className='pressable w-9 h-9 grid place-items-center text-gray-600 hover:bg-black/[0.04]'
                        >
                          <Minus className='w-3.5 h-3.5' />
                        </button>
                        <span className='w-8 text-center text-sm font-semibold tabular-nums'>
                          {line.quantity}
                        </span>
                        <button
                          type='button'
                          onClick={() => setQuantity(line.webProductId, line.quantity + 1)}
                          aria-label='Increase quantity'
                          className='pressable w-9 h-9 grid place-items-center text-gray-600 hover:bg-black/[0.04]'
                        >
                          <Plus className='w-3.5 h-3.5' />
                        </button>
                      </div>

                      <button
                        type='button'
                        onClick={() => removeFromCart(line.webProductId)}
                        className='inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors'
                      >
                        <Trash2 className='w-3.5 h-3.5' /> Remove
                      </button>
                    </div>
                  </div>

                  <p className='text-sm font-semibold text-gray-900 tabular-nums shrink-0'>
                    {inr(line.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Summary */}
            <aside className='rounded-xl border border-black/[0.06] bg-white p-5 shadow-sm lg:sticky lg:top-24'>
              <h2 className='text-sm font-semibold text-gray-900'>Order summary</h2>

              <dl className='mt-4 space-y-2.5 text-sm'>
                <div className='flex justify-between'>
                  <dt className='text-gray-500'>Subtotal</dt>
                  <dd className='font-medium text-gray-900 tabular-nums'>{inr(cart.subtotal)}</dd>
                </div>
                <div className='flex justify-between'>
                  <dt className='text-gray-500'>Delivery</dt>
                  <dd className='font-medium text-gray-900 tabular-nums'>
                    {cart.shipping === 0 ? 'Free' : inr(cart.shipping)}
                  </dd>
                </div>
                <div className='pt-3 border-t border-gray-100 flex justify-between text-base'>
                  <dt className='font-semibold text-gray-900'>Total</dt>
                  <dd className='font-semibold tracking-[-0.01em] text-gray-900 tabular-nums'>{inr(cart.total)}</dd>
                </div>
              </dl>

              <p className='mt-1.5 text-[11px] text-gray-400'>GST included</p>

              {cart.amountToFreeShipping > 0 && (
                <p className='mt-3 inline-flex items-start gap-1.5 text-xs text-gray-600'>
                  <Truck className='w-3.5 h-3.5 mt-px shrink-0 text-gray-400' />
                  Add {inr(cart.amountToFreeShipping)} more for free delivery.
                </p>
              )}

              <Link
                to='/checkout'
                className='pressable mt-5 w-full h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 text-sm font-semibold text-white shadow-sm hover:bg-amber-600'
              >
                Checkout <ArrowRight className='w-4 h-4' />
              </Link>

              <Link
                to='/shop'
                className='pressable mt-2.5 w-full h-11 inline-flex items-center justify-center rounded-lg border border-black/[0.08] text-sm font-medium text-gray-700 hover:bg-black/[0.03]'
              >
                Keep shopping
              </Link>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
