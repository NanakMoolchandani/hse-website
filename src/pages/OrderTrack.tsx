/**
 * Track an order.
 *
 * This is what stands in for "my account", and it is a better fit than one. A
 * buyer who ordered a chair in March will not remember a password they set in
 * March; they will have the order number in an email and their own phone number
 * in their hand. Those two are the proof, and nothing is stored on this device
 * to make it work.
 *
 * A wrong number and a non-existent order give the same answer, deliberately.
 * Order numbers run in sequence and are therefore guessable, so distinguishing
 * the two would turn this into a way of testing whether a phone number has ever
 * bought anything.
 */

import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, MessageCircle, Loader2 } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO from '@/src/components/SEO'
import OrderDetail from '@/src/components/OrderDetail'
import { fetchOrderByNumber, track, type OrderView } from '@/src/lib/analytics'

export default function OrderTrack() {
  const [params] = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(params.get('number') ?? '')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState<OrderView | null>(null)
  const [searching, setSearching] = useState(false)
  const [missing, setMissing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searching) return

    setSearching(true)
    setMissing(false)
    setOrder(null)

    const result = await fetchOrderByNumber(orderNumber.trim(), phone.trim())
    if (result.status === 'FOUND') setOrder(result.order)
    else setMissing(true)

    setSearching(false)
  }

  return (
    <div className='min-h-screen bg-white pt-16 flex flex-col'>
      <SEO
        title='Track Your Order'
        description='Check the status of your MVM Aasanam order with your order number and phone number.'
        canonical='/order/track'
      />

      <div className='flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Track your order</h1>
        <p className='mt-2 text-sm text-gray-500'>
          Enter the order number from your confirmation and the mobile number you ordered with.
          No login needed.
        </p>

        <form onSubmit={handleSubmit} className='mt-8 grid sm:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='number' className='block text-xs font-medium text-gray-700 mb-1.5'>
              Order number
            </label>
            <input
              id='number'
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder='WEB-AUG-26-0001'
              className='w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-300 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500'
            />
          </div>

          <div>
            <label htmlFor='phone' className='block text-xs font-medium text-gray-700 mb-1.5'>
              Mobile number
            </label>
            <input
              id='phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode='numeric'
              placeholder='10-digit mobile'
              className='w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500'
            />
          </div>

          <button
            type='submit'
            disabled={searching || orderNumber.trim().length < 6 || phone.replace(/\D/g, '').length < 10}
            className='sm:col-span-2 h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-sm font-semibold text-white transition-transform duration-150 ease-out active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100'
          >
            {searching ? <Loader2 className='w-4 h-4 animate-spin' /> : <Search className='w-4 h-4' />}
            Find my order
          </button>
        </form>

        {missing && (
          <div className='mt-8 rounded-xl border border-gray-200 px-5 py-6 text-center'>
            <p className='text-sm font-medium text-gray-900'>
              No order matches that number and mobile.
            </p>
            <p className='mt-1.5 text-sm text-gray-500'>
              Check both against your confirmation email, or message us and we will look it up.
            </p>
            <a
              href='https://wa.me/919981516171'
              onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'order-track-miss' } })}
              className='mt-4 inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-emerald-600 text-sm font-semibold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-emerald-700 active:scale-[0.98]'
            >
              <MessageCircle className='w-4 h-4' />
              Message us
            </a>
          </div>
        )}

        {order && (
          <div className='mt-8'>
            <OrderDetail order={order} />
          </div>
        )}

        <p className='mt-10 text-xs text-gray-400'>
          Looking for something else? <Link to='/shop' className='underline underline-offset-2'>Visit the shop</Link>.
        </p>
      </div>

      <Footer />
    </div>
  )
}
