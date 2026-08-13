/**
 * Storefront tracker.
 *
 * Sends the events the admin dashboard's funnel is built from. Small on
 * purpose — no third-party script, no cookie banner obligations beyond a
 * first-party id, and nothing that blocks a page from rendering.
 *
 * Three rules it follows:
 *   1. Never break the store. Every network call is fire-and-forget and every
 *      failure is swallowed — a customer must never see an analytics error
 *      while trying to buy a chair.
 *   2. Batch and flush. Events queue for a second, then go in one request, and
 *      whatever is queued is flushed with `sendBeacon` when the tab closes.
 *   3. Capture attribution once. UTMs and click ids are read from the landing
 *      URL and stored for the session; the campaign that brought someone in
 *      does not change because they clicked through to a second page.
 */

export const ENDPOINT = `${import.meta.env.VITE_ADMIN_API_ORIGIN ?? 'https://admin.mvm-furniture.com'}/api/storefront`

const VISITOR_KEY = 'mvm_vid'
const SESSION_KEY = 'mvm_sid'
const SESSION_TS_KEY = 'mvm_sid_ts'
const SESSION_UTM_KEY = 'mvm_utm'
const FIRST_TOUCH_KEY = 'mvm_first_touch'
const CART_KEY = 'mvm_cart_id'
const VISIT_COUNT_KEY = 'mvm_visits'

/** Same 30-minute rule the ingestion endpoint applies. Both sides have to
 *  agree or sessions get split in one place and merged in the other. */
const SESSION_IDLE_MS = 30 * 60 * 1000

const FLUSH_DELAY_MS = 1000
const MAX_BATCH = 25

export type EventType =
  | 'PAGE_VIEW' | 'PRODUCT_VIEW' | 'COLLECTION_VIEW' | 'SEARCH'
  | 'COLOR_SWATCH_CLICK' | 'ZOOM_IMAGE' | 'VIDEO_PLAY'
  | 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'VIEW_CART'
  | 'BEGIN_CHECKOUT' | 'ADD_SHIPPING_INFO' | 'ADD_PAYMENT_INFO'
  | 'PURCHASE' | 'PAYMENT_FAILED'
  | 'WHATSAPP_CLICK' | 'CALL_CLICK' | 'CATALOG_DOWNLOAD' | 'NEWSLETTER_SIGNUP'

interface QueuedEvent {
  type: EventType
  path?: string
  productId?: number
  quantity?: number
  value?: number
  searchQuery?: string
  resultCount?: number
  meta?: Record<string, unknown>
}

const UTM_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'fbclid', 'gclid', 'wbraid', 'ttclid', 'ad_id', 'adset_id', 'campaign_id',
]

// ── Identity ─────────────────────────────────────────────────────────────────

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

function safeGet(store: Storage, key: string): string | null {
  try { return store.getItem(key) } catch { return null }
}

function safeSet(store: Storage, key: string, value: string): void {
  try { store.setItem(key, value) } catch { /* private mode — tracking is optional */ }
}

let isNewVisitorThisLoad = false

function visitorId(): string {
  const existing = safeGet(localStorage, VISITOR_KEY)
  if (existing) return existing
  const id = uuid()
  safeSet(localStorage, VISITOR_KEY, id)
  isNewVisitorThisLoad = true
  return id
}

/**
 * The current session, starting a new one when the last event was more than
 * 30 minutes ago OR the landing URL carries a new campaign.
 *
 * The campaign check matters: someone who browses, leaves, then clicks an
 * Instagram ad an hour later is a new visit that the ad should get credit for,
 * and folding it into the old session would hand the credit to whatever brought
 * them the first time.
 */
