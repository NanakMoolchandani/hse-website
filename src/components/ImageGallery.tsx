import { useState, useEffect, useRef } from 'react'
import { Play, Pause } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  alt: string
  lifestyleImage?: string | null
}

export default function ImageGallery({ images, alt, lifestyleImage }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [kenBurnsPhase, setKenBurnsPhase] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Include lifestyle image as last in gallery if available
  const allImages = lifestyleImage ? [...images, lifestyleImage] : images

  useEffect(() => {
    if (autoPlay && allImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % allImages.length)
        setKenBurnsPhase((prev) => prev + 1)
      }, 3000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [autoPlay, allImages.length])

  if (allImages.length === 0) return null

  // Ken Burns transform variations
  const kenBurnsTransforms = [
    'scale-105 translate-x-1 -translate-y-1',
    'scale-110 -translate-x-2 translate-y-1',
    'scale-105 translate-x-2 translate-y-2',
    'scale-110 -translate-x-1 -translate-y-2',
    'scale-108 translate-x-0 translate-y-0',
  ]
  const currentTransform = autoPlay
    ? kenBurnsTransforms[kenBurnsPhase % kenBurnsTransforms.length]
    : 'scale-100'

  const isLifestyleActive = lifestyleImage && activeIndex === allImages.length - 1

  return (
    <>
      {/* Main image with Ken Burns effect */}
      <div
        className='relative aspect-square bg-gray-50 rounded-2xl overflow-hidden cursor-pointer group'
        onClick={() => !autoPlay && setLightboxOpen(true)}
      >
        <img
          src={allImages[activeIndex]}
          alt={`${alt} — ${isLifestyleActive ? 'lifestyle view' : `photo ${activeIndex + 1}`}`}
          className={`w-full h-full ${isLifestyleActive ? 'object-cover' : 'object-contain'} transition-transform duration-[3000ms] ease-out ${currentTransform}`}
        />

        {/* Gradient overlay on hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />

        {/* Auto-play toggle */}
        {allImages.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setAutoPlay(!autoPlay)
            }}
            className='absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10'
            title={autoPlay ? 'Pause auto-play' : 'Auto-play 360°'}
          >
            {autoPlay ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4 ml-0.5' />}
          </button>
        )}

        {/* Lifestyle badge */}
        {isLifestyleActive && (
          <div className='absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full'>
            Lifestyle View
          </div>
        )}

        {/* Photo counter */}
        {!isLifestyleActive && allImages.length > 1 && (
          <div className='absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full'>
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {allImages.length > 1 && (
        <div className='flex gap-2 mt-3 overflow-x-auto pb-1'>
          {allImages.map((img, i) => {
            const isLifestyle = lifestyleImage && i === allImages.length - 1
            return (
              <button
                key={i}
                onClick={() => {
                  setActiveIndex(i)
                  setAutoPlay(false)
                }}
                className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  i === activeIndex
                    ? 'border-gray-900 shadow-md'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={img}
                  alt={`${alt} ${isLifestyle ? 'lifestyle' : `thumbnail ${i + 1}`}`}
                  className='w-full h-full object-cover'
                />
                {isLifestyle && (
                  <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                    <span className='text-[8px] text-white font-bold uppercase'>Room</span>
                  </div>
                )}
              </button>
            )
          })}
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

          {allImages.length > 1 && (
            <>
              <button
                className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl font-light'
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
                }}
              >
                &#8249;
              </button>
              <button
                className='absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl font-light'
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
                }}
              >
                &#8250;
              </button>
            </>
          )}

          <img
            src={allImages[activeIndex]}
            alt={`${alt} — full size`}
            className='max-h-[90vh] max-w-[90vw] object-contain'
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
