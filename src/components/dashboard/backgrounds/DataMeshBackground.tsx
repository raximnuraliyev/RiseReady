import { useEffect, useRef } from 'react'

// Theme #6: Infinite loop of digital data mesh
export default function DataMeshBackground() {
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

    // Mesh nodes
    const nodes: Array<{ x: number; y: number }> = []
    const nodeCount = window.innerWidth < 768 ? 15 : 30
    const gridCols = Math.ceil(Math.sqrt(nodeCount))
    const gridRows = Math.ceil(nodeCount / gridCols)

    for (let i = 0; i < nodeCount; i++) {
      const col = i % gridCols
      const row = Math.floor(i / gridCols)
      nodes.push({
        x: (col / (gridCols - 1)) * canvas.width,
        y: (row / (gridRows - 1)) * canvas.height
      })
    }

    const dataPackets: Array<{
      from: number
      to: number
      progress: number
      speed: number
    }> = []

    let animationFrame: number
    let time = 0

    const animate = () => {
      time += 0.016
      ctx.fillStyle = darkGreen
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw mesh connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x
          const dy = nodes[j].y - nodes[i].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 300) {
            ctx.strokeStyle = `rgba(255, 213, 0, 0.2)`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Create data packets
      if (Math.random() < 0.05) {
        const from = Math.floor(Math.random() * nodes.length)
        let to = Math.floor(Math.random() * nodes.length)
        while (to === from) {
          to = Math.floor(Math.random() * nodes.length)
        }
        dataPackets.push({
          from,
          to,
          progress: 0,
          speed: 0.01 + Math.random() * 0.02
        })
      }

      // Update and draw data packets
      dataPackets.forEach((packet, i) => {
        packet.progress += packet.speed

        if (packet.progress >= 1) {
          dataPackets.splice(i, 1)
          return
        }

        const from = nodes[packet.from]
        const to = nodes[packet.to]
        const x = from.x + (to.x - from.x) * packet.progress
        const y = from.y + (to.y - from.y) * packet.progress

        ctx.fillStyle = gold
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw nodes
      nodes.forEach(node => {
        ctx.fillStyle = goldenrod
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
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

