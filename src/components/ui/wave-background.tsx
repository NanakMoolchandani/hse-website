import { useEffect, useRef } from 'react'

type Variant = 'indigo' | 'warm'

interface Props {
  className?: string
  variant?: Variant
}

export default function WaveBackground({ className = '', variant = 'indigo' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0
    let animId: number
    let frameCount = 0

    const isWarm = variant === 'warm'
    const isMobile = window.innerWidth < 768
    const waveCount = isMobile ? 3 : 6

    const waveData = Array.from({ length: waveCount }).map(() => ({
      value: Math.random() * (isWarm ? 0.5 : 0.4) + (isWarm ? 0.15 : 0.1),
      targetValue: Math.random() * (isWarm ? 0.5 : 0.4) + (isWarm ? 0.15 : 0.1),
      speed: Math.random() * 0.015 + 0.008,
    }))

    function resizeCanvas() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    function updateWaveData() {
      waveData.forEach((data) => {
        if (Math.random() < (isWarm ? 0.01 : 0.008)) {
          data.targetValue = Math.random() * (isWarm ? 0.6 : 0.5) + (isWarm ? 0.15 : 0.1)
        }
        data.value += (data.targetValue - data.value) * data.speed
      })
    }

    function drawIndigo(w: number, h: number) {
      waveData.forEach((data, i) => {
        const freq = data.value * 6
        ctx!.beginPath()
        for (let x = 0; x < w; x++) {
          const nx = (x / w) * 2 - 1
          const px = nx + i * 0.05 + freq * 0.03
          const py =
            Math.sin(px * 8 + time) *
            Math.cos(px * 2.5) *
            freq *
            0.08 *
            ((i + 1) / waveCount)
          const y = (py + 1) * h / 2
          x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y)
        }

        const intensity = Math.min(1, freq * 0.35)
        const r = Math.round(79 + intensity * 80)
        const g = Math.round(70 + intensity * 100)
        const b = 229

        ctx!.lineWidth = 0.8 + i * 0.2
        ctx!.strokeStyle = `rgba(${r},${g},${b},0.25)`
        ctx!.shadowColor = `rgba(${r},${g},${b},0.3)`
        ctx!.shadowBlur = 4
        ctx!.stroke()
        ctx!.shadowBlur = 0
      })
    }

    function drawWarm(w: number, h: number) {
      // Centre band: waves only occupy middle 40% of height
      const bandTop = h * 0.3
      const bandHeight = h * 0.4

      waveData.forEach((data, i) => {
        const freq = data.value * 6

        // Purple on left → red on right
        const grad = ctx!.createLinearGradient(0, 0, w, 0)
        grad.addColorStop(0, 'rgba(139, 92, 246, 0.4)')
        grad.addColorStop(0.3, 'rgba(168, 85, 200, 0.35)')
        grad.addColorStop(0.6, 'rgba(220, 80, 80, 0.3)')
        grad.addColorStop(1, 'rgba(200, 30, 30, 0.3)')

        ctx!.beginPath()
        for (let x = 0; x < w; x++) {
          const nx = (x / w) * 2 - 1
          const px = nx + i * 0.04 + freq * 0.03
          // Negative time makes waves flow left-to-right (opposite of chair marquee)
          const py =
            Math.sin(px * 8 - time + i * 0.7) *
            Math.cos(px * 2.5 - time * 0.3) *
            freq *
            0.06 *
            ((i + 1) / waveCount)
          // Map into centre band instead of full height
          const y = bandTop + (py + 1) * bandHeight / 2
          x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y)
        }

        ctx!.lineWidth = 1 + i * 0.15
        ctx!.strokeStyle = grad

        const glowProgress = i / waveCount
        const glowR = Math.round(139 + glowProgress * 61)
        const glowG = Math.round(92 - glowProgress * 62)
        const glowB = Math.round(246 - glowProgress * 216)
        ctx!.shadowColor = `rgba(${glowR},${glowG},${glowB},0.3)`
        ctx!.shadowBlur = 6
        ctx!.stroke()
        ctx!.shadowBlur = 0
      })
    }

    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      isWarm ? drawWarm(w, h) : drawIndigo(w, h)
    }

    function animate() {
      frameCount++
      // Skip every other frame on mobile to save battery
      if (isMobile && frameCount % 2 !== 0) {
        animId = requestAnimationFrame(animate)
        return
      }
      time += isWarm ? 0.006 : 0.015
      updateWaveData()
      draw()
      animId = requestAnimationFrame(animate)
    }

    const observer = new ResizeObserver(resizeCanvas)
    observer.observe(canvas)
    resizeCanvas()
    animate()

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
    }
  }, [variant])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}
