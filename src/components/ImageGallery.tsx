import { useState, useRef, useCallback } from 'react'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Swipe state
  const touchStartX = useRef<number | null>(null)
  const touchCurrentX = useRef<number | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const isSwiping = useRef(false)

  const goToImage = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setActiveIndex(index)
      }
    },
    [images.length]
  )

  const goNext = useCallback(() => {
    if (activeIndex < images.length - 1) setActiveIndex(activeIndex + 1)
  }, [activeIndex, images.length])

  const goPrev = useCallback(() => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1)
  }, [activeIndex])

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchCurrentX.current = e.targetTouches[0].clientX
    isSwiping.current = false
    setSwipeOffset(0)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    touchCurrentX.current = e.targetTouches[0].clientX
    const diff = touchCurrentX.current - touchStartX.current

    if (Math.abs(diff) > 10) {
      isSwiping.current = true
    }

    if (isSwiping.current) {
      const atStart = activeIndex === 0 && diff > 0
      const atEnd = activeIndex === images.length - 1 && diff < 0
      const dampened = atStart || atEnd ? diff * 0.3 : diff
      setSwipeOffset(dampened)
    }
  }

  const onTouchEnd = () => {
    const minSwipeDistance = 50
    if (touchStartX.current !== null && touchCurrentX.current !== null) {
      const distance = touchStartX.current - touchCurrentX.current
      if (distance > minSwipeDistance) goNext()
      else if (distance < -minSwipeDistance) goPrev()
    }
    touchStartX.current = null
    touchCurrentX.current = null
    setSwipeOffset(0)
    isSwiping.current = false
  }

  // Scroll thumbnail into view
  const thumbRef = useRef<HTMLDivElement>(null)
  const scrollThumbIntoView = useCallback((index: number) => {
    if (!thumbRef.current) return
    const thumb = thumbRef.current.children[index] as HTMLElement
    if (!thumb) return
    thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [])

  if (images.length === 0) return null

  return (
    <>
      {/* Main image - swipeable on mobile */}
      <div className='relative'>
        <div
          className='relative aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden cursor-pointer group touch-pan-y'
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={() => {
            if (!isSwiping.current) setLightboxOpen(true)
          }}
        >
          <div
            style={{
              transform: `translateX(${swipeOffset}px)`,
              transition: swipeOffset === 0 ? 'transform 0.3s ease' : 'none',
            }}
            className='w-full h-full'
          >
            <img
              src={images[activeIndex]}
              alt={`${alt} - photo ${activeIndex + 1}`}
              className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
            />
          </div>

          {/* Desktop arrow navigation */}
          {images.length > 1 && (
            <>
              {activeIndex > 0 && (
                <button
                  className='absolute left-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white text-xl transition-colors'
                  onClick={(e) => { e.stopPropagation(); goPrev() }}
                  aria-label='Previous image'
                >
                  &#8249;
                </button>
              )}
              {activeIndex < images.length - 1 && (
                <button
                  className='absolute right-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white text-xl transition-colors'
                  onClick={(e) => { e.stopPropagation(); goNext() }}
                  aria-label='Next image'
                >
                  &#8250;
                </button>
              )}
            </>
          )}

          {/* Gradient overlay on hover */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' />
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className='flex items-center justify-center gap-1.5 mt-3'>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => { goToImage(i); scrollThumbIntoView(i) }}
                className={`rounded-full transition-all ${
                  activeIndex === i
                    ? 'w-6 h-2 bg-gray-900'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          ref={thumbRef}
          className='flex gap-2 mt-3 overflow-x-auto thumbnail-scroll pb-1'
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goToImage(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? 'border-gray-900 shadow-md'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={img}
                alt={`${alt} thumbnail ${i + 1}`}
                className='w-full h-full object-cover'
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className='fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4'
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className='absolute top-4 right-4 text-white/60 hover:text-white text-3xl font-light z-10'
            onClick={() => setLightboxOpen(false)}
          >
            &times;
          </button>

          {images.length > 1 && (
            <>
              <button
                className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl font-light'
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                }}
              >
                &#8249;
              </button>
              <button
                className='absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl font-light'
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                }}
              >
                &#8250;
              </button>
            </>
          )}

          <img
            src={images[activeIndex]}
            alt={`${alt} - full size`}
            className='max-h-[90vh] max-w-[90vw] object-contain'
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
