/**
 * One order, as the buyer sees it.
 *
 * Shared by the thank-you page and the tracking page, because they are the same
 * information asked for at two different moments and it would be strange for
 * the total to be laid out one way an hour after it was laid out another.
 *
 * The progress strip reads forward only. A returned or RTO order is not shown
 * as a fourth grey step that never lights up: it is a different outcome, said
 * plainly, because a customer whose order came back needs a sentence, not a
 * diagram.
 */

import { Package, Truck, CheckCircle2, CreditCard } from 'lucide-react'
import type { OrderView } from '@/src/lib/analytics'
import { inr } from '@/src/lib/utils'

const STEPS = [
  { key: 'PAID', label: 'Paid', icon: CreditCard },
  { key: 'PACKED', label: 'Packed', icon: Package },
  { key: 'SHIPPED', label: 'On the way', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
] as const

/** How far along the strip this order has got. -1 means the strip is hidden. */
function reached(order: OrderView): number {
  switch (order.fulfilmentStatus) {
    case 'DELIVERED': return 3
    case 'IN_TRANSIT': return 2
    case 'FULFILLED':
    case 'PARTIALLY_FULFILLED': return 1
    case 'UNFULFILLED': return 0
    default: return -1   // RETURNED, RTO
  }
}

function outcomeNote(order: OrderView): string | null {
  if (order.paymentStatus === 'REFUNDED') return 'This order has been refunded in full.'
  if (order.paymentStatus === 'PARTIALLY_REFUNDED') return 'Part of this order has been refunded.'
  if (order.fulfilmentStatus === 'RETURNED') return 'This order was returned to us.'
  if (order.fulfilmentStatus === 'RTO') return 'Delivery did not succeed and the order came back to us. We will call you.'
  return null
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function OrderDetail({ order }: { order: OrderView }) {
  const step = reached(order)
  const note = outcomeNote(order)
  const placed = formatDate(order.paidAt ?? order.placedOn)

  return (
    <div className='rounded-xl border border-gray-200 overflow-hidden'>
      {/* Header */}
      <div className='px-5 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'>
        <div>
          <p className='text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-400'>Order</p>
          <p className='text-base font-bold text-gray-900 tabular-nums'>{order.orderNumber}</p>
        </div>
        {placed && <p className='text-xs text-gray-500'>Placed {placed}</p>}
      </div>

      <div className='p-5 space-y-6'>
        {note && (
          <p className='rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-900'>
            {note}
          </p>
        )}

        {step >= 0 && !note && (
          <ol className='flex items-start'>
            {STEPS.map((s, i) => {
              const done = i <= step
              const Icon = s.icon
              return (
                <li key={s.key} className='flex-1 flex flex-col items-center relative'>
                  {i > 0 && (
                    <span
                      className={`absolute top-4 right-1/2 left-[-50%] h-px ${
                        i <= step ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <span
                    className={`relative z-10 w-8 h-8 grid place-items-center rounded-full border ${
                      done
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-white border-gray-200 text-gray-300'
                    }`}
                  >
                    <Icon className='w-4 h-4' />
                  </span>
                  <span className={`mt-1.5 text-[11px] text-center ${done ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </li>
              )
            })}
          </ol>
        )}

        {/* Courier, once there is one */}
        {(order.courierName || order.awbNumber) && (
          <div className='rounded-lg bg-gray-50 px-4 py-3 text-sm'>
            <p className='font-medium text-gray-900'>
              {order.courierName ?? 'Dispatched'}
            </p>
            {order.awbNumber && (
              <p className='mt-0.5 text-gray-500'>
                Docket <span className='font-medium text-gray-700 tabular-nums'>{order.awbNumber}</span>
              </p>
            )}
          </div>
        )}

        {/* Items */}
        <div>
          <h3 className='text-xs font-semibold tracking-wide uppercase text-gray-400'>Items</h3>
          <ul className='mt-3 space-y-3'>
            {order.items.map((item, i) => (
              <li key={i} className='flex gap-3 text-sm'>
                <span className='w-6 h-6 shrink-0 grid place-items-center rounded bg-gray-100 text-[11px] font-semibold text-gray-600 tabular-nums'>
                  {item.quantity}
                </span>
                <span className='flex-1 min-w-0 text-gray-700 leading-snug'>
                  {item.name}
                  {item.variantLabel && (
                    <span className='block text-xs text-gray-400'>{item.variantLabel}</span>
                  )}
                </span>
                <span className='font-medium text-gray-900 tabular-nums'>
                  {inr(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Money */}
        <dl className='pt-4 border-t border-gray-100 space-y-2 text-sm'>
          <div className='flex justify-between'>
            <dt className='text-gray-500'>Items</dt>
            <dd className='text-gray-900 tabular-nums'>
              {inr(order.grandTotal - order.shippingTotal)}
            </dd>
          </div>
          <div className='flex justify-between'>
            <dt className='text-gray-500'>Delivery</dt>
            <dd className='text-gray-900 tabular-nums'>
              {order.shippingTotal === 0 ? 'Free' : inr(order.shippingTotal)}
            </dd>
          </div>
          <div className='pt-2.5 border-t border-gray-100 flex justify-between text-base'>
            <dt className='font-semibold text-gray-900'>Paid</dt>
            <dd className='font-bold text-gray-900 tabular-nums'>{inr(order.grandTotal)}</dd>
          </div>
          <p className='text-[11px] text-gray-400'>
            Includes {inr(order.taxTotal)} GST
            {order.paymentMethod ? ` · paid by ${order.paymentMethod}` : ''}
          </p>
        </dl>

        {/* Where it is going */}
        {order.address?.line1 && (
          <div className='pt-4 border-t border-gray-100'>
            <h3 className='text-xs font-semibold tracking-wide uppercase text-gray-400'>Delivering to</h3>
            <address className='mt-2 text-sm not-italic text-gray-700 leading-relaxed'>
              {order.customerName && <span className='block font-medium text-gray-900'>{order.customerName}</span>}
              {order.address.line1}
              {order.address.line2 && <>, {order.address.line2}</>}
              <br />
              {order.address.landmark && <>{order.address.landmark}<br /></>}
              {order.city}, {order.state} {order.pincode}
              {order.phone && <span className='block mt-1 text-gray-500 tabular-nums'>{order.phone}</span>}
            </address>
          </div>
        )}
      </div>
    </div>
  )
}
