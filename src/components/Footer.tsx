import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'

export default function Footer({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark'

  return (
    <footer className={isDark ? 'bg-gray-950 border-t border-white/10 py-8' : 'bg-white border-t border-gray-100 py-8'}>
      <div className='max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-4'>
        <div className='flex flex-col sm:flex-row justify-between items-center gap-4 text-sm'>
          <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
            &copy; {new Date().getFullYear()} Hari Shewa Enterprises. All Rights Reserved.
          </p>
          <div className='flex gap-4 sm:gap-6'>
            <Link to='/about' className={isDark ? 'py-1 text-gray-500 hover:text-gray-300 transition-colors' : 'py-1 text-gray-400 hover:text-gray-600 transition-colors'}>About</Link>
            <Link to='/privacy' className={isDark ? 'py-1 text-gray-500 hover:text-gray-300 transition-colors' : 'py-1 text-gray-400 hover:text-gray-600 transition-colors'}>Privacy Policy</Link>
            <Link to='/terms' className={isDark ? 'py-1 text-gray-500 hover:text-gray-300 transition-colors' : 'py-1 text-gray-400 hover:text-gray-600 transition-colors'}>Terms of Service</Link>
          </div>
        </div>
        <div className='flex items-center justify-center gap-6 text-sm'>
          <div className={`flex items-center gap-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Phone className='w-3.5 h-3.5' />
            <span>Call us at</span>
            <a href='tel:+919981516171' className={isDark ? 'hover:text-gray-300 transition-colors' : 'hover:text-gray-600 transition-colors'}>
              99815 16171
            </a>
            <span>/</span>
            <a href='tel:+917999970552' className={isDark ? 'hover:text-gray-300 transition-colors' : 'hover:text-gray-600 transition-colors'}>
              79999 70552
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
