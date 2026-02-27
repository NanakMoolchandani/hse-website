'use client'

import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

interface BlobConfig {
  /** x position as % */
  x: number
  /** y position as % */
  y: number
  /** size in vw */
  size: number
  /** color */
  color: string
  /** animation duration in seconds */
  duration: number
  /** movement range in % */
  range: number
  /** delay in seconds */
  delay: number
}

interface EtherealShadowProps {
  /** Array of blob colors — defaults to moody grays/blues */
  colors?: string[]
  /** Overall animation speed multiplier (lower = slower, default 1) */
  speed?: number
  /** Blur amount in px (default 80) */
  blur?: number
  /** Whether to show noise grain overlay */
  noise?: boolean
  style?: CSSProperties
  className?: string
}

const DEFAULT_BLOBS: BlobConfig[] = [
  { x: 25, y: 30, size: 40, color: 'rgba(80, 80, 110, 0.6)', duration: 20, range: 15, delay: 0 },
  { x: 70, y: 60, size: 35, color: 'rgba(60, 65, 90, 0.5)', duration: 25, range: 12, delay: 2 },
  { x: 50, y: 20, size: 45, color: 'rgba(90, 85, 100, 0.4)', duration: 30, range: 18, delay: 4 },
  { x: 30, y: 70, size: 30, color: 'rgba(70, 75, 95, 0.5)', duration: 22, range: 10, delay: 1 },
  { x: 80, y: 25, size: 25, color: 'rgba(55, 60, 85, 0.45)', duration: 28, range: 14, delay: 3 },
]

export function EtherealShadow({
  colors,
  speed = 1,
  blur = 80,
  noise = true,
  style,
  className,
}: EtherealShadowProps) {
  const blobs = colors
    ? DEFAULT_BLOBS.map((b, i) => ({ ...b, color: colors[i % colors.length] }))
    : DEFAULT_BLOBS

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#000',
        ...style,
      }}
    >
      {/* Animated blobs layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: `blur(${blur}px)`,
          willChange: 'transform',
        }}
      >
        {blobs.map((blob, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${blob.x - blob.size / 2}vw`,
              y: `${blob.y - blob.size / 2}vh`,
            }}
            animate={{
              x: [
                `${blob.x - blob.size / 2}vw`,
                `${blob.x - blob.size / 2 + blob.range}vw`,
                `${blob.x - blob.size / 2 - blob.range * 0.5}vw`,
                `${blob.x - blob.size / 2 + blob.range * 0.3}vw`,
                `${blob.x - blob.size / 2}vw`,
              ],
              y: [
                `${blob.y - blob.size / 2}vh`,
                `${blob.y - blob.size / 2 - blob.range * 0.7}vh`,
                `${blob.y - blob.size / 2 + blob.range}vh`,
                `${blob.y - blob.size / 2 - blob.range * 0.4}vh`,
                `${blob.y - blob.size / 2}vh`,
              ],
              scale: [1, 1.1, 0.95, 1.05, 1],
            }}
            transition={{
              duration: blob.duration / speed,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: blob.delay / speed,
            }}
            style={{
              position: 'absolute',
              width: `${blob.size}vw`,
              height: `${blob.size}vw`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
            }}
          />
        ))}
      </div>

      {/* Noise grain overlay */}
      {noise && (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.08,
          }}
        >
          <filter id="ethereal-noise-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#ethereal-noise-grain)" />
        </svg>
      )}
    </div>
  )
}
