import { useEffect, useRef, useState } from 'react'

interface ModelViewerProps {
  src: string
  poster?: string
  alt?: string
}

/**
 * 3D Model Viewer using @google/model-viewer web component.
 *
 * model-viewer is loaded globally via CDN in index.html.
 * This component creates the element via DOM API to avoid React
 * stripping custom element attributes.
 */
export default function ModelViewer({ src, poster, alt = '3D Model' }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    setStatus('loading')
    container.innerHTML = ''

    // Create model-viewer element via DOM API (bypasses React attribute handling)
    const mv = document.createElement('model-viewer')
    mv.setAttribute('src', src)
    if (poster) mv.setAttribute('poster', poster)
    mv.setAttribute('alt', alt)
    mv.setAttribute('camera-controls', '')
    mv.setAttribute('auto-rotate', '')
    mv.setAttribute('shadow-intensity', '0.5')
    mv.setAttribute('loading', 'eager')
    mv.setAttribute('touch-action', 'pan-y')
    mv.style.width = '100%'
    mv.style.height = '100%'
    mv.style.borderRadius = '1rem'
    mv.style.backgroundColor = '#f9fafb'

    mv.addEventListener('load', () => setStatus('loaded'))
    mv.addEventListener('error', () => setStatus('error'))

    container.appendChild(mv)

    return () => {
      container.innerHTML = ''
    }
  }, [src, poster, alt])

  return (
    <div className='relative w-full aspect-square bg-gray-50 rounded-2xl'>
      <div ref={containerRef} className='w-full h-full rounded-2xl' />

      {status === 'loading' && (
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <div className='text-center bg-gray-50/90 px-4 py-3 rounded-xl'>
            <div className='w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2' />
            <p className='text-xs text-gray-400'>Loading 3D model...</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-50 rounded-2xl'>
          <p className='text-sm text-gray-500'>3D model could not be loaded</p>
        </div>
      )}

      {status === 'loaded' && (
        <div className='absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none'>
          Drag to rotate · Scroll to zoom
        </div>
      )}
    </div>
  )
}
