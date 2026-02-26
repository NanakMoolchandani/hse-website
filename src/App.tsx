import { useState, useEffect } from 'react'
import ScrollExpandMedia from '../components/blocks/scroll-expansion-hero'
import {
  Menu,
  X,
  ArrowUpRight,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Craftsmanship', href: '#technology' },
  { label: 'Collections', href: '#collections' },
  { label: 'Seating', href: '#mvm-seating' },
  { label: 'Features', href: '#features' },
  { label: 'Contact', href: '#contact' },
]

const STATS = [
  { count: '25+', label: 'Years of Craftsmanship' },
  { count: '1000+', label: 'Happy Customers' },
  { count: '50+', label: 'Product Designs' },
  { count: '24', label: 'Premium Finishes' },
]

const CRAFTSMANSHIP = [
  {
    title: 'Solid Wood Construction',
    description:
      'Premium Sheesham and Teak wood sourced from sustainable forests. Each grain tells a unique story.',
    icon: (
      <svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-10 h-10'>
        <path d='M24 4L4 14v20l20 10 20-10V14L24 4z' stroke='currentColor' strokeWidth='1.5' />
        <path d='M4 14l20 10m0 0l20-10M24 24v20' stroke='currentColor' strokeWidth='1.5' />
      </svg>
    ),
  },
  {
    title: 'Precision Joinery',
    description:
      'Mortise and tenon joints ensure generational durability. No nails, no shortcuts — just timeless craftsmanship.',
    icon: (
      <svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-10 h-10'>
        <circle cx='24' cy='24' r='20' stroke='currentColor' strokeWidth='1.5' />
        <path d='M24 8v16l12 8' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    title: 'Italian Finish',
    description:
      'Multi-layer PU coating with hand-polished finish. Resistant to scratches, stains, and everyday wear.',
    icon: (
      <svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-10 h-10'>
        <path d='M8 40h32M12 40V20l12-12 12 12v20' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        <rect x='20' y='28' width='8' height='12' stroke='currentColor' strokeWidth='1.5' />
      </svg>
    ),
  },
  {
    title: 'Quality Assured',
    description:
      'Every piece undergoes 12-point quality inspection before leaving our workshop. Zero compromise policy.',
    icon: (
      <svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-10 h-10'>
        <path d='M24 4c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4z' stroke='currentColor' strokeWidth='1.5' />
        <path d='M16 24l6 6 10-12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    ),
  },
]

const COLLECTIONS = [
  {
    name: 'Living Room',
    count: '12 Products',
    description: 'Sofas, coffee tables, TV units & storage solutions',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    name: 'Bedroom',
    count: '10 Products',
    description: 'Beds, wardrobes, dressers & nightstands',
    image: 'https://images.unsplash.com/photo-1567016526105-22da7c13161a?w=600&q=80',
  },
  {
    name: 'Dining',
    count: '8 Products',
    description: 'Tables, chairs, cabinets & bar units',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80',
  },
  {
    name: 'Office & Study',
    count: '6 Products',
    description: 'Desks, bookshelves, filing cabinets & chairs',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
  },
  {
    name: 'Custom Design',
    count: 'Made to Order',
    description: 'Your vision, our craft — fully bespoke furniture',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
  },
]

const FEATURES = [
  {
    number: '01',
    title: 'Ergonomic Design',
    description:
      'Every curve, angle, and dimension is optimized for human comfort. Our furniture adapts to you, not the other way around.',
  },
  {
    number: '02',
    title: 'Modular Flexibility',
    description:
      'Reconfigure your space effortlessly. Our modular systems let you expand, rearrange, and personalize your setup.',
  },
  {
    number: '03',
    title: 'Built to Last',
    description:
      "We don't build furniture for years — we build it for generations. Solid wood construction with lifetime structural warranty.",
  },
  {
    number: '04',
    title: 'Custom Finishing',
    description:
      'Choose from 24 premium finishes — Walnut, Honey Oak, Mahogany, Espresso, and more. Your vision, our execution.',
  },
]

const TESTIMONIALS = [
  {
    initials: 'RS',
    name: 'Rajesh Sharma',
    location: 'Neemuch, MP',
    quote:
      'Excellent quality sofa set. The Sheesham wood finish is absolutely stunning. Worth every rupee. Delivery was on time and the team handled everything professionally.',
  },
  {
    initials: 'VG',
    name: 'Vinod Gupta',
    location: 'Mandsaur, MP',
    quote:
      "Got a complete bedroom set — king-size bed, wardrobe and dressing table. The craftsmanship is outstanding. We've been buying from HSE for 10 years now.",
  },
  {
    initials: 'AM',
    name: 'Anil Mehta',
    location: 'Ratlam, MP',
    quote:
      'Custom dining table for our restaurant — 12-seater in Teak. HSE delivered exactly what we envisioned. The PU finish is scratch-resistant even after heavy daily use.',
  },
]

const SPECS = [
  {
    heading: 'Materials',
    rows: [
      ['Primary Wood', 'Sheesham / Teak'],
      ['Finish', 'Multi-layer PU Polish'],
      ['Upholstery', 'Premium Fabric / Leather'],
      ['Hardware', 'Stainless Steel / Brass'],
    ],
  },
  {
    heading: 'Construction',
    rows: [
      ['Joinery', 'Mortise & Tenon'],
      ['Load Capacity', 'Up to 250 kg'],
      ['Quality Checks', '12-Point Inspection'],
      ['Warranty', '5-Year Structural'],
    ],
  },
  {
    heading: 'Collections',
    rows: [
      ['Living Room', 'Sofas, Tables, Storage'],
      ['Bedroom', 'Beds, Wardrobes, Dressers'],
      ['Dining', 'Tables, Chairs, Cabinets'],
      ['Custom', 'Made to Order'],
    ],
  },
  {
    heading: 'Delivery',
    rows: [
      ['Pan India', 'Available'],
      ['Assembly', 'White Glove Service'],
      ['Packaging', 'Multi-layer Protection'],
      ['Tracking', 'Real-time Updates'],
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
          <a href='#hero' className={`text-base font-bold tracking-tight font-sans ${scrolled ? 'text-gray-900' : 'text-white'}`}>
            Hari Shewa Enterprises
          </a>
          <div className='hidden md:flex items-center gap-8'>
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className={`text-sm font-medium transition-colors hover:opacity-70 ${scrolled ? 'text-gray-700' : 'text-white/90'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <a
            href='https://wa.me/919131438300'
            className={`hidden md:inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all ${
              scrolled
                ? 'bg-gray-900 text-white hover:bg-gray-700'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
            }`}
          >
            WhatsApp Us
          </a>
          <button
            className={`md:hidden p-2 ${scrolled ? 'text-gray-900' : 'text-white'}`}
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
        <div className='max-w-6xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8'>
          {STATS.map((s) => (
            <div key={s.label} className='text-center'>
              <p className='text-4xl font-bold text-gray-900 font-display'>{s.count}</p>
              <p className='text-sm text-gray-500 mt-1'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Craftsmanship */}
      <section id='technology' className='py-20 md:py-28 bg-gray-50'>
        <div className='max-w-6xl mx-auto px-4'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Craftsmanship
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
            Technology Meets<br />Tradition
          </h2>
          <p className='text-gray-500 max-w-xl mb-14 text-lg'>
            Every piece is a testament to decades of woodworking mastery, where traditional
            techniques meet modern precision.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {CRAFTSMANSHIP.map((c) => (
              <div
                key={c.title}
                className='bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all'
              >
                <div className='text-gray-700 mb-4'>{c.icon}</div>
                <h3 className='font-semibold text-gray-900 mb-2'>{c.title}</h3>
                <p className='text-sm text-gray-500 leading-relaxed'>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section id='collections' className='py-20 md:py-28'>
        <div className='max-w-6xl mx-auto px-4'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Collections
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
            Furniture for<br />Every Room
          </h2>
          <p className='text-gray-500 max-w-xl mb-14 text-lg'>
            From living rooms to bedrooms, dining spaces to offices — each collection designed
            to transform your space with elegance.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {COLLECTIONS.map((col) => (
              <a
                key={col.name}
                href='#contact'
                className='group relative rounded-2xl overflow-hidden aspect-[4/3] block'
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
                <div className='absolute bottom-0 left-0 right-0 p-5 text-white'>
                  <span className='text-xs font-medium text-white/60 uppercase tracking-wider'>
                    {col.count}
                  </span>
                  <h3 className='text-xl font-bold mt-0.5'>{col.name}</h3>
                  <p className='text-sm text-white/70 mt-1'>{col.description}</p>
                </div>
                <div className='absolute top-4 right-4 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                  <ArrowUpRight className='w-4 h-4 text-white' />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id='features' className='py-20 md:py-28 bg-gray-900 text-white'>
        <div className='max-w-6xl mx-auto px-4'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Why MVM Aasanam
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold mb-16'>
            Designed for Living
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
        <div className='max-w-6xl mx-auto px-4'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Our Process
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
            From Workshop<br />to Your Home
          </h2>
          <p className='text-gray-500 max-w-xl mb-14 text-lg'>
            A seamless journey from the first conversation to final delivery, with meticulous
            attention at every stage.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {[
              { n: '1', title: 'Consultation', desc: 'Share your requirements via WhatsApp, call, or visit. We understand your space, style, and budget.' },
              { n: '2', title: 'Design & Quote', desc: 'Receive a detailed quotation with material options, dimensions, and finish samples.' },
              { n: '3', title: 'Crafting', desc: 'Master artisans handcraft your furniture in our Neemuch workshop using traditional joinery techniques.' },
              { n: '4', title: 'Delivery & Setup', desc: 'White-glove delivery with careful assembly and placement. Your satisfaction is our final quality check.' },
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
        <div className='max-w-6xl mx-auto px-4'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Testimonials
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-14'>
            What Our Customers Say
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className='bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all'
              >
                <StarRow />
                <blockquote className='text-gray-600 mt-4 mb-6 leading-relaxed text-sm'>
                  "{t.quote}"
                </blockquote>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold'>
                    {t.initials}
                  </div>
                  <div>
                    <p className='font-semibold text-gray-900 text-sm'>{t.name}</p>
                    <p className='text-xs text-gray-400'>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className='py-20 md:py-28'>
        <div className='max-w-6xl mx-auto px-4'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Specifications
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-14'>
            The Details Matter
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
        <div className='max-w-4xl mx-auto px-4 text-center'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Get in Touch
          </p>
          <h2 className='font-display text-3xl md:text-5xl font-bold mb-4'>
            Ready to Transform<br />Your Space?
          </h2>
          <p className='text-gray-400 text-lg mb-10 max-w-xl mx-auto'>
            Contact us for custom orders, bulk inquiries, or to visit our showroom in Neemuch.
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
        <div className='max-w-6xl mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-10'>
            <div>
              <h4 className='text-lg font-bold text-gray-900 mb-1'>MVM Aasanam</h4>
              <p className='text-xs text-gray-400 mb-3'>by Hari Shewa Enterprises</p>
              <p className='text-sm text-gray-500 leading-relaxed'>
                Premium handcrafted furniture since 2001. Quality you can trust, designs you'll love.
              </p>
            </div>
            <div>
              <h5 className='font-semibold text-gray-900 mb-3'>Collections</h5>
              <div className='space-y-2'>
                {['Living Room', 'Bedroom', 'Dining', 'Office & Study', 'Custom Design'].map((l) => (
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
            <p>Handcrafted with pride in Neemuch, Madhya Pradesh</p>
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
        <ScrollExpandMedia
          mediaType='image'
          mediaSrc='https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1200&q=85&fit=crop&auto=format'
          bgImageSrc='https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80&fit=crop&auto=format'
          date='Premium Office Seating'
          scrollToExpand='↓ Scroll to discover'
          textBlend={false}
          words={['Elegant', 'Comfortable', 'Ergonomic', 'Premium', 'Yours']}
        >
          <LandingContent />
        </ScrollExpandMedia>
      </div>
    </div>
  )
}
