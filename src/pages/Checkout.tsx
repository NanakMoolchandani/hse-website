/**
 * Checkout.
 *
 * There is no account, and that is a decision rather than an omission. A chair
 * is bought once every few years, so an account is friction at the exact moment
 * someone is ready to pay, and it protects nothing: the order is confirmed by
 * the payment, not by a password. Everything a login would have provided is
 * provided without one. The buyer is recognised on their next order because
 * `web_customers` is matched on phone number, order updates go to WhatsApp
 * rather than to a dashboard nobody logs into, and an order can be looked up
 * with its number and the phone it was placed with.
 *
 * One page, not a wizard. Five fields of address split across three steps is
 * three chances to abandon, and on a phone the whole form fits in one scroll
 * anyway.
 *
 * The details are saved locally after a successful start, so the second order
 * is a review rather than a retype. They never leave this device except as part
 * of an order.
 */

import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, ArrowRight, ShoppingBag, MessageCircle } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO from '@/src/components/SEO'
import { useCart, loadCart } from '@/src/lib/cart'
import {
  startCheckout, verifyPayment, track, cartId, CheckoutFieldError,
} from '@/src/lib/analytics'
import { openRazorpay } from '@/src/lib/razorpay'
import { INDIAN_STATES, HOME_STATE } from '@/src/lib/states'
import ProtectionPicker, { PROTECTION_PLANS } from '@/src/components/ProtectionPicker'
import { inr } from '@/src/lib/utils'

const BUYER_KEY = 'mvm_buyer'

interface BuyerForm {
  name: string
  email: string
  phone: string
  line1: string
  line2: string
  landmark: string
  city: string
  state: string
  pincode: string
}

const BLANK: BuyerForm = {
  name: '', email: '', phone: '',
  line1: '', line2: '', landmark: '', city: '', state: HOME_STATE, pincode: '',
}

function readSaved(): BuyerForm {
  try {
    const raw = localStorage.getItem(BUYER_KEY)
    if (!raw) return BLANK
    return { ...BLANK, ...(JSON.parse(raw) as Partial<BuyerForm>) }
  } catch {
    return BLANK
  }
}

