import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote } from 'lucide-react'

export interface Testimonial {
  quote: string
  detail: string
  name: string
  role: string
  company: string
  stat?: string
  statLabel?: string
}

interface Props {
  items: Testimonial[]
}

export default function ScrollTestimonials({ items }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const lastIndexRef = useRef(0)

  const handleScroll = useCallback(() => {
    const section = sectionRef.current
    if (!section) return

    const rect = section.getBoundingClientRect()
    const sectionHeight = section.offsetHeight
    const viewportH = window.innerHeight

    const scrolled = -rect.top
    const scrollable = sectionHeight - viewportH

    if (scrollable <= 0) return

    const progress = Math.max(0, Math.min(1, scrolled / scrollable))
    const idx = Math.min(
      items.length - 1,
      Math.floor(progress * items.length),
    )

    if (idx !== lastIndexRef.current) {
      lastIndexRef.current = idx
      setActiveIndex(idx)
    }
  }, [items.length])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const current = items[activeIndex]

  return (
    <section
      ref={sectionRef}
      className='relative bg-gray-950'
      style={{ height: `${items.length * 80}vh` }}
    >
      <div className='sticky top-0 h-screen flex items-center overflow-hidden'>
        {/* Subtle background accents */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl' />
          <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl' />
        </div>

        <div className='relative z-10 max-w-5xl mx-auto px-6 lg:px-10 w-full'>
          <div className='grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 lg:gap-20 items-center'>
            {/* Left: Section heading + progress */}
            <div>
              <p className='text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-3'>
                Client Feedback
              </p>
              <h2 className='font-display text-2xl md:text-4xl font-bold text-white mb-4'>
                What Our Clients Say About Us
              </h2>
              <p className='text-white/40 text-base mb-10'>
                We let our work speak, and our clients confirm it.
              </p>

              {/* Progress dots */}
              <div className='flex gap-3'>
                {items.map((_, i) => (
                  <div
                    key={i}
                    className='relative h-1 rounded-full overflow-hidden transition-all duration-700 ease-out'
                    style={{ width: i === activeIndex ? 48 : 16 }}
                  >
                    <div className='absolute inset-0 bg-white/10 rounded-full' />
                    <motion.div
                      className='absolute inset-0 bg-indigo-400 rounded-full'
                      initial={false}
                      animate={{ scaleX: i === activeIndex ? 1 : 0 }}
                      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </div>
                ))}
              </div>

              <p className='text-white/20 text-xs mt-4 tracking-wider uppercase'>
                {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </p>
            </div>

            {/* Right: Testimonial card */}
            <div className='relative min-h-0 lg:min-h-[420px]'>
              <AnimatePresence mode='popLayout'>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className='glass-card p-5 md:p-10 flex flex-col h-full'
                >
                  <Quote className='w-10 h-10 text-indigo-400/30 mb-6' />

                  <blockquote className='text-white text-lg md:text-xl font-medium leading-relaxed mb-6'>
                    &ldquo;{current.quote}&rdquo;
                  </blockquote>

                  <p className='text-white/40 text-sm leading-relaxed flex-1 mb-8'>
                    {current.detail}
                  </p>

                  {current.stat && (
                    <div className='mb-8 flex items-baseline gap-3'>
                      <span className='text-3xl font-bold text-indigo-400'>
                        {current.stat}
                      </span>
                      <span className='text-sm text-white/40'>
                        {current.statLabel}
                      </span>
                    </div>
                  )}

                  <div className='border-t border-white/10 pt-6'>
                    <p className='font-semibold text-white'>{current.name}</p>
                    <p className='text-sm text-white/40 mt-0.5'>{current.role}</p>
                    <p className='text-sm text-white/40'>{current.company}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
