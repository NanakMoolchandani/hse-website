import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'
import ChairExplosionSection from '@/src/components/ui/chair-explosion-section'
import { GlareCard } from '@/components/ui/glare-card'
import {
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  Quote,
} from 'lucide-react'
import { CATEGORIES } from '@/src/lib/categories'
import { fetchProductCounts } from '@/src/lib/supabase'

// ── Data ──────────────────────────────────────────────────────────────────────

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
      ['Visitor', 'Reception & Waiting Area'],
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

const CLIENTS = [
  'SBI', 'Bank of India', 'PNB', 'Central Bank', 'HDFC Bank', 'Axis Bank',
  'NTPC', 'BHEL', 'Indian Railways', 'MPEB', 'District Collectorate', 'PWD',
  'TCS', 'Infosys', 'Wipro', 'L&T', 'Reliance', 'Adani Group',
  'IIT Indore', 'IIM Indore', 'DAVV', 'KV Schools', 'NIT Bhopal', 'AIIMS',
]

const TESTIMONIALS = [
  {
    quote: 'We furnished our entire 200-seat office with MVM Aasanam chairs. The quality is exceptional — after two years of heavy daily use, they still look and feel brand new. Their team handled the bulk order seamlessly.',
    name: 'Rajesh Sharma',
    role: 'Head of Procurement',
    company: 'Leading IT Services Company, Indore',
  },
  {
    quote: 'As a GeM empanelled supplier, Hari Shewa made our government procurement process completely hassle-free. Competitive pricing, proper documentation, and on-time delivery for all 12 of our district offices.',
    name: 'Dr. Anita Verma',
    role: 'Administrative Officer',
    company: 'Government Institution, Madhya Pradesh',
  },
  {
    quote: 'The customization options are what set them apart. We needed specific fabric colours and armrest configurations to match our brand guidelines — they delivered exactly what we specified, on schedule.',
    name: 'Priya Mehta',
    role: 'Interior Design Lead',
    company: 'Architecture & Interiors Firm, Mumbai',
  },
]

const FAQS = [
  {
    q: 'What is the minimum order quantity?',
    a: 'Our minimum order is 10 units. However, we specialise in bulk and project orders — from 50 chairs to 10,000+. Pricing improves significantly with volume.',
  },
  {
    q: 'Which areas do you deliver to?',
    a: 'We deliver across all of Central India — Madhya Pradesh, Rajasthan, Gujarat, Maharashtra, Chhattisgarh, and beyond. For large orders, we arrange delivery pan-India.',
  },
  {
    q: 'What is the typical delivery timeline?',
    a: 'Standard orders are dispatched within 7 to 15 working days from our Neemuch facility. Large institutional orders (500+ units) may take 3 to 4 weeks depending on customization.',
  },
  {
    q: 'Do you offer customization?',
    a: 'Yes. You can choose fabric type (mesh, leatherette, fabric), colour, armrest style (fixed, 2D, 4D), base material (nylon or aluminium), and height range. Every order is configured to your specifications.',
  },
  {
    q: 'Are you listed on the Government e-Marketplace (GeM)?',
    a: 'Yes, we are an empanelled supplier on GeM. Government bodies can place orders directly through the GeM portal with all required compliance documentation.',
  },
  {
    q: 'What certifications do you hold?',
    a: 'We are ISO 9001 (Quality Management) and ISO 22000 (Food Safety — for cafeteria furniture) certified. All products undergo multi-point quality checks before dispatch.',
  },
  {
    q: 'What warranty do you provide?',
    a: 'All chairs come with a 1-year warranty on the mechanism (gas lift, tilt, and adjustment controls). Frames and structural components are built for 8+ years of commercial use.',
  },
  {
    q: 'How do I get a quotation?',
    a: 'Simply message us on WhatsApp at +91 91314 38300 with your requirements — quantity, product type, and any customization needs. You will receive an itemised quotation within 24 hours.',
  },
]

