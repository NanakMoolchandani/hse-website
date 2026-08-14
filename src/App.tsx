import { useState, useEffect, useLayoutEffect, useRef, lazy, Suspense } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Menu, X, MessageCircle, ChevronDown, Palette, MapPin } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navigate } from 'react-router-dom'
import CartButton from '@/src/components/CartButton'
import HeaderSearch from '@/src/components/HeaderSearch'
import { WishlistButton } from '@/src/components/WishlistButton'
import { initAnalytics, trackPageView, track } from '@/src/lib/analytics'
import { loadCart } from '@/src/lib/cart'
import { useReveal } from '@/src/hooks/use-reveal'

// Shop is the default landing route (/) and carries the hero, so it stays
// eager: lazy-loading the first paint would put a spinner where the showroom
// photograph should be.
import Shop from '@/src/pages/Shop'

// All other routes lazy — drops ~60% off initial JS. Prerender plugin uses
// renderAfterTime:6000 so lazy chunks resolve before HTML snapshot for SEO.
const Home = lazy(() => import('@/src/pages/Home'))
const About = lazy(() => import('@/src/pages/About'))
const Nilkamal = lazy(() => import('@/src/pages/Nilkamal'))
const NilkamalCollection = lazy(() => import('@/src/pages/NilkamalCollection'))
const NilkamalProductPage = lazy(() => import('@/src/pages/NilkamalProduct'))
const Supreme = lazy(() => import('@/src/pages/Supreme'))
const SupremeCollection = lazy(() => import('@/src/pages/SupremeCollection'))
const SupremeProductPage = lazy(() => import('@/src/pages/SupremeProduct'))
const Seatex = lazy(() => import('@/src/pages/Seatex'))
const SeatexCollection = lazy(() => import('@/src/pages/SeatexCollection'))
const SeatexProductPage = lazy(() => import('@/src/pages/SeatexProduct'))
const MVMProductPage = lazy(() => import('@/src/pages/MVMProduct'))
const Privacy = lazy(() => import('@/src/pages/Privacy'))
const Terms = lazy(() => import('@/src/pages/Terms'))
const Refunds = lazy(() => import('@/src/pages/Refunds'))
const Shipping = lazy(() => import('@/src/pages/Shipping'))
const CatalogueColors = lazy(() => import('@/src/pages/CatalogueColors'))

// ── Store ────────────────────────────────────────────────────────────────────
// Lazy like everything else: most visitors never reach these, and the checkout
// pulls in form and cart code that has no business in the marketing bundle.
const CartPage = lazy(() => import('@/src/pages/Cart'))
const Checkout = lazy(() => import('@/src/pages/Checkout'))
const OrderSuccess = lazy(() => import('@/src/pages/OrderSuccess'))
const OrderTrack = lazy(() => import('@/src/pages/OrderTrack'))
const WishlistPage = lazy(() => import('@/src/pages/Wishlist'))

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ── Data ──────────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = '919981516171'
const GOOGLE_LISTING_URL = 'https://www.google.com/maps?cid=16199908150674240164'

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Products', href: null }, // dropdown
]

/**
 * The category row under the search bar.
 *
 * Mirrors the eight seating categories the shop actually sells, plus a way
 * into the made-to-order range. `enum` is empty for "All", which is the
 * unfiltered shop.
 */