function sessionId(hasNewCampaign: boolean): string {
  const existing = safeGet(sessionStorage, SESSION_KEY)
  const lastTs = Number(safeGet(sessionStorage, SESSION_TS_KEY) ?? 0)
  const stale = !lastTs || Date.now() - lastTs > SESSION_IDLE_MS

  if (existing && !stale && !hasNewCampaign) {
    safeSet(sessionStorage, SESSION_TS_KEY, String(Date.now()))
    return existing
  }

  const id = uuid()
  safeSet(sessionStorage, SESSION_KEY, id)
  safeSet(sessionStorage, SESSION_TS_KEY, String(Date.now()))
  safeSet(localStorage, VISIT_COUNT_KEY, String(visitCount() + 1))
  return id
}

function visitCount(): number {
  return Number(safeGet(localStorage, VISIT_COUNT_KEY) ?? 0)
}

// ── Attribution ──────────────────────────────────────────────────────────────

function readUrlCampaign(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const found: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) found[key] = value.slice(0, 200)
  }
  return found
}

function currentUtm(): Record<string, string> {
  const fromUrl = readUrlCampaign()
  if (Object.keys(fromUrl).length > 0) {
    safeSet(sessionStorage, SESSION_UTM_KEY, JSON.stringify(fromUrl))
    // First touch is written once, ever. It is a fact about the visitor.
    if (!safeGet(localStorage, FIRST_TOUCH_KEY)) {
      safeSet(localStorage, FIRST_TOUCH_KEY, JSON.stringify({
        ...fromUrl,
        landingPath: window.location.pathname,
        at: new Date().toISOString(),
      }))
    }
    return fromUrl
  }
  try {
    return JSON.parse(safeGet(sessionStorage, SESSION_UTM_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function firstTouch(): Record<string, string> {
  try {
    return JSON.parse(safeGet(localStorage, FIRST_TOUCH_KEY) ?? '{}')
  } catch {
    return {}
  }
}

/** Everything the checkout has to hand the payment provider so the order comes
 *  back knowing which ad produced it. */
export function attribution(): Record<string, string> {
  const utm = currentUtm()
  const first = firstTouch()
  const firstAt = first.at ? Date.parse(first.at) : NaN
  const out: Record<string, string> = {
    source: utm.utm_source ?? '',
    medium: utm.utm_medium ?? '',
    campaign: utm.utm_campaign ?? '',
    content: utm.utm_content ?? '',
    clickId: utm.fbclid ?? utm.gclid ?? utm.wbraid ?? utm.ttclid ?? '',
    adId: utm.ad_id ?? '',
    adsetId: utm.adset_id ?? '',
    campaignId: utm.campaign_id ?? '',
    landingPath: sessionLandingPath ?? window.location.pathname,
    firstCampaign: first.utm_campaign ?? '',
    sessionsToConvert: String(visitCount()),
    daysToConvert: Number.isFinite(firstAt)
      ? String(Math.max(0, Math.round((Date.now() - firstAt) / 86400000)))
      : '0',
  }
  for (const key of Object.keys(out)) if (!out[key]) delete out[key]
  return out
}

// ── Queue ────────────────────────────────────────────────────────────────────

let queue: QueuedEvent[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null
let contextSent = false
let sessionLandingPath: string | null = null
let vid = ''
let sid = ''

function payload(events: QueuedEvent[]) {
  const body: Record<string, unknown> = { visitorId: vid, sessionId: sid, events }
  if (!contextSent) {
    body.context = {
      referrer: document.referrer || undefined,
      landingPath: sessionLandingPath ?? window.location.pathname,
      utm: currentUtm(),
      screenWidth: window.innerWidth,
      isNewVisitor: isNewVisitorThisLoad,
    }
  }
  return body
}

function flush(useBeacon = false): void {
  if (queue.length === 0) return
  const events = queue.splice(0, MAX_BATCH)
  const body = JSON.stringify(payload(events))
  contextSent = true

  try {
    if (useBeacon && navigator.sendBeacon) {
      // Beacon survives the page unload that a fetch would not. Content type
      // must be text/plain — anything else triggers a CORS preflight the
      // unloading page will never live long enough to complete.
      navigator.sendBeacon(`${ENDPOINT}/track`, new Blob([body], { type: 'text/plain' }))
      return
    }
    void fetch(`${ENDPOINT}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => { /* analytics must never surface to a shopper */ })
  } catch {
    /* ignore */
  }
}

function schedule(): void {
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    flushTimer = null
    flush()
  }, FLUSH_DELAY_MS)
}

// ── Public API ───────────────────────────────────────────────────────────────

let started = false

export function initAnalytics(): void {
  if (started || typeof window === 'undefined') return
  started = true

  const hasNewCampaign = Object.keys(readUrlCampaign()).length > 0
  vid = visitorId()
  sid = sessionId(hasNewCampaign)
  sessionLandingPath = window.location.pathname
  currentUtm()

  // Flush on the way out, and when the tab is hidden — on mobile Safari the
  // page is often frozen without ever firing `unload`, so `visibilitychange` is
  // the only reliable last chance.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true)
  })
  window.addEventListener('pagehide', () => flush(true))
}

export function track(type: EventType, props: Omit<QueuedEvent, 'type'> = {}): void {
  if (typeof window === 'undefined') return
  if (!started) initAnalytics()
  safeSet(sessionStorage, SESSION_TS_KEY, String(Date.now()))
  queue.push({ type, path: props.path ?? window.location.pathname, ...props })
  // Conversions go immediately: waiting a second to batch a WhatsApp click is
  // a second in which the customer has already left for the WhatsApp app.
  if (type === 'WHATSAPP_CLICK' || type === 'CALL_CLICK' || type === 'BEGIN_CHECKOUT') {
    flush(true)
  } else {
    schedule()
  }
}

export function trackPageView(path?: string): void {
  track('PAGE_VIEW', { path: path ?? window.location.pathname })
}

export function trackProductView(productId: number | undefined, name?: string): void {
  track('PRODUCT_VIEW', { productId, meta: name ? { name } : undefined })
}

export function trackSearch(query: string, resultCount: number): void {
  track('SEARCH', { searchQuery: query, resultCount })
}

export function trackWhatsAppClick(context?: string): void {
  track('WHATSAPP_CLICK', { meta: context ? { context } : undefined })
}

// ── Cart + checkout ──────────────────────────────────────────────────────────

export function cartId(): string {
  const existing = safeGet(localStorage, CART_KEY)
  if (existing) return existing
  const id = uuid()
  safeSet(localStorage, CART_KEY, id)
  return id
}

export function clearCartId(): void {
  try { localStorage.removeItem(CART_KEY) } catch { /* ignore */ }
}

/** Override the cart id, for a recovery link that arrives on a new device. */
export function adoptCartId(id: string): void {
  if (id.length < 8 || id.length > 64) return
  safeSet(localStorage, CART_KEY, id)
}

export interface CartLine { webProductId: number; quantity: number }

export interface ServerCartLine {
  webProductId: number
  name: string
  slug?: string | null
  variantLabel?: string | null
  quantity: number
  unitPrice: number
  lineTotal: number
  imageUrl: string | null
  capped?: boolean
  inStock?: boolean
}

export interface ServerCart {
  cartId: string
  items: ServerCartLine[]
  subtotal: number
  itemCount: number
  shipping: number
  total: number
  freeShippingAbove: number
  amountToFreeShipping: number
  rejected?: { webProductId: number; reason: string }[]
}

/**
 * Push the cart server-side. Prices come back from the server — the caller must
 * render those and not its own, because the server's are the ones that will be
 * charged.
 */
export async function syncCart(items: CartLine[], contact?: { email?: string; phone?: string }): Promise<ServerCart> {
  const res = await fetch(`${ENDPOINT}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cartId: cartId(),
      sessionId: sid || safeGet(sessionStorage, SESSION_KEY),
      visitorId: vid || safeGet(localStorage, VISITOR_KEY),
      items,
      ...contact,
    }),
  })
  if (!res.ok) throw new Error('Could not update cart')
  return res.json() as Promise<ServerCart>
}

/** Read a saved cart back, for a reload or a recovery link. */
export async function fetchCart(): Promise<ServerCart> {
  const res = await fetch(`${ENDPOINT}/cart?cartId=${encodeURIComponent(cartId())}`)
  if (!res.ok) throw new Error('Could not load cart')
  return res.json() as Promise<ServerCart>
}

export interface CheckoutDetails {
  customer: { name: string; email: string; phone: string }
  address: {
    line1: string
    line2?: string
    landmark?: string
    city: string
    state: string
    pincode: string
  }
}

/** A 422 from the checkout: which field, and what is wrong with it. */
export class CheckoutFieldError extends Error {
  fields: Record<string, string>
  constructor(fields: Record<string, string>) {
    super('Check the details')
    this.name = 'CheckoutFieldError'
    this.fields = fields
  }
}

/** Start payment and hand back the URL to redirect to. */
export async function startCheckout(details: CheckoutDetails): Promise<string> {
  track('BEGIN_CHECKOUT')
  const res = await fetch(`${ENDPOINT}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cartId: cartId(),
      sessionId: sid || safeGet(sessionStorage, SESSION_KEY),
      visitorId: vid || safeGet(localStorage, VISITOR_KEY),
      attribution: attribution(),
      ...details,
    }),
  })
  const json = await res.json()
  if (res.status === 422 && json.fields) throw new CheckoutFieldError(json.fields)
  if (!res.ok) throw new Error(json.error ?? 'Checkout failed')
  return json.url as string
}

// ── Order status ─────────────────────────────────────────────────────────────

export interface OrderView {
  orderNumber: string
  placedOn: string | null
  paidAt: string | null
  paymentStatus: string
  fulfilmentStatus: string
  paymentMethod: string | null
  subtotal: number
  discountTotal: number
  shippingTotal: number
  taxTotal: number
  grandTotal: number
  customerName: string | null
  email: string | null
  phone: string | null
  city: string | null
  state: string | null
  pincode: string | null
  address: Record<string, string> | null
  courierName: string | null
  awbNumber: string | null
  promisedBy: string | null
  dispatchedAt: string | null
  deliveredAt: string | null
  items: { name: string; variantLabel: string | null; quantity: number; unitPrice: number }[]
}

/**
 * PENDING is the normal first answer on the thank-you page: the buyer is
 * redirected back the moment the payment clears, and the webhook that writes
 * the order arrives seconds later on a different connection.
 */
export type OrderLookup =
  | { status: 'FOUND'; order: OrderView }
  | { status: 'PENDING' }
  | { status: 'NOT_FOUND' }

export async function fetchOrderByRef(ref: string): Promise<OrderLookup> {
  const res = await fetch(`${ENDPOINT}/order?ref=${encodeURIComponent(ref)}`)
  if (!res.ok) return { status: 'NOT_FOUND' }
  return res.json() as Promise<OrderLookup>
}

export async function fetchOrderByNumber(orderNumber: string, phone: string): Promise<OrderLookup> {
  const res = await fetch(
    `${ENDPOINT}/order?number=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`,
  )
  if (!res.ok) return { status: 'NOT_FOUND' }
  return res.json() as Promise<OrderLookup>
}

/** Live price and availability for the storefront. Copy and photos still come
 *  from Supabase; only the two fields a shopper can act on come from here. */
export async function fetchLivePricing(slug?: string) {
  const url = slug ? `${ENDPOINT}/products?slug=${encodeURIComponent(slug)}` : `${ENDPOINT}/products`
  const res = await fetch(url)
  if (!res.ok) return { products: [] }
  return res.json() as Promise<{
    products: {
      id: number; catalogProductId: number; slug: string; name: string; sku: string
      price: number; compareAtPrice: number | null; gstRate: number
      colorName: string | null; colorHex: string | null; thumbnailUrl: string | null
      inStock: boolean; availableQty: number | null
    }[]
  }>
}
