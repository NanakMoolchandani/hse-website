import { Link } from 'react-router-dom'
import { CheckCircle2, MessageCircle, Phone, MapPin } from 'lucide-react'
import Footer from '@/src/components/Footer'

const STATS = [
  { count: '500+', label: 'Corporates Served' },
  { count: '50,000+', label: 'Chairs Delivered' },
  { count: '30+', label: 'Years of Experience' },
  { count: '300+', label: 'Active Designs' },
]

const MILESTONES = [
  { year: '1997', event: 'Founded in Neemuch, Madhya Pradesh as a furniture trading firm' },
  { year: '2005', event: 'Expanded into manufacturing, set up own production facility' },
  { year: '2012', event: 'Achieved ISO 9001 certification for quality management' },
  { year: '2016', event: 'Empanelled as a registered supplier on GeM (Government e Marketplace)' },
  { year: '2020', event: 'Crossed 50,000 chairs delivered milestone across Central India' },
  { year: '2024', event: 'Launched MVM Aasanam as the premium office furniture brand' },
]

export default function About() {
  return (
    <div className='bg-white min-h-screen flex flex-col'>
      {/* Hero */}
      <section className='bg-gray-900 text-white pt-28 pb-20 md:pt-36 md:pb-28'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Our Story
          </p>
          <h1 className='font-display text-3xl md:text-6xl font-bold mb-6'>
            About MVM<br />Aasanam
          </h1>
          <p className='text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed'>
            MVM Aasanam is the premium furniture brand of Hari Shewa Enterprises,
            headquartered in Neemuch, Madhya Pradesh. For nearly three decades, we have
            designed, manufactured, and supplied commercial grade office and cafeteria
            furniture trusted by corporates, government bodies, and institutions across
            Central India.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className='border-b border-gray-100 py-10 md:py-14'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8'>
          {STATS.map((s) => (
            <div key={s.label} className='text-center'>
              <p className='text-2xl sm:text-4xl font-bold text-gray-900 font-display'>{s.count}</p>
              <p className='text-sm text-gray-500 mt-1'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What We Do */}
      <section className='py-12 md:py-28'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16'>
            <div>
              <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
                What We Do
              </p>
              <h2 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
                Commercial Furniture,<br />Built to Last
              </h2>
              <p className='text-gray-500 leading-relaxed mb-6'>
                We specialise in office and cafeteria furniture for commercial environments,
                including executive chairs, ergonomic task seating, cafeteria tables and chairs, visitor
                seating, and reception furniture. Every product is engineered for ergonomic
                comfort and built to endure years of daily commercial use.
              </p>
              <p className='text-gray-500 leading-relaxed'>
                From executive boardrooms to 500 seat cafeterias, we handle projects of every
                scale. Our clients include IT companies, banks, government departments,
                hospitals, educational institutions, and hotels across Central India.
              </p>
            </div>
            <div>
              <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
                Our Approach
              </p>
              <h2 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
                Direct from<br />Manufacturer
              </h2>
              <p className='text-gray-500 leading-relaxed mb-6'>
                As a manufacturer and supplier, we cut out the middlemen. You get factory direct
                pricing, full customization options, and complete control over specifications
                including fabric, colour, armrests, base material, and more.
              </p>
              <p className='text-gray-500 leading-relaxed'>
                Every order is configured to match your workspace requirements and brand
                identity. Whether it is 50 chairs for a startup or 5,000 for a corporate
                campus, we deliver on time with consistent quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className='py-12 md:py-28 bg-gray-50'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-10'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Our Journey
          </p>
          <h2 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mb-14'>
            Three Decades of<br />Building Trust
          </h2>
          <div className='space-y-0'>
            {MILESTONES.map((m, i) => (
              <div key={m.year} className='flex gap-6 pb-8 last:pb-0'>
                <div className='flex flex-col items-center'>
                  <div className='w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0'>
                    {m.year.slice(2)}
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div className='w-px h-full bg-gray-200 mt-2' />
                  )}
                </div>
                <div className='pt-2'>
                  <p className='text-sm font-semibold text-gray-900 mb-1'>{m.year}</p>
                  <p className='text-sm text-gray-500 leading-relaxed'>{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className='py-12 md:py-28'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3'>
            Certifications & Compliance
          </p>
          <h2 className='font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
            Quality You Can<br />Verify
          </h2>
          <p className='text-gray-500 max-w-2xl mb-14 text-lg'>
            We hold industry standard certifications that validate our commitment to quality, safety, and sustainability in furniture manufacturing.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[
              {
                title: 'ISO 9001',
                subtitle: 'Quality Management System',
                desc: 'Certifies that our manufacturing processes follow a structured quality management system. Every product undergoes multi point quality checks from raw material sourcing to final dispatch.',
                color: 'bg-blue-50 text-blue-700',
              },
              {
                title: 'ISO 14001',
                subtitle: 'Environmental Management',
                desc: 'Validates that our manufacturing follows environmentally responsible practices including proper waste management, energy efficiency, and pollution control across our production facility.',
                color: 'bg-green-50 text-green-700',
              },
              {
                title: 'ISO 45001',
                subtitle: 'Occupational Health & Safety',
                desc: 'Certifies that our workplace follows proper safety protocols for all employees. Covers risk management, safe working conditions, and prevention of work related injuries in our factory.',
                color: 'bg-orange-50 text-orange-700',
              },
              {
                title: 'BIFMA Certified',
                subtitle: 'International Furniture Standard',
                desc: 'Business and Institutional Furniture Manufacturers Association certification. An internationally recognised standard that validates our office furniture meets global safety, durability, and performance benchmarks.',
                color: 'bg-purple-50 text-purple-700',
              },
              {
                title: 'BIS / ISI Mark',
                subtitle: 'Bureau of Indian Standards',
                desc: 'Products certified under Indian Standards IS 17631 (Work Chairs) and IS 17632 (Chairs and Stools). Confirms our furniture meets mandatory Indian safety and quality requirements.',
                color: 'bg-red-50 text-red-700',
              },
              {
                title: 'GeM Empanelled',
                subtitle: 'Government e Marketplace',
                desc: 'Registered supplier on the Government e Marketplace. Government bodies, PSUs, and institutions can procure directly through the GeM portal with full compliance and documentation.',
                color: 'bg-indigo-50 text-indigo-700',
              },
              {
                title: 'ZED Certified',
                subtitle: 'Zero Defect Zero Effect',
                desc: 'Government of India certification under the Ministry of MSME. Validates our commitment to manufacturing with zero defects in products and zero negative effect on the environment.',
                color: 'bg-teal-50 text-teal-700',
              },
              {
                title: 'NSIC Registered',
                subtitle: 'National Small Industries Corporation',
                desc: 'Registered under the Single Point Registration Scheme (SPRS). Provides verified credibility for government procurement with benefits including EMD exemption and price preference.',
                color: 'bg-amber-50 text-amber-700',
              },
              {
                title: 'GREENGUARD',
                subtitle: 'Low Chemical Emissions',
                desc: 'UL GREENGUARD certification proving our furniture has low chemical emissions (VOCs). Ensures our products are safe for indoor air quality in offices, schools, and healthcare facilities.',
                color: 'bg-emerald-50 text-emerald-700',
              },
            ].map((cert) => (
              <div key={cert.title} className='rounded-2xl border border-gray-200 p-5 sm:p-8 hover:shadow-md transition-shadow'>
                <div className={`inline-block text-xs font-bold tracking-wide uppercase px-3 py-1 rounded-full mb-4 ${cert.color}`}>
                  {cert.title}
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>{cert.subtitle}</h3>
                <p className='text-sm text-gray-500 leading-relaxed'>{cert.desc}</p>
              </div>
            ))}
          </div>
          <div className='mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4'>
            {['GST Registered', 'GSTIN: 23AJUPM2209E1ZD', 'HSN: 9403 (Furniture)', 'HDFC Bank'].map((badge) => (
              <div key={badge} className='flex items-center gap-2 text-sm text-gray-400'>
                <CheckCircle2 className='w-4 h-4 text-gray-300 shrink-0' />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className='py-12 md:py-28 bg-gray-900 text-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 text-center'>
          <h2 className='font-display text-3xl md:text-5xl font-bold mb-4'>
            Let's Work Together
          </h2>
          <p className='text-gray-400 text-lg mb-10 max-w-xl mx-auto'>
            Share your requirements and get a personalised quotation within 24 hours.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-10'>
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
          <div className='flex items-center justify-center gap-2 text-gray-400 text-sm'>
            <MapPin className='w-4 h-4 shrink-0' />
            <span>Neemuch, Madhya Pradesh, India</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
