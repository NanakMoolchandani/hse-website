/**
 * The footer.
 *
 * This is the one place the company name belongs. MVM Aasanam is the brand a
 * customer buys and recognises; Hari Shewa Enterprises is the entity that
 * manufactures it, holds the GSTIN and takes the payment. Putting the company
 * name across the top of every page made the shop read as a supplier's
 * letterhead, so it lives down here in the legal line instead, where anyone
 * checking who they are actually paying can find it in one look.
 *
 * Columns collapse to a single stack on a phone rather than shrinking, because
 * four columns of links at 390px are unreadable and untappable.
 */

import { Link } from 'react-router-dom'
import { Phone, MapPin, MessageCircle, Facebook, Instagram } from 'lucide-react'
import { track } from '@/src/lib/analytics'

const WHATSAPP = '919981516171'

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com/profile.php?id=61581382924728', Icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com/mvm_aasanam', Icon: Instagram },
]

/**
 * Both numbers reach the office. Written without spaces, because that is how
 * they are read out and dialled here; grouping them turns a number people
 * recognise at a glance into something they have to reassemble.
 */
const PHONES = [
  { display: '9981516171', dial: '+919981516171' },
  { display: '9425106894', dial: '+919425106894' },
]

const SHOP_LINKS = [
  { to: '/shop', label: 'All seating' },
  { to: '/shop?category=EXECUTIVE_CHAIRS', label: 'Executive chairs' },
  { to: '/shop?category=ERGONOMIC_TASK_CHAIRS', label: 'Ergonomic task chairs' },
  { to: '/shop?category=VISITOR_RECEPTION', label: 'Visitor & reception' },
  { to: '/catalogue-colors', label: 'Fabric & colours' },
]

const COMPANY_LINKS = [
  { to: '/about', label: 'About us' },
  { to: '/order/track', label: 'Track your order' },
  { to: '/shipping', label: 'Shipping & delivery' },
  { to: '/refunds', label: 'Refunds & cancellation' },
  { to: '/privacy', label: 'Privacy policy' },
  { to: '/terms', label: 'Terms of use' },
]

const DEALER_LINKS = [
  { to: '/nilkamal', label: 'Nilkamal' },
  { to: '/supreme', label: 'Supreme' },
  { to: '/seatex', label: 'Seatex' },
]

export default function Footer({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark'

  const shell = isDark
    ? 'bg-gray-950 border-t border-white/10'
    : 'bg-gray-50 border-t border-black/[0.06]'
  const heading = isDark ? 'text-white' : 'text-gray-900'
  const link = isDark
    ? 'text-gray-400 hover:text-white'
    : 'text-gray-500 hover:text-gray-900'
  const muted = isDark ? 'text-gray-500' : 'text-gray-400'
  const rule = isDark ? 'border-white/10' : 'border-black/[0.06]'

  return (
    <footer className={shell}>
      <div className='max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-12 sm:py-16'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10'>

          {/* Brand */}
          <div className='col-span-2 lg:col-span-1'>
            <div className='flex items-center gap-2.5'>
              <img src='/logos/mvm-logo.png' alt='' className='w-10 h-10 rounded-full' />
              <span className={`text-lg font-semibold tracking-[-0.02em] ${heading}`}>
                MVM Aasanam
              </span>
            </div>
            <p className={`mt-4 text-sm leading-relaxed max-w-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Office seating and furniture, manufactured in our own factory in
              Neemuch and delivered across India.
            </p>

            <div className='mt-6 flex flex-wrap items-center gap-2'>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                onClick={() => track('WHATSAPP_CLICK', { meta: { context: 'footer' } })}
                className='pressable inline-flex items-center gap-2 h-10 px-4 rounded-full bg-amber-500 text-sm font-semibold text-white hover:bg-amber-600'
              >
                <MessageCircle className='w-4 h-4' />
                WhatsApp us
              </a>
              {PHONES.map((p) => (
                <a
                  key={p.dial}
                  href={`tel:${p.dial}`}
                  className={`pressable inline-flex items-center gap-2 h-10 px-4 rounded-full border text-sm font-medium ${
                    isDark
                      ? 'border-white/15 text-white hover:bg-white/10'
                      : 'border-black/10 text-gray-700 hover:bg-black/[0.04]'
                  }`}
                >
                  <Phone className='w-3.5 h-3.5' />
                  {p.display}
                </a>
              ))}
            </div>

            <div className='mt-4 flex items-center gap-2'>
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className={`pressable inline-flex items-center justify-center w-10 h-10 rounded-full border ${
                    isDark
                      ? 'border-white/15 text-white hover:bg-white/10'
                      : 'border-black/10 text-gray-700 hover:bg-black/[0.04]'
                  }`}
                >
                  <Icon className='w-4 h-4' />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title='Shop' links={SHOP_LINKS} heading={heading} link={link} />
          <FooterColumn title='Company' links={COMPANY_LINKS} heading={heading} link={link} />

          {/* Visit + dealer brands */}
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.16em] mb-4 ${heading}`}>
              Visit our factory
            </p>
            <p className={`flex items-start gap-2 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <MapPin className='w-4 h-4 mt-0.5 shrink-0 opacity-60' />
              <span>
                01, Ambedkar Road
                <br />
                Neemuch, Madhya Pradesh 458441
              </span>
            </p>
            <a
              href='https://www.google.com/maps?cid=16199908150674240164'
              target='_blank'
              rel='noopener noreferrer'
              className='mt-3 inline-block text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors'
            >
              Get directions &rarr;
            </a>

            <p className={`mt-7 text-xs font-semibold uppercase tracking-[0.16em] mb-3 ${heading}`}>
              We also stock
            </p>
            <ul className='flex flex-wrap gap-x-4 gap-y-1.5'>
              {DEALER_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={`text-sm transition-colors ${link}`}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The legal line. Small, factual, and the only place the company name
            appears in the shop. */}
        <div className={`mt-12 pt-6 border-t ${rule} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}>
          <p className={`text-xs leading-relaxed ${muted}`}>
            MVM Aasanam is a brand of Hari Shewa Enterprises, Neemuch.
            <span className='hidden sm:inline'> &middot; </span>
            <br className='sm:hidden' />
            GSTIN 23AJUPM2209E1ZD
          </p>
          <p className={`text-xs ${muted}`}>
            &copy; {new Date().getFullYear()} Hari Shewa Enterprises. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title, links, heading, link,
}: {
  title: string
  links: { to: string; label: string }[]
  heading: string
  link: string
}) {
  return (
    <div>
      <p className={`text-xs font-semibold uppercase tracking-[0.16em] mb-4 ${heading}`}>{title}</p>
      <ul className='space-y-2.5'>
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className={`text-sm transition-colors ${link}`}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
