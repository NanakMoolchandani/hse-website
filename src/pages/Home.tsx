import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'
import ChairExplosionSection from '@/src/components/ui/chair-explosion-section'
import WaveBackground from '@/src/components/ui/wave-background'
import {
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Armchair,
  Building2,
  Landmark,
  Heart,
  GraduationCap,
  Banknote,
  Hotel,
} from 'lucide-react'
// GlowingEffect removed — using compact grid instead
import { CATEGORIES, getCategoryByEnum } from '@/src/lib/categories'
import { CardStack, type CardStackItem } from '@/src/components/ui/card-stack'
// ScrollTestimonials removed — using inline grid instead
import Footer from '@/src/components/Footer'
import SEO, { LOCAL_BUSINESS_SCHEMA, ORGANIZATION_SCHEMA } from '@/src/components/SEO'
import { fetchProductCounts, fetchProducts, getOptimizedImageUrl, type CatalogProduct } from '@/src/lib/supabase'

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  { count: '5,000+', label: 'Clients Served' },
  { count: '2,00,000+', label: 'Chairs Delivered' },
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
      'Direct from manufacturer to you, no middlemen. Get the best price on chairs, tables, wardrobes, and all office furniture without compromising on quality.',
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

const TESTIMONIALS = [
  { quote: 'Furnished our entire 200 seat office. Quality is exceptional — every chair still looks brand new after 2 years.', name: 'Rajesh Sharma', role: 'Head of Procurement', company: 'IT Services, Indore' },
  { quote: 'GeM procurement made completely hassle free. On time delivery for all 12 district offices across MP.', name: 'Dr. Anita Verma', role: 'Administrative Officer', company: 'Govt. Institution, MP' },
  { quote: 'Customization options set them apart. 300+ units delivered on schedule with zero defects.', name: 'Priya Mehta', role: 'Interior Design Lead', company: 'Interiors Firm, Mumbai' },
  { quote: 'Best wholesale rates for Nilkamal products. We have been buying from them for 15 years now.', name: 'Suresh Patel', role: 'Store Owner', company: 'Furniture Mart, Ujjain' },
  { quote: 'They set up our entire bank branch in under 2 weeks. Professional service from start to finish.', name: 'Vikram Joshi', role: 'Branch Manager', company: 'Public Sector Bank, Neemuch' },
  { quote: 'Our hospital waiting area chairs needed to be durable and easy to clean. MVM delivered perfectly.', name: 'Dr. Meena Agarwal', role: 'Hospital Administrator', company: 'Multi Speciality Hospital, Mandsaur' },
  { quote: 'Ordered 500 chairs for our new campus. The delivery and installation was remarkably smooth.', name: 'Prof. R. K. Singh', role: 'Registrar', company: 'Engineering College, Indore' },
  { quote: 'Supreme plastic chairs for our restaurant chain. Bulk pricing was unbeatable in the region.', name: 'Amit Gupta', role: 'Operations Head', company: 'Restaurant Chain, Rajasthan' },
  { quote: 'Conference room setup with executive chairs. Excellent lumbar support — our team loves them.', name: 'Neha Kulkarni', role: 'Office Manager', company: 'Consulting Firm, Bhopal' },
  { quote: 'Reliable supplier for all our cafeteria furniture. Quick replacements when needed.', name: 'Rahul Verma', role: 'Facilities Manager', company: 'IT Park, Indore' },
  { quote: 'Wardrobes and storage cabinets for our hostel. Sturdy build quality at a competitive price.', name: 'Deepak Jain', role: 'Hostel Warden', company: 'University, Ujjain' },
  { quote: 'They handled our complete office fit out — tables, chairs, storage. Single vendor, zero hassle.', name: 'Kavita Sharma', role: 'Procurement Head', company: 'Manufacturing Co., Ratlam' },
]

const BUSINESS_FAQS = [
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
    q: 'Are you listed on the Government e Marketplace (GeM)?',
    a: 'Yes, we are an empanelled supplier on GeM. Government bodies can place orders directly through the GeM portal with all required compliance documentation.',
  },
  {
    q: 'How do I get a quotation?',
    a: 'Simply message us on WhatsApp at +91 99815 16171 with your requirements including quantity, product type, and any customization needs. You will receive an itemised quotation within 24 hours.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept bank transfers (NEFT/RTGS), UPI, cheques, and demand drafts. For institutional orders, we offer flexible payment terms including advance plus balance on delivery.',
  },
]

