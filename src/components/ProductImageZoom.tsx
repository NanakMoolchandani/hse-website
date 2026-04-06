import { useState, useRef, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, Minus, Plus } from 'lucide-react'

interface ProductImageZoomProps {
  images: string[]
  alt: string
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  accentColor?: 'amber' | 'blue' | 'orange' | 'emerald'
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

const ACCENT_CLASSES = {
  amber: {
    thumbActive: 'border-amber-500 ring-1 ring-amber-500/30',
    hint: 'text-amber-400/60',
  },
  blue: {
    thumbActive: 'border-blue-500 ring-1 ring-blue-500/30',
    hint: 'text-blue-400/60',
  },
  orange: {
    thumbActive: 'border-orange-500 ring-1 ring-orange-500/30',
    hint: 'text-orange-400/60',
  },
  emerald: {
    thumbActive: 'border-emerald-500 ring-1 ring-emerald-500/30',
    hint: 'text-emerald-400/60',
  },
}

const ZOOM_LEVEL = 2.5

export default function ProductImageZoom({
  images,
  alt,
  activeIndex,
  onActiveIndexChange,
  accentColor = 'amber',
  onError,
}: ProductImageZoomProps) {
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxScale, setLightboxScale] = useState(1)
  const [lightboxOffset, setLightboxOffset] = useState({ x: 0, y: 0 })
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const thumbContainerRef = useRef<HTMLDivElement>(null)

  // Pinch-to-zoom state
  const pinchStartDist = useRef(0)
  const pinchStartScale = useRef(1)
  const panStart = useRef({ x: 0, y: 0 })
  const panStartOffset = useRef({ x: 0, y: 0 })
  const isPanning = useRef(false)

  const accent = ACCENT_CLASSES[accentColor]

  // Reset lightbox state when image changes
  useEffect(() => {
    setLightboxScale(1)
    setLightboxOffset({ x: 0, y: 0 })
  }, [activeIndex])

