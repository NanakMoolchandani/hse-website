import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'

export default function Footer({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark'
  const text = isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
  const divider = isDark ? 'text-gray-700' : 'text-gray-200'

  return (
    <footer className={isDark ? 'bg-gray-950 border-t border-white/10 py-5 md:py-3' : 'bg-white border-t border-gray-100 py-5 md:py-3'}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-10'>
        <div className='flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-y-3 gap-x-6 text-xs'>
          {/* Brand links + phone */}
          <div className='flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1.5 order-2 md:order-2'>
            <Link to='/mvm' className={`transition-colors ${text}`}>MVM Aasanam</Link>
            <span className={divider}>|</span>
            <Link to='/nilkamal' className={`transition-colors ${text}`}>Nilkamal</Link>
            <span className={divider}>|</span>
            <Link to='/supreme' className={`transition-colors ${text}`}>Supreme</Link>
            <span className={divider}>|</span>
            <Link to='/seatex' className={`transition-colors ${text}`}>Seatex</Link>
          </div>

          {/* Phone (separate, prominent on mobile) */}
          <a
            href='tel:+919981516171'
            className={`hidden md:inline-flex items-center gap-1 transition-colors order-3 ${text}`}
          >
            <Phone className='w-3 h-3' />
            99815 16171
          </a>

          {/* Copyright */}
          <p className={`text-center md:text-left order-4 md:order-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            &copy; {new Date().getFullYear()} Hari Shewa Enterprises
          </p>

          {/* Legal links */}
          <div className='flex items-center justify-center md:justify-end gap-4 order-1 md:order-4'>
            <Link to='/about' className={`transition-colors ${text}`}>About</Link>
            <Link to='/privacy' className={`transition-colors ${text}`}>Privacy</Link>
            <Link to='/terms' className={`transition-colors ${text}`}>Terms</Link>
            <a
              href='tel:+919981516171'
              className={`md:hidden inline-flex items-center gap-1 transition-colors ${text}`}
            >
              <Phone className='w-3 h-3' />
              99815 16171
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
