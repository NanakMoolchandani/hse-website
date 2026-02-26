import { useState } from 'react'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (images.length === 0) return null

  return (
    <>
      {/* Main image — taller aspect ratio for better visibility */}
      <div
        className='relative aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden cursor-pointer group'
        onClick={() => setLightboxOpen(true)}
      >
        <img
          src={images[activeIndex]}
          alt={`${alt} — photo ${activeIndex + 1}`}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        />

        {/* Gradient overlay on hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />

        {/* Photo counter */}
        {images.length > 1 && (
          <div className='absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full'>
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className='flex gap-2 mt-3 overflow-x-auto pb-1'>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
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
            alt={`${alt} — full size`}
            className='max-h-[90vh] max-w-[90vw] object-contain'
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
