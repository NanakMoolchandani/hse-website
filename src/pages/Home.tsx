/**
 * Our story: the brand and the company behind the shop.
 *
 * This page used to be a dark, full-screen showcase built on GSAP scroll
 * pinning, a 3D chair explosion, a wave background and a card stack. It was
 * impressive and it was the wrong job. Someone who lands here is deciding
 * whether to trust a manufacturer they have never heard of with a purchase
 * order, and the things that answer that are plain: how long we have been
 * doing this, what we have delivered, who has bought from us, where the
 * factory is, and what happens if something breaks.
 *
 * So it is now light, photographic and quiet, in the same visual system as the
 * shop: one accent colour, hairline rules instead of boxes, and headings that
 * carry the weight rather than effects. Every number and claim on this page
 * came off the old one; nothing here is new marketing.
 *
 * Dropping the 3D and GSAP work takes a large dependency out of this route's
 * chunk, which matters because it is the page a first-time visitor is most
 * likely to arrive on cold from search.
 */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin, Phone, MessageCircle, ArrowRight, ChevronDown, Check,
  Factory, Truck, ShieldCheck, Ruler, Wrench, IndianRupee, Star,
} from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO, { LOCAL_BUSINESS_SCHEMA, ORGANIZATION_SCHEMA } from '@/src/components/SEO'
import { track } from '@/src/lib/analytics'

// ── Data ─────────────────────────────────────────────────────────────────────

const WHATSAPP = '919981516171'
const PHONES = [
  { display: '9981516171', dial: '+919981516171' },
  { display: '9425106894', dial: '+919425106894' },
]

/**
 * Google Business Profile links.
 *
 * Both are keyed off the CID that appears in the Maps embed further down, which
 * is the one identifier here that is provably ours. A previous review link used
 * a hand-entered Place ID that did not match that CID, which is why it went
 * nowhere.
 */
const GOOGLE_CID = '16199908150674240164'
const GOOGLE_LISTING_URL = `https://www.google.com/maps?cid=${GOOGLE_CID}`
const GOOGLE_REVIEW_URL = `https://www.google.com/maps?cid=${GOOGLE_CID}&reviews=1`

const STATS = [
  { value: 5000, suffix: '+', label: 'Clients served' },
  { value: 200000, suffix: '+', label: 'Chairs delivered' },
  { value: 30, suffix: '+', label: 'Years at it' },
  { value: 300, suffix: '+', label: 'Active designs' },
]

