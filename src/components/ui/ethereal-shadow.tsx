'use client'

import { useRef, useId, useEffect, type CSSProperties } from 'react'
import { animate, useMotionValue, type AnimationPlaybackControls } from 'framer-motion'

function mapRange(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
): number {
  if (fromLow === fromHigh) return toLow
  return toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow)
}

interface EtherealShadowProps {
  /** CSS color for the shadow effect */
  color?: string
  /** Animation scale (0-100) and speed (0-100) */
  animation?: { scale: number; speed: number }
  /** Noise overlay opacity (0-1) */
  noise?: { opacity: number }
  style?: CSSProperties
  className?: string
}

export function EtherealShadow({
  color = 'rgba(100, 100, 120, 1)',
  animation,
  noise,
  style,
  className,
}: EtherealShadowProps) {
  const rawId = useId()
  const id = `ethereal-${rawId.replace(/:/g, '')}`
  const animationEnabled = !!(animation && animation.scale > 0)
  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null)
  const hueRotateMotionValue = useMotionValue(180)
  const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null)

  const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0
  const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1

  useEffect(() => {
    if (!feColorMatrixRef.current || !animationEnabled) return

    hueRotateAnimation.current?.stop()
    hueRotateMotionValue.set(0)
    hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
      duration: animationDuration / 25,
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
      ease: 'linear',
      delay: 0,
      onUpdate: (value: number) => {
        feColorMatrixRef.current?.setAttribute('values', String(value))
      },
    })

    return () => { hueRotateAnimation.current?.stop() }
  }, [animationEnabled, animationDuration, hueRotateMotionValue])

  return (
    <div
      className={className}
      style={{
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {/* SVG filter definition (zero-size, just defines the filter) */}
      {animationEnabled && (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id={id} colorInterpolationFilters="sRGB">
              <feTurbulence
                result="undulation"
                numOctaves="2"
                baseFrequency={`${mapRange(animation!.scale, 0, 100, 0.001, 0.0005)},${mapRange(animation!.scale, 0, 100, 0.004, 0.002)}`}
                seed="0"
                type="turbulence"
              />
              <feColorMatrix
                ref={feColorMatrixRef}
                in="undulation"
                type="hueRotate"
                values="180"
              />
              <feColorMatrix
                in="dist"
                result="circulation"
                type="matrix"
                values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="circulation"
                scale={displacementScale}
                result="dist"
              />
              <feDisplacementMap
                in="dist"
                in2="undulation"
                scale={displacementScale}
                result="output"
              />
            </filter>
          </defs>
        </svg>
      )}

      {/* Animated shadow blobs — pure CSS gradients, no external images */}
      <div
        style={{
          position: 'absolute',
          inset: animationEnabled ? -displacementScale : 0,
          filter: animationEnabled ? `url(#${id}) blur(4px)` : 'none',
        }}
      >
        {/* Central blob */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 70% at 50% 50%, ${color}, transparent 70%)`,
        }} />
        {/* Upper-left accent */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 25% 30%, ${color}, transparent 70%)`,
          opacity: 0.7,
        }} />
        {/* Lower-right accent */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 55% 55% at 75% 65%, ${color}, transparent 70%)`,
          opacity: 0.5,
        }} />
        {/* Bottom wash */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 90% 40% at 50% 90%, ${color}, transparent 70%)`,
          opacity: 0.4,
        }} />
      </div>

      {/* Film grain / noise — inline SVG, no external deps */}
      {noise && noise.opacity > 0 && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: noise.opacity * 0.25 }}>
          <filter id={`${id}-noise`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${id}-noise)`} />
        </svg>
      )}
    </div>
  )
}
