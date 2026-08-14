/**
 * Replacement cover, offered at checkout.
 *
 * Deliberately not called insurance. Selling insurance in India means being
 * registered with the IRDAI; this is a service warranty a manufacturer sells
 * on its own goods, which is an ordinary commercial thing to do, and the
 * wording has to keep saying so.
 *
 * It is a **replacement** promise, not a return: a customer whose chair turned
 * up with a split seam wants a working chair, not their money back and an
 * empty room. Saying "replace" rather than "refund" also keeps the offer
 * honest, because a refund is not what we intend to do.
 *
 * Opt-in. The default is None and it is a visible, selectable option rather
 * than the absence of one, so nobody is charged ₹399 because they scrolled
 * past a pre-ticked box.
 */

import { Check, ShieldCheck } from 'lucide-react'
import { inr } from '@/src/lib/utils'

export interface ProtectionPlan {
  id: string
  label: string
  price: number
  months: number
  blurb: string
}

/** Mirrors lib/website/protection.ts. The server re-resolves by id and never
 *  trusts a price sent from here. */
export const PROTECTION_PLANS: ProtectionPlan[] = [
  {
    id: 'care12',
    label: 'Care',
    price: 399,
    months: 12,
    blurb: 'Arrives damaged, or a manufacturing fault appears: we replace it and pay the freight both ways.',
  },
  {
    id: 'care24',
    label: 'Care Plus',
    price: 499,
    months: 24,
    blurb: 'Everything in Care, plus wear on the gas lift, castors and armrests, which is what actually fails on a chair used every day.',
  },
]

export default function ProtectionPicker({
  value,
  onChange,
}: {
  value: string | null
  onChange: (id: string | null) => void
}) {
  return (
    <section>
      <h2 className='text-sm font-semibold text-gray-900 inline-flex items-center gap-1.5'>
        <ShieldCheck className='w-4 h-4 text-gray-400' />
        Replacement cover
      </h2>
      <p className='mt-1 text-xs text-gray-500'>
        Optional. If the chair reaches you damaged or develops a fault, we send a new one.
      </p>

      <div className='mt-4 space-y-2'>
        {PROTECTION_PLANS.map((plan) => (
          <Option
            key={plan.id}
            selected={value === plan.id}
            onSelect={() => onChange(value === plan.id ? null : plan.id)}
            title={`${plan.label} · ${plan.months} months`}
            price={inr(plan.price)}
            blurb={plan.blurb}
          />
        ))}
        <Option
          selected={value === null}
          onSelect={() => onChange(null)}
          title='No cover'
          price=''
          blurb='The standard manufacturing warranty still applies.'
        />
      </div>
    </section>
  )
}

function Option({
  selected, onSelect, title, price, blurb,
}: {
  selected: boolean
  onSelect: () => void
  title: string
  price: string
  blurb: string
}) {
  return (
    <button
      type='button'
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full text-left rounded-lg border p-3.5 transition-[border-color,background-color] ${
        selected
          ? 'border-amber-500 bg-amber-50/60'
          : 'border-black/[0.08] bg-white hover:border-black/[0.16]'
      }`}
    >
      <div className='flex items-start gap-3'>
        <span
          className={`mt-0.5 w-4 h-4 shrink-0 rounded-full border grid place-items-center ${
            selected ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
          }`}
        >
          {selected && <Check className='w-2.5 h-2.5 text-white' />}
        </span>
        <span className='flex-1 min-w-0'>
          <span className='flex items-baseline justify-between gap-2'>
            <span className='text-sm font-semibold text-gray-900'>{title}</span>
            {price && <span className='text-sm font-semibold text-gray-900 tabular-nums'>{price}</span>}
          </span>
          <span className='mt-0.5 block text-xs leading-relaxed text-gray-500'>{blurb}</span>
        </span>
      </div>
    </button>
  )
}
