import { useState, useEffect } from 'react'
import HeroScrollVideo from '../components/ui/scroll-animated-video'
import { ShaderAnimation } from '../components/ui/shader-animation'
import { GlareCard } from '../components/ui/glare-card'
import {
  Menu,
  X,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Why Us', href: '#technology' },
  { label: 'Products', href: '#collections' },
  { label: 'Features', href: '#features' },
  { label: 'Contact', href: '#contact' },
]

const STATS = [
  { count: '500+', label: 'Corporates Served' },
  { count: '50,000+', label: 'Chairs Delivered' },
  { count: '30+', label: 'Years of Experience' },
  { count: '300+', label: 'Active Designs' },
]

const QUALITY_PILLARS = [
  {
    title: 'Ergonomic Engineering',
    description:
      'Every chair is designed around the human spine. Lumbar support, adjustable armrests, and seat depth are calibrated for all-day comfort in demanding work environments.',
    icon: (
      <svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-10 h-10'>
        <path d='M24 6v36M14 16c0-5.52 4.48-10 10-10s10 4.48 10 10' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
        <path d='M10 32h28M14 42h20' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    title: 'Heavy-Duty Frame',
    description:
      'MS powder-coated frames with nylon or aluminium base rated for commercial use. Built to withstand 8 or more hours of daily office use, year after year.',
    icon: (
      <svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-10 h-10'>
        <rect x='8' y='8' width='32' height='32' rx='4' stroke='currentColor' strokeWidth='1.5' />
        <path d='M16 24h16M24 16v16' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    title: 'Premium Upholstery',
    description:
      'Breathable mesh, high-density foam, and premium fabric or leatherette options. Certified for durability and resistant to wear, spills, and fading.',
    icon: (
      <svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-10 h-10'>
        <path d='M8 20c0-6.63 5.37-12 12-12h8c6.63 0 12 5.37 12 12v8c0 6.63-5.37 12-12 12h-8C13.37 40 8 34.63 8 28v-8z' stroke='currentColor' strokeWidth='1.5' />
        <path d='M16 28c2.21 2.21 5.79 2.21 8 0s5.79-2.21 8 0' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    title: 'ISO 9001 & ISO 22000 Certified',
    description:
      'All products pass multi-point quality checks before dispatch. We are ISO 9001 and ISO 22000 certified, trusted by corporates, hospitals, and institutions across Central India.',
    icon: (
      <svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-10 h-10'>
        <path d='M24 4c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4z' stroke='currentColor' strokeWidth='1.5' />
        <path d='M16 24l6 6 10-12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    ),
  },
  {
    title: 'Custom Configurations',
    description:
      'Choose your fabric, colour, armrest type, base finish, and height range. Every order is configured to match your office interior and brand identity.',
    icon: (
      <svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-10 h-10'>
        <circle cx='24' cy='24' r='10' stroke='currentColor' strokeWidth='1.5' />
        <circle cx='24' cy='24' r='3' stroke='currentColor' strokeWidth='1.5' />
        <path d='M6 24h8M34 24h8M24 6v8M24 34v8' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    title: 'Fast & Reliable Delivery',
    description:
      'Orders dispatched from Neemuch within 7 to 15 working days. We handle large-scale fit-outs and institutional projects across Central India with on-time delivery.',
    icon: (
      <svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-10 h-10'>
        <path d='M6 14h24v20H6z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
        <path d='M30 20h6l6 6v8h-12V20z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
        <circle cx='14' cy='36' r='3' stroke='currentColor' strokeWidth='1.5' />
        <circle cx='36' cy='36' r='3' stroke='currentColor' strokeWidth='1.5' />
      </svg>
    ),
  },
]

const COLLECTIONS = [
  {
    name: 'Executive Chairs',
    count: 'Boss Series',
    description: 'Premium leather executive chairs for cabins and boardrooms',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&q=80',
  },
  {
    name: 'Ergonomic Task Chairs',
    count: 'Mesh Pro',
    description: 'All-day comfort with lumbar support, breathable mesh back and full adjustability',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a7db3?w=600&q=80',
  },
  {
    name: 'Cafeteria Furniture',
    count: 'Cafe Range',
    description: 'Durable cafeteria chairs and tables. Stackable, easy to clean and bulk-ready',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
  },
  {
    name: 'Conference & Meeting',
    count: 'Board Room',
    description: 'Coordinated seating solutions for meeting rooms and training halls',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  },
  {
    name: 'Visitor & Reception',
    count: 'Lobby Collection',
    description: 'Stylish visitor chairs, waiting area sofas and reception counters',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
  },
]

const FEATURES = [
  {
    number: '01',
    title: 'Bulk & Project Supply',
    description:
      'From 10 chairs to 10,000. We handle large-scale corporate orders, fit-outs, and institutional supply with on-time delivery across Central India.',
  },
  {
    number: '02',
    title: 'Custom Configurations',
    description:
      'Choose your fabric, colour, armrest type, base finish, and height range. We configure every order to match your office interior and brand.',
  },
  {
    number: '03',
    title: 'After-Sales Support',
    description:
      'Dedicated support for repairs, spare parts, and replacements. We stand behind every product we supply — long after the invoice is paid.',
  },
  {
    number: '04',
    title: 'Competitive Pricing',
    description:
      'Direct from manufacturer to you — no middlemen. Get the best price on premium office and cafeteria furniture without compromising on quality.',
  },
]

const TESTIMONIALS = [
  {
    initials: 'PJ',
    name: 'Prakash Jain',
    location: 'Neemuch, MP',
    quote:
      'Ordered 150 workstation chairs for our new office. MVM Furnishing delivered on time, quality was excellent, and the ergonomic support has made a real difference to our team.',
  },
  {
    initials: 'SK',
    name: 'Suresh Kumar',
    location: 'Indore, MP',
    quote:
      'We furnished our entire cafeteria — 80 chairs and 20 tables. Pricing was very competitive and the stackable chairs are extremely practical for our space. Highly recommended.',
  },
  {
    initials: 'RV',
    name: 'Ramesh Verma',
    location: 'Mandsaur, MP',
    quote:
      'Got executive chairs for our boardroom and visitor chairs for reception. Premium quality, great finish. The team was helpful right from selection to installation.',
  },
]

const SPECS = [
  {
    heading: 'Chair Construction',
    rows: [
      ['Frame', 'MS / Aluminium'],
      ['Base', 'Nylon 5-Star / Aluminium'],
      ['Gas Lift', 'Class 4 Hydraulic'],
      ['Load Rating', 'Up to 150 kg'],
    ],
  },
  {
    heading: 'Upholstery',
    rows: [
      ['Fabric', 'Mesh / Fabric / Leatherette'],
      ['Foam Density', 'High-Density PU Foam'],
      ['Armrests', 'Fixed / 2D / 4D'],
      ['Warranty', '1-Year on Mechanism'],
    ],
  },
  {
    heading: 'Product Range',
    rows: [
      ['Executive', 'High-Back Chairs'],
      ['Task', 'Mid-Back Ergonomic'],
      ['Cafeteria', 'Stackable Chairs & Tables'],
      ['Conference', 'Meeting Room Seating'],
    ],
  },
  {
    heading: 'Supply & Service',
    rows: [
      ['Coverage', 'Central India'],
      ['Min. Order', '10 Units'],
      ['Lead Time', '7–15 Working Days'],
      ['Installation', 'Available on Request'],
    ],
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    setOpen(false)
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16'>
          <a href='#hero' className='text-base font-bold tracking-tight font-sans text-gray-900'>
            Hari Shewa Enterprises
          </a>
          <div className='hidden md:flex items-center gap-8'>
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className='text-sm font-medium text-gray-700 transition-colors hover:opacity-70'
              >
                {l.label}
              </button>
            ))}
          </div>
          <a
            href='https://wa.me/919131438300'
            className='hidden md:inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-all'
          >
            WhatsApp Us
          </a>
          <button
            className='md:hidden p-2 text-gray-900'
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className='fixed inset-0 z-40 bg-white flex flex-col pt-16'>
          <div className='flex flex-col px-6 py-8 gap-6'>
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className='text-left text-2xl font-semibold text-gray-900'
              >
                {l.label}
              </button>
            ))}
            <a
              href='https://wa.me/919131438300'
              className='mt-4 inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium'
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

function StarRow() {
  return (
    <div className='flex gap-0.5'>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className='w-4 h-4 fill-amber-400' viewBox='0 0 16 16'>
          <path d='M8 0l2.47 4.94L16 5.82l-4 3.86.94 5.46L8 12.54l-4.94 2.6.94-5.46-4-3.86 5.53-.88L8 0z' />
        </svg>
      ))}
    </div>
  )
}

