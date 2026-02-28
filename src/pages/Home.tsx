import { useState, useEffect } from 'react'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'
import ChairExplosionSection from '@/src/components/ui/chair-explosion-section'
import WaveBackground from '@/src/components/ui/wave-background'
import {
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react'
import { CATEGORIES } from '@/src/lib/categories'
import { CardStack, type CardStackItem } from '@/src/components/ui/card-stack'
import ScrollTestimonials, { type Testimonial } from '@/src/components/ui/scroll-testimonials'
import Footer from '@/src/components/Footer'
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
      'Every chair is designed around the human spine. Lumbar support, adjustable armrests, and seat depth are calibrated for all day comfort in demanding work environments.',
    icon: (
      <svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-10 h-10'>
        <path d='M24 6v36M14 16c0-5.52 4.48-10 10-10s10 4.48 10 10' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
        <path d='M10 32h28M14 42h20' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    title: 'Heavy Duty Frame',
    description:
      'MS powder coated frames with nylon or aluminium base rated for commercial use. Built to withstand 8 or more hours of daily office use, year after year.',
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
      'Breathable mesh, high density foam, and premium fabric or leatherette options. Certified for durability and resistant to wear, spills, and fading.',
    icon: (
      <svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-10 h-10'>
        <path d='M8 20c0-6.63 5.37-12 12-12h8c6.63 0 12 5.37 12 12v8c0 6.63-5.37 12-12 12h-8C13.37 40 8 34.63 8 28v-8z' stroke='currentColor' strokeWidth='1.5' />
        <path d='M16 28c2.21 2.21 5.79 2.21 8 0s5.79-2.21 8 0' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    title: 'Tested for Endurance',
    description:
      'Every product passes multi point quality checks before dispatch. Load tested, weld inspected, and fabric stress verified. Trusted by corporates, hospitals, and institutions across Central India.',
    icon: (
      <svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-10 h-10'>
        <path d='M24 4L6 12v12c0 11 8 18 18 22 10-4 18-11 18-22V12L24 4z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
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
      'Orders dispatched from Neemuch within 7 to 15 working days. We handle large scale fit outs and institutional projects across Central India with on time delivery.',
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
      'From 10 chairs to 10,000. We handle large scale corporate orders, fit outs, and institutional supply with on time delivery across Central India.',
  },
  {
    number: '02',
    title: 'Custom Configurations',
    description:
      'Choose your fabric, colour, armrest type, base finish, and height range. We configure every order to match your office interior and brand.',
  },
  {
    number: '03',
    title: 'After Sales Support',
    description:
      'Dedicated support for repairs, spare parts, and replacements. We stand behind every product we supply, long after the invoice is paid.',
  },
  {
    number: '04',
    title: 'Competitive Pricing',
    description:
      'Direct from manufacturer to you, no middlemen. Get the best price on premium office and cafeteria furniture without compromising on quality.',
  },
]

const SPECS = [
  {
    heading: 'Chair Construction',
    rows: [
      ['Frame', 'MS / Aluminium'],
      ['Base', 'Nylon 5 Star / Aluminium'],
      ['Gas Lift', 'Class 4 Hydraulic'],
      ['Load Rating', 'Up to 150 kg'],
    ],
  },
  {
    heading: 'Upholstery',
    rows: [
      ['Fabric', 'Mesh / Fabric / Leatherette'],
      ['Foam Density', 'High Density PU Foam'],
      ['Armrests', 'Fixed / 2D / 4D'],
      ['Warranty', '1 Year on Mechanism'],
    ],
  },
  {
    heading: 'Product Range',
    rows: [
      ['Executive', 'High Back Chairs'],
      ['Task', 'Mid Back Ergonomic'],
      ['Cafeteria', 'Stackable Chairs & Tables'],
      ['Visitor', 'Reception & Waiting Area'],
    ],
  },
  {
    heading: 'Supply & Service',
    rows: [
      ['Coverage', 'Central India'],
      ['Min. Order', '10 Units'],
      ['Lead Time', '7 to 15 Working Days'],
      ['Installation', 'Available on Request'],
    ],
  },
]

const CLIENTS = [
  { name: 'SBI', logo: '/logos/sbi.svg' },
  { name: 'Bank of India', logo: '/logos/boi.svg' },
  { name: 'PNB', logo: '/logos/pnb.svg' },
  { name: 'Central Bank', logo: '/logos/central-bank.svg' },
  { name: 'HDFC Bank', logo: '/logos/hdfc.svg' },
  { name: 'Axis Bank', logo: '/logos/axis.svg' },
  { name: 'NTPC', logo: '/logos/ntpc.svg' },
  { name: 'BHEL', logo: '/logos/bhel.svg' },
  { name: 'Indian Railways', logo: '/logos/indian-railways.svg' },
  { name: 'TCS', logo: '/logos/tcs.svg' },
  { name: 'Infosys', logo: '/logos/infosys.svg' },
  { name: 'Wipro', logo: '/logos/wipro.svg' },
  { name: 'L&T', logo: '/logos/lt.svg' },
  { name: 'Reliance', logo: '/logos/reliance.svg' },
  { name: 'IIT Indore', logo: '/logos/iit-indore.svg' },
  { name: 'IIM Indore', logo: '/logos/iim-indore.svg' },
  { name: 'AIIMS', logo: '/logos/aiims.svg' },
]

const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'We furnished our entire 200 seat office with MVM Aasanam chairs. The quality is exceptional.',
    detail: 'After two years of heavy daily use across three floors, every single chair still looks and feels brand new. The lumbar support holds up perfectly even with 10+ hour workdays. Their team handled the entire bulk order from measurement to delivery seamlessly, and even sent a technician for on site assembly. We have since placed two more orders for our Bhopal and Raipur branches.',
    name: 'Rajesh Sharma',
    role: 'Head of Procurement',
    company: 'Leading IT Services Company, Indore',
    stat: '200+',
    statLabel: 'chairs delivered in a single order',
  },
  {
    quote: 'As a GeM empanelled supplier, Hari Shewa made our government procurement process completely hassle free.',
    detail: 'Competitive pricing with full GST compliance, proper documentation for every single unit, and on time delivery for all 12 of our district offices across Madhya Pradesh. The entire process from GeM order placement to final installation took under 3 weeks. Their invoice and challan documentation was audit ready from day one, which saved us weeks of back and forth during our annual inspection.',
    name: 'Dr. Anita Verma',
    role: 'Administrative Officer',
    company: 'Government Institution, Madhya Pradesh',
    stat: '12',
    statLabel: 'district offices furnished on time',
  },
  {
    quote: 'The customization options are what set them apart from every other supplier we evaluated.',
    detail: 'We needed specific fabric colours, armrest configurations, and base finishes to match our client\'s brand guidelines for a new 15,000 sq ft corporate office. MVM Aasanam delivered exactly what we specified, on schedule, with consistent quality across 300+ units. They even produced fabric samples in advance so we could get client approval before full production. That level of attention to detail is rare in this price range.',
    name: 'Priya Mehta',
    role: 'Interior Design Lead',
    company: 'Architecture & Interiors Firm, Mumbai',
    stat: '300+',
    statLabel: 'custom units with zero defects',
  },
]

