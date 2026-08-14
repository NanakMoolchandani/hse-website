import { useState, useEffect, useLayoutEffect, useRef, lazy, Suspense } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Menu, X, MessageCircle, ChevronDown, FileDown, Palette } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navigate } from 'react-router-dom'
import CartButton from '@/src/components/CartButton'
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
const CatalogueColors = lazy(() => import('@/src/pages/CatalogueColors'))

// ── Store ────────────────────────────────────────────────────────────────────
// Lazy like everything else: most visitors never reach these, and the checkout
// pulls in form and cart code that has no business in the marketing bundle.
const CartPage = lazy(() => import('@/src/pages/Cart'))
const Checkout = lazy(() => import('@/src/pages/Checkout'))
const OrderSuccess = lazy(() => import('@/src/pages/OrderSuccess'))
const OrderTrack = lazy(() => import('@/src/pages/OrderTrack'))

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ── Data ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: null }, // dropdown
  // The catalogue is everything we make; the shop is the part you can buy
  // right now without asking for a price. Both stay in the nav, because most
  // of the range is still wholesale and quoted per deal.
  { label: 'Shop', href: '/shop' },
  { label: 'Features', href: '/home#features' },
  { label: 'Contact', href: '/home#contact' },
]

/**
 * Downloadable catalogues.
 *
 * These are served from `/catalogs/*` — a same-origin rewrite onto the R2
 * asset host (see vercel.json). Same-origin matters: it is what lets `fetch`
 * read the file without a CORS grant and lets the `download` attribute save it
 * rather than opening the browser's PDF viewer.
 */
const CATALOGS = [
  {
    label: 'MVM Aasanam — Seating',
    href: '/catalogs/MVM-Aasanam-Seating-Collection.pdf',
    file: 'MVM-Aasanam-Seating-Collection.pdf',
  },
  { label: 'MVM Aasanam', href: '/catalogs/HSE-Catalog.pdf', file: 'MVM-Aasanam-Catalog.pdf' },
  { label: 'Nilkamal', href: '/catalogs/Nilkamal-Catalog.pdf', file: 'Nilkamal-Catalog.pdf' },
  { label: 'Supreme', href: '/catalogs/Supreme-Catalog.pdf', file: 'Supreme-Catalog.pdf' },
  { label: 'Seatex', href: '/catalogs/Seatex-Catalog.pdf', file: 'Seatex-Catalog.pdf' },
]

