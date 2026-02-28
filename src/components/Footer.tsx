import { Link } from 'react-router-dom'

export default function Footer({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark'

  return (
    <footer className={isDark ? 'bg-gray-950 border-t border-white/10 py-8' : 'bg-white border-t border-gray-100 py-8'}>
      <div className='max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm'>
        <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
          &copy; {new Date().getFullYear()} Hari Shewa Enterprises. All Rights Reserved.
        </p>
        <div className='flex gap-4 sm:gap-6'>
          <Link to='/about' className={isDark ? 'py-1 text-gray-500 hover:text-gray-300 transition-colors' : 'py-1 text-gray-400 hover:text-gray-600 transition-colors'}>About</Link>
          <Link to='/privacy' className={isDark ? 'py-1 text-gray-500 hover:text-gray-300 transition-colors' : 'py-1 text-gray-400 hover:text-gray-600 transition-colors'}>Privacy Policy</Link>
          <Link to='/terms' className={isDark ? 'py-1 text-gray-500 hover:text-gray-300 transition-colors' : 'py-1 text-gray-400 hover:text-gray-600 transition-colors'}>Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