const FAQS = [
  {
    q: 'What is the minimum order quantity?',
    a: 'Our minimum order is 10 units. However, we specialise in bulk and project orders, from 50 chairs to 10,000+. Pricing improves significantly with volume.',
  },
  {
    q: 'Which areas do you deliver to?',
    a: 'We deliver across all of Central India including Madhya Pradesh, Rajasthan, Gujarat, Maharashtra, Chhattisgarh, and beyond. For large orders, we arrange delivery pan India.',
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
    q: 'Are you listed on the Government e Marketplace (GeM)?',
    a: 'Yes, we are an empanelled supplier on GeM. Government bodies can place orders directly through the GeM portal with all required compliance documentation.',
  },
  {
    q: 'What certifications do you hold?',
    a: 'We hold ISO 9001 (Quality Management), ISO 14001 (Environmental Management), and ISO 45001 (Occupational Health and Safety) certifications. We are also BIFMA certified and GeM empanelled. All products undergo multi point quality checks before dispatch.',
  },
  {
    q: 'What warranty do you provide?',
    a: 'All chairs come with a 1 year warranty on the mechanism (gas lift, tilt, and adjustment controls). Frames and structural components are built for 8+ years of commercial use.',
  },
  {
    q: 'How do I get a quotation?',
    a: 'Simply message us on WhatsApp at +91 91314 38300 with your requirements including quantity, product type, and any customization needs. You will receive an itemised quotation within 24 hours.',
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
        <section id='technology' className='relative py-20 md:py-28 bg-gray-950 overflow-hidden'>
          <WaveBackground />
          <div className='relative z-10 max-w-7xl mx-auto px-6 lg:px-10'>
            <p className='text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-3'>
              Why MVM Aasanam
            </p>
            <h2 className='font-display text-3xl md:text-5xl font-bold text-white mb-4'>
              Built for the<br />Modern Workplace
            </h2>
            <p className='text-white/50 max-w-xl mb-14 text-lg'>
              Every chair we supply is engineered for productivity, comfort, and long term commercial use.
              Not just aesthetics.
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [grid-auto-rows:1fr] gap-5'>
              {QUALITY_PILLARS.map((c) => (
                <div key={c.title} className='glass-card flex flex-col p-6 h-full'>
                  <div className='glass-card-icon w-16 h-16 flex items-center justify-center mb-5'>
                    <div className='relative z-10 text-indigo-300'>{c.icon}</div>
                  </div>
                  <h3 className='font-semibold text-white mb-2'>{c.title}</h3>
                  <p className='text-sm text-white/45 leading-relaxed'>{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Trust Bar — scrolling marquee */}
        <section className='py-14 md:py-18 border-b border-gray-100 overflow-hidden'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-8 text-center'>
            Trusted by India's Leading Institutions
          </p>
          <div className='relative'>
            <div className='absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none' />
            <div className='absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none' />
            <div className='flex animate-marquee'>
              {[...CLIENTS, ...CLIENTS].map((client, i) => (
                <div key={`${client.name}-${i}`} className='shrink-0 flex items-center px-8'>
                  <img
                    src={client.logo}
                    alt={client.name}
                    className='h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity'
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products — card stack carousel */}
        <section id='collections' className='relative py-20 md:py-28 bg-gray-950 overflow-hidden'>
          <div className='max-w-7xl mx-auto px-6 lg:px-10'>
            <div className='text-center mb-12'>
              <p className='text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-3'>
                Product Range
              </p>
              <h2 className='font-display text-3xl md:text-5xl font-bold text-white mb-4'>
                Seating for Every Space
              </h2>
              <p className='text-white/50 max-w-xl mx-auto text-lg'>
                From executive cabins to open workstations, conference rooms to cafeterias,
                we have the right seating solution for every area of your office.
              </p>
            </div>
            <CardStack
              items={CATEGORIES.map((cat) => {
                const count = productCounts[cat.enum] || 0
                return {
                  id: cat.slug,
                  title: cat.label,
                  description: cat.description,
                  imageSrc: cat.image,
                  href: `/products/${cat.slug}`,
                  tag: cat.series,
                  ctaLabel: count > 0 ? `${count} products · View Collection →` : 'View Collection →',
                } satisfies CardStackItem
              })}
              initialIndex={0}
              cardWidth={560}
              cardHeight={360}
              overlap={0.5}
              spreadDeg={40}
              autoAdvance
              intervalMs={3000}
              pauseOnHover
              showDots
              loop
            />
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
              A simple, hassle free process whether you're furnishing a 10 seat office or
              a 500 person facility.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
              {[
                { n: '1', title: 'Share Requirements', desc: "Tell us your space, headcount, and budget via WhatsApp or call. We'll guide you to the right products." },
                { n: '2', title: 'Get a Quote', desc: 'Receive an itemised quotation with product specs, fabric/colour options, and delivery timeline.' },
                { n: '3', title: 'We Dispatch', desc: 'Orders are packed and dispatched from Neemuch within 7 to 15 working days with tracking updates.' },
                { n: '4', title: 'Delivery & Setup', desc: 'We deliver pan Central India. Installation support available on request. Post sale service included.' },
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

        {/* Testimonials — scroll-driven, one at a time */}
        <ScrollTestimonials items={TESTIMONIALS} />

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
              {['ISO 9001', 'ISO 14001', 'ISO 45001', 'BIFMA', 'BIS / ISI Mark', 'GeM Empanelled', 'ZED Certified', 'NSIC', 'GREENGUARD'].map((badge) => (
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

        <Footer variant='dark' />

      </div>
    </>
  )
}