/** Save a catalogue to disk rather than opening it in the PDF viewer. */
async function downloadPdf(url: string, filename: string) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    if (blob.size === 0) throw new Error('empty file')

    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    // Safari aborts the save if the object URL is revoked too early.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10000)
  } catch {
    // Last resort: let the browser handle the URL directly.
    window.open(url, '_blank', 'noopener')
  }
}

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

  const handleNavClick = (href: string) => {
    setOpen(false)
    if (href.includes('#') && isHome) {
      const hash = href.substring(href.indexOf('#'))
      const target = document.querySelector(hash)
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-2'>
          <Link to='/shop' className={`flex items-center gap-2 sm:gap-2.5 font-bold tracking-tight font-sans min-w-0 ${textColor}`}>
            <img src='/logos/mvm-logo.png' alt='MVM Aasanam' className='w-8 h-8 sm:w-9 sm:h-9 rounded-full flex-shrink-0' />
            <span className='text-[13px] sm:text-base truncate'>
              <span className='sm:hidden'>Hari Shewa</span>
              <span className='hidden sm:inline'>Hari Shewa Enterprises</span>
            </span>
          </Link>
          <div className='hidden md:flex items-center gap-8'>
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
                          {/* Catalogs */}
                          <div className={`py-2 w-52 border-l ${isHome ? 'border-white/10' : 'border-gray-100'}`}>
                            <p className='px-4 py-1 text-[10px] font-semibold tracking-widest uppercase text-gray-500'>
                              Catalogs
                            </p>
                            {CATALOGS.map((catalog) => (
                              <button
                                key={catalog.label}
                                className={`flex items-center gap-2 px-4 py-1.5 text-sm w-full text-left ${dropdownItemClass}`}
                                onClick={() => {
                                  setProductsOpen(false)
                                  downloadPdf(catalog.href, catalog.file)
                                }}
                              >
                                <FileDown className='w-3 h-3 flex-shrink-0' />
                                {catalog.label}
                              </button>
                            ))}
                            <div className={`border-t mt-1 pt-1 ${isHome ? 'border-white/10' : 'border-gray-100'}`}>
                              <Link
                                to='/catalogue-colors'
                                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium ${dropdownItemClass}`}
                                onClick={() => setProductsOpen(false)}
                              >
                                <Palette className='w-3 h-3 flex-shrink-0' />
                                Catalogue Colors
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : l.href.includes('#') ? (
                isHome ? (
                  <button
                    key={l.href}
                    onClick={() => handleNavClick(l.href!)}
                    className={`text-sm font-medium transition-colors ${linkColor}`}
                  >
                    {l.label}
                  </button>
                ) : (
                  <Link
                    key={l.href}
                    to={l.href}
                    className={`text-sm font-medium transition-colors ${linkColor}`}
                  >
                    {l.label}
                  </Link>
                )
              ) : (
                <Link
                  key={l.href}
                  to={l.href!}
                  className={`text-sm font-medium transition-colors ${linkColor}`}
                >
                  {l.label}
                </Link>
              ),
            )}
          </div>
          <div className='flex items-center gap-1'>
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
          {/* Weighted 80/20. The four names were previously equal siblings,
              which read as "we sell four brands". MVM Aasanam is the one we
              manufacture, so it takes the width and the accent, and the three
              dealer lines share the right edge. Both tags carry the same
              weight; only their colour separates owning a brand from carrying
              one. */}
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-stretch h-16'>
            <BrandTab
              to='/shop'
              label='MVM Aasanam'
              tag='Our Brand'
              owned
              dark={isHome}
              // Product pages still live under /mvm/<collection>/<slug>, so the
              // brand stays lit while a customer is looking at one of its chairs.
              active={location.pathname.startsWith('/mvm') || location.pathname === '/shop'}
              className='flex-[4]'
            />
            <span className={`my-3 w-px ${isHome ? 'bg-white/15' : 'bg-black/10'}`} />
            <div className='flex-1 flex items-stretch'>
              {[
                { to: '/nilkamal', label: 'Nilkamal' },
                { to: '/supreme', label: 'Supreme' },
                { to: '/seatex', label: 'Seatex' },
              ].map((brand) => (
                <BrandTab
                  key={brand.to}
                  to={brand.to}
                  label={brand.label}
                  tag='Dealer'
                  dark={isHome}
                  active={location.pathname.startsWith(brand.to)}
                  className='flex-1'
                />
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
              <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] mb-2.5 ${isHome ? 'text-gray-500' : 'text-gray-400'}`}>Catalogs</p>
              {CATALOGS.map((catalog) => (
                <button
                  key={catalog.label}
                  className={`flex items-center gap-2 text-sm font-medium py-1.5 pl-1 w-full text-left ${isHome ? 'text-gray-300' : 'text-gray-600'}`}
                  onClick={() => {
                    setOpen(false)
                    downloadPdf(catalog.href, catalog.file)
                  }}
                >
                  <FileDown className='w-3.5 h-3.5 flex-shrink-0' />
                  {catalog.label}
                </button>
              ))}
              <Link
                to='/catalogue-colors'
                className={`flex items-center gap-2 text-sm font-medium py-1.5 pl-1 ${isHome ? 'text-purple-400' : 'text-purple-600'}`}
                onClick={() => setOpen(false)}
              >
                <Palette className='w-3.5 h-3.5 flex-shrink-0' />
                Catalogue Colors
              </Link>
            </div>
            {isHome ? (
              <button
                onClick={() => handleNavClick('/home#contact')}
                className={`text-left text-xl font-semibold py-1.5 ${isHome ? 'text-white' : 'text-gray-900'}`}
              >
                Contact
              </button>
            ) : (
              <Link
                to='/home#contact'
                className={`text-left text-xl font-semibold py-1.5 ${isHome ? 'text-white' : 'text-gray-900'}`}
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
            )}
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

// ── Brand tab ─────────────────────────────────────────────────────────────────

interface BrandTabProps {
  to: string
  label: string
  tag: string
  /** Our own line, which gets the accent and the larger type. */
  owned?: boolean
  dark: boolean
  active: boolean
  className?: string
}

/**
 * One name in the brand bar. Reads as a real tab: it lights on hover, presses
 * on tap, and the route you are on keeps a lit underline so the bar always
 * answers "which of these am I looking at".
 */
function BrandTab({ to, label, tag, owned, dark, active, className = '' }: BrandTabProps) {
  return (
    <Link
      to={to}
      className={`group relative flex flex-col justify-center px-4 transition-colors duration-150 ${
        dark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.035]'
      } ${className}`}
    >
      <span
        className={`font-semibold leading-tight transition-colors ${
          owned ? 'text-[15px]' : 'text-[13px]'
        } ${
          dark
            ? active || owned ? 'text-white' : 'text-white/80 group-hover:text-white'
            : active || owned ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
        }`}
      >
        {label}
      </span>
      <span
        className={`mt-0.5 text-[9px] font-bold uppercase leading-tight tracking-[0.18em] ${
          owned
            ? 'text-amber-500'
            : dark ? 'text-white/40' : 'text-gray-400'
        }`}
      >
        {tag}
      </span>

      {/* Sits under the tab, grows from nothing on hover, stays lit on the
          route you are actually on. */}
      <span
        aria-hidden
        className={`absolute bottom-0 left-0 right-0 h-[2px] origin-left transition-transform duration-250 ease-spring ${
          owned ? 'bg-amber-500' : dark ? 'bg-white/50' : 'bg-gray-900'
        } ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
      />
    </Link>
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
          <Route path='/cart' element={<CartPage />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/order/success' element={<OrderSuccess />} />
          <Route path='/order/track' element={<OrderTrack />} />
          <Route path='/order' element={<Navigate to='/order/track' replace />} />
          {/* Legacy /catalogue-colors/<line> URLs redirect to the consolidated page */}
          <Route path='/catalogue-colors/:slug' element={<Navigate to='/catalogue-colors' replace />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/terms' element={<Terms />} />
          {/* Redirect old /products/ URLs to /mvm/ */}
          <Route path='/products/:category' element={<Navigate to='/shop' replace />} />
          <Route path='/products/:category/:slug' element={<Navigate to='/shop' replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}
