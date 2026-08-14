/**
 * The photographs on a product page.
 *
 * This replaced a component that did three kinds of zoom: a magnifier panel
 * that flew out beside the image on hover, a full-screen lightbox, and pinch
 * and button controls inside it. All of it is gone.
 *
 * The magnifier was the worst of the three. It fired on hover, so a laptop
 * visitor moving the pointer across the page got a 430px panel thrown over the
 * price and the buy button without asking for it, and it magnified a photograph
 * that is a render rather than a macro shot, so there was no extra detail under
 * it to find. Zoom earns its place on a fabric swatch or a watch dial. It does
 * not earn it here.
 *
 * What is left is what a buyer actually uses: a large photograph, thumbnails
 * under it, and arrows. Nothing moves unless they ask it to.
 */

import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  alt: string
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  accentColor?: 'amber' | 'blue' | 'orange' | 'emerald'
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

const ACCENT: Record<string, string> = {
  amber: 'border-amber-500',
  blue: 'border-blue-500',
  orange: 'border-orange-500',
  emerald: 'border-emerald-500',
}

export default function ProductGallery({
  images,
  alt,
  activeIndex,
  onActiveIndexChange,
  accentColor = 'amber',
  onError,
}: ProductGalleryProps) {
  const stripRef = useRef<HTMLDivElement>(null)
  const activeBorder = ACCENT[accentColor] ?? ACCENT.amber
  const count = images.length

  /**
   * Keep the selected thumbnail in view.
   *
   * Drives the strip's own `scrollLeft` rather than calling `scrollIntoView`,
   * which scrolls every scrollable ancestor including the page: that is what
   * used to make the product page jump about 76px down the moment it loaded.
   */
  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const thumb = strip.children[activeIndex] as HTMLElement | undefined
    if (!thumb) return
    const left = thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2
    strip.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [activeIndex])

  if (count === 0) {
    return (
      <div className='aspect-square rounded-2xl bg-gray-50 grid place-items-center text-sm text-gray-400'>
        No photograph yet
      </div>
    )
  }

  const step = (delta: number) => {
    onActiveIndexChange((activeIndex + delta + count) % count)
  }

  return (
    <div>
      <div className='group relative aspect-square rounded-2xl bg-[#f7f6f4] overflow-hidden ring-1 ring-black/[0.06]'>
        <img
          src={images[activeIndex]}
          alt={alt}
          onError={onError}
          className='w-full h-full object-cover'
        />

        {count > 1 && (
          <>
            {/* Present but quiet: full strength once the pointer is over the
                photograph, and always visible on touch, where there is no
                hover to reveal them with. */}
            <button
              type='button'
              onClick={() => step(-1)}
              aria-label='Previous photograph'
              className='pressable absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-full bg-white/85 text-gray-800 shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-250 ease-spring hover:bg-white'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>
            <button
              type='button'
              onClick={() => step(1)}
              aria-label='Next photograph'
              className='pressable absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-full bg-white/85 text-gray-800 shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-250 ease-spring hover:bg-white'
            >
              <ChevronRight className='w-5 h-5' />
            </button>

            <span className='absolute bottom-3 right-3 text-[11px] font-medium tabular-nums rounded-full bg-black/55 text-white px-2.5 py-1'>
              {activeIndex + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div
          ref={stripRef}
          className='mt-3 flex gap-2.5 overflow-x-auto thumbnail-scroll pb-1'
        >
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type='button'
              onClick={() => onActiveIndexChange(i)}
              aria-label={`Photograph ${i + 1} of ${count}`}
              aria-current={i === activeIndex}
              className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#f7f6f4] border-2 transition-colors duration-250 ease-spring ${
                i === activeIndex ? activeBorder : 'border-transparent hover:border-black/[0.15]'
              }`}
            >
              <img src={src} alt='' loading='lazy' onError={onError} className='w-full h-full object-cover' />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