export default function Checkout() {
  const cart = useCart()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const cancelled = params.get('cancelled') === '1'

  const [form, setForm] = useState<BuyerForm>(BLANK)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [protectionPlan, setProtectionPlan] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)
  const shippingTracked = useRef(false)

  useEffect(() => {
    loadCart()
    setForm(readSaved())
  }, [])

  // Fires once, when the address first becomes complete. It is the funnel step
  // between "started checkout" and "paid", and the drop between those two is
  // the single most expensive number on the store dashboard.
  useEffect(() => {
    if (shippingTracked.current) return
    if (form.pincode.length === 6 && form.city.length > 1 && form.line1.length > 4) {
      shippingTracked.current = true
      track('ADD_SHIPPING_INFO')
    }
  }, [form.pincode, form.city, form.line1])

  const chosenPlan = PROTECTION_PLANS.find((p) => p.id === protectionPlan) ?? null
  const payable = cart.total + (chosenPlan?.price ?? 0)

  const set = (field: keyof BuyerForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting || cart.lines.length === 0) return

    setSubmitting(true)
    setErrors({})
    setFailure(null)

    try {
      const handle = await startCheckout({
        customer: { name: form.name, email: form.email, phone: form.phone },
        address: {
          line1: form.line1,
          line2: form.line2 || undefined,
          landmark: form.landmark || undefined,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        protectionPlan,
      })

      try {
        localStorage.setItem(BUYER_KEY, JSON.stringify(form))
      } catch {
        /* private mode — they will type it again next time */
      }

      // Read before the sheet opens: the thank-you page empties the bag on
      // arrival, and this id is how it finds the order that was just paid for.
      const ref = cartId()

      if (handle.inline) {
        const outcome = await openRazorpay(handle.inline)

        if (outcome.status === 'PAID') {
          // Best effort, and awaited only so the thank-you page usually has a
          // real order number on its first look. The webhook writes the order
          // whether this call lands or not.
          await verifyPayment(outcome.result as unknown as Record<string, string>)
          navigate(`/order/success?ref=${encodeURIComponent(ref)}`)
          return
        }

        // Closing the sheet is an ordinary thing to do. They come back to a
        // filled-in form and a bag that still has their chairs in it.
        if (outcome.status === 'FAILED') setFailure(outcome.reason)
        setSubmitting(false)
        return
      }

      if (handle.url) {
        // Full navigation, not a route change: that page is another origin.
        window.location.href = handle.url
        return
      }

      throw new Error('Could not start the payment')
    } catch (err) {
      if (err instanceof CheckoutFieldError) {
        setErrors(err.fields)
        // Send them to the first thing that is wrong rather than making them
        // hunt for it in a form they have just scrolled past.
        const first = Object.keys(err.fields)[0]
        document.getElementById(first)?.focus()
      } else {
        setFailure(err instanceof Error ? err.message : 'Could not start the payment')
      }
      setSubmitting(false)
    }
  }

  if (cart.status !== 'idle' && cart.lines.length === 0) {
    return (
      <div className='min-h-screen bg-white pt-16 flex flex-col'>
        <SEO title='Checkout' description='Complete your MVM Aasanam order.' canonical='/checkout' noindex />
        <div className='flex-1 max-w-md w-full mx-auto px-4 py-24 text-center'>
          <ShoppingBag className='w-6 h-6 mx-auto text-gray-300' />
          <p className='mt-3 font-medium text-gray-900'>There is nothing to check out.</p>
          <button
            type='button'
            onClick={() => navigate('/shop')}
            className='pressable mt-5 inline-flex items-center gap-1.5 h-11 px-5 rounded-lg bg-gray-900 text-sm font-semibold text-white shadow-sm hover:bg-gray-800'
          >
            Browse the shop <ArrowRight className='w-4 h-4' />
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white pt-16 flex flex-col'>
      <SEO title='Checkout' description='Complete your MVM Aasanam order.' canonical='/checkout' noindex />

      <div className='flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14'>
        <h1 className='text-display text-gray-900'>Checkout</h1>
        <p className='mt-1.5 text-sm text-gray-500'>
          No account needed. Fill this in once and pay.
        </p>

        {cancelled && (
          <p className='animate-notice-in mt-5 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-900'>
            Payment was cancelled and nothing has been charged. Your details are still here.
          </p>
        )}

        <form onSubmit={handleSubmit} className='mt-8 grid lg:grid-cols-[1fr_320px] gap-8 items-start'>
          <div className='space-y-8'>
            {/* Contact */}
            <section>
              <h2 className='text-sm font-semibold text-gray-900'>Contact</h2>
              <p className='mt-1 text-xs text-gray-500'>
                We send the receipt to your email and delivery updates to WhatsApp.
              </p>

              <div className='mt-4 grid sm:grid-cols-2 gap-4'>
                <Field
                  id='name' label='Full name' value={form.name} onChange={set('name')}
                  error={errors.name} autoComplete='name' className='sm:col-span-2'
                />
                <Field
                  id='email' label='Email' type='email' value={form.email} onChange={set('email')}
                  error={errors.email} autoComplete='email' inputMode='email'
                />
                <Field
                  id='phone' label='WhatsApp number' value={form.phone} onChange={set('phone')}
                  error={errors.phone} autoComplete='tel' inputMode='numeric'
                  placeholder='10-digit mobile' prefix='+91'
                />
              </div>
            </section>

            {/* Address */}
            <section>
              <h2 className='text-sm font-semibold text-gray-900'>Delivery address</h2>

              <div className='mt-4 grid sm:grid-cols-2 gap-4'>
                <Field
                  id='line1' label='House / building and street' value={form.line1} onChange={set('line1')}
                  error={errors.line1} autoComplete='address-line1' className='sm:col-span-2'
                />
                <Field
                  id='line2' label='Area or colony' value={form.line2} onChange={set('line2')}
                  autoComplete='address-line2' optional className='sm:col-span-2'
                />
                <Field
                  id='landmark' label='Landmark' value={form.landmark} onChange={set('landmark')}
                  optional placeholder='Helps the driver find you'
                />
                <Field
                  id='city' label='City or town' value={form.city} onChange={set('city')}
                  error={errors.city} autoComplete='address-level2'
                />

                <div>
                  <label htmlFor='state' className='block text-xs font-medium text-gray-700 mb-1.5'>
                    State
                  </label>
                  <select
                    id='state'
                    value={form.state}
                    onChange={set('state')}
                    autoComplete='address-level1'
                    className='w-full h-11 rounded-lg border border-black/[0.1] bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-[border-color,box-shadow] duration-150 ease-spring'
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className='mt-1 text-xs text-red-600'>{errors.state}</p>}
                </div>

                <Field
                  id='pincode' label='PIN code' value={form.pincode} onChange={set('pincode')}
                  error={errors.pincode} autoComplete='postal-code' inputMode='numeric' maxLength={6}
                />
              </div>
            </section>

            <ProtectionPicker value={protectionPlan} onChange={setProtectionPlan} />

            {failure && (
              <div className='animate-notice-in rounded-lg bg-red-50 border border-red-100 px-4 py-3'>
                <p className='text-sm text-red-800'>{failure}</p>
                <a
                  href='https://wa.me/919981516171'
                  onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'checkout-failure' } })}
                  className='mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-red-900 underline underline-offset-4'
                >
                  <MessageCircle className='w-3.5 h-3.5' />
                  Order on WhatsApp instead
                </a>
              </div>
            )}
          </div>

          {/* Summary */}
          <aside className='rounded-xl border border-black/[0.06] bg-white p-5 shadow-sm lg:sticky lg:top-24'>
            <h2 className='text-sm font-semibold text-gray-900'>Your order</h2>

            <ul className='mt-4 space-y-3'>
              {cart.lines.map((line) => (
                <li key={line.webProductId} className='flex gap-3 text-sm'>
                  <span className='w-6 h-6 shrink-0 grid place-items-center rounded bg-gray-100 text-[11px] font-semibold text-gray-600 tabular-nums'>
                    {line.quantity}
                  </span>
                  <span className='flex-1 min-w-0 text-gray-700 leading-snug'>
                    {line.name}
                    {line.variantLabel && (
                      <span className='block text-xs text-gray-400'>{line.variantLabel}</span>
                    )}
                  </span>
                  <span className='font-medium text-gray-900 tabular-nums'>{inr(line.lineTotal)}</span>
                </li>
              ))}
            </ul>

            <dl className='mt-5 pt-4 border-t border-gray-100 space-y-2.5 text-sm'>
              <div className='flex justify-between'>
                <dt className='text-gray-500'>Subtotal</dt>
                <dd className='font-medium text-gray-900 tabular-nums'>{inr(cart.subtotal)}</dd>
              </div>
              <div className='flex justify-between'>
                <dt className='text-gray-500'>Delivery</dt>
                <dd className='font-medium text-gray-900 tabular-nums'>
                  {cart.shipping === 0 ? 'Included' : inr(cart.shipping)}
                </dd>
              </div>
              {chosenPlan && (
                <div className='flex justify-between'>
                  <dt className='text-gray-500'>
                    {chosenPlan.label} cover
                    <span className='text-gray-400'> &middot; {chosenPlan.months} months</span>
                  </dt>
                  <dd className='font-medium text-gray-900 tabular-nums'>{inr(chosenPlan.price)}</dd>
                </div>
              )}
              <div className='pt-3 border-t border-gray-100 flex justify-between text-base'>
                <dt className='font-semibold text-gray-900'>Total</dt>
                <dd className='font-semibold tracking-[-0.01em] text-gray-900 tabular-nums'>{inr(payable)}</dd>
              </div>
            </dl>
            <p className='mt-1.5 text-[11px] text-gray-400'>GST included</p>

            <button
              type='submit'
              disabled={submitting}
              className='pressable mt-5 w-full h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-60'
            >
              {submitting ? 'Opening payment…' : <><Lock className='w-4 h-4' /> Pay {inr(payable)}</>}
            </button>

            <p className='mt-3 text-xs text-gray-500'>
              UPI, cards, netbanking and wallets.
            </p>

            <p className='mt-2 text-[11px] leading-relaxed text-gray-400'>
              Payment opens on this page and is handled by Razorpay. We never see or store
              your card or UPI details. By paying you accept our{' '}
              <Link to='/terms' className='underline underline-offset-2'>terms</Link>.
            </p>
          </aside>
        </form>
      </div>

      <Footer />
    </div>
  )
}

// ── Field ────────────────────────────────────────────────────────────────────

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  type?: string
  autoComplete?: string
  inputMode?: 'text' | 'email' | 'numeric' | 'tel'
  placeholder?: string
  maxLength?: number
  optional?: boolean
  prefix?: string
  className?: string
}

function Field({
  id, label, value, onChange, error, type = 'text', autoComplete,
  inputMode, placeholder, maxLength, optional, prefix, className,
}: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className='block text-xs font-medium text-gray-700 mb-1.5'>
        {label}
        {optional && <span className='ml-1 font-normal text-gray-400'>(optional)</span>}
      </label>
      <div className='relative'>
        {prefix && (
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none'>
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          className={`w-full h-11 rounded-lg border bg-white text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 transition-[border-color,box-shadow] duration-150 ease-spring ${
            prefix ? 'pl-12 pr-3' : 'px-3'
          } ${
            error
              ? 'border-red-300 focus:ring-red-500/30 focus:border-red-400'
              : 'border-black/[0.1] focus:ring-amber-500/40 focus:border-amber-500'
          }`}
        />
      </div>
      {error && <p className='mt-1 text-xs text-red-600'>{error}</p>}
    </div>
  )
}