  // Desktop hover zoom
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
    setIsZooming(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsZooming(false)
  }, [])

  // Navigation
  const goPrev = useCallback(() => {
    onActiveIndexChange((activeIndex - 1 + images.length) % images.length)
  }, [activeIndex, images.length, onActiveIndexChange])

  const goNext = useCallback(() => {
    onActiveIndexChange((activeIndex + 1) % images.length)
  }, [activeIndex, images.length, onActiveIndexChange])

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!thumbContainerRef.current) return
    const thumb = thumbContainerRef.current.children[activeIndex] as HTMLElement
    if (thumb) {
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeIndex])

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, goPrev, goNext])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  // Lightbox pinch-to-zoom handlers
  const getTouchDist = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStartDist.current = getTouchDist(e.touches)
      pinchStartScale.current = lightboxScale
    } else if (e.touches.length === 1 && lightboxScale > 1) {
      isPanning.current = true
      panStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      panStartOffset.current = { ...lightboxOffset }
    }
  }

  const handleLightboxTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      const dist = getTouchDist(e.touches)
      const scale = Math.min(Math.max(pinchStartScale.current * (dist / pinchStartDist.current), 1), 5)
      setLightboxScale(scale)
      if (scale === 1) setLightboxOffset({ x: 0, y: 0 })
    } else if (e.touches.length === 1 && isPanning.current && lightboxScale > 1) {
      e.preventDefault()
      const dx = e.touches[0].clientX - panStart.current.x
      const dy = e.touches[0].clientY - panStart.current.y
      setLightboxOffset({
        x: panStartOffset.current.x + dx,
        y: panStartOffset.current.y + dy,
      })
    }
  }

  const handleLightboxTouchEnd = () => {
    isPanning.current = false
  }

  // Lightbox zoom controls
  const zoomIn = () => setLightboxScale((s) => Math.min(s + 0.5, 5))
  const zoomOut = () => {
    setLightboxScale((s) => {
      const next = Math.max(s - 0.5, 1)
      if (next === 1) setLightboxOffset({ x: 0, y: 0 })
      return next
    })
  }
  const resetZoom = () => {
    setLightboxScale(1)
    setLightboxOffset({ x: 0, y: 0 })
  }

  if (images.length === 0) {
    return (
      <div className='relative aspect-square rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden mb-4'>
        <div className='w-full h-full flex items-center justify-center text-gray-700'>
          <span className='text-6xl font-bold opacity-10'>{(alt || 'P')[0]}</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Main Image with hover zoom */}
      <div
        ref={imageContainerRef}
        className='relative aspect-square rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden mb-4 group'
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Normal image */}
        <img
          src={images[activeIndex]}
          alt={`${alt} - Image ${activeIndex + 1}`}
          className={`w-full h-full object-contain p-6 transition-opacity duration-200 ${
            isZooming ? 'opacity-0' : 'opacity-100'
          }`}
          onError={onError}
        />

        {/* Zoomed image (desktop hover) — uses background-image trick */}
        <div
          className={`absolute inset-0 transition-opacity duration-200 hidden md:block ${
            isZooming ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            backgroundImage: `url(${images[activeIndex]})`,
            backgroundSize: `${ZOOM_LEVEL * 100}%`,
            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            backgroundRepeat: 'no-repeat',
            cursor: 'zoom-in',
          }}
          onClick={() => setLightboxOpen(true)}
        />

        {/* Mobile tap-to-zoom overlay */}
        <button
          className='absolute inset-0 md:hidden'
          onClick={() => setLightboxOpen(true)}
          aria-label='Tap to zoom'
        />

        {/* Zoom hint */}
        <div className={`absolute bottom-4 right-4 flex items-center gap-1.5 text-xs ${accent.hint} bg-black/30 backdrop-blur-sm px-2.5 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:flex`}>
          <ZoomIn className='w-3.5 h-3.5' />
          Hover to zoom
        </div>

        {/* Mobile zoom hint */}
        <div className={`absolute bottom-4 right-4 flex items-center gap-1.5 text-xs ${accent.hint} bg-black/30 backdrop-blur-sm px-2.5 py-1.5 rounded-full md:hidden pointer-events-none`}>
          <ZoomIn className='w-3.5 h-3.5' />
          Tap to zoom
        </div>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className='absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10'
              aria-label='Previous image'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>
            <button
              onClick={goNext}
              className='absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10'
              aria-label='Next image'
            >
              <ChevronRight className='w-5 h-5' />
            </button>
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full z-10'>
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div ref={thumbContainerRef} className='flex gap-2 overflow-x-auto pb-2'>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onActiveIndexChange(i)}
              className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? accent.thumbActive
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              <img
                src={img}
                alt={`${alt} thumbnail ${i + 1}`}
                className='w-full h-full object-contain p-1'
                loading='lazy'
                onError={onError}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox with pinch-to-zoom + button zoom */}
      {lightboxOpen && (
        <div
          className='fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col'
          onTouchStart={handleLightboxTouchStart}
          onTouchMove={handleLightboxTouchMove}
          onTouchEnd={handleLightboxTouchEnd}
        >
          {/* Top bar */}
          <div className='flex items-center justify-between px-4 py-3 shrink-0'>
            <div className='text-sm text-white/60'>
              {images.length > 1 && `${activeIndex + 1} / ${images.length}`}
            </div>
            <div className='flex items-center gap-2'>
              {/* Zoom controls */}
              <button
                onClick={zoomOut}
                className='w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center transition-colors'
                aria-label='Zoom out'
              >
                <Minus className='w-4 h-4' />
              </button>
              <button
                onClick={resetZoom}
                className='text-xs text-white/60 hover:text-white/90 px-2 py-1 rounded transition-colors min-w-[3rem] text-center'
              >
                {Math.round(lightboxScale * 100)}%
              </button>
              <button
                onClick={zoomIn}
                className='w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center transition-colors'
                aria-label='Zoom in'
              >
                <Plus className='w-4 h-4' />
              </button>
              <div className='w-px h-5 bg-white/10 mx-1' />
              <button
                onClick={() => { setLightboxOpen(false); resetZoom() }}
                className='w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center transition-colors'
                aria-label='Close'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          </div>

          {/* Image area */}
          <div
            className='flex-1 flex items-center justify-center overflow-hidden relative'
            onClick={(e) => {
              if (e.target === e.currentTarget && lightboxScale === 1) {
                setLightboxOpen(false)
                resetZoom()
              }
            }}
          >
            {/* Nav arrows (desktop) */}
            {images.length > 1 && (
              <>
                <button
                  className='absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors'
                  onClick={(e) => { e.stopPropagation(); goPrev(); resetZoom() }}
                  aria-label='Previous image'
                >
                  <ChevronLeft className='w-6 h-6' />
                </button>
                <button
                  className='absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors'
                  onClick={(e) => { e.stopPropagation(); goNext(); resetZoom() }}
                  aria-label='Next image'
                >
                  <ChevronRight className='w-6 h-6' />
                </button>
              </>
            )}

            <img
              src={images[activeIndex]}
              alt={`${alt} - full size`}
              className='max-h-[85vh] max-w-[90vw] object-contain select-none'
              style={{
                transform: `scale(${lightboxScale}) translate(${lightboxOffset.x / lightboxScale}px, ${lightboxOffset.y / lightboxScale}px)`,
                transition: isPanning.current ? 'none' : 'transform 0.2s ease-out',
                cursor: lightboxScale > 1 ? 'grab' : 'zoom-in',
              }}
              onClick={(e) => {
                e.stopPropagation()
                if (lightboxScale === 1) zoomIn()
                else resetZoom()
              }}
              draggable={false}
              onError={onError}
            />
          </div>

          {/* Bottom thumbnails in lightbox */}
          {images.length > 1 && (
            <div className='flex items-center justify-center gap-2 px-4 py-3 overflow-x-auto shrink-0'>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { onActiveIndexChange(i); resetZoom() }}
                  className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeIndex
                      ? 'border-white/60 ring-1 ring-white/20'
                      : 'border-white/10 hover:border-white/30 opacity-50 hover:opacity-80'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${alt} thumbnail ${i + 1}`}
                    className='w-full h-full object-contain'
                    loading='lazy'
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
