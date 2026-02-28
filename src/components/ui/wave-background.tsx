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

    const waveData = Array.from({ length: 6 }).map(() => ({
      value: Math.random() * 0.4 + 0.1,
      targetValue: Math.random() * 0.4 + 0.1,
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
        if (Math.random() < 0.008) data.targetValue = Math.random() * 0.5 + 0.1
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
        ctx.beginPath()
        for (let x = 0; x < w; x++) {
          const nx = (x / w) * 2 - 1
          const px = nx + i * 0.05 + freq * 0.03
          const py =
            Math.sin(px * 8 + time) *
            Math.cos(px * 2.5) *
            freq *
            0.08 *
            ((i + 1) / 6)
          const y = (py + 1) * h / 2
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }

        const intensity = Math.min(1, freq * 0.35)
        const r = Math.round(79 + intensity * 80)
        const g = Math.round(70 + intensity * 100)
        const b = 229

        ctx.lineWidth = 0.8 + i * 0.2
        ctx.strokeStyle = `rgba(${r},${g},${b},0.25)`
        ctx.shadowColor = `rgba(${r},${g},${b},0.3)`
        ctx.shadowBlur = 4
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
