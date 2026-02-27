import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const TOTAL_FRAMES = 240

function padFrame(n: number): string {
  return String(n).padStart(3, '0')
}

export default function ChairExplosionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentFrameRef = useRef(0)
  const [loadProgress, setLoadProgress] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // ── Preload ALL frames before enabling scroll ──
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES)
    let loadedCount = 0

    function drawFrame(index: number) {
      const img = images[index]
      if (!img || !img.complete || !ctx || !canvas) return

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const imgAspect = img.naturalWidth / img.naturalHeight
      const canvasAspect = canvas.width / canvas.height

      let drawW: number, drawH: number, drawX: number, drawY: number

      if (imgAspect > canvasAspect) {
        drawH = canvas.height
        drawW = drawH * imgAspect
        drawX = (canvas.width - drawW) / 2
        drawY = 0
      } else {
        drawW = canvas.width
        drawH = drawW / imgAspect
        drawX = 0
        drawY = (canvas.height - drawH) / 2
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH)
    }

    function resizeCanvas() {
      const container = canvas!.parentElement!
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas!.width = Math.round(rect.width * dpr)
      canvas!.height = Math.round(rect.height * dpr)
      canvas!.style.width = rect.width + 'px'
      canvas!.style.height = rect.height + 'px'

      ctx!.imageSmoothingEnabled = true
      ctx!.imageSmoothingQuality = 'high'
      drawFrame(currentFrameRef.current)
    }

    // Load all frames, track progress
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `/chair-explosion/ezgif-frame-${padFrame(i + 1)}.jpg`
      img.onload = () => {
        loadedCount++
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100))

        if (loadedCount === 1) {
          resizeCanvas()
          drawFrame(0)
        }
      }
      images[i] = img
    }

    // Create ScrollTrigger immediately so section stays pinned
    const frameObj = { frame: 0 }

    gsap.to(frameObj, {
      frame: TOTAL_FRAMES - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 0.5,
      },
      onUpdate: () => {
        const frameIndex = Math.round(frameObj.frame)
        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex
          drawFrame(frameIndex)
        }
      },
    })

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className='relative w-full min-h-screen bg-black overflow-hidden'
    >
      <div className='flex flex-col lg:flex-row items-center h-screen'>
        {/* Left — About text (narrower) */}
        <div className='w-full lg:w-[35%] flex items-center justify-center px-8 md:px-12 lg:px-14 py-16 lg:py-0'>
          <div className='max-w-md'>
            <p className='text-xs font-semibold tracking-[0.25em] uppercase text-gray-500 mb-4'>
              Est. 1997 &middot; Neemuch, MP
            </p>
            <h2 className='font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight'>
              About MVM<br />Aasanam
            </h2>
            <p className='text-gray-300 text-base leading-relaxed mb-5'>
              MVM Aasanam is the premium furniture brand of{' '}
              <span className='text-white font-medium'>
                Hari Shewa Enterprises
              </span>
              , headquartered in Neemuch, Madhya Pradesh. For over three decades,
              we have designed, manufactured, and supplied commercial-grade office
              and cafeteria furniture trusted by corporates, government bodies, and
              institutions across Central India.
            </p>
            <p className='text-gray-400 text-sm leading-relaxed mb-8'>
              From executive boardrooms to 500-seat cafeterias, every product is
              engineered for ergonomic comfort and built to endure years of
              daily commercial use. We are{' '}
              <span className='text-gray-200'>ISO 9001 &amp; ISO 22000 certified</span>{' '}
              and an empanelled supplier on the{' '}
              <span className='text-gray-200'>Government e-Marketplace (GeM)</span>.
            </p>
            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <div className='w-1.5 h-1.5 rounded-full bg-green-500' />
                <span className='text-xs text-gray-500 uppercase tracking-widest'>
                  ISO 9001
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-1.5 h-1.5 rounded-full bg-green-500' />
                <span className='text-xs text-gray-500 uppercase tracking-widest'>
                  ISO 22000
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-1.5 h-1.5 rounded-full bg-green-500' />
                <span className='text-xs text-gray-500 uppercase tracking-widest'>
                  GeM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Chair explosion canvas (wider) */}
        <div className='w-full lg:w-[65%] h-[50vh] lg:h-full relative'>
          <canvas
            ref={canvasRef}
            className='absolute inset-0 w-full h-full'
            style={{
              filter: 'contrast(1.3) brightness(0.85)',
              imageRendering: 'high-quality' as React.CSSProperties['imageRendering'],
            }}
          />
          {/* Loading indicator — fades out when all frames are ready */}
          {loadProgress < 100 && (
            <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
              <div className='text-center'>
                <div className='w-16 h-0.5 bg-white/10 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-white/40 rounded-full transition-all duration-300'
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
