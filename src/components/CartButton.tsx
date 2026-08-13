/**
 * The bag, in the header.
 *
 * Hidden entirely when it is empty. An always-visible cart icon on a site that
 * is mostly a wholesale catalogue invites the question "where is the shop?" on
 * every page; once there is something in it, it is the most important control
 * on the screen and it stays visible until it is dealt with.
 *
 * The count comes from local intent rather than the server's reply, so a tap on
 * "add" is acknowledged in the same frame instead of a few hundred milliseconds
 * later when the round trip lands.
 */

import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/src/lib/cart'

export default function CartButton({ dark = false, onNavigate }: { dark?: boolean; onNavigate?: () => void }) {
  const { itemCount } = useCart()
  if (itemCount === 0) return null

  return (
    <Link
      to='/cart'
      onClick={onNavigate}
      aria-label={`Bag, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
      className={`relative inline-flex items-center justify-center w-11 h-11 rounded-full transition-[transform,background-color] duration-150 ease-out active:scale-[0.94] ${
        dark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'
      }`}
    >
      <ShoppingBag className='w-5 h-5' />
      <span
        className='absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-amber-500 text-[10px] font-bold text-white tabular-nums'
      >
        {itemCount > 9 ? '9+' : itemCount}
      </span>
    </Link>
  )
}