const PRODUCT_FAQS = [
  {
    q: 'Do you offer customization?',
    a: 'Yes. You can choose fabric type (mesh, leatherette, fabric), colour, armrest style (fixed, 2D, 4D), base material (nylon or aluminium), and height range. Every order is configured to your specifications.',
  },
  {
    q: 'What warranty do you provide?',
    a: 'All chairs come with a 1 year warranty on the mechanism (gas lift, tilt, and adjustment controls). Frames and structural components are built for 8+ years of commercial use.',
  },
  {
    q: 'What certifications do you hold?',
    a: 'We hold ISO 9001 (Quality Management), ISO 14001 (Environmental Management), and ISO 45001 (Occupational Health and Safety) certifications. We are also BIFMA certified and GeM empanelled. All products undergo multi point quality checks before dispatch.',
  },
  {
    q: 'What materials are used in your chairs?',
    a: 'We use high density moulded foam, cold rolled steel frames, class 4 gas lifts, and commercial grade mesh or leatherette upholstery. Every component is sourced for durability in high use environments.',
  },
  {
    q: 'Can I order replacement parts?',
    a: 'Yes. We stock all components including gas lifts, castors, armrests, and mechanisms. Replacement parts can be ordered directly through WhatsApp and shipped within 3 to 5 working days.',
  },
  {
    q: 'What weight capacity do your chairs support?',
    a: 'Our standard chairs support up to 120 kg. Heavy duty models in the Executive and Ergonomic ranges are rated for 150 kg with reinforced bases and mechanisms.',
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
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)

  useEffect(() => {
    fetchProductCounts().then(setProductCounts)
    fetchProducts().then(setProducts)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // FAQ data still used for HTML rendering (good for PAA matching), schema removed (restricted)

  return (
    <>
      <SEO
        title="Best Furniture Store in Neemuch | Nilkamal, Supreme &amp; Seatex Dealer"
        description="Best furniture store in Neemuch, MP. Authorized Nilkamal, Supreme & Seatex dealer. Office chairs, plastic furniture, dining sets, storage cabinets. Own brand MVM Aasanam. ISO certified, GeM empanelled. 30+ years. Call +91 99815 16171."
        canonical="/home"
        keywords="furniture store Neemuch, furniture shop Neemuch, furniture in Neemuch, best furniture Neemuch, Nilkamal dealer Neemuch, Supreme dealer Neemuch, Seatex dealer Neemuch, office furniture Neemuch, plastic furniture Neemuch, furniture Mandsaur, furniture Ratlam, furniture Ujjain, नीमच फर्नीचर, नीमच में फर्नीचर की दुकान, ऑफिस फर्नीचर नीमच, फर्नीचर निर्माता नीमच"
        jsonLd={[LOCAL_BUSINESS_SCHEMA, ORGANIZATION_SCHEMA]}
      />
      {isMobile ? (
        <section className='relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden'>
          <img
            src='/hero-storefront.webp'
            alt='Hari Shewa Enterprises - Office furniture showroom in Neemuch, Madhya Pradesh'
            className='absolute inset-0 w-full h-full object-cover'
            fetchPriority='high'
            decoding='async'
            width={1920}
            height={1080}
          />
          <div className='absolute inset-0 bg-black/40' />
          <div className='relative z-10 text-center px-6'>
            <h1 className='text-4xl font-bold text-white font-display tracking-tight'>
              MVM आसनम
            </h1>
            <p className='text-white/70 text-sm font-medium tracking-widest uppercase mt-3'>
              Est. 1997 · Neemuch, MP
            </p>
            <ChevronDown className='w-6 h-6 text-white/50 mx-auto mt-8 animate-bounce' />
          </div>
        </section>
      ) : (
        <ScrollExpandMedia
          mediaType='image'
          mediaSrc='/hero-showroom.webp'
          bgImageSrc='/hero-storefront.webp'
          title='MVM आसनम'
          date='Est. 1997 · Neemuch, MP'
          scrollToExpand='Scroll to explore'
          textBlend
        />
      )}

      <div className='bg-white'>
        {/* Stats Bar */}
        <section className='border-y border-gray-100 py-10 md:py-14'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8'>
            {STATS.map((s) => (
              <div key={s.label} className='text-center'>
                <p className='text-2xl sm:text-4xl font-bold text-gray-900 font-display'>{s.count}</p>
                <p className='text-sm text-gray-500 mt-1'>{s.label}</p>
              </div>
            ))}
          </div>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-10'>
            <a
              href='https://wa.me/919981516171'
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
        <section id='technology' className='relative py-12 md:py-28 bg-gray-950 overflow-hidden'>
          <WaveBackground />
          <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
            <p className='text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-3'>
              Why MVM Aasanam
            </p>
            <h2 className='font-display text-3xl md:text-5xl font-bold text-white mb-4'>
              Built for the<br />Modern Workplace
            </h2>
            <p className='text-white/50 max-w-xl mb-8 md:mb-14 text-lg'>
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

        {/* Client Trust Bar - scrolling marquee */}
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
                    loading='lazy'
                    decoding='async'
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products - card stack carousel */}
        <section id='collections' className='relative py-20 md:py-28 bg-gray-950 overflow-hidden'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
            <div className='text-center mb-12'>
              <p className='text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-3'>
                Product Range
              </p>
              <h2 className='font-display text-3xl md:text-5xl font-bold text-white mb-4'>
                Furniture for Every Space
              </h2>
              <p className='text-white/50 max-w-xl mx-auto text-lg'>
                Chairs, tables, wardrobes, storage cabinets, and more — from executive cabins
                to open workstations, conference rooms to cafeterias, we have the right solution for every area.
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
        <section id='features' className='py-12 md:py-28 bg-gray-900 text-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
            <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
              What Sets Us Apart
            </p>
            <h2 className='font-display text-3xl md:text-5xl font-bold mb-8 md:mb-16'>
              Designed for Business
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16'>
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

        {/* Product Showcase - scrolling marquee (two rows) */}
        {products.length > 0 && (
          <section className='relative py-16 md:py-20 bg-gray-800 overflow-hidden'>
            <div className='relative z-10'>
              <div className='text-center mb-10'>
                <p className='text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-3'>
                  Our Products
                </p>
                <h2 className='font-display text-3xl md:text-4xl font-bold text-white'>
                  Explore Our Collection
                </h2>
              </div>
              {/* Row 1 - scrolls left */}
              <div className='relative marquee-container mb-6'>
                <div className='absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-gray-800 to-transparent z-10 pointer-events-none' />
                <div className='absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-gray-800 to-transparent z-10 pointer-events-none' />
                <div className='flex animate-marquee-slow'>
                  {[...products, ...products, ...products].map((product, i) => {
                    const cat = getCategoryByEnum(product.category || '')
                    const catSlug = cat?.slug || 'executive-chairs'
                    const rawImg = product.processed_photo_urls?.[0] || product.thumbnail_url || product.raw_photo_urls?.[0]
                    const image = rawImg ? getOptimizedImageUrl(rawImg, 250, 70) : null
                    return (
                      <Link
                        key={`row1-${product.id}-${i}`}
                        to={`/products/${catSlug}/${product.slug}`}
                        className='shrink-0 w-40 md:w-48 mx-2 md:mx-3 group'
                      >
                        <div className='aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-white/10 group-hover:border-indigo-500/30 transition-all duration-300 flex items-center justify-center'>
                          {image ? (
                            <img
                              src={image}
                              alt={product.name || 'Product'}
                              className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-300'
                              loading='lazy'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center text-gray-600'>
                              <svg className='w-12 h-12' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className='mt-2 text-sm text-white/80 text-center font-medium truncate group-hover:text-white transition-colors'>
                          {product.name}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
              {/* Row 2 - scrolls right (reverse) */}
              <div className='relative marquee-container'>
                <div className='absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-gray-800 to-transparent z-10 pointer-events-none' />
                <div className='absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-gray-800 to-transparent z-10 pointer-events-none' />
                <div className='flex animate-marquee-reverse'>
                  {[...products, ...products, ...products].reverse().map((product, i) => {
                    const cat = getCategoryByEnum(product.category || '')
                    const catSlug = cat?.slug || 'executive-chairs'
                    const rawImg = product.processed_photo_urls?.[0] || product.thumbnail_url || product.raw_photo_urls?.[0]
                    const image = rawImg ? getOptimizedImageUrl(rawImg, 250, 70) : null
                    return (
                      <Link
                        key={`row2-${product.id}-${i}`}
                        to={`/products/${catSlug}/${product.slug}`}
                        className='shrink-0 w-40 md:w-48 mx-2 md:mx-3 group'
                      >
                        <div className='aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-white/10 group-hover:border-indigo-500/30 transition-all duration-300 flex items-center justify-center'>
                          {image ? (
                            <img
                              src={image}
                              alt={product.name || 'Product'}
                              className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-300'
                              loading='lazy'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center text-gray-600'>
                              <svg className='w-12 h-12' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className='mt-2 text-sm text-white/80 text-center font-medium truncate group-hover:text-white transition-colors'>
                          {product.name}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Brands We Deal - Authorized Wholesale Dealer */}
        <section className='py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
            <div className='text-center mb-12'>
              <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 mb-5'>
                <span className='w-1.5 h-1.5 rounded-full bg-gray-500' />
                <span className='text-xs font-semibold text-gray-600 tracking-wide uppercase'>Authorized Wholesale Dealer</span>
              </div>
              <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
                Brands We Deal
              </h2>
              <p className='text-gray-500 text-lg max-w-2xl mx-auto'>
                Hari Shewa Enterprises is the Authorized Wholesale Dealer of India's top plastic furniture brands. Get the complete range at best wholesale prices.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {[
                {
                  name: 'Nilkamal',
                  to: '/nilkamal',
                  desc: "India's #1 moulded furniture brand. Chairs, tables, storage cabinets, beds, and more.",
                  tags: ['Chairs', 'Cabinets', 'Tables', 'Beds'],
                  borderColor: 'border-blue-200 hover:border-blue-400',
                  badgeBg: 'bg-blue-50',
                  badgeText: 'text-blue-700',
                  dotColor: 'bg-blue-500',
                },
                {
                  name: 'Supreme',
                  to: '/supreme',
                  desc: "By Supreme Industries - India's largest plastics company. 50+ years of quality and trust.",
                  tags: ['Seating', 'Tables', 'Storage', 'Kids'],
                  borderColor: 'border-orange-200 hover:border-orange-400',
                  badgeBg: 'bg-orange-50',
                  badgeText: 'text-orange-700',
                  dotColor: 'bg-orange-500',
                },
                {
                  name: 'Seatex',
                  to: '/seatex',
                  desc: "Hindustan ka sabse favorite furniture. 40+ designs across 15+ colours.",
                  tags: ['Standard', 'Premium', 'Tables', 'Stools'],
                  borderColor: 'border-emerald-200 hover:border-emerald-400',
                  badgeBg: 'bg-emerald-50',
                  badgeText: 'text-emerald-700',
                  dotColor: 'bg-emerald-500',
                },
              ].map((brand) => (
                <Link
                  key={brand.name}
                  to={brand.to}
                  className={`group rounded-2xl border-2 ${brand.borderColor} p-6 transition-all duration-300 hover:shadow-lg`}
                >
                  <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${brand.badgeBg} mb-4`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${brand.dotColor}`} />
                    <span className={`text-[10px] font-semibold ${brand.badgeText} tracking-wide uppercase`}>Dealer</span>
                  </div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors'>
                    {brand.name}
                  </h3>
                  <p className='text-sm text-gray-500 leading-relaxed mb-4'>{brand.desc}</p>
                  <div className='flex flex-wrap gap-2 mb-5'>
                    {brand.tags.map((tag) => (
                      <span key={tag} className='text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600'>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className='inline-flex items-center gap-1 text-sm font-semibold text-gray-900 group-hover:gap-2 transition-all'>
                    Browse Products <ChevronRight className='w-4 h-4' />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className='py-10 md:py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
            <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
              How It Works
            </p>
            <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
              From Enquiry<br />to Installation
            </h2>
            <p className='text-gray-500 max-w-xl mb-8 md:mb-14 text-lg'>
              A simple, hassle free process whether you're furnishing a 10 seat office or
              a 500 person facility.
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
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

        {/* Testimonials - compact grid */}
        <section className='py-12 md:py-16 bg-gray-950'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
            <div className='text-center mb-8 md:mb-10'>
              <p className='text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-3'>
                Client Feedback
              </p>
              <h2 className='font-display text-3xl md:text-4xl font-bold text-white mb-3'>
                What Our Clients Say
              </h2>
              <p className='text-white/40 text-base max-w-lg mx-auto'>
                We let our work speak, and our clients confirm it.
              </p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className='glass-card p-5 flex flex-col justify-between'>
                  <p className='text-white/80 text-sm leading-relaxed mb-4'>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className='border-t border-white/10 pt-3'>
                    <p className='text-white text-sm font-semibold'>{t.name}</p>
                    <p className='text-white/40 text-xs'>{t.role}, {t.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who We Serve - compact grid */}
        <section className='py-8 md:py-12 bg-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
            <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
              Our Clientele
            </p>
            <h2 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
              Trusted Across Industries
            </h2>
            <p className='text-gray-500 max-w-xl mb-6 text-base'>
              From corporate offices to government institutions, we supply furniture to organisations
              that demand quality, durability, and value at scale.
            </p>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
              {([
                { label: 'Corporate Offices', Icon: Building2, desc: 'IT parks, MNCs' },
                { label: 'Government', Icon: Landmark, desc: 'GeM empanelled' },
                { label: 'Hospitals', Icon: Heart, desc: 'OPDs, waiting areas' },
                { label: 'Education', Icon: GraduationCap, desc: 'Schools, colleges' },
                { label: 'Banks', Icon: Banknote, desc: 'Branch offices' },
                { label: 'Hotels', Icon: Hotel, desc: 'Conference halls' },
              ] as const).map((client) => (
                <div key={client.label} className='rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow'>
                  <client.Icon className='h-5 w-5 text-gray-600 mb-2' />
                  <h3 className='text-sm font-semibold text-gray-900'>{client.label}</h3>
                  <p className='text-xs text-gray-500 mt-0.5'>{client.desc}</p>
                </div>
              ))}
            </div>
            <div className='mt-8 flex flex-wrap items-center justify-center gap-x-4 md:gap-x-10 gap-y-3'>
              {['ISO 9001', 'ISO 14001', 'ISO 45001', 'BIFMA', 'BIS / ISI Mark', 'GeM Empanelled', 'ZED Certified', 'NSIC', 'GREENGUARD'].map((badge) => (
                <div key={badge} className='flex items-center gap-2 text-sm text-gray-500'>
                  <CheckCircle2 className='w-4 h-4 text-green-500 shrink-0' />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className='py-12 md:py-28 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 md:mb-14'>
              <div>
                <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
                  Common Questions
                </p>
                <h2 className='font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4'>
                  Frequently Asked<br />Questions
                </h2>
                <p className='text-gray-500 max-w-xl text-lg'>
                  Everything you need to know about ordering furniture from us.
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-0 gap-y-8 lg:gap-x-16 lg:gap-y-12'>
              {/* Business FAQs */}
              <div>
                <div className='flex items-center gap-3 mb-6'>
                  <span className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-sm font-semibold text-indigo-700'>
                    <Briefcase className='w-4 h-4' />
                    Business
                  </span>
                </div>
                <div className='border-t border-gray-200'>
                  {BUSINESS_FAQS.map((faq) => (
                    <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>

              {/* Product FAQs */}
              <div>
                <div className='flex items-center gap-3 mb-6'>
                  <span className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-sm font-semibold text-amber-700'>
                    <Armchair className='w-4 h-4' />
                    Product
                  </span>
                </div>
                <div className='border-t border-gray-200'>
                  {PRODUCT_FAQS.map((faq) => (
                    <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id='contact' className='py-12 md:py-28 bg-gray-900 text-white'>
          <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 text-center'>
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
                href='https://wa.me/919981516171'
                className='inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors'
              >
                <MessageCircle className='w-5 h-5' />
                WhatsApp Us
              </a>
              <a
                href='tel:+919981516171'
                className='inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors'
              >
                <Phone className='w-5 h-5' />
                Call Now
              </a>
            </div>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400 text-sm mb-12'>
              <div className='flex items-center gap-2'>
                <MapPin className='w-4 h-4 shrink-0' />
                <span>01, Ambedkar Road, Neemuch, MP 458441</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle2 className='w-4 h-4 shrink-0' />
                <span>GSTIN: 23AJUPM2209E1ZD</span>
              </div>
            </div>
            {/* Google Presence */}
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-10'>
              <a
                href='https://g.co/kgs/Hari-Shewa-Enterprises-Neemuch'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 border border-white/20 text-white font-medium px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors text-sm'
              >
                <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z' fill='#4285F4'/>
                  <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853'/>
                  <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05'/>
                  <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335'/>
                </svg>
                Find Us on Google
              </a>
              <a
                href='https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRhBgdotc3SFk'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 border border-white/20 text-white font-medium px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors text-sm'
              >
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                </svg>
                Leave a Review
              </a>
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
