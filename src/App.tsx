import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Menu, X, MessageCircle, ChevronDown } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CATEGORIES } from '@/src/lib/categories'
import Home from '@/src/pages/Home'
import CategoryPage from '@/src/pages/CategoryPage'
import ProductPage from '@/src/pages/ProductPage'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ── Data ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Why Us', href: '/#technology' },
  { label: 'Products', href: null }, // dropdown
  { label: 'Features', href: '/#features' },
  { label: 'Contact', href: '/#contact' },
]

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Category pages have a dark background — navbar should be transparent/dark
  const isCategoryPage = /^\/products\/[^/]+$/.test(location.pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setProductsOpen(false)
  }, [location])

  const handleNavClick = (href: string) => {
    setOpen(false)
    if (href.startsWith('/#') && isHome) {
      const target = document.querySelector(href.substring(1))
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16'>
          <Link to='/' className={`text-base font-bold tracking-tight font-sans ${textColor}`}>
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
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-xl shadow-lg border py-2 w-56 z-50 ${dropdownBg}`}>
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.slug}
                            to={`/products/${cat.slug}`}
                            className={`block px-4 py-2 text-sm ${dropdownItemClass}`}
                            onClick={() => setProductsOpen(false)}
                          >
                            {cat.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : l.href.startsWith('/#') ? (
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
            href='https://wa.me/919131438300'
            className={`hidden md:inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all ${
              isCategoryPage
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
          >
            WhatsApp Us
          </a>
          <button
            className={`md:hidden p-2 ${textColor}`}
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
              to='/'
              className={`text-left text-2xl font-semibold ${isCategoryPage ? 'text-white' : 'text-gray-900'}`}
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <div>
              <p className={`text-sm font-medium uppercase tracking-wider mb-3 ${
                isCategoryPage ? 'text-gray-500' : 'text-gray-400'
              }`}>Products</p>
              <div className='space-y-3 pl-2'>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/products/${cat.slug}`}
                    className={`block text-lg font-medium ${
                      isCategoryPage ? 'text-gray-300' : 'text-gray-700'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
            {isHome ? (
              <button
                onClick={() => handleNavClick('/#contact')}
                className={`text-left text-2xl font-semibold ${isCategoryPage ? 'text-white' : 'text-gray-900'}`}
              >
                Contact
              </button>
            ) : (
              <Link
                to='/#contact'
                className={`text-left text-2xl font-semibold ${isCategoryPage ? 'text-white' : 'text-gray-900'}`}
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
            )}
            <a
              href='https://wa.me/919131438300'
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

  // Kill all GSAP ScrollTriggers and reset scroll on route change
  useEffect(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill())
    ScrollTrigger.clearScrollMemory()
    ScrollTrigger.refresh()

    // Clear any leftover inline styles from GSAP pins
    document.querySelectorAll('[style*="position: fixed"], [style*="transform"]').forEach((el) => {
      if (el.closest('[data-gsap-pinned]') || el.getAttribute('style')?.includes('pin-spacer')) {
        gsap.set(el, { clearProps: 'all' })
      }
    })

    // Remove any GSAP pin-spacer wrapper elements
    document.querySelectorAll('.pin-spacer').forEach((spacer) => {
      const child = spacer.firstElementChild
      if (child) {
        spacer.parentElement?.insertBefore(child, spacer)
        spacer.remove()
      }
    })

    if (!location.hash) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  return (
    <div className='bg-white'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products/:category' element={<CategoryPage />} />
        <Route path='/products/:category/:slug' element={<ProductPage />} />
      </Routes>
    </div>
  )
}