const PILLARS = [
  {
    icon: Factory,
    title: 'Made in our own factory',
    body: 'Cut, welded, foamed and upholstered in Neemuch. Nothing is bought in and rebadged, so when something needs changing we change it on the line rather than asking a supplier.',
  },
  {
    icon: Ruler,
    title: 'Built around the spine',
    body: 'Lumbar support, armrest height and seat depth are set for a full working day, not for a showroom photograph. Standard chairs take 120kg; the heavy duty executive and ergonomic models take 150kg.',
  },
  {
    icon: ShieldCheck,
    title: 'Tested before it ships',
    body: 'Load tested, welds inspected, fabric stress checked. ISO 9001, 14001 and 45001 certified, BIFMA certified, and empanelled on the Government e Marketplace.',
  },
  {
    icon: Wrench,
    title: 'Parts, years later',
    body: 'Gas lifts, castors, armrests and mechanisms are all held in stock and shipped in three to five working days. One year warranty on the mechanism; the frame is built for eight years of commercial use.',
  },
  {
    icon: Truck,
    title: 'Out in seven to fifteen days',
    body: 'Standard orders leave Neemuch inside a fortnight. Institutional orders past 500 units take three to four weeks depending on how much is customised.',
  },
  {
    icon: IndianRupee,
    title: 'Factory price, no middleman',
    body: 'You are buying from the people who made it. Ten units is where wholesale pricing starts and it improves considerably with volume.',
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
  { quote: 'Furnished our entire 200 seat office. Quality is exceptional: every chair still looks brand new after 2 years.', name: 'Rajesh Sharma', role: 'Head of Procurement, IT Services, Indore' },
  { quote: 'GeM procurement made completely hassle free. On time delivery for all 12 district offices across MP.', name: 'Dr. Anita Verma', role: 'Administrative Officer, Govt. Institution, MP' },
  { quote: 'Customization options set them apart. 300+ units delivered on schedule with zero defects.', name: 'Priya Mehta', role: 'Interior Design Lead, Interiors Firm, Mumbai' },
  { quote: 'They set up our entire bank branch in under 2 weeks. Professional service from start to finish.', name: 'Vikram Joshi', role: 'Branch Manager, Public Sector Bank, Neemuch' },
  { quote: 'Our hospital waiting area chairs needed to be durable and easy to clean. MVM delivered perfectly.', name: 'Dr. Meena Agarwal', role: 'Hospital Administrator, Mandsaur' },
  { quote: 'Ordered 500 chairs for our new campus. The delivery and installation was remarkably smooth.', name: 'Prof. R. K. Singh', role: 'Registrar, Engineering College, Indore' },
  { quote: 'Best wholesale rates in the region. We have been buying from them for 15 years now.', name: 'Suresh Patel', role: 'Store Owner, Furniture Mart, Ujjain' },
  { quote: 'They handled our complete office fit out: tables, chairs, storage. Single vendor, zero hassle.', name: 'Kavita Sharma', role: 'Procurement Head, Manufacturing Co., Ratlam' },
]

const FAQS = [
  { q: 'What is the minimum order quantity?', a: 'Ten units. We specialise in bulk and project orders, from 50 chairs to 10,000, and pricing improves considerably with volume. Single pieces can be bought from the online shop.' },
  { q: 'Which areas do you deliver to?', a: 'All of Central India: Madhya Pradesh, Rajasthan, Gujarat, Maharashtra and Chhattisgarh. For large orders we arrange delivery anywhere in the country.' },
  { q: 'What is the typical delivery timeline?', a: 'Standard orders are dispatched within 7 to 15 working days from Neemuch. Institutional orders past 500 units may take 3 to 4 weeks depending on customisation.' },
  { q: 'Are you listed on the Government e Marketplace?', a: 'Yes, we are an empanelled GeM supplier. Government bodies can order directly through the portal with all the compliance documentation in place.' },
  { q: 'Do you offer customisation?', a: 'Yes. Fabric type (mesh, leatherette, fabric), colour, armrest style (fixed, 2D, 4D), base material (nylon or aluminium) and height range are all yours to choose.' },
  { q: 'What warranty do you provide?', a: 'One year on the mechanism, covering the gas lift, tilt and adjustment controls. Frames and structural components are built for eight or more years of commercial use.' },
  { q: 'Can I order replacement parts?', a: 'Yes. Gas lifts, castors, armrests and mechanisms are held in stock and ship within 3 to 5 working days. Ask on WhatsApp.' },
  { q: 'How do I get a quotation?', a: `Message us on WhatsApp at ${PHONES[0].display} with quantity, product type and any customisation. You will have an itemised quotation within 24 hours.` },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <SEO
        title='Furniture Manufacturer in Neemuch | MVM Aasanam'
        description='MVM Aasanam is made by Hari Shewa Enterprises in Neemuch, Madhya Pradesh. Office chairs, tables, wardrobes and storage from our own factory. 5,000+ clients, 2 lakh+ chairs delivered, 30+ years. ISO certified and GeM empanelled.'
        canonical='/home'
        ogImage='https://mvm-furniture.com/og-about.jpg'
        keywords='furniture manufacturer Neemuch, office furniture Neemuch, MVM Aasanam, Hari Shewa Enterprises, bulk office chairs Madhya Pradesh, GeM furniture supplier, furniture Mandsaur, furniture Ratlam, furniture Ujjain'
        jsonLd={[LOCAL_BUSINESS_SCHEMA, ORGANIZATION_SCHEMA]}
      />

      <div className='bg-white pt-32 md:pt-40'>
        <Hero />
        <Stats />
        <Story />
        <Pillars />
        <Clients />
        <Testimonials />
        <Faq />
        <Visit />
      </div>

      <Footer variant='light' />
    </>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6'>
      <div className='relative overflow-hidden rounded-2xl sm:rounded-[1.75rem] bg-gray-950 min-h-[26rem] sm:min-h-[30rem] lg:min-h-[34rem] flex items-end'>
        <picture>
          <source srcSet='/hero-storefront.webp' type='image/webp' />
          <img
            src='/hero-storefront.jpg'
            alt='The Hari Shewa Enterprises furniture showroom in Neemuch, Madhya Pradesh'
            fetchPriority='high'
            decoding='async'
            className='absolute inset-0 w-full h-full object-cover'
          />
        </picture>
        <div className='absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/55 to-gray-950/10' />

        <div className='relative w-full p-6 sm:p-10 lg:p-14'>
          <p className='text-eyebrow text-amber-400 mb-4'>Our story</p>
          <h1 className='text-display text-white max-w-3xl'>
            Thirty years of building<br className='hidden sm:block' /> furniture in Neemuch.
          </h1>
          <p className='mt-5 text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed'>
            MVM Aasanam is our own line, made in our own factory. Two lakh chairs
            have left it so far.
          </p>
          <div className='mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 max-w-sm sm:max-w-none'>
            <Link
              to='/shop'
              className='pressable inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-white text-sm font-semibold text-gray-900 hover:bg-gray-100'
            >
              Shop the range
              <ArrowRight className='w-4 h-4' />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hi, I would like to discuss a bulk order.')}`}
              onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'story-hero' } })}
              className='pressable inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full border border-white/25 text-sm font-semibold text-white hover:bg-white/10'
            >
              <MessageCircle className='w-4 h-4' />
              Talk about a bulk order
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Stats ────────────────────────────────────────────────────────────────────

