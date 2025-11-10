import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function ConstellationBackground() {
  // Generate random constellation points
  const stars = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
    }))
  }, [])

  // Generate connections between nearby stars
  const connections = useMemo(() => {
    const conns = []
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x
        const dy = stars[i].y - stars[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 15 && conns.length < 80) {
          conns.push({ from: i, to: j, distance })
        }
      }
    }
    return conns
  }, [stars])

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-primary via-accent to-accent-light">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Constellation connections */}
        {connections.map((conn, i) => (
          <motion.line
            key={`line-${i}`}
            x1={`${stars[conn.from].x}%`}
            y1={`${stars[conn.from].y}%`}
            x2={`${stars[conn.to].x}%`}
            y2={`${stars[conn.to].y}%`}
            stroke="rgba(175, 221, 229, 0.3)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 8,
              delay: i * 0.1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
        
        {/* Stars */}
        {stars.map((star) => (
          <motion.circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="rgba(175, 221, 229, 0.8)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + star.size,
              delay: star.id * 0.05,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
      
      {/* Moving gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 49, 53, 0.4) 100%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute w-1 h-1 bg-accent-light rounded-full"
          style={{
            boxShadow: '0 0 10px 2px rgba(175, 221, 229, 0.8)',
          }}
          animate={{
            x: ['0%', '100%'],
            y: ['0%', '80%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 5,
            repeat: Infinity,
            repeatDelay: 12,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}
