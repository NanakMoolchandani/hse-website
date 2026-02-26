import { useEffect, useRef } from 'react'
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
          'shadow-intensity'?: string
          'environment-image'?: string
          loading?: string
          reveal?: string
          'ar'?: boolean | string
          style?: React.CSSProperties
        },
        HTMLElement
      >
    }
  }
}

export default function ModelViewer({ src, poster, alt = '3D Model' }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // model-viewer registers as a custom element — just need the import above
  }, [])

  return (
    <div ref={containerRef} className='relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden'>
      <model-viewer
        src={src}
        poster={poster}
        alt={alt}
        camera-controls=''
        auto-rotate=''
        shadow-intensity='1'
        loading='eager'
        style={{ width: '100%', height: '100%' }}
      />
      <div className='absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded'>
        3D — drag to rotate
      </div>
    </div>
  )
}
