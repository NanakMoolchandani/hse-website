import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'
import { GlareCard } from '@/components/ui/glare-card'
import {
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
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
        mediaSrc='https://videos.pexels.com/video-files/4763824/4763824-hd_1920_1080_24fps.mp4'
        posterSrc='https://images.pexels.com/photos/7539887/pexels-photo-7539887.jpeg?auto=compress&cs=tinysrgb&w=1920'
        bgImageSrc='https://images.pexels.com/photos/7539887/pexels-photo-7539887.jpeg?auto=compress&cs=tinysrgb&w=1920'
        title='MVM Aasanam'
        date='Est. 1997 · Neemuch, MP'
        scrollToExpand='Scroll to explore'
        textBlend
      >
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
              Our Story
            </p>
            <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-6'>
              About MVM Aasanam
            </h2>
            <p className='text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed'>
              MVM Aasanam is the premium furniture brand of Hari Shewa Enterprises, founded in 1997 in Neemuch, Madhya Pradesh. For over 30 years, we have been engineering and supplying office and cafeteria furniture trusted by corporates, institutions, and government bodies across Central India.
            </p>
            <p className='text-gray-400 text-base max-w-xl mx-auto mt-4 leading-relaxed'>
              ISO 9001 & ISO 22000 certified. Empanelled supplier on the Government e-Marketplace (GeM). Designed to perform.
            </p>
          </div>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16'>
            {STATS.map((s) => (
              <div key={s.label} className='text-center'>
                <p className='text-4xl font-bold text-gray-900 font-display'>{s.count}</p>
                <p className='text-sm text-gray-500 mt-1'>{s.label}</p>
              </div>
            ))}
          </div>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
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
        </div>
      </ScrollExpandMedia>

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
                  {[
                    ['Craftsmanship', '#technology'],
                    ['Our Process', '#features'],
                    ['Our Clients', '#collections'],
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
              <p>&copy; {new Date().getFullYear()} Hari Shewa Enterprises. All Rights Reserved.</p>
              <p>Office & Cafeteria Furniture — Neemuch, Madhya Pradesh</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
