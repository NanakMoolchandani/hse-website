/**
 * Thank you.
 *
 * This page loads before the order exists. The buyer is redirected back the
 * instant the payment clears, while the webhook that actually writes the order
 * is still in flight on a different connection, so the first answer from the
 * server is almost always PENDING. That is not an error and must never look
 * like one: the money has moved, and telling someone "we have no record of
 * this" three seconds after taking ₹14,000 from them is how a support call
 * starts.
 *
 * So it polls, briefly, and if the order still has not appeared it says the
 * true thing: the payment went through, the confirmation is coming, here is the
 * WhatsApp number. Nothing is lost either way; the webhook writes the order
 * whether this tab is open or not.
 *
 * PURCHASE is fired here rather than in the webhook because it belongs to the
 * browsing session: it is the event that closes the funnel the rest of the
 * store dashboard is built from.
 */

import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, MessageCircle, Loader2, ArrowRight } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO from '@/src/components/SEO'
import OrderDetail from '@/src/components/OrderDetail'
import { fetchOrderByRef, track, type OrderView } from '@/src/lib/analytics'
import { clearCart } from '@/src/lib/cart'

/** Long enough for a healthy webhook, short enough not to look stuck. */
const POLL_MS = 2000
const GIVE_UP_AFTER_MS = 40000

export default function OrderSuccess() {
  const [params] = useSearchParams()
  const ref = params.get('ref')

  const [order, setOrder] = useState<OrderView | null>(null)
  const [state, setState] = useState<'waiting' | 'found' | 'slow' | 'unknown'>(
    ref ? 'waiting' : 'unknown',
  )
  const purchaseTracked = useRef(false)

  useEffect(() => {
    if (!ref) return
    let live = true
    const startedAt = Date.now()

    // The bag is emptied on arrival, not on confirmation. The payment has
    // cleared; leaving the items sitting there invites a second purchase of
    // the same chairs.
    clearCart()

    const poll = async () => {
      if (!live) return
      const result = await fetchOrderByRef(ref)
      if (!live) return

      if (result.status === 'FOUND') {
        setOrder(result.order)
        setState('found')
        if (!purchaseTracked.current) {
          purchaseTracked.current = true
          track('PURCHASE', {
            value: result.order.grandTotal,
            meta: { orderNumber: result.order.orderNumber },
          })
        }
        return
      }

      if (Date.now() - startedAt > GIVE_UP_AFTER_MS) {
        setState(result.status === 'NOT_FOUND' ? 'unknown' : 'slow')
        return
      }

      window.setTimeout(poll, POLL_MS)
    }

    void poll()
    return () => { live = false }
  }, [ref])

  return (
    <div className='min-h-screen bg-white pt-16 flex flex-col'>
      <SEO
        title='Order Confirmed'
        description='Thank you for your order.'
        canonical='/order/success'
        noindex
      />

      <div className='flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16'>
        {/* The confirmation reads the same whether the order row has landed
            yet or not, because from the buyer's side it has: they paid. */}
        {/* The only place on the site with a bounce. Someone has just handed
            over a five-figure sum to a manufacturer they may have met an hour
            ago; this is the moment that should feel like something happened. */}
        <div className='text-center'>
          <span className='animate-pop-in inline-grid place-items-center w-16 h-16 rounded-full bg-emerald-50'>
            <CheckCircle2 className='w-8 h-8 text-emerald-600' />
          </span>
          <h1
            className='animate-notice-in mt-5 text-display text-gray-900'
            style={{ animationDelay: '120ms' }}
          >
            Thank you, your order is placed
          </h1>
          <p
            className='animate-notice-in mt-3 text-gray-500 max-w-md mx-auto leading-relaxed'
            style={{ animationDelay: '200ms' }}
          >
            We have your payment. A receipt is on its way to your email, and we will send
            delivery updates on WhatsApp.
          </p>
        </div>

        <div className='mt-10'>
          {state === 'waiting' && (
            <div className='rounded-xl border border-gray-200 py-10 text-center'>
              <Loader2 className='w-5 h-5 mx-auto text-gray-400 animate-spin' />
              <p className='mt-3 text-sm text-gray-500'>Confirming your order…</p>
            </div>
          )}

          {state === 'found' && order && <OrderDetail order={order} />}

          {state === 'slow' && (
            <div className='rounded-xl border border-gray-200 px-5 py-6 text-center'>
              <p className='text-sm font-medium text-gray-900'>
                Your payment went through and your order is being recorded.
              </p>
              <p className='mt-1.5 text-sm text-gray-500'>
                The confirmation will reach you shortly. Nothing further is needed from you.
              </p>
            </div>
          )}

          {state === 'unknown' && (
            <div className='rounded-xl border border-gray-200 px-5 py-6 text-center'>
              <p className='text-sm font-medium text-gray-900'>
                We could not find this order on the page.
              </p>
              <p className='mt-1.5 text-sm text-gray-500'>
                If you were charged, the order exists and we will contact you. Send us your
                payment reference on WhatsApp and we will confirm it straight away.
              </p>
            </div>
          )}
        </div>

        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <a
            href='https://wa.me/919981516171'
            onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'order-success' } })}
            className='inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-emerald-600 text-sm font-semibold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-emerald-700 active:scale-[0.98]'
          >
            <MessageCircle className='w-4 h-4' />
            Message us
          </a>
          <Link
            to='/order/track'
            className='inline-flex items-center gap-1.5 h-11 px-5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 transition-transform duration-150 ease-out active:scale-[0.98]'
          >
            Track this order
          </Link>
          <Link
            to='/shop'
            className='inline-flex items-center gap-1.5 h-11 px-5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors'
          >
            Keep shopping <ArrowRight className='w-4 h-4' />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