/**
 * Counts up when the row first comes into view.
 *
 * This is the one place on the page motion earns its keep: these four numbers
 * are the argument, they are seen once per visit, and a number that arrives by
 * counting is read rather than skimmed. It runs a single time, respects reduced
 * motion by jumping straight to the value, and never blocks anything.
 */
function useCountUp(target: number, run: boolean, ms = 1100): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let raf = 0
    let start: number | null = null
    const tick = (t: number) => {
      if (start === null) start = t
      const p = Math.min(1, (t - start) / ms)
      // Ease out: fast at first, settling rather than stopping dead.
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, ms])
  return value
}

function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])

  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6'>
      <div
        ref={ref}
        className='grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.07] rounded-2xl overflow-hidden ring-1 ring-black/[0.07]'
      >
        {STATS.map((s) => (
          <StatCell key={s.label} {...s} run={seen} />
        ))}
      </div>
    </section>
  )
}

function StatCell({ value, suffix, label, run }: { value: number; suffix: string; label: string; run: boolean }) {
  const n = useCountUp(value, run)
  return (
    <div className='bg-white px-4 py-7 sm:px-6 sm:py-9 text-center'>
      <p className='text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-gray-900 tabular-nums'>
        {n.toLocaleString('en-IN')}
        <span className='text-amber-500'>{suffix}</span>
      </p>
      <p className='mt-2 text-xs sm:text-sm text-gray-500'>{label}</p>
    </div>
  )
}

// ── Story ────────────────────────────────────────────────────────────────────

