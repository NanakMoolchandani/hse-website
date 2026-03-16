import { Link } from 'react-router-dom'
import { MessageCircle, Phone, ArrowLeft } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO from '@/src/components/SEO'

// ── Nilkamal Product Categories ──────────────────────────────────────────────

const NILKAMAL_CATEGORIES = [
  {
    name: 'Plastic Chairs',
    description: 'India\'s most popular moulded plastic chairs — lightweight, stackable, and built for everyday use. From the iconic CHR series to the premium Crystal range.',
    series: ['CHR Series', 'Novella Series', 'Crystal Series', 'Signature Series'],
    products: ['CHR 2005', 'CHR 2051', 'CHR 2060', 'CHR 2135', 'CHR 2180', 'CHR 2225', 'CHR 4001', 'CHR 4002', 'CHR 4025', 'Novella 07', 'Novella 08', 'Novella 09', 'Novella 10', 'Crystal PP', 'Crystal PC', 'Mystique', 'Weekender', 'Captain', 'Enamora', 'Exotica'],
    image: 'https://www.nilkamalfurniture.com/cdn/shop/files/CHR_2135_-_Bright_Red.jpg?v=1711020988&width=800',
    color: 'from-red-500/20 to-red-600/5',
    accent: 'text-red-500',
    border: 'border-red-500/20 hover:border-red-500/40',
  },
  {
    name: 'Storage & Cabinets',
    description: 'The Freedom Series — Nilkamal\'s flagship plastic storage cabinets and wardrobes. Weather-proof, termite-proof, and maintenance-free. Perfect for homes, offices, and institutions.',
    series: ['Freedom Series', 'Magna Series'],
    products: ['Freedom Big 1 (FB1)', 'Freedom Big 2 (FB2)', 'Freedom Mini Small (FMS)', 'Freedom Mini Medium (FMM)', 'Freedom Shoe Cabinet', 'Freedom with Drawers', 'Magna KD', 'Magna 15', 'Magna 18', 'Gem Cabinet', 'Chest of Drawers'],
    image: 'https://www.nilkamalfurniture.com/cdn/shop/files/Freedom_Big_1_-_Weathered_Brown___Biscuit.jpg?v=1711005489&width=800',
    color: 'from-amber-500/20 to-amber-600/5',
    accent: 'text-amber-600',
    border: 'border-amber-500/20 hover:border-amber-500/40',
  },
  {
    name: 'Tables',
    description: 'Dining tables, centre tables, office desks, and study tables. From the Shahenshah dining range to compact study desks — durable plastic and composite construction.',
    series: ['Dining Range', 'Office Range', 'Study Range'],
    products: ['Ultima Dining Table', 'Mega Dining Table', 'Shahenshah Dining Table', 'Dining Sets (4 & 6 Seater)', 'Centre Tables', 'Maximus Office Table', 'Enzo Office Table', 'Endura Office Table', 'Apple Jr Study Desk', 'Wizard Study Desk'],
    image: 'https://www.nilkamalfurniture.com/cdn/shop/files/Shahenshah_Dining_Table_-_Pear_Wood.jpg?v=1711015461&width=800',
    color: 'from-emerald-500/20 to-emerald-600/5',
    accent: 'text-emerald-600',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
  },
  {
    name: 'Office Chairs',
    description: 'Ergonomic office seating from Nilkamal — high-back executive chairs, mid-back task chairs, and visitor chairs with writing pads. Built for commercial and institutional use.',
    series: ['Executive Series', 'Visitor Series'],
    products: ['Libra High Back', 'Glory High Back', 'Thames High Back', 'Alba Mid Back Visitor', 'Contract 01 Visitor', 'Contract 02 Visitor', 'Gary Visitor', 'Zing Visitor (with Writing Pad)'],
    image: 'https://www.nilkamalfurniture.com/cdn/shop/files/Libra_High_Back_-_Black.jpg?v=1711018234&width=800',
    color: 'from-blue-500/20 to-blue-600/5',
    accent: 'text-blue-600',
    border: 'border-blue-500/20 hover:border-blue-500/40',
  },
  {
    name: 'Outdoor & Garden',
    description: 'Weather-resistant garden furniture — sofa sets, loungers, swings, and patio seating. The Goa Sofa series and Breeze collection are perfect for outdoor spaces.',
    series: ['Goa Series', 'Breeze Collection'],
    products: ['Goa Sofa 1 Seater', 'Goa Sofa 2 Seater', 'Goa Sofa 3 Seater', 'Breeze Patio Set', 'Garden Sofa Sets', 'Outdoor Loungers', 'Garden Swings', 'Outdoor Chairs & Tables'],
    image: 'https://www.nilkamalfurniture.com/cdn/shop/files/Goa_Sofa_3_1_1_Set.jpg?v=1711019876&width=800',
    color: 'from-teal-500/20 to-teal-600/5',
    accent: 'text-teal-600',
    border: 'border-teal-500/20 hover:border-teal-500/40',
  },
  {
    name: 'Stools & Step Stools',
    description: 'Stackable plastic stools and multi-purpose step stools. High load capacity, compact storage, and available in multiple colours.',
    series: ['Utility Range'],
    products: ['Plastic Stools', 'Step Stools', 'Bathroom Stools', 'Kitchen Step Stools'],
    image: 'https://www.nilkamalfurniture.com/cdn/shop/files/Step_Stool.jpg?v=1711020123&width=800',
    color: 'from-violet-500/20 to-violet-600/5',
    accent: 'text-violet-600',
    border: 'border-violet-500/20 hover:border-violet-500/40',
  },
  {
    name: 'Kids Furniture',
    description: 'Safe, colourful, and durable furniture designed for children — study tables, chairs, beds, and storage units with rounded edges and child-friendly materials.',
    series: ['Kids Range'],
    products: ['Eeezy Go Baby Chair', 'Kids Study Tables', 'Kids Chairs', 'Kids Storage Units', 'Kids Beds'],
    image: 'https://www.nilkamalfurniture.com/cdn/shop/files/Eeezy_Go_-_Pink.jpg?v=1711020456&width=800',
    color: 'from-pink-500/20 to-pink-600/5',
    accent: 'text-pink-600',
    border: 'border-pink-500/20 hover:border-pink-500/40',
  },
  {
    name: 'Utility & Commercial',
    description: 'Industrial dustbins, wheeled waste bins, crates, containers, and steel ladders. Built for commercial, municipal, and institutional use.',
    series: ['Commercial Range'],
    products: ['120L Dustbin', '240L Wheeled Dustbin', 'Waste Bins', 'Plastic Crates', 'Storage Containers', 'Steel Ladders', 'Benches (Elano 3-Seater)'],
    image: 'https://www.nilkamalfurniture.com/cdn/shop/files/240L_Wheeled_Dustbin.jpg?v=1711020789&width=800',
    color: 'from-gray-500/20 to-gray-600/5',
    accent: 'text-gray-600',
    border: 'border-gray-400/20 hover:border-gray-400/40',
  },
  {
    name: 'Mattresses',
    description: 'Nilkamal Mattrezzz — a complete range of foam, spring, and orthopaedic mattresses. Engineered for comfort and certified for quality.',
    series: ['Nilkamal Sleep'],
    products: ['Foam Mattresses', 'Spring Mattresses', 'Orthopaedic Mattresses', 'Mattress Protectors'],
    image: 'https://www.nilkamalfurniture.com/cdn/shop/files/Mattress_Collection.jpg?v=1711021000&width=800',
    color: 'from-indigo-500/20 to-indigo-600/5',
    accent: 'text-indigo-600',
    border: 'border-indigo-500/20 hover:border-indigo-500/40',
  },
]

