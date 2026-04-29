import { useState, useEffect, useLayoutEffect, useRef, lazy, Suspense } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Menu, X, MessageCircle, ChevronDown, FileDown, Palette } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navigate } from 'react-router-dom'

// MVM is the default landing route (/) — keep eager so first paint has no spinner.
import MVM from '@/src/pages/MVM'

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

/** Download a cross-origin PDF as a file (bypasses browser PDF viewer) */
async function downloadPdf(url: string, filename: string) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(a.href)
  } catch {
    // Fallback: open in new tab
    window.open(url, '_blank')
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

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      const delta = y - lastScrollY.current
      if (Math.abs(delta) > 5) {
        if (y > 80 && delta > 0) setHidden(true)
        else if (delta < 0) setHidden(false)
        lastScrollY.current = y
      }
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
    if (href.includes('#')) {
      const hash = href.substring(href.indexOf('#'))
      const target = document.querySelector(hash)
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Always dark navbar — full-site dark theme
  const navBg = scrolled
    ? 'bg-[#0C0C0C]/90 backdrop-blur-md border-b border-white/[0.06]'
    : 'bg-transparent border-b border-white/[0.04]'
  const textColor = 'text-white'
  const linkColor = 'text-[#9C9C9C] hover:text-white'
  const dropdownBg = 'bg-[#1F1F1F]/95 backdrop-blur-md border border-white/[0.08]'
  const dropdownItemClass = 'text-[#9C9C9C] hover:bg-white/[0.06] hover:text-white'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg} ${hidden && !open ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-2'>
          <Link to='/mvm' className={`flex items-center gap-2 sm:gap-2.5 font-bold tracking-tight font-sans min-w-0 ${textColor}`}>
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
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-xl shadow-lg border z-50 ${dropdownBg}`}>
                        <div className='flex'>
                          {/* Brands */}
                          <div className='py-2 w-52'>
                            <Link
                              to='/mvm'
                              className={`block px-4 py-2 text-sm font-medium ${dropdownItemClass}`}
                              onClick={() => setProductsOpen(false)}
                            >
                              MVM Aasanam
                              <span className='ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-400'>
                                Our Brand
                              </span>
                            </Link>
                            {[
                              { to: '/nilkamal', label: 'Nilkamal', bg: 'bg-blue-500/20 text-blue-400' },
                              { to: '/supreme', label: 'Supreme', bg: 'bg-orange-500/20 text-orange-400' },
                              { to: '/seatex', label: 'Seatex', bg: 'bg-emerald-500/20 text-emerald-400' },
                            ].map((brand) => (
                              <Link
                                key={brand.to}
                                to={brand.to}
                                className={`block px-4 py-2 text-sm font-medium ${dropdownItemClass}`}
                                onClick={() => setProductsOpen(false)}
                              >
                                {brand.label}
                                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${brand.bg}`}>
                                  Dealer
                                </span>
                              </Link>
                            ))}
                          </div>
                          {/* Catalogs */}
                          <div className='py-2 w-52 border-l border-white/10'>
                            <p className='px-4 py-1 text-[10px] font-semibold tracking-widest uppercase text-[#9C9C9C]'>
                              Catalogs
                            </p>
                            {[
                              { label: 'MVM Aasanam', href: 'https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog-assets/documents/HSE-Catalog.pdf', file: 'MVM-Aasanam-Catalog.pdf' },
                              { label: 'Nilkamal', href: 'https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog-assets/documents/Nilkamal-Catalog.pdf', file: 'Nilkamal-Catalog.pdf' },
                              { label: 'Supreme', href: 'https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog-assets/documents/Supreme-Catalog.pdf', file: 'Supreme-Catalog.pdf' },
                              { label: 'Seatex', href: 'https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog-assets/documents/Seatex-Catalog.pdf', file: 'Seatex-Catalog.pdf' },
                            ].map((catalog) => (
                              <button
                                key={catalog.label}
                                className={`flex items-center gap-2 px-4 py-1.5 text-sm w-full text-left ${dropdownItemClass}`}
                                onClick={() => { setProductsOpen(false); downloadPdf(catalog.href, catalog.file) }}
                              >
                                <FileDown className='w-3 h-3 flex-shrink-0' />
                                {catalog.label}
                              </button>
                            ))}
                            <div className='border-t mt-1 pt-1 border-white/10'>
                              <Link
                                to='/catalogue-colors'
                                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium ${dropdownItemClass}`}
                                onClick={() => setProductsOpen(false)}
                              >
                                <Palette className='w-3 h-3 flex-shrink-0' />
                                Colour Catalogue
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : l.href.includes('#') ? (
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
            className='hidden md:inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all bg-white text-black hover:bg-gray-200'
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

        {/* Brand quick-links bar */}
        <div className={`hidden md:block ${scrolled ? 'bg-[#0C0C0C]/80 backdrop-blur-md border-t border-white/[0.06]' : 'bg-[#0C0C0C]/50 backdrop-blur-md'}`}>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-8 h-10'>
            {[
              { to: '/mvm',      label: 'MVM Aasanam', tag: 'Our Brand' },
              { to: '/nilkamal', label: 'Nilkamal',     tag: 'Dealer' },
              { to: '/supreme',  label: 'Supreme',      tag: 'Dealer' },
              { to: '/seatex',   label: 'Seatex',       tag: 'Dealer' },
            ].map((brand, i) => (
              <span key={brand.to} className='flex items-center'>
                {i > 0 && <span className='mr-8 h-3.5 w-px bg-white/10' />}
                <Link to={brand.to} className='flex items-center gap-2 group'>
                  <span className='text-[13px] font-medium text-[#9C9C9C] group-hover:text-white transition-colors'>
                    {brand.label}
                  </span>
                  <span className='text-[10px] tracking-wide uppercase text-white/30 group-hover:text-white/50 transition-colors'>
                    {brand.tag}
                  </span>
                </Link>
              </span>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu — always dark */}
      {open && (
        <div className='fixed inset-0 z-40 flex flex-col pt-16 overflow-y-auto bg-[#0C0C0C]'>
          <div className='flex flex-col px-5 py-6 gap-5'>
            <Link to='/home' className='text-left text-xl font-semibold py-1.5 text-white' onClick={() => setOpen(false)}>
              Home
            </Link>
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.18em] mb-2.5 text-[#9C9C9C]'>Products</p>
              <div className='space-y-0.5 pl-1'>
                <Link to='/mvm' className='flex items-center gap-2 text-base font-medium py-1.5 text-[#9C9C9C] hover:text-white transition-colors' onClick={() => setOpen(false)}>
                  MVM Aasanam
                  <span className='text-[9px] px-1.5 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-400'>Our Brand</span>
                </Link>
                {[
                  { to: '/nilkamal', label: 'Nilkamal', bg: 'bg-blue-500/20 text-blue-400' },
                  { to: '/supreme',  label: 'Supreme',  bg: 'bg-orange-500/20 text-orange-400' },
                  { to: '/seatex',   label: 'Seatex',   bg: 'bg-emerald-500/20 text-emerald-400' },
                ].map((brand) => (
                  <Link key={brand.to} to={brand.to} className='flex items-center gap-2 text-base font-medium py-1.5 text-[#9C9C9C] hover:text-white transition-colors' onClick={() => setOpen(false)}>
                    {brand.label}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${brand.bg}`}>Dealer</span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.18em] mb-2.5 text-[#9C9C9C]'>Catalogs</p>
              {[
                { label: 'MVM Aasanam', href: 'https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog-assets/documents/HSE-Catalog.pdf', file: 'MVM-Aasanam-Catalog.pdf' },
                { label: 'Nilkamal',    href: 'https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog-assets/documents/Nilkamal-Catalog.pdf', file: 'Nilkamal-Catalog.pdf' },
                { label: 'Supreme',     href: 'https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog-assets/documents/Supreme-Catalog.pdf', file: 'Supreme-Catalog.pdf' },
                { label: 'Seatex',      href: 'https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog-assets/documents/Seatex-Catalog.pdf', file: 'Seatex-Catalog.pdf' },
              ].map((catalog) => (
                <button key={catalog.label} className='flex items-center gap-2 text-sm font-medium py-1.5 pl-1 w-full text-left text-[#9C9C9C] hover:text-white transition-colors' onClick={() => { setOpen(false); downloadPdf(catalog.href, catalog.file) }}>
                  <FileDown className='w-3.5 h-3.5 flex-shrink-0' />
                  {catalog.label}
                </button>
              ))}
              <Link to='/catalogue-colors' className='flex items-center gap-2 text-sm font-medium py-1.5 pl-1 text-[#9C9C9C] hover:text-white transition-colors' onClick={() => setOpen(false)}>
                <Palette className='w-3.5 h-3.5 flex-shrink-0' />
                Colour Catalogue
              </Link>
            </div>
            <button onClick={() => handleNavClick('/home#contact')} className='text-left text-xl font-semibold py-1.5 text-white'>
              Contact
            </button>
            <a href='https://wa.me/919981516171' className='mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold w-full bg-white text-black'>
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

  // All routes are dark — full-site dark theme matching premium furniture aesthetics
  const isDarkRoute = true

  // Always dark body — no white flash on any route
  useLayoutEffect(() => {
    document.documentElement.style.backgroundColor = '#0C0C0C'
    document.body.style.backgroundColor = '#0C0C0C'
  }, [])

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

  return (
    <div className={isDarkRoute ? 'bg-gray-950' : 'bg-white'}>
      <Navbar />
      <Suspense fallback={<div className='min-h-screen' />}>
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
          <Route path='/mvm/:collection' element={<Navigate to='/mvm' replace />} />
          <Route path='/mvm/:collection/:slug' element={<MVMProductPage />} />
          <Route path='/catalogue-colors' element={<CatalogueColors />} />
          {/* Legacy /catalogue-colors/<line> URLs redirect to the consolidated page */}
          <Route path='/catalogue-colors/:slug' element={<Navigate to='/catalogue-colors' replace />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/terms' element={<Terms />} />
          {/* Redirect old /products/ URLs to /mvm/ */}
          <Route path='/products/:category' element={<Navigate to='/mvm' replace />} />
          <Route path='/products/:category/:slug' element={<Navigate to='/mvm' replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}