function Story() {
  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-24'>
      <div className='grid lg:grid-cols-2 gap-10 lg:gap-16 items-center'>
        <div className='reveal order-2 lg:order-1'>
          <p className='text-eyebrow text-amber-600 mb-3'>Who makes it</p>
          <h2 className='text-section text-gray-900'>
            One factory, one line, one name on it.
          </h2>
          <div className='mt-6 space-y-4 text-base text-gray-500 leading-relaxed'>
            <p>
              Hari Shewa Enterprises has been making furniture in Neemuch, Madhya
              Pradesh for over thirty years. <strong className='font-semibold text-gray-900'>MVM Aasanam</strong> is
              the brand that goes on what we make ourselves: office seating,
              executive and ergonomic chairs, visitor and cafeteria ranges, and
              storage built to order.
            </p>
            <p>
              Everything is cut, welded, foamed and upholstered on our own line.
              That is the whole reason we can quote a factory price, change a
              fabric on request, and still have a gas lift on the shelf for a
              chair we sold years ago.
            </p>
            <p>
              We also stock Nilkamal, Supreme and Seatex for customers who want
              them. Those are brands we carry. MVM Aasanam is the one we answer
              for.
            </p>
          </div>

          <div className='mt-8 flex flex-wrap gap-2'>
            {['ISO 9001', 'ISO 14001', 'ISO 45001', 'BIFMA certified', 'GeM empanelled'].map((c) => (
              <span
                key={c}
                className='inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700'
              >
                <Check className='w-3 h-3 text-amber-600' strokeWidth={3} />
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className='reveal order-1 lg:order-2'>
          <div className='aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-black/[0.06] bg-gray-50'>
            <picture>
              <source srcSet='/hero-showroom.webp' type='image/webp' />
              <img
                src='/hero-showroom.jpg'
                alt='Chairs and fabric samples laid out in the MVM Aasanam showroom'
                loading='lazy'
                className='w-full h-full object-cover'
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Pillars ──────────────────────────────────────────────────────────────────

function Pillars() {
  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-24'>
      <div className='text-center mb-10 sm:mb-12'>
        <p className='text-eyebrow text-amber-600 mb-3'>Why buy from the factory</p>
        <h2 className='text-section text-gray-900'>What you get, in practice</h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.07] rounded-2xl overflow-hidden ring-1 ring-black/[0.07]'>
        {PILLARS.map(({ icon: Icon, title, body }) => (
          <div key={title} className='bg-white p-6 sm:p-8'>
            <Icon className='w-6 h-6 text-amber-600' strokeWidth={1.6} />
            <h3 className='mt-4 text-title text-gray-900'>{title}</h3>
            <p className='mt-2.5 text-sm text-gray-500 leading-relaxed'>{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Clients ──────────────────────────────────────────────────────────────────

function Clients() {
  // Doubled so the loop has something to scroll into. The animation translates
  // exactly -50%, which lands the copy precisely where the original started.
  const row = [...CLIENTS, ...CLIENTS]
  return (
    <section className='pt-16 sm:pt-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center mb-8 sm:mb-10'>
        <p className='text-eyebrow text-amber-600 mb-3'>Who buys from us</p>
        <h2 className='text-section text-gray-900'>Banks, hospitals, campuses, PSUs</h2>
      </div>

      <div className='marquee-container relative overflow-hidden'>
        {/* The row runs off both edges rather than stopping inside a margin;
            these fade it out instead of cutting it, so it reads as continuous. */}
        <span className='pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-white to-transparent' />
        <span className='pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-white to-transparent' />
        <div className='flex w-max animate-marquee-slow items-center gap-10 sm:gap-16'>
          {row.map((c, i) => (
            <img
              key={`${c.name}-${i}`}
              src={c.logo}
              alt={c.name}
              loading='lazy'
              className='h-7 sm:h-9 w-auto shrink-0 opacity-45 grayscale hover:opacity-80 hover:grayscale-0 transition-[opacity,filter] duration-250'
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className='pt-16 sm:pt-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
        <div className='flex items-end justify-between gap-4 mb-8'>
          <div>
            <p className='text-eyebrow text-amber-600 mb-3'>In their words</p>
            <h2 className='text-section text-gray-900'>What buyers say</h2>
          </div>
          <a
            href={GOOGLE_REVIEW_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-900 hover:text-amber-600 transition-colors pb-1'
          >
            Read on Google
            <ArrowRight className='w-3.5 h-3.5' />
          </a>
        </div>

        <div className='-mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-10 overflow-x-auto thumbnail-scroll snap-x snap-mandatory'>
          <div className='flex gap-4 sm:gap-5 w-max pr-4 sm:pr-6 lg:pr-10'>
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className='snap-start shrink-0 w-[17rem] sm:w-80 rounded-2xl ring-1 ring-black/[0.07] bg-white p-6 flex flex-col'
              >
                <div className='flex gap-0.5 mb-4'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className='w-3.5 h-3.5 fill-amber-400 text-amber-400' />
                  ))}
                </div>
                <blockquote className='text-sm text-gray-700 leading-relaxed flex-1'>
                  {t.quote}
                </blockquote>
                <figcaption className='mt-5 pt-4 border-t border-black/[0.06]'>
                  <p className='text-sm font-semibold text-gray-900'>{t.name}</p>
                  <p className='mt-0.5 text-xs text-gray-500 leading-relaxed'>{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── FAQ ──────────────────────────────────────────────────────────────────────

function Faq() {
  return (
    <section className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-24'>
      <div className='text-center mb-8 sm:mb-10'>
        <p className='text-eyebrow text-amber-600 mb-3'>Before you ask</p>
        <h2 className='text-section text-gray-900'>Questions we get</h2>
      </div>
      <div className='border-t border-black/[0.08]'>
        {FAQS.map((f) => (
          <FaqItem key={f.q} {...f} />
        ))}
      </div>
    </section>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className='border-b border-black/[0.08]'>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className='w-full flex items-center justify-between gap-4 py-5 text-left'
      >
        <span className='text-[15px] font-medium text-gray-900'>{q}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-250 ease-spring ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {/* `grid-template-rows` from 0fr to 1fr animates a height the browser
          works out itself, so the panel opens to exactly its content instead of
          to a max-height guess that clips long answers or lags on short ones. */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-spring ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className='overflow-hidden'>
          <p className='pb-5 pr-8 text-sm text-gray-500 leading-relaxed'>{a}</p>
        </div>
      </div>
    </div>
  )
}

// ── Visit ────────────────────────────────────────────────────────────────────

function Visit() {
  return (
    <section className='pt-16 sm:pt-24 pb-4'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
        <div className='rounded-2xl sm:rounded-[1.75rem] overflow-hidden ring-1 ring-black/[0.07] grid lg:grid-cols-2'>
          <div className='bg-gray-950 p-8 sm:p-12 flex flex-col justify-center'>
            <p className='text-eyebrow text-amber-400 mb-3'>Come and sit on one</p>
            <h2 className='text-section text-white'>Visit the factory</h2>
            <p className='mt-4 text-base text-gray-400 leading-relaxed max-w-sm'>
              The showroom is at the factory, so what you try is what gets built.
              No appointment needed.
            </p>

            <p className='mt-8 flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed'>
              <MapPin className='w-4 h-4 mt-0.5 shrink-0 text-amber-400' />
              <span>
                01, Ambedkar Road
                <br />
                Neemuch, Madhya Pradesh 458441
              </span>
            </p>

            <div className='mt-6 flex flex-wrap gap-2'>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'story-visit' } })}
                className='pressable inline-flex items-center gap-2 h-11 px-5 rounded-full bg-amber-500 text-sm font-semibold text-white hover:bg-amber-600'
              >
                <MessageCircle className='w-4 h-4' />
                WhatsApp us
              </a>
              {PHONES.map((p) => (
                <a
                  key={p.dial}
                  href={`tel:${p.dial}`}
                  className='pressable inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/20 text-sm font-medium text-white hover:bg-white/10'
                >
                  <Phone className='w-3.5 h-3.5' />
                  {p.display}
                </a>
              ))}
            </div>

            <a
              href={GOOGLE_LISTING_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors'
            >
              Get directions
              <ArrowRight className='w-3.5 h-3.5' />
            </a>
          </div>

          <div className='min-h-[18rem] lg:min-h-0 bg-gray-100'>
            <iframe
              title='Hari Shewa Enterprises on Google Maps'
              src={`https://www.google.com/maps?cid=${GOOGLE_CID}&output=embed`}
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              className='w-full h-full min-h-[18rem] border-0'
            />
          </div>
        </div>
      </div>
    </section>
  )
}
