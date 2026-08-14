/**
 * Razorpay's payment sheet.
 *
 * Loaded on demand rather than in the page head: it is ~120kB that only
 * matters to someone who has filled in a whole address form, and the shop is
 * mostly read by people who never reach checkout.
 *
 * The sheet opens over our own page. On a phone the UPI option hands off to
 * the payer's own app (GPay, PhonePe, Paytm) and comes back; cards, netbanking
 * and wallets are in the same sheet. Nothing here ever sees a card number.
 *
 * This module deliberately knows nothing about what was bought or what it
 * cost. Amount and order id come from the server, which built them from the
 * cart, so a page with a tampered total cannot charge a different one: the
 * amount Razorpay collects is the one attached to the order id on their side.
 */

import type { InlineCheckout } from './analytics'

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

export interface RazorpayResult {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  order_id: string
  prefill?: { name?: string; email?: string; contact?: string }
  theme?: { color?: string }
  handler: (result: RazorpayResult) => void
  modal?: { ondismiss?: () => void; escape?: boolean; confirm_close?: boolean }
  retry?: { enabled: boolean }
}

interface RazorpayInstance {
  open: () => void
  on: (event: string, handler: (payload: unknown) => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

let loading: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve()
  // One load, however many times the button is pressed.
  if (loading) return loading

  loading = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    const script = existing ?? document.createElement('script')
    script.addEventListener('load', () => resolve())
    script.addEventListener('error', () => {
      loading = null
      reject(new Error('Could not reach the payment gateway'))
    })
    if (!existing) {
      script.src = SCRIPT_SRC
      script.async = true
      document.head.appendChild(script)
    }
  })
  return loading
}

export type PaymentOutcome =
  | { status: 'PAID'; result: RazorpayResult }
  | { status: 'DISMISSED' }
  | { status: 'FAILED'; reason: string }

/**
 * Open the sheet and settle when the buyer is done with it.
 *
 * Resolves rather than throws on dismissal, because closing the sheet is a
 * normal thing to do and the checkout page behind it is still perfectly valid:
 * they should land back on their own details with the bag intact, not on an
 * error.
 */
export function openRazorpay(inline: InlineCheckout): Promise<PaymentOutcome> {
  return loadScript().then(
    () =>
      new Promise<PaymentOutcome>((resolve) => {
        const Razorpay = window.Razorpay
        if (!Razorpay) {
          resolve({ status: 'FAILED', reason: 'Could not reach the payment gateway' })
          return
        }

        let settled = false
        const settle = (outcome: PaymentOutcome) => {
          if (settled) return
          settled = true
          resolve(outcome)
        }

        const rzp = new Razorpay({
          key: inline.keyId,
          // Paise, and only for what the sheet displays. What is actually
          // charged is fixed to the order on Razorpay's side.
          amount: Math.round(inline.amount * 100),
          currency: inline.currency,
          name: inline.name,
          description: inline.description,
          order_id: inline.orderId,
          prefill: inline.prefill,
          theme: { color: inline.themeColor },
          retry: { enabled: false },
          handler: (result) => settle({ status: 'PAID', result }),
          modal: {
            ondismiss: () => settle({ status: 'DISMISSED' }),
            // Escape closes it. Trapping someone inside a payment sheet is how
            // you turn an abandoned cart into a support message.
            escape: true,
          },
        })

        rzp.on('payment.failed', (payload) => {
          const description =
            (payload as { error?: { description?: string } } | undefined)?.error?.description ??
            'The payment did not go through'
          settle({ status: 'FAILED', reason: description })
        })

        rzp.open()
      }),
  )
}