// ── FAQ Accordion Item ───────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className='border-b border-gray-200'>
      <button
        onClick={() => setOpen((o) => !o)}
        className='w-full flex items-center justify-between py-5 text-left group'
      >
        <span className='text-base font-medium text-gray-900 pr-4'>{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-60 pb-5' : 'max-h-0'}`}
      >
        <p className='text-sm text-gray-500 leading-relaxed'>{a}</p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [productCounts, setProductCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchProductCounts().then(setProductCounts)
  }, [])

  return (
    <>
      <ScrollExpandMedia
        mediaType='video'
        mediaSrc='https://videos.pexels.com/video-files/8347237/8347237-hd_1920_1080_25fps.mp4'
        posterSrc='https://images.pexels.com/videos/8347237/pexels-photo-8347237.jpeg?auto=compress&cs=tinysrgb&w=1920'
        bgImageSrc='https://images.pexels.com/videos/8347237/pexels-photo-8347237.jpeg?auto=compress&cs=tinysrgb&w=1920'
        title='MVM Aasanam'
        date='Est. 1997 · Neemuch, MP'
        scrollToExpand='Scroll to explore'
        textBlend
      />

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
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-10'>
            <a
              href='https://wa.me/919131438300'
              className='inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-700 transition-colors'
            >
              <MessageCircle className='w-5 h-5' />
              Get a Free Quote
            </a>
            <a
              href='#collections'
              className='inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-50 transition-colors'
            >
              View Products
            </a>
          </div>
        </section>
      </div>

      <ChairExplosionSection />

      <div className='bg-white'>
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

        {/* Client Trust Bar */}
        <section className='py-16 md:py-20 border-b border-gray-100'>
          <div className='max-w-7xl mx-auto px-6 lg:px-10'>
            <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3 text-center'>
              Trusted Partners
            </p>
            <h2 className='font-display text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center'>
              Serving India's Leading Institutions
            </h2>
            <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'>
              {CLIENTS.map((name) => (
                <div
                  key={name}
                  className='border border-gray-100 rounded-lg px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wide hover:border-gray-300 hover:text-gray-600 transition-colors'
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products — now with router links */}
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
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              {CATEGORIES.map((cat) => {
                const count = productCounts[cat.enum] || 0
                return (
                  <Link key={cat.slug} to={`/products/${cat.slug}`} className='group block'>
                    <div className='relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100'>
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />
                      <div className='absolute bottom-0 left-0 right-0 p-8'>
                        <span className='text-xs font-semibold text-white/50 uppercase tracking-widest'>
                          {cat.series}
                        </span>
                        <h3 className='text-2xl md:text-3xl font-bold text-white mt-1'>{cat.label}</h3>
                        <p className='text-sm text-white/60 mt-2 max-w-sm'>{cat.description}</p>
                        {count > 0 && (
                          <p className='text-xs text-white/40 mt-3'>{count} products</p>
                        )}
                        <span className='inline-block mt-4 text-sm font-medium text-white border-b border-white/30 pb-0.5 group-hover:border-white transition-colors'>
                          View Collection →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
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
              Client Feedback
            </p>
            <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
              What Our Clients<br />Say About Us
            </h2>
            <p className='text-gray-500 max-w-xl mb-14 text-lg'>
              We let our work speak — and our clients confirm it.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className='bg-white rounded-2xl border border-gray-100 p-8 flex flex-col'>
                  <Quote className='w-8 h-8 text-gray-200 mb-4' />
                  <p className='text-gray-600 text-sm leading-relaxed flex-1 mb-6'>
                    {t.quote}
                  </p>
                  <div>
                    <p className='font-semibold text-gray-900 text-sm'>{t.name}</p>
                    <p className='text-xs text-gray-400'>{t.role}</p>
                    <p className='text-xs text-gray-400'>{t.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className='py-20 md:py-28 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-6 lg:px-10'>
            <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
              Our Clientele
            </p>
            <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
              Trusted Across<br />Industries
            </h2>
            <p className='text-gray-500 max-w-xl mb-14 text-lg'>
              From corporate offices to government institutions, we supply furniture to organisations
              that demand quality, durability, and value at scale.
            </p>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
              {[
                { label: 'Corporate Offices', icon: '🏢', desc: 'IT parks, co-working spaces, MNCs' },
                { label: 'Government Bodies', icon: '🏛️', desc: 'GeM empanelled supplier' },
                { label: 'Hospitals & Clinics', icon: '🏥', desc: 'OPDs, waiting areas, admin offices' },
                { label: 'Educational Institutes', icon: '🎓', desc: 'Schools, colleges, training centres' },
                { label: 'Banks & Finance', icon: '🏦', desc: 'Branch offices, regional HQs' },
                { label: 'Hotels & Hospitality', icon: '🏨', desc: 'Conference halls, business centres' },
              ].map((client) => (
                <div key={client.label} className='text-center p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-md transition-shadow'>
                  <div className='text-3xl mb-3'>{client.icon}</div>
                  <h4 className='font-semibold text-gray-900 text-sm mb-1'>{client.label}</h4>
                  <p className='text-xs text-gray-400'>{client.desc}</p>
                </div>
              ))}
            </div>
            <div className='mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4'>
              {['ISO 9001 Certified', 'ISO 22000 Certified', 'GeM Empanelled', 'GST Registered', '30+ Years Experience'].map((badge) => (
                <div key={badge} className='flex items-center gap-2 text-sm text-gray-500'>
                  <CheckCircle2 className='w-4 h-4 text-green-500 shrink-0' />
                  <span>{badge}</span>
                </div>
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
            <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
              Built to Commercial<br />Standards
            </h2>
            <p className='text-gray-500 max-w-xl mb-14 text-lg'>
              Every product meets rigorous quality benchmarks. Here's what goes into our furniture.
            </p>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {SPECS.map((g) => (
                <div key={g.heading} className='rounded-2xl border border-gray-200 overflow-hidden'>
                  <div className='bg-gray-900 px-6 py-4'>
                    <h4 className='font-bold text-white text-sm tracking-wide uppercase'>{g.heading}</h4>
                  </div>
                  <table className='w-full'>
                    <tbody>
                      {g.rows.map(([label, value], idx) => (
                        <tr key={label} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className='px-6 py-4 text-sm text-gray-500 w-1/2'>{label}</td>
                          <td className='px-6 py-4 text-sm font-semibold text-gray-900 text-right'>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className='py-20 md:py-28 bg-gray-50'>
          <div className='max-w-3xl mx-auto px-6 lg:px-10'>
            <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
              Common Questions
            </p>
            <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
              Frequently Asked<br />Questions
            </h2>
            <p className='text-gray-500 max-w-xl mb-14 text-lg'>
              Everything you need to know about ordering furniture from us.
            </p>
            <div className='border-t border-gray-200'>
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
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
            <div className='flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400 text-sm mb-12'>
              <div className='flex items-center gap-2'>
                <MapPin className='w-4 h-4 shrink-0' />
                <span>Neemuch, Madhya Pradesh</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle2 className='w-4 h-4 shrink-0' />
                <span>GSTIN: 23AJUPM2209E1ZD</span>
              </div>
            </div>
            <div className='max-w-4xl mx-auto rounded-xl overflow-hidden border border-white/10'>
              <iframe
                title='Hari Shewa Enterprises Location'
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.5!2d74.87!3d24.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDI4JzEyLjAiTiA3NMKwNTInMTIuMCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin&q=Neemuch,+Madhya+Pradesh'
                width='100%'
                height='250'
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(0.9)' }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='bg-white border-t border-gray-100 py-10'>
          <div className='max-w-7xl mx-auto px-6 lg:px-10'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-10'>
              <div>
                <h4 className='text-lg font-bold text-gray-900 mb-1'>MVM Aasanam</h4>
                <p className='text-xs text-gray-400 mb-3'>by Hari Shewa Enterprises</p>
                <p className='text-sm text-gray-500 leading-relaxed'>
                  Office & cafeteria furniture specialists serving corporates across Central India since 1997.
                </p>
              </div>
              <div>
                <h5 className='font-semibold text-gray-900 mb-3'>Products</h5>
                <div className='space-y-2'>
                  {CATEGORIES.map((cat) => (
                    <Link key={cat.slug} to={`/products/${cat.slug}`} className='block text-sm text-gray-500 hover:text-gray-900'>
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h5 className='font-semibold text-gray-900 mb-3'>Company</h5>
                <div className='space-y-2'>
                  <Link to='/about' className='block text-sm text-gray-500 hover:text-gray-900'>About Us</Link>
                  <a href='#technology' className='block text-sm text-gray-500 hover:text-gray-900'>Craftsmanship</a>
                  <a href='#features' className='block text-sm text-gray-500 hover:text-gray-900'>Our Process</a>
                  <a href='#contact' className='block text-sm text-gray-500 hover:text-gray-900'>Contact Us</a>
                </div>
              </div>
            </div>
            <div className='border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-sm text-gray-400'>
              <p>&copy; {new Date().getFullYear()} Hari Shewa Enterprises. All Rights Reserved.</p>
              <div className='flex gap-4'>
                <Link to='/privacy' className='hover:text-gray-600 transition-colors'>Privacy Policy</Link>
                <Link to='/terms' className='hover:text-gray-600 transition-colors'>Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
