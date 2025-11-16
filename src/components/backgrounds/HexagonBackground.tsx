import { motion } from 'framer-motion'

export default function HexagonBackground() {
  const hexagonPath = (size: number) => {
    const angle = (Math.PI * 2) / 6
    const points = []
    for (let i = 0; i < 6; i++) {
      const x = size * Math.cos(angle * i)
      const y = size * Math.sin(angle * i)
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-accent via-primary to-secondary">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Hexagon grid */}
        {[...Array(50)].map((_, i) => {
          const row = Math.floor(i / 10)
          const col = i % 10
          const x = col * 80 + (row % 2) * 40 + 40
          const y = row * 70 + 40
          const size = 30
          
          return (
            <motion.g key={i} transform={`translate(${x}, ${y})`}>
              <motion.polygon
                points={hexagonPath(size)}
                fill="none"
                stroke={`rgba(175, 221, 229, ${0.3 - (i % 10) * 0.02})`}
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0.8, 1, 0.8],
                  opacity: [0.2, 0.5, 0.2],
                  rotate: [0, 60, 0],
                }}
                transition={{
                  duration: 8 + (i % 5) * 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.g>
          )
        })}
      </svg>
      
      {/* Glowing center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(15, 164, 175, 0.5) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Floating hexagons */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`float-${i}`}
          className="absolute"
          style={{
            left: `${(i * 15) % 90}%`,
            top: `${(i * 20) % 80}%`,
          }}
          animate={{
            y: [0, -50, 0],
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40">
            <polygon
              points={hexagonPath(15)}
              transform="translate(20, 20)"
              fill={`rgba(175, 221, 229, ${0.3 - i * 0.03})`}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