// ── Main content revealed after hero expansion ────────────────────────────────

function LandingContent() {
  return (
    <div className='bg-white'>
      {/* Stats Bar */}
      <section className='border-y border-gray-100 py-10 md:py-14'>
        <div className='max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8'>
          {STATS.map((s) => (
            <div key={s.label} className='text-center'>
              <p className='text-4xl font-bold text-gray-900 font-display'>{s.count}</p>
              <p className='text-sm text-gray-500 mt-1'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section id='technology' className='py-20 md:py-28'>
        <div className='max-w-7xl mx-auto px-6 lg:px-10'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Why MVM Aasanam
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
            Built for the<br />Modern Workplace
          </h2>
          <p className='text-gray-500 max-w-xl mb-14 text-lg'>
            Every chair we supply is engineered for productivity, comfort, and long-term commercial use.
            Not just aesthetics.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [grid-auto-rows:1fr] gap-6'>
            {QUALITY_PILLARS.map((c) => (
              <GlareCard key={c.title} fitContent containerClassName='w-full h-full' className='flex flex-col items-start justify-start p-7 h-full'>
                <div className='text-white/60 mb-5'>{c.icon}</div>
                <h3 className='font-semibold text-white mb-2'>{c.title}</h3>
                <p className='text-sm text-white/50 leading-relaxed'>{c.description}</p>
              </GlareCard>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id='collections' className='py-20 md:py-28'>
        <div className='max-w-7xl mx-auto px-6 lg:px-10'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Product Range
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
            Seating for<br />Every Space
          </h2>
          <p className='text-gray-500 max-w-xl mb-14 text-lg'>
            From executive cabins to open workstations, conference rooms to cafeterias,
            we have the right seating solution for every area of your office.
          </p>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {COLLECTIONS.map((col) => (
              <GlareCard key={col.name} containerClassName='w-full' className='relative flex flex-col justify-end'>
                <img
                  src={col.image}
                  alt={col.name}
                  className='h-full w-full absolute inset-0 object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
                <div className='relative z-10 p-6'>
                  <span className='text-xs font-medium text-white/60 uppercase tracking-wider'>
                    {col.count}
                  </span>
                  <h3 className='text-xl font-bold text-white mt-0.5'>{col.name}</h3>
                  <p className='text-sm text-white/60 mt-1'>{col.description}</p>
                </div>
              </GlareCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id='features' className='py-20 md:py-28 bg-gray-900 text-white'>
        <div className='max-w-7xl mx-auto px-6 lg:px-10'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            What Sets Us Apart
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold mb-16'>
            Designed for Business
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16'>
            {FEATURES.map((f) => (
              <div key={f.number} className='flex gap-6'>
                <span className='text-4xl font-bold text-gray-700 font-display shrink-0 leading-none'>
                  {f.number}
                </span>
                <div>
                  <h3 className='text-xl font-semibold mb-2'>{f.title}</h3>
                  <p className='text-gray-400 leading-relaxed'>{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className='py-20 md:py-28'>
        <div className='max-w-7xl mx-auto px-6 lg:px-10'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            How It Works
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
            From Enquiry<br />to Installation
          </h2>
          <p className='text-gray-500 max-w-xl mb-14 text-lg'>
            A simple, hassle-free process — whether you're furnishing a 10-seat office or
            a 500-person facility.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {[
              { n: '1', title: 'Share Requirements', desc: "Tell us your space, headcount, and budget via WhatsApp or call. We'll guide you to the right products." },
              { n: '2', title: 'Get a Quote', desc: 'Receive an itemised quotation with product specs, fabric/colour options, and delivery timeline.' },
              { n: '3', title: 'We Dispatch', desc: 'Orders are packed and dispatched from Neemuch within 7–15 working days with tracking updates.' },
              { n: '4', title: 'Delivery & Setup', desc: 'We deliver pan Central India. Installation support available on request. Post-sale service included.' },
            ].map((step) => (
              <div key={step.n} className='relative'>
                <div className='w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold mb-4'>
                  {step.n}
                </div>
                <h4 className='font-semibold text-gray-900 mb-2'>{step.title}</h4>
                <p className='text-sm text-gray-500 leading-relaxed'>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='py-20 md:py-28 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-6 lg:px-10'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Testimonials
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-14'>
            Trusted by Corporates<br />Across the Region
          </h2>
          <div className='flex flex-wrap justify-center gap-6'>
            {TESTIMONIALS.map((t) => (
              <GlareCard key={t.name} className='flex flex-col items-start justify-end p-8'>
                <StarRow />
                <blockquote className='text-white/75 mt-4 mb-6 leading-relaxed text-sm'>
                  "{t.quote}"
                </blockquote>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center text-sm font-bold'>
                    {t.initials}
                  </div>
                  <div>
                    <p className='font-semibold text-white text-sm'>{t.name}</p>
                    <p className='text-xs text-white/40'>{t.location}</p>
                  </div>
                </div>
              </GlareCard>
            ))}
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className='py-20 md:py-28'>
        <div className='max-w-7xl mx-auto px-6 lg:px-10'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Specifications
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-14'>
            Built to Commercial<br />Standards
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {SPECS.map((g) => (
              <div key={g.heading}>
                <h4 className='font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200'>
                  {g.heading}
                </h4>
                <div className='space-y-3'>
                  {g.rows.map(([label, value]) => (
                    <div key={label} className='flex justify-between gap-2'>
                      <span className='text-sm text-gray-500'>{label}</span>
                      <span className='text-sm font-medium text-gray-900 text-right'>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id='contact' className='py-20 md:py-28 bg-gray-900 text-white'>
        <div className='max-w-4xl mx-auto px-6 lg:px-10 text-center'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Get in Touch
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold mb-4'>
            Ready to Furnish<br />Your Workspace?
          </h2>
          <p className='text-gray-400 text-lg mb-10 max-w-xl mx-auto'>
            Share your requirements and get a quote within 24 hours. Bulk orders, custom configurations, and pan Central India delivery available.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-14'>
            <a
              href='https://wa.me/919131438300'
              className='inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors'
            >
              <MessageCircle className='w-5 h-5' />
              WhatsApp Us
            </a>
            <a
              href='tel:+919131438300'
              className='inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors'
            >
              <Phone className='w-5 h-5' />
              Call Now
            </a>
          </div>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400 text-sm'>
            <div className='flex items-center gap-2'>
              <MapPin className='w-4 h-4 shrink-0' />
              <span>Neemuch, Madhya Pradesh</span>
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='w-4 h-4 shrink-0' />
              <span>GSTIN: 23AJUPM2209E1ZD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-white border-t border-gray-100 py-10'>
        <div className='max-w-7xl mx-auto px-6 lg:px-10'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-10'>
            <div>
              <h4 className='text-lg font-bold text-gray-900 mb-1'>MVM Furnishing</h4>
              <p className='text-xs text-gray-400 mb-3'>by Hari Shewa Enterprises</p>
              <p className='text-sm text-gray-500 leading-relaxed'>
                Office & cafeteria furniture specialists serving corporates across Central India since 1997.
              </p>
            </div>
            <div>
              <h5 className='font-semibold text-gray-900 mb-3'>Products</h5>
              <div className='space-y-2'>
                {['Executive Chairs', 'Ergonomic Task Chairs', 'Cafeteria Furniture', 'Conference & Meeting', 'Visitor & Reception'].map((l) => (
                  <a key={l} href='#collections' className='block text-sm text-gray-500 hover:text-gray-900'>
                    {l}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h5 className='font-semibold text-gray-900 mb-3'>Company</h5>
              <div className='space-y-2'>
                {[
                  ['Craftsmanship', '#technology'],
                  ['Our Process', '#features'],
                  ['Testimonials', '#collections'],
                  ['Contact Us', '#contact'],
                ].map(([label, href]) => (
                  <a key={label} href={href} className='block text-sm text-gray-500 hover:text-gray-900'>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className='border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-sm text-gray-400'>
            <p>© {new Date().getFullYear()} Hari Shewa Enterprises. All Rights Reserved.</p>
            <p>Office & Cafeteria Furniture — Neemuch, Madhya Pradesh</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className='bg-white'>
      <Navbar />
      <div id='hero'>
        <HeroScrollVideo
          title='MVM Aasanam'
          subtitle='Leading Pioneers in Office and Cafeteria Furniture'
          meta='Est. 1997 · Neemuch, MP'
          credits={null}
          mediaType='video'
          media='https://videos.pexels.com/video-files/6774539/6774539-hd_1920_1080_30fps.mp4'
          poster='https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1920&q=90&fit=crop&auto=format'
          muted
          loop
          playsInline
          overlay={{
            caption: 'ISO 9001 & ISO 22000 CERTIFIED · NEEMUCH, MP',
            heading: 'Where Comfort Meets Productivity',
            paragraphs: [
              '30+ years crafting premium office and cafeteria furniture for India\'s leading corporates.',
            ],
            extra: (
              <a
                href='https://wa.me/919131438300'
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fff',
                  color: '#111827',
                  fontWeight: 700,
                  fontSize: '15px',
                  padding: '12px 28px',
                  borderRadius: '999px',
                  marginTop: '8px',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                }}
              >
                <MessageCircle size={18} />
                Get a Free Quote
              </a>
            ),
          }}
          targetSize={{ widthVw: 100, heightVh: 95, borderRadius: 0 }}
          scrollHeightVh={280}
          smoothScroll={false}
          initialBoxSize={400}
          headerBackground={
            <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.18 }}>
              <ShaderAnimation />
            </div>
          }
        />
      </div>
      <LandingContent />
    </div>
  )
}
