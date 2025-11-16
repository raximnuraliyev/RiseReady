import { useEffect, useRef } from 'react'

// Theme #1: Animated dark green rotating circular fading element
export default function RotatingRingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const darkGreen = '#06362D'
    const gold = '#FFD500'
    const goldenrod = '#D1A505'

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) * 0.4

    let animationFrame: number
    let time = 0

    const animate = () => {
      time += 0.016
      ctx.fillStyle = darkGreen
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Rotating ring with fading opacity
      const rotation = time * 0.017 // 360° in 60s
      const opacity = 0.7 + Math.sin(time * 0.05) * 0.2 // 0.7-0.9 over 20s cycle

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)

      // Draw ring segments
      for (let i = 0; i < 12; i++) {
        const segmentAngle = (Math.PI * 2) / 12
        const startAngle = i * segmentAngle
        const endAngle = (i + 1) * segmentAngle

        ctx.strokeStyle = `rgba(255, 213, 0, ${opacity * (i % 2 === 0 ? 1 : 0.6)})`
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.arc(0, 0, radius, startAngle, endAngle)
        ctx.stroke()
      }

      ctx.restore()

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: -1 }}
    />
  )
}

