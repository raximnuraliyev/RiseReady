import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Theme #6: Looped tech-structure with bright particles & data flow
export default function TechStructureBackground() {
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

    // Color palette
    const darkGreen = '#06362D'
    const gold = '#FFD500'
    const goldenrod = '#D1A505'
    const secondaryGreen = '#155332'

    // Network nodes and connections
    const nodes: Array<{ x: number; y: number; vx: number; vy: number }> = []
    const connections: Array<{ from: number; to: number; age: number }> = []
    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number }> = []

    // Initialize nodes
    const nodeCount = window.innerWidth < 768 ? 20 : 40
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      })
    }

    let animationFrame: number
    let time = 0

    const animate = () => {
      time += 0.016
      ctx.fillStyle = darkGreen
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update nodes
      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        node.x = Math.max(0, Math.min(canvas.width, node.x))
        node.y = Math.max(0, Math.min(canvas.height, node.y))
      })

      // Create connections between nearby nodes
      connections.length = 0
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x
          const dy = nodes[j].y - nodes[i].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            connections.push({ from: i, to: j, age: dist / 150 })
          }
        }
      }

      // Draw connections
      connections.forEach(conn => {
        const from = nodes[conn.from]
        const to = nodes[conn.to]
        const opacity = (1 - conn.age) * 0.3
        ctx.strokeStyle = `rgba(255, 213, 0, ${opacity})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
      })

      // Draw nodes
      nodes.forEach(node => {
        ctx.fillStyle = gold
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Create particles along connections
      if (Math.random() < 0.1) {
        connections.forEach(conn => {
          if (Math.random() < 0.3) {
            const from = nodes[conn.from]
            const to = nodes[conn.to]
            const t = Math.random()
            particles.push({
              x: from.x + (to.x - from.x) * t,
              y: from.y + (to.y - from.y) * t,
              vx: (to.x - from.x) * 0.01,
              vy: (to.y - from.y) * 0.01,
              life: 0,
              maxLife: 60
            })
          }
        })
      }

      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.life++

        if (p.life > p.maxLife || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          particles.splice(i, 1)
          return
        }

        const alpha = 1 - (p.life / p.maxLife)
        ctx.fillStyle = `rgba(255, 213, 0, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fill()
      })

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

