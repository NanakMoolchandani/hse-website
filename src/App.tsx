import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Menu, X, MessageCircle, ChevronDown, FileDown } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CATEGORIES } from '@/src/lib/categories'
import { Navigate } from 'react-router-dom'
import Home from '@/src/pages/Home'
import About from '@/src/pages/About'
import Nilkamal from '@/src/pages/Nilkamal'
import NilkamalCollection from '@/src/pages/NilkamalCollection'
import NilkamalProductPage from '@/src/pages/NilkamalProduct'
import Supreme from '@/src/pages/Supreme'
import SupremeCollection from '@/src/pages/SupremeCollection'
import SupremeProductPage from '@/src/pages/SupremeProduct'
import Seatex from '@/src/pages/Seatex'
import SeatexCollection from '@/src/pages/SeatexCollection'
import SeatexProductPage from '@/src/pages/SeatexProduct'
import MVM from '@/src/pages/MVM'
import MVMCollection from '@/src/pages/MVMCollection'
import MVMProductPage from '@/src/pages/MVMProduct'
import Privacy from '@/src/pages/Privacy'
import Terms from '@/src/pages/Terms'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ── Data ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: null }, // dropdown
  { label: 'Features', href: '/home#features' },
  { label: 'Contact', href: '/home#contact' },
]

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const location = useLocation()
  const isHome = location.pathname === '/home'

  // Category pages and Nilkamal page have a dark background — navbar should be transparent/dark
  const isDarkPage = location.pathname.startsWith('/nilkamal') || location.pathname.startsWith('/supreme') || location.pathname.startsWith('/seatex') || location.pathname.startsWith('/mvm')
  const isCategoryPage = isDarkPage

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

  // Determine navbar styling based on context
  const navBg = isCategoryPage
    ? scrolled
      ? 'bg-black/80 backdrop-blur-md border-b border-white/5'
      : 'bg-transparent'
    : scrolled || !isHome
      ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100'
      : 'bg-transparent'

  const textColor = isCategoryPage ? 'text-white' : 'text-gray-900'
  const linkColor = isCategoryPage ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:opacity-70'
  const dropdownBg = isCategoryPage
    ? 'bg-gray-900/95 backdrop-blur-md border-white/10'
    : 'bg-white border-gray-100'
  const dropdownItemClass = isCategoryPage
    ? 'text-gray-300 hover:bg-white/10 hover:text-white'
    : 'text-gray-700 hover:bg-gray-50'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg} ${hidden && !open ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16'>
          <Link to='/mvm' className={`text-base font-bold tracking-tight font-sans ${textColor}`}>
            Hari Shewa Enterprises
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
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-xl shadow-lg border z-50 ${dropdownBg}`}>
                        <div className='flex'>
                          {/* Categories */}
                          <div className='py-2 w-52'>
                            {CATEGORIES.map((cat) => (
                              <Link
                                key={cat.slug}
                                to={`/mvm/${cat.slug}`}
                                className={`block px-4 py-2 text-sm ${dropdownItemClass}`}
                                onClick={() => setProductsOpen(false)}
                              >
                                {cat.label}
                              </Link>
                            ))}
                            <div className={`mx-3 my-1 border-t ${isCategoryPage ? 'border-white/10' : 'border-gray-100'}`} />
                            <Link
                              to='/mvm'
                              className={`block px-4 py-2 text-sm font-medium ${dropdownItemClass}`}
                              onClick={() => setProductsOpen(false)}
                            >
                              MVM Aasanam
                              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isCategoryPage ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
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
                                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isCategoryPage ? brand.bg : brand.bgLight}`}>
                                  Dealer
                                </span>
                              </Link>
                            ))}
                          </div>
                          {/* Documents */}
                          <div className={`py-2 w-48 border-l ${isCategoryPage ? 'border-white/10' : 'border-gray-100'}`}>
                            <p className={`px-4 py-1 text-[10px] font-semibold tracking-widest uppercase ${isCategoryPage ? 'text-gray-500' : 'text-gray-400'}`}>
                              Documents
                            </p>
                            <a
                              href='https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog-assets/documents/HSE-Catalog.pdf'
                              target='_blank'
                              rel='noopener noreferrer'
                              className={`flex items-center gap-2 px-4 py-2 text-sm ${dropdownItemClass}`}
                              onClick={() => setProductsOpen(false)}
                            >
                              <FileDown className='w-3.5 h-3.5' />
                              Product Catalog
                            </a>
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
          <a
            href='https://wa.me/919981516171'
            className={`hidden md:inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all ${
              isCategoryPage
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
          >
            WhatsApp Us
          </a>
          <button
            className={`md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center ${textColor}`}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className={`fixed inset-0 z-40 flex flex-col pt-16 ${
          isCategoryPage ? 'bg-black' : 'bg-white'
        }`}>
          <div className='flex flex-col px-6 py-8 gap-6'>
            <Link
              to='/home'
              className={`text-left text-2xl font-semibold py-2 ${isCategoryPage ? 'text-white' : 'text-gray-900'}`}
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <div>
              <p className={`text-sm font-medium uppercase tracking-wider mb-3 ${
                isCategoryPage ? 'text-gray-500' : 'text-gray-400'
              }`}>Products</p>
              <div className='space-y-1 pl-2'>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/mvm/${cat.slug}`}
                    className={`block text-lg font-medium py-1.5 ${
                      isCategoryPage ? 'text-gray-300' : 'text-gray-700'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {cat.label}
                  </Link>
                ))}
                <Link
                  to='/mvm'
                  className={`flex items-center gap-2 text-lg font-medium py-1.5 ${
                    isCategoryPage ? 'text-gray-300' : 'text-gray-700'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  MVM Aasanam
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isCategoryPage ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
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
                    className={`flex items-center gap-2 text-lg font-medium py-1.5 ${
                      isCategoryPage ? 'text-gray-300' : 'text-gray-700'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {brand.label}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isCategoryPage ? brand.bg : brand.bgLight}`}>
                      Dealer
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className={`text-sm font-medium uppercase tracking-wider mb-3 ${
                isCategoryPage ? 'text-gray-500' : 'text-gray-400'
              }`}>Documents</p>
              <a
                href='https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog-assets/documents/HSE-Catalog.pdf'
                target='_blank'
                rel='noopener noreferrer'
                className={`flex items-center gap-2 text-lg font-medium py-1.5 pl-2 ${
                  isCategoryPage ? 'text-gray-300' : 'text-gray-700'
                }`}
                onClick={() => setOpen(false)}
              >
                <FileDown className='w-4 h-4' />
                Product Catalog PDF
              </a>
            </div>
            {isHome ? (
              <button
                onClick={() => handleNavClick('/home#contact')}
                className={`text-left text-2xl font-semibold py-2 ${isCategoryPage ? 'text-white' : 'text-gray-900'}`}
              >
                Contact
              </button>
            ) : (
              <Link
                to='/home#contact'
                className={`text-left text-2xl font-semibold py-2 ${isCategoryPage ? 'text-white' : 'text-gray-900'}`}
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
            )}
            <a
              href='https://wa.me/919981516171'
              className={`mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium ${
                isCategoryPage
                  ? 'bg-white text-black'
                  : 'bg-gray-900 text-white'
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

  // Kill GSAP ScrollTriggers BEFORE new page sets up its own (useLayoutEffect cleanup)
  useLayoutEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      ScrollTrigger.clearScrollMemory()

      // Remove any GSAP pin-spacer wrapper elements
      document.querySelectorAll('.pin-spacer').forEach((spacer) => {
        const child = spacer.firstElementChild
        if (child) {
          spacer.parentElement?.insertBefore(child, spacer)
          spacer.remove()
        }
      })
    }
  }, [location.pathname])

  // Scroll to top on route change
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  return (
    <div className='bg-white'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Navigate to='/mvm' replace />} />
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
        <Route path='/mvm' element={<MVM />} />
        <Route path='/mvm/:collection' element={<MVMCollection />} />
        <Route path='/mvm/:collection/:slug' element={<MVMProductPage />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/terms' element={<Terms />} />
        {/* Redirect old /products/ URLs to /mvm/ */}
        <Route path='/products/:category' element={<Navigate to='/mvm' replace />} />
        <Route path='/products/:category/:slug' element={<Navigate to='/mvm' replace />} />
      </Routes>
    </div>
  )
}
