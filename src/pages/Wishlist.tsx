/**
 * Saved chairs.
 *
 * A shortlist, not an account feature. It lives in this browser, which is the
 * honest thing to say on the page: someone who saves six chairs on their phone
 * and then opens the laptop should not be left wondering where they went.
 */

import { Link } from 'react-router-dom'
import { Heart, ArrowRight, Trash2 } from 'lucide-react'
import Footer from '@/src/components/Footer'
import SEO from '@/src/components/SEO'
import { useWishlist, removeFromWishlist } from '@/src/lib/wishlist'

export default function Wishlist() {
  const items = useWishlist()

  return (
    <div className='min-h-screen bg-white pt-32 md:pt-40 flex flex-col'>
      <SEO
        title='Saved chairs'
        description='The chairs you have saved from the MVM Aasanam range.'
        canonical='/wishlist'
        noindex
      />

      <div className='flex-1 max-w-7xl w-full mx-auto px-5 sm:px-6 lg:px-10 py-10 sm:py-14'>
        <p className='text-eyebrow text-amber-600 mb-4'>Your shortlist</p>
        <h1 className='text-section text-gray-900'>Saved</h1>
        {items.length > 0 && (
          <p className='mt-4 text-base text-gray-500'>
            {items.length} {items.length === 1 ? 'chair' : 'chairs'} saved on this device.
          </p>
        )}

        {items.length === 0 ? (
          <div className='mt-10 rounded-2xl border border-dashed border-black/[0.1] py-20 px-6 text-center'>
            <Heart className='w-7 h-7 mx-auto text-gray-300' />
            <p className='mt-4 text-title text-gray-900'>Nothing saved yet.</p>
            <p className='mt-2 text-sm text-gray-500 max-w-sm mx-auto leading-relaxed'>
              Tap the heart on any chair to keep it here while you decide. The list
              stays in this browser, so there is nothing to sign up for.
            </p>
            <Link
              to='/shop'
              className='pressable mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-full bg-gray-900 text-sm font-semibold text-white shadow-sm hover:bg-gray-800'
            >
              Browse the range <ArrowRight className='w-4 h-4' />
            </Link>
          </div>
        ) : (
          <div className='mt-10 grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8'>
            {items.map((item) => (
              <article
                key={item.slug}
                className='group reveal rounded-2xl border border-black/[0.06] bg-white overflow-hidden flex flex-col transition-[transform,box-shadow] duration-250 ease-spring hover:-translate-y-1.5 hover:shadow-xl'
              >
                <Link to={item.href} className='block aspect-square bg-gray-50 overflow-hidden'>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      loading='lazy'
                      className='w-full h-full object-contain p-5 sm:p-7 transition-transform duration-400 ease-spring group-hover:scale-[1.06]'
                    />
                  ) : (
                    <div className='w-full h-full grid place-items-center text-gray-300 text-xs'>
                      No photo
                    </div>
                  )}
                </Link>
                <div className='p-4 sm:p-5 flex flex-col flex-1'>
                  <Link to={item.href}>
                    <h2 className='text-title text-gray-900 line-clamp-2'>{item.name}</h2>
                  </Link>
                  <div className='mt-auto pt-4 flex items-center gap-3'>
                    <Link
                      to={item.href}
                      className='pressable flex-1 h-10 inline-flex items-center justify-center rounded-lg bg-gray-900 text-xs font-semibold text-white hover:bg-gray-800'
                    >
                      View chair
                    </Link>
                    <button
                      type='button'
                      onClick={() => removeFromWishlist(item.slug)}
                      aria-label={`Remove ${item.name} from saved`}
                      className='pressable w-10 h-10 grid place-items-center rounded-lg border border-black/[0.08] text-gray-400 hover:text-red-600 hover:border-red-200'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
