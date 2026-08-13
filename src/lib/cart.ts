/**
 * The cart.
 *
 * Two halves that deliberately disagree until they are reconciled:
 *
 *   intent   what the shopper asked for. Product ids and quantities, in
 *            localStorage, so a closed tab or a dead battery does not empty the
 *            basket.
 *   view     what it actually costs. Names, prices, stock and totals, all from
 *            the server, because the server's prices are the ones the card will
 *            be charged and a price rendered from anywhere else is a promise we
 *            might not keep.
 *
 * Every change writes intent, syncs, and then writes the server's answer back
 * over intent. That last step is what makes a capped line (three left, five
 * asked for) settle at three everywhere instead of springing back to five on
 * the next render.
 *
 * A plain module store rather than context: the header badge, the drawer, the
 * cart page and the checkout all read the same thing, and threading a provider
 * through a route tree that is 90% marketing pages buys nothing.
 */

import { useSyncExternalStore } from 'react'
import {
  syncCart, fetchCart, track, clearCartId,
  type CartLine, type ServerCart, type ServerCartLine,
} from '@/src/lib/analytics'

const INTENT_KEY = 'mvm_cart_lines'

export interface CartState {
  /** `idle` before the first load; `syncing` while a request is in flight. */
  status: 'idle' | 'syncing' | 'ready' | 'error'
  lines: ServerCartLine[]
  /** Straight from intent, so the header badge answers the click immediately. */
  itemCount: number
  subtotal: number
  shipping: number
  total: number
  freeShippingAbove: number
  amountToFreeShipping: number
  /** Set when a line was dropped or trimmed, for the page to explain. */
  notice: string | null
  error: string | null
}

const EMPTY: CartState = {
  status: 'idle',
  lines: [],
  itemCount: 0,
  subtotal: 0,
  shipping: 0,
  total: 0,
  freeShippingAbove: 15000,
  amountToFreeShipping: 15000,
  notice: null,
  error: null,
}

let state: CartState = { ...EMPTY, itemCount: countOf(readIntent()) }
const listeners = new Set<() => void>()

function emit(next: Partial<CartState>): void {
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

// ── Intent ───────────────────────────────────────────────────────────────────

type Intent = Record<number, number>

function readIntent(): Intent {
  try {
    const raw = localStorage.getItem(INTENT_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Intent
    const clean: Intent = {}
    for (const [id, qty] of Object.entries(parsed)) {
      const pid = Number(id)
      const q = Number(qty)
      if (Number.isInteger(pid) && Number.isInteger(q) && q > 0) clean[pid] = Math.min(q, 50)
    }
    return clean
  } catch {
    return {}
  }
}

function writeIntent(intent: Intent): void {
  try {
    localStorage.setItem(INTENT_KEY, JSON.stringify(intent))
  } catch {
    /* private mode — the cart still works for this visit */
  }
}

function countOf(intent: Intent): number {
  return Object.values(intent).reduce((sum, q) => sum + q, 0)
}

function asLines(intent: Intent): CartLine[] {
  return Object.entries(intent).map(([id, quantity]) => ({
    webProductId: Number(id),
    quantity,
  }))
}

// ── Sync ─────────────────────────────────────────────────────────────────────

/** Last write wins. Two rapid taps on + must not land out of order. */
let syncToken = 0

async function push(): Promise<void> {
  const token = ++syncToken
  const intent = readIntent()
  emit({ status: 'syncing', itemCount: countOf(intent), error: null })

  try {
    const cart = await syncCart(asLines(intent))
    if (token !== syncToken) return
    absorb(cart, intent)
  } catch {
    if (token !== syncToken) return
    // The basket is not lost — intent is still on disk, and the next change or
    // the next page load will try again.
    emit({ status: 'error', error: 'Could not reach the store. Check your connection.' })
  }
}

/**
 * Take the server's answer as the truth and fold it back into intent.
 *
 * Anything the server refused (withdrawn, sold out) leaves intent here, so it
 * does not reappear on the next sync. Anything it trimmed is trimmed locally
 * too, so the number beside the item is the number that will be charged.
 */
function absorb(cart: ServerCart, intent: Intent): void {
  const settled: Intent = {}
  for (const line of cart.items) settled[line.webProductId] = line.quantity

  const dropped = Object.keys(intent).filter((id) => !(Number(id) in settled)).length
  const trimmed = cart.items.filter((l) => l.capped).length

  writeIntent(settled)

  emit({
    status: 'ready',
    lines: cart.items,
    itemCount: countOf(settled),
    subtotal: cart.subtotal,
    shipping: cart.shipping,
    total: cart.total,
    freeShippingAbove: cart.freeShippingAbove,
    amountToFreeShipping: cart.amountToFreeShipping,
    notice: noticeFor(dropped, trimmed),
    error: null,
  })
}

function noticeFor(dropped: number, trimmed: number): string | null {
  if (dropped > 0 && trimmed > 0) {
    return 'Some items sold out and one quantity was reduced to what is left in stock.'
  }
  if (dropped > 0) {
    return dropped === 1
      ? 'An item is no longer available and has been removed.'
      : `${dropped} items are no longer available and have been removed.`
  }
  if (trimmed > 0) return 'A quantity was reduced to what is left in stock.'
  return null
}

// ── Actions ──────────────────────────────────────────────────────────────────

let loaded = false

/**
 * First load.
 *
 * With nothing in intent the server is asked anyway: the cart id may have come
 * from a recovery link on a phone that has never seen this site, and refilling
 * that basket is the entire point of sending the link.
 */
export function loadCart(): void {
  if (loaded) return
  loaded = true

  const intent = readIntent()
  if (countOf(intent) > 0) {
    void push()
    return
  }

  void (async () => {
    try {
      const cart = await fetchCart()
      absorb(cart, {})
    } catch {
      emit({ status: 'ready' })
    }
  })()
}

export function addToCart(
  webProductId: number,
  quantity = 1,
  meta?: { name?: string; price?: number },
): void {
  const intent = readIntent()
  intent[webProductId] = Math.min(50, (intent[webProductId] ?? 0) + quantity)
  writeIntent(intent)
  loaded = true

  track('ADD_TO_CART', {
    productId: webProductId,
    quantity,
    value: meta?.price ? meta.price * quantity : undefined,
    meta: meta?.name ? { name: meta.name } : undefined,
  })

  void push()
}

export function setQuantity(webProductId: number, quantity: number): void {
  const intent = readIntent()
  if (quantity <= 0) {
    delete intent[webProductId]
    track('REMOVE_FROM_CART', { productId: webProductId })
  } else {
    intent[webProductId] = Math.min(50, quantity)
  }
  writeIntent(intent)
  void push()
}

export function removeFromCart(webProductId: number): void {
  setQuantity(webProductId, 0)
}

/**
 * Empty it after a completed order.
 *
 * The cart id goes too: that id is now attached to a paid order, and reusing it
 * for the next basket would point the buyer's own success link at the wrong
 * purchase.
 */
export function clearCart(): void {
  writeIntent({})
  clearCartId()
  emit({ ...EMPTY, status: 'ready' })
}

export function dismissNotice(): void {
  emit({ notice: null })
}

// ── Subscription ─────────────────────────────────────────────────────────────

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function snapshot(): CartState {
  return state
}

/** Server snapshot for the prerenderer, which has no localStorage. */
const SERVER_SNAPSHOT: CartState = EMPTY

export function useCart(): CartState {
  return useSyncExternalStore(subscribe, snapshot, () => SERVER_SNAPSHOT)
}