const HEADER_CATEGORIES = [
  { label: 'All Seating', enum: '' },
  { label: 'Executive', enum: 'EXECUTIVE_CHAIRS' },
  { label: 'Ergonomic', enum: 'ERGONOMIC_TASK_CHAIRS' },
  { label: 'Visitor & Reception', enum: 'VISITOR_RECEPTION' },
  { label: 'Cafeteria', enum: 'CAFETERIA_FURNITURE' },
  { label: 'Gaming', enum: 'GAMING_CHAIRS' },
  { label: 'Recliners', enum: 'RECLINERS' },
  { label: 'Salon', enum: 'SALON_CHAIRS' },
  { label: 'Made to Order', enum: 'WARDROBES_ALMIRAHS' },
]

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const location = useLocation()
  const isHome = location.pathname === '/home' || location.pathname === '/'

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      const delta = y - lastScrollY.current
      // Only change hidden state on meaningful scroll (ignore tiny jitter)
      if (Math.abs(delta) > 5) {
        if (y > 80 && delta > 0) {
          setHidden(true)   // scrolling down → hide
        } else if (delta < 0) {
          setHidden(false)  // scrolling up → show
        }
        lastScrollY.current = y
      }
      // Always show at top of page
      if (y <= 80) setHidden(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setProductsOpen(false)
  }, [location])

  // The chrome is a floating translucent layer, not an opaque strip: content
  // travels under it as you scroll. It carries no permanent divider either;
  // the shadow appears only once there is something beneath it to separate
  // from, which is what makes the bar read as glass rather than as a border.
  const navBg = isHome
    ? scrolled
      ? 'material-chrome-dark border-b border-white/5'
      : 'bg-transparent'
    : scrolled
      ? 'material-chrome shadow-sm'
      : 'material-chrome'

  const textColor = isHome ? 'text-white' : 'text-gray-900'
  const linkColor = isHome ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
  const dropdownBg = isHome
    ? 'material-chrome-dark border-white/10'
    : 'material-chrome border border-black/[0.06] shadow-xl'
  const dropdownItemClass = isHome
    ? 'text-gray-300 hover:bg-white/10 hover:text-white'
    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'

  return (
    <>
      {/* Fixed, so every page has to reserve room for it: 4rem of main bar on
          mobile, plus another 4rem of brand bar from `md` up. Pages express
          that as `pt-20 md:pt-32` and sticky children as `top-16 md:top-32`.
          If you change either bar's height, those change with it. The offsets
          used to be hand-typed as 108/116/120px, none of which agreed. */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-spring ${navBg} ${hidden && !open ? '-translate-y-full' : 'translate-y-0'}`}>
        {/* Tier 1: the utility strip. Where you are, what is on, how to get
            help. Desktop only, because on a phone this is noise above the
            fold and the same links live in the menu. */}
        <div className='hidden md:block bg-amber-500 text-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-xs'>
            <a
              href={GOOGLE_LISTING_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1.5 font-medium hover:underline underline-offset-2'
            >
              <MapPin className='w-3.5 h-3.5' />
              Factory &amp; showroom: Neemuch, MP
            </a>
            <p className='hidden lg:block font-medium'>
              Made in our own factory &middot; Delivered across India &middot; GST invoice on every order
            </p>
            <div className='flex items-center gap-4 font-medium'>
              <Link to='/order/track' className='hover:underline underline-offset-2'>Track order</Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'utility-strip' } })}
                className='hover:underline underline-offset-2'
              >
                Help
              </a>
            </div>
          </div>
        </div>

        {/* Tier 2: logo, search, actions. */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-2'>
          {/* The brand a customer buys is MVM Aasanam. Hari Shewa Enterprises
              is the company that owns it: it belongs on the invoice, in the
              footer and on the legal pages, not across the top of every screen
              in the shop. */}
          <Link
            to='/shop'
            aria-label='MVM Aasanam, home'
            className={`flex items-center gap-2 sm:gap-2.5 min-w-0 ${textColor}`}
          >
            <img src='/logos/mvm-logo.png' alt='' className='w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0' />
            <span className='flex flex-col leading-none min-w-0'>
              <span className='text-[15px] sm:text-lg font-semibold tracking-[-0.02em] truncate'>
                MVM Aasanam
              </span>
              <span className={`hidden sm:block mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] ${
                isHome ? 'text-white/45' : 'text-gray-400'
              }`}>
                Made in Neemuch
              </span>
            </span>
          </Link>
          {/* Search takes the width between the logo and the icons, the way a
              shop's does. It used to be a thin underlined box tucked into the
              corner of the product grid, which is where you put a filter, not
              where you put the main way through a 400 piece catalogue. */}
          <div className='hidden md:block flex-1 max-w-lg mx-5'>
            <HeaderSearch dark={isHome} />
          </div>

          <div className='hidden md:flex items-center gap-5 shrink-0'>
            {NAV_LINKS.map((l) =>
              l.href === null ? (
                <div key='products' className='relative'>
                  <button
                    onClick={() => setProductsOpen((o) => !o)}
                    className={`text-sm font-medium transition-colors inline-flex items-center gap-1 ${linkColor}`}
                  >
                    Products
                    <ChevronDown className={`w-3 h-3 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {productsOpen && (
                    <>
                      <div className='fixed inset-0 z-40' onClick={() => setProductsOpen(false)} />
                      {/* Grows from the trigger rather than appearing beside
                          it, so the menu and the word that opened it read as
                          the same object. */}
                      <div className={`animate-menu-in absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-xl shadow-lg border z-50 ${dropdownBg}`}>
                        <div className='flex'>
                          {/* Brands */}
                          <div className='py-2 w-52'>
                            <Link
                              to='/shop'
                              className={`block px-4 py-2 text-sm font-medium ${dropdownItemClass}`}
                              onClick={() => setProductsOpen(false)}
                            >
                              MVM Aasanam
                              <span className='ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-400'>
                                Our Brand
                              </span>
                            </Link>
                            {[
                              { to: '/nilkamal', label: 'Nilkamal', bg: 'bg-blue-500/20 text-blue-400', bgLight: 'bg-blue-50 text-blue-600' },
                              { to: '/supreme', label: 'Supreme', bg: 'bg-orange-500/20 text-orange-400', bgLight: 'bg-orange-50 text-orange-600' },
                              { to: '/seatex', label: 'Seatex', bg: 'bg-emerald-500/20 text-emerald-400', bgLight: 'bg-emerald-50 text-emerald-600' },
                            ].map((brand) => (
                              <Link
                                key={brand.to}
                                to={brand.to}
                                className={`block px-4 py-2 text-sm font-medium ${dropdownItemClass}`}
                                onClick={() => setProductsOpen(false)}
                              >
                                {brand.label}
                                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isHome ? brand.bg : brand.bgLight}`}>
                                  Dealer
                                </span>
                              </Link>
                            ))}
                          </div>
                          {/* Fabrics and finishes. The downloadable PDF
                              catalogues used to live here; the live grid is
                              always current, which a PDF never is. */}
                          <div className={`py-2 w-52 border-l ${isHome ? 'border-white/10' : 'border-gray-100'}`}>
                            <p className='px-4 py-1 text-[10px] font-semibold tracking-widest uppercase text-gray-500'>
                              Customise
                            </p>
                            <Link
                              to='/catalogue-colors'
                              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${dropdownItemClass}`}
                              onClick={() => setProductsOpen(false)}
                            >
                              <Palette className='w-3 h-3 flex-shrink-0' />
                              Fabrics &amp; colours
                            </Link>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  key={l.href}
                  to={l.href}
                  className={`text-sm font-medium transition-colors ${linkColor}`}
                >
                  {l.label}
                </Link>
              ),
            )}
          </div>
          <div className='flex items-center gap-1'>
            <WishlistButton dark={isHome} />
            <CartButton dark={isHome} />
            <a
              href='https://wa.me/919981516171'
              onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'navbar' } })}
              className={`pressable hidden md:inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full ${
                isHome
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              }`}
            >
              WhatsApp Us
            </a>
            <button
              className={`pressable md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full ${textColor}`}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
            </button>
          </div>
        </div>

        {/* Mobile: search gets a row of its own rather than being squeezed
            into the bar beside four icons. At 390px there is no width to
            share, and search is the thing people reach for. */}
        <div className={`md:hidden px-4 pb-3 ${isHome ? '' : 'border-b border-black/[0.06]'}`}>
          <HeaderSearch dark={isHome} onSubmitted={() => setOpen(false)} />
        </div>

        {/* Brand quick-links bar - desktop only, centered */}
        {/* Part of the same pane of glass as the bar above it: a hairline
            divider, never a second translucent layer stacked on the first,
            which is what turns frosted chrome muddy. The unscrolled dark case
            is the exception, because there the parent is transparent and this
            strip needs its own material to stay legible over the hero. */}
        <div className={`hidden md:block ${
          isHome
            ? scrolled ? 'border-t border-white/10' : 'material-chrome-dark'
            : 'border-t border-gray-200/60'
        }`}>
          {/* Tier 3: the category row, which is how a furniture shop is
              actually navigated. Our own range takes the row; the three dealer
              brands we merely stock sit small at the right, because a customer
              looking for a chair wants a category, not a supplier. */}
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12 gap-6'>
            <div className='flex items-center gap-6 overflow-x-auto thumbnail-scroll'>
              {HEADER_CATEGORIES.map((cat) => {
                const to = cat.enum ? `/shop?category=${cat.enum}` : '/shop'
                const active = cat.enum
                  ? location.search.includes(cat.enum)
                  : location.pathname === '/shop' && !location.search.includes('category')
                return (
                  <Link
                    key={cat.label}
                    to={to}
                    className={`relative whitespace-nowrap text-sm transition-colors py-3 ${
                      active
                        ? isHome ? 'text-white font-semibold' : 'text-gray-900 font-semibold'
                        : linkColor
                    }`}
                  >
                    {cat.label}
                    <span
                      aria-hidden
                      className={`absolute bottom-0 left-0 right-0 h-[2px] origin-left transition-transform duration-250 ease-spring bg-amber-500 ${
                        active ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </Link>
                )
              })}
            </div>

            <div className={`hidden lg:flex items-center gap-3 shrink-0 text-xs ${isHome ? 'text-white/50' : 'text-gray-400'}`}>
              <span className='uppercase tracking-[0.14em] font-semibold'>Also stocking</span>
              {[
                { to: '/nilkamal', label: 'Nilkamal' },
                { to: '/supreme', label: 'Supreme' },
                { to: '/seatex', label: 'Seatex' },
              ].map((b) => (
                <Link
                  key={b.to}
                  to={b.to}
                  className={`transition-colors ${isHome ? 'hover:text-white' : 'hover:text-gray-900'}`}
                >
                  {b.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className={`animate-sheet-in fixed inset-0 z-40 flex flex-col pt-16 overflow-y-auto ${isHome ? 'bg-black' : 'bg-white'}`}>
          <div className='flex flex-col px-5 py-6 gap-5'>
            <Link
              to='/home'
              className={`text-left text-xl font-semibold py-1.5 ${isHome ? 'text-white' : 'text-gray-900'}`}
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              to='/about'
              className={`text-left text-xl font-semibold py-1.5 ${isHome ? 'text-white' : 'text-gray-900'}`}
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <Link
              to='/shop'
              className={`text-left text-xl font-semibold py-1.5 ${isHome ? 'text-white' : 'text-gray-900'}`}
              onClick={() => setOpen(false)}
            >
              Shop
            </Link>
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] mb-2.5 ${isHome ? 'text-gray-500' : 'text-gray-400'}`}>Products</p>
              <div className='space-y-0.5 pl-1'>
                <Link
                  to='/shop'
                  className={`flex items-center gap-2 text-base font-medium py-1.5 ${isHome ? 'text-gray-300' : 'text-gray-700'}`}
                  onClick={() => setOpen(false)}
                >
                  MVM Aasanam
                  <span className='text-[9px] px-1.5 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-400'>
                    Our Brand
                  </span>
                </Link>
                {[
                  { to: '/nilkamal', label: 'Nilkamal', bg: 'bg-blue-500/20 text-blue-400', bgLight: 'bg-blue-50 text-blue-600' },
                  { to: '/supreme', label: 'Supreme', bg: 'bg-orange-500/20 text-orange-400', bgLight: 'bg-orange-50 text-orange-600' },
                  { to: '/seatex', label: 'Seatex', bg: 'bg-emerald-500/20 text-emerald-400', bgLight: 'bg-emerald-50 text-emerald-600' },
                ].map((brand) => (
                  <Link
                    key={brand.to}
                    to={brand.to}
                    className={`flex items-center gap-2 text-base font-medium py-1.5 ${isHome ? 'text-gray-300' : 'text-gray-700'}`}
                    onClick={() => setOpen(false)}
                  >
                    {brand.label}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${isHome ? brand.bg : brand.bgLight}`}>
                      Dealer
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] mb-2.5 ${isHome ? 'text-gray-500' : 'text-gray-400'}`}>Customise</p>
              <Link
                to='/catalogue-colors'
                className={`flex items-center gap-2 text-base font-medium py-1.5 pl-1 ${isHome ? 'text-gray-300' : 'text-gray-700'}`}
                onClick={() => setOpen(false)}
              >
                <Palette className='w-4 h-4 flex-shrink-0' />
                Fabrics &amp; colours
              </Link>
            </div>
            <Link
              to='/order/track'
              className={`text-left text-sm font-medium py-1.5 ${isHome ? 'text-gray-400' : 'text-gray-500'}`}
              onClick={() => setOpen(false)}
            >
              Track an order
            </Link>
            <a
              href='https://wa.me/919981516171'
              onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'mobile-menu' } })}
              className={`mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold w-full ${
                isHome ? 'bg-white text-black' : 'bg-amber-500 text-white'
              }`}
            >
              <MessageCircle className='w-4 h-4' />
              WhatsApp Us
            </a>
          </div>
        </div>
      )}
    </>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const location = useLocation()

  // Watches the whole document for `.reveal`, so pages opt in with a class
  // rather than each wiring up its own observer.
  useReveal()

  // Only home routes use dark background
  const isDarkRoute =
    location.pathname === '/home' ||
    location.pathname === '/'

  // Set body background SYNCHRONOUSLY before paint to prevent white flash
  // during route transitions (e.g., white Home → dark product page)
  useLayoutEffect(() => {
    const bg = isDarkRoute ? '#030712' : '#ffffff'
    document.documentElement.style.backgroundColor = bg
    document.body.style.backgroundColor = bg
  }, [isDarkRoute])

  // Clean up GSAP ScrollTriggers AFTER React has finished unmounting.
  // CRITICAL: This must use useEffect (not useLayoutEffect) + setTimeout
  // so it runs AFTER React's DOM reconciliation is complete. Calling kill()
  // or revert() during unmount modifies the DOM (removes pin-spacer wrappers)
  // while React still holds references to those nodes, causing "removeChild"
  // errors and blank pages.
  useEffect(() => {
    const id = setTimeout(() => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      ScrollTrigger.clearScrollMemory()
    }, 0)
    return () => clearTimeout(id)
  }, [location.pathname])

  // Scroll to top on route change
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  // Analytics and the saved bag, once per load. The tracker captures the
  // campaign from the landing URL, so it has to start before any navigation
  // rewrites the query string away.
  useEffect(() => {
    initAnalytics()
    loadCart()
  }, [])

  // One page view per route. The site is a single-page app, so without this the
  // whole visit reads as one view of whichever page they landed on.
  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  return (
    <div className={isDarkRoute ? 'bg-gray-950' : 'bg-white'}>
      <Navbar />
      <Suspense fallback={<div className='min-h-screen' />}>
        <Routes>
          <Route path='/' element={<Navigate to='/shop' replace />} />
          <Route path='/home' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/nilkamal' element={<Nilkamal />} />
          <Route path='/nilkamal/:collection' element={<NilkamalCollection />} />
          <Route path='/nilkamal/:collection/:handle' element={<NilkamalProductPage />} />
          <Route path='/supreme' element={<Supreme />} />
          <Route path='/supreme/:collection' element={<SupremeCollection />} />
          <Route path='/supreme/:collection/:handle' element={<SupremeProductPage />} />
          <Route path='/seatex' element={<Seatex />} />
          <Route path='/seatex/:collection' element={<SeatexCollection />} />
          <Route path='/seatex/:collection/:handle' element={<SeatexProductPage />} />
          {/* The catalogue index and the shop were the same grid of the same
              chairs under two URLs. /shop is the survivor; these keep old links,
              bookmarks and indexed results working. */}
          <Route path='/mvm' element={<Navigate to='/shop' replace />} />
          <Route path='/mvm/:collection' element={<Navigate to='/shop' replace />} />
          <Route path='/mvm/:collection/:slug' element={<MVMProductPage />} />
          <Route path='/catalogue-colors' element={<CatalogueColors />} />

          {/* ── Store ─────────────────────────────────────────────────────
              /order/success is the return URL the payment provider sends the
              buyer back to, and /order/track is the whole of "my account".
              Neither needs a login: see the note at the top of Checkout. */}
          <Route path='/shop' element={<Shop />} />
          <Route path='/wishlist' element={<WishlistPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/order/success' element={<OrderSuccess />} />
          <Route path='/order/track' element={<OrderTrack />} />
          <Route path='/order' element={<Navigate to='/order/track' replace />} />
          {/* Legacy /catalogue-colors/<line> URLs redirect to the consolidated page */}
          <Route path='/catalogue-colors/:slug' element={<Navigate to='/catalogue-colors' replace />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/refunds' element={<Refunds />} />
          <Route path='/shipping' element={<Shipping />} />
          {/* Redirect old /products/ URLs to /mvm/ */}
          <Route path='/products/:category' element={<Navigate to='/shop' replace />} />
          <Route path='/products/:category/:slug' element={<Navigate to='/shop' replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}