// ── Nilkamal Stats ───────────────────────────────────────────────────────────

const NILKAMAL_STATS = [
  { value: '40+', label: 'Years in Business' },
  { value: '20,000+', label: 'Dealers Across India' },
  { value: '#1', label: 'Moulded Furniture Brand' },
  { value: '50+', label: 'Retail Stores' },
]

// ── Page Component ───────────────────────────────────────────────────────────

export default function Nilkamal() {
  return (
    <>
      <SEO
        title="Nilkamal Authorized Wholesale Dealer | Hari Shewa Enterprises, Neemuch"
        description="Hari Shewa Enterprises — Authorized Wholesale Dealer of Nilkamal in Neemuch, Madhya Pradesh. Shop the complete range: chairs, tables, storage cabinets (Freedom Series), office furniture, outdoor furniture, and more. Bulk orders and institutional supply available."
        canonical="/nilkamal"
        keywords="Nilkamal dealer Neemuch, Nilkamal wholesale Madhya Pradesh, Nilkamal furniture Neemuch, Nilkamal chairs wholesale, Freedom Series cabinets, Nilkamal authorized dealer MP, Nilkamal plastic furniture wholesale, Nilkamal office chairs, नीलकमल डीलर नीमच, नीलकमल फर्नीचर थोक"
      />

      {/* Hero */}
      <section className='relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden'>
        {/* Decorative grid */}
        <div className='absolute inset-0 opacity-[0.03]' style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className='relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center'>
          {/* Back button */}
          <Link
            to='/home'
            className='inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-8'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Home
          </Link>

          {/* Badge */}
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6'>
            <span className='w-2 h-2 rounded-full bg-blue-400 animate-pulse' />
            <span className='text-sm font-medium text-blue-400'>Authorized Wholesale Dealer</span>
          </div>

          <h1 className='font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight'>
            Nilkamal
          </h1>
          <p className='text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed'>
            We are the <span className='text-white font-semibold'>Authorized Wholesale Dealer</span> of Nilkamal — India's largest and most trusted moulded furniture brand — serving Neemuch, Mandsaur, and all of Central India.
          </p>
          <p className='text-base text-gray-500 max-w-xl mx-auto mb-10'>
            Get the complete Nilkamal range at wholesale prices. Bulk orders, institutional supply, and doorstep delivery available.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <a
              href='https://wa.me/919981516171?text=Hi%2C%20I%27m%20interested%20in%20Nilkamal%20products.%20Please%20share%20details.'
              className='inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors'
            >
              <MessageCircle className='w-5 h-5' />
              Enquire on WhatsApp
            </a>
            <a
              href='tel:+919981516171'
              className='inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors'
            >
              <Phone className='w-5 h-5' />
              Call for Bulk Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className='bg-gray-950 border-y border-white/5 py-10'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8'>
          {NILKAMAL_STATS.map((s) => (
            <div key={s.label} className='text-center'>
              <p className='text-2xl sm:text-3xl font-bold text-white font-display'>{s.value}</p>
              <p className='text-sm text-gray-500 mt-1'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Buy From Us */}
      <section className='bg-gray-950 py-16 md:py-20'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[
              { title: 'Wholesale Pricing', desc: 'Direct dealer pricing on the entire Nilkamal range. Best rates for bulk and institutional orders.' },
              { title: 'Genuine Products', desc: '100% authentic Nilkamal products with original warranty. No duplicates, no compromises.' },
              { title: 'Local Availability', desc: 'Ready stock in Neemuch with fast delivery across Mandsaur, Ratlam, Ujjain, and all of MP & Rajasthan.' },
            ].map((item) => (
              <div key={item.title} className='rounded-2xl border border-white/10 bg-white/[0.02] p-6'>
                <h3 className='text-lg font-semibold text-white mb-2'>{item.title}</h3>
                <p className='text-sm text-gray-400 leading-relaxed'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className='bg-gray-950 py-16 md:py-24'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
          <div className='text-center mb-14'>
            <p className='text-xs font-semibold tracking-widest uppercase text-blue-400 mb-3'>
              Complete Product Range
            </p>
            <h2 className='font-display text-3xl md:text-5xl font-bold text-white mb-4'>
              Everything Nilkamal Makes
            </h2>
            <p className='text-gray-500 max-w-xl mx-auto text-lg'>
              Browse the full Nilkamal catalogue. Contact us for wholesale pricing and availability.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {NILKAMAL_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className={`group rounded-2xl border bg-gradient-to-br ${cat.color} backdrop-blur-sm p-6 transition-all duration-300 ${cat.border}`}
              >
                {/* Category Image */}
                <div className='aspect-[4/3] rounded-xl overflow-hidden bg-gray-900/50 mb-5'>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-500'
                    loading='lazy'
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-600"><span class="text-4xl font-bold opacity-20">${cat.name[0]}</span></div>`
                    }}
                  />
                </div>

                {/* Category Info */}
                <h3 className={`text-xl font-bold text-white mb-2 ${cat.accent}`}>{cat.name}</h3>
                <p className='text-sm text-gray-400 leading-relaxed mb-4'>{cat.description}</p>

                {/* Series Tags */}
                <div className='flex flex-wrap gap-2 mb-4'>
                  {cat.series.map((s) => (
                    <span key={s} className='text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300'>
                      {s}
                    </span>
                  ))}
                </div>

                {/* Popular Products */}
                <div className='border-t border-white/5 pt-4'>
                  <p className='text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2'>
                    Popular Models
                  </p>
                  <p className='text-sm text-gray-400 leading-relaxed'>
                    {cat.products.slice(0, 6).join(' · ')}
                    {cat.products.length > 6 && ` + ${cat.products.length - 6} more`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='bg-gray-900 py-16 md:py-20 border-t border-white/5'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 text-center'>
          <h2 className='font-display text-3xl md:text-4xl font-bold text-white mb-4'>
            Need Nilkamal Products?
          </h2>
          <p className='text-gray-400 text-lg mb-8 max-w-xl mx-auto'>
            Get wholesale rates on any Nilkamal product. Share your requirements and we'll send you a quote within 24 hours.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <a
              href='https://wa.me/919981516171?text=Hi%2C%20I%20need%20Nilkamal%20products.%20Please%20share%20wholesale%20pricing.'
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
        </div>
      </section>

      <Footer variant='dark' />
    </>
  )
}
