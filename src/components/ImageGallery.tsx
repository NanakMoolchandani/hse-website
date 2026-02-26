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
      {/* Main image */}
      <div
        className='relative aspect-square bg-gray-50 rounded-2xl overflow-hidden cursor-pointer group'
        onClick={() => setLightboxOpen(true)}
      >
        <img
          src={images[activeIndex]}
          alt={`${alt} — photo ${activeIndex + 1}`}
          className='w-full h-full object-contain transition-transform duration-300 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors' />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className='flex gap-2 mt-3 overflow-x-auto pb-1'>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex ? 'border-gray-900' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img src={img} alt={`${alt} thumbnail ${i + 1}`} className='w-full h-full object-cover' />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4'
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className='absolute top-4 right-4 text-white/60 hover:text-white text-3xl font-light'
            onClick={() => setLightboxOpen(false)}
          >
            &times;
          </button>

          {/* Prev / Next */}
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
