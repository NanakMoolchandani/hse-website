import { useEffect, useRef } from 'react'

export default function WaveBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0
    let animId: number

    const waveData = Array.from({ length: 14 }).map(() => ({
      value: Math.random() * 0.5 + 0.15,
      targetValue: Math.random() * 0.5 + 0.15,
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
        if (Math.random() < 0.01) data.targetValue = Math.random() * 0.6 + 0.15
        data.value += (data.targetValue - data.value) * data.speed
      })
    }

    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      ctx.clearRect(0, 0, w, h)

      waveData.forEach((data, i) => {
        const freq = data.value * 6

        // Use a gradient stroke: white on left → red on right
        const grad = ctx.createLinearGradient(0, 0, w, 0)
        grad.addColorStop(0, `rgba(255, 255, 255, 0.4)`)
        grad.addColorStop(0.4, `rgba(255, 200, 180, 0.35)`)
        grad.addColorStop(0.7, `rgba(220, 80, 60, 0.3)`)
        grad.addColorStop(1, `rgba(180, 30, 20, 0.25)`)

        ctx.beginPath()
        for (let x = 0; x < w; x++) {
          const nx = (x / w) * 2 - 1
          const px = nx + i * 0.04 + freq * 0.03
          const py =
            Math.sin(px * 8 + time + i * 0.7) *
            Math.cos(px * 2.5 + time * 0.3) *
            freq *
            0.1 *
            ((i + 1) / waveData.length)
          const y = (py + 1) * h / 2
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }

        ctx.lineWidth = 1 + i * 0.15
        ctx.strokeStyle = grad

        // Glow: white on left side, red on right
        const glowProgress = i / waveData.length
        const glowR = Math.round(255 - glowProgress * 75)
        const glowG = Math.round(255 - glowProgress * 200)
        const glowB = Math.round(255 - glowProgress * 220)
        ctx.shadowColor = `rgba(${glowR},${glowG},${glowB},0.3)`
        ctx.shadowBlur = 6
        ctx.stroke()
        ctx.shadowBlur = 0
      })
    }

    function animate() {
      time += 0.015
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
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}
