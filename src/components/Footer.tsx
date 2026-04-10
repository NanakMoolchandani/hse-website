import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'

export default function Footer({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark'
  const text = isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
  const divider = isDark ? 'text-gray-700' : 'text-gray-200'

  return (
    <footer className={isDark ? 'bg-gray-950 border-t border-white/10 py-3' : 'bg-white border-t border-gray-100 py-3'}>
      <div className='max-w-7xl mx-auto px-6 lg:px-10'>
        <div className='flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs'>
          {/* Left: copyright */}
          <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
            &copy; {new Date().getFullYear()} Hari Shewa Enterprises
          </p>

          {/* Center: brand links + phone */}
          <div className='flex flex-wrap items-center gap-x-4 gap-y-1'>
            <Link to='/mvm' className={`transition-colors ${text}`}>MVM Aasanam</Link>
            <span className={divider}>|</span>
            <Link to='/nilkamal' className={`transition-colors ${text}`}>Nilkamal</Link>
            <span className={divider}>|</span>
            <Link to='/supreme' className={`transition-colors ${text}`}>Supreme</Link>
            <span className={divider}>|</span>
            <Link to='/seatex' className={`transition-colors ${text}`}>Seatex</Link>
            <span className={divider}>|</span>
            <a
              href='tel:+919981516171'
              className={`flex items-center gap-1 transition-colors ${text}`}
            >
              <Phone className='w-3 h-3' />
              99815 16171
            </a>
          </div>

          {/* Right: legal links */}
          <div className='flex items-center gap-4'>
            <Link to='/about' className={`transition-colors ${text}`}>About</Link>
            <Link to='/privacy' className={`transition-colors ${text}`}>Privacy</Link>
            <Link to='/terms' className={`transition-colors ${text}`}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
