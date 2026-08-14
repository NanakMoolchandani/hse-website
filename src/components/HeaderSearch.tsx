/**
 * The search field in the header.
 *
 * Modelled on how the big Indian furniture sites do it: search is not a small
 * icon tucked beside the cart, it is the widest thing in the bar. On a
 * catalogue of 400+ pieces, typing "executive" is faster than working down a
 * category list, and putting it front and centre says "this is a shop" before
 * a single product has loaded.
 *
 * It navigates to /shop?q=... rather than filtering in place, so a search is a
 * real page you can link, share and come back to with the back button. Shop
 * reads that param as the initial query.
 */

import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'

export default function HeaderSearch({
  dark = false,
  onSubmitted,
  autoFocus = false,
}: {
  dark?: boolean
  onSubmitted?: () => void
  autoFocus?: boolean
}) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [value, setValue] = useState(params.get('q') ?? '')

  // Keep the box honest when the URL changes under it: clearing the search on
  // the shop page, or arriving from a shared link, should both be reflected.
  useEffect(() => {
    setValue(params.get('q') ?? '')
  }, [params])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    onSubmitted?.()
  }

  return (
    <form onSubmit={submit} role='search' className='relative w-full'>
      <Search
        aria-hidden
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
          dark ? 'text-white/50' : 'text-gray-400'
        }`}
      />
      <input
        type='search'
        // `search` inputs get a native clear button in WebKit that fights the
        // one below, and no rounded corners of their own.
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Search chairs, tables, storage'
        aria-label='Search products'
        className={`w-full h-11 pl-11 pr-10 rounded-full text-sm transition-[background-color,box-shadow,border-color] duration-250 ease-spring focus:outline-none [&::-webkit-search-cancel-button]:hidden ${
          dark
            ? 'bg-white/10 text-white placeholder:text-white/50 border border-white/15 focus:bg-white/15 focus:border-white/30'
            : 'bg-black/[0.045] text-gray-900 placeholder:text-gray-400 border border-transparent focus:bg-white focus:border-black/[0.1] focus:shadow-md'
        }`}
      />
      {value && (
        <button
          type='button'
          onClick={() => setValue('')}
          aria-label='Clear search'
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-full ${
            dark ? 'text-white/60 hover:bg-white/10' : 'text-gray-400 hover:bg-black/[0.06]'
          }`}
        >
          <X className='w-3.5 h-3.5' />
        </button>
      )}
    </form>
  )
}
