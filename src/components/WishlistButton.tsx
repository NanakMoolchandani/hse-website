/**
 * The heart on a product card, and the counter in the header.
 *
 * Two exports because they are the same idea at two scales: one saves a
 * product, the other says how many are saved. Keeping them together stops the
 * icon and the count drifting apart.
 */

import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlist, toggleWishlist, type WishlistEntry } from '@/src/lib/wishlist'

/**
 * The heart that sits on a card or a product page.
 *
 * Stops the click from reaching the card's link: on a grid the heart lives
 * inside an anchor, and without this, saving a chair navigates to it.
 */
export function WishlistHeart({
  entry,
  className = '',
  size = 'sm',
}: {
  entry: Omit<WishlistEntry, 'addedAt'>
  className?: string
  size?: 'sm' | 'lg'
}) {
  const saved = useWishlist().some((e) => e.slug === entry.slug)
  const icon = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
  // 44px on touch, where a fingertip needs it, and 36px from `sm` up where a
  // pointer is precise and a big circle on every card would shout.
  const box = size === 'lg' ? 'w-11 h-11' : 'w-11 h-11 sm:w-9 sm:h-9'

  return (
    <button
      type='button'
      aria-label={saved ? `Remove ${entry.name} from your saved list` : `Save ${entry.name}`}
      aria-pressed={saved}
      // Not tracked yet. `EventType` in analytics.ts has no wishlist events,
      // and the admin API validates the type server-side, so inventing one
      // here would either be rejected or land as an unknown row. Add
      // ADD_TO_WISHLIST / REMOVE_FROM_WISHLIST at both ends together.
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(entry)
      }}
      className={`pressable ${box} grid place-items-center rounded-full material-chrome border border-black/[0.06] shadow-sm hover:scale-105 ${className}`}
    >
      <Heart
        className={`${icon} transition-[fill,color,transform] duration-250 ease-spring ${
          saved ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-500'
        }`}
      />
    </button>
  )
}

/**
 * Header entry point. Hidden until something is saved, for the same reason the
 * bag is: an empty control on a mostly-catalogue site invites a question it
 * cannot answer.
 */
export function WishlistButton({ dark = false, onNavigate }: { dark?: boolean; onNavigate?: () => void }) {
  const count = useWishlist().length
  if (count === 0) return null

  return (
    <Link
      to='/wishlist'
      onClick={onNavigate}
      aria-label={`Saved, ${count} item${count === 1 ? '' : 's'}`}
      className={`pressable relative inline-flex items-center justify-center w-11 h-11 rounded-full ${
        dark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-black/[0.06]'
      }`}
    >
      <Heart className='w-5 h-5' />
      <span className='absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white tabular-nums'>
        {count > 9 ? '9+' : count}
      </span>
    </Link>
  )
}
