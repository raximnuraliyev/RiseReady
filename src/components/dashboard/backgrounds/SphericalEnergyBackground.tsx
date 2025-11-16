import { useEffect, useRef } from 'react'

// Theme #2: Shiny spherical field of flowing energy waves
export default function SphericalEnergyBackground() {
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
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.3

    let animationFrame: number
    let time = 0

    const animate = () => {
      time += 0.016
      ctx.fillStyle = darkGreen
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Oscillating sphere
      const scale = 1 + Math.sin(time * 0.033) * 0.05 // 30s cycle
      const radius = baseRadius * scale

      // Draw energy waves around sphere
      for (let i = 0; i < 8; i++) {
        const angle = (time * 0.02) + (i * Math.PI / 4)
        const waveRadius = radius + Math.sin(time * 0.1 + i) * 30
        const x = centerX + Math.cos(angle) * waveRadius
        const y = centerY + Math.sin(angle) * waveRadius

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 50)
        gradient.addColorStop(0, `rgba(255, 213, 0, ${0.6 - i * 0.05})`)
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, 50, 0, Math.PI * 2)
        ctx.fill()
      }

      // Central sphere glow
      const sphereGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      sphereGradient.addColorStop(0, `rgba(255, 213, 0, 0.3)`)
      sphereGradient.addColorStop(0.5, `rgba(209, 165, 5, 0.2)`)
      sphereGradient.addColorStop(1, 'transparent')

      ctx.fillStyle = sphereGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()

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

