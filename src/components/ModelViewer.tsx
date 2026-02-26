import { useEffect, useRef, useState } from 'react'
import '@google/model-viewer'

interface ModelViewerProps {
  src: string
  poster?: string
  alt?: string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string
          poster?: string
          alt?: string
          'camera-controls'?: boolean | string
          'auto-rotate'?: boolean | string
          'auto-rotate-delay'?: string
          'rotation-per-second'?: string
          'shadow-intensity'?: string
          'interaction-prompt'?: string
          loading?: string
          reveal?: string
          'touch-action'?: string
          style?: React.CSSProperties
        },
        HTMLElement
      >
    }
  }
}

export default function ModelViewer({ src, poster, alt = '3D Model' }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoaded(false)
    setError(false)

    const el = containerRef.current?.querySelector('model-viewer')
    if (!el) return

    const onLoad = () => setLoaded(true)
    const onError = () => setError(true)

    el.addEventListener('load', onLoad)
    el.addEventListener('error', onError)

    return () => {
      el.removeEventListener('load', onLoad)
      el.removeEventListener('error', onError)
    }
  }, [src])

  return (
    <div ref={containerRef} className='relative w-full aspect-square bg-gray-50 rounded-2xl'>
      {/* model-viewer with MINIMAL config — let it auto-frame the model */}
      <model-viewer
        src={src}
        poster={poster}
        alt={alt}
        camera-controls=''
        auto-rotate=''
        auto-rotate-delay='500'
        rotation-per-second='30deg'
        shadow-intensity='0.5'
        interaction-prompt='auto'
        loading='eager'
        touch-action='pan-y'
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '1rem',
          outline: 'none',
          backgroundColor: '#f9fafb',
        }}
      />

      {/* Loading spinner — must NOT have bg so it doesn't cover the model */}
      {!loaded && !error && (
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <div className='text-center bg-gray-50/90 px-4 py-3 rounded-xl'>
            <div className='w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2' />
            <p className='text-xs text-gray-400'>Loading 3D model...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-50 rounded-2xl'>
          <p className='text-sm text-gray-500'>3D model could not be loaded</p>
        </div>
      )}

      {/* Hint — pointer-events-none so it doesn't block drag */}
      {loaded && (
        <div className='absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none'>
          Drag to rotate · Scroll to zoom
        </div>
      )}
    </div>
  )
}
