import { motion } from 'framer-motion'

export default function SpiralBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-primary via-accent to-secondary">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
        {/* Spiral particles */}
        {[...Array(80)].map((_, i) => {
          const angle = (i * 137.5 * Math.PI) / 180 // Golden angle
          const radius = Math.sqrt(i) * 15
          const cx = 500 + radius * Math.cos(angle)
          const cy = 500 + radius * Math.sin(angle)
          const size = 8 + (i % 10)
          
          return (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={size}
              fill={`rgba(175, 221, 229, ${0.6 - (i / 100)})`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 1, 0],
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: 8,
                delay: i * 0.05,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )
        })}
        
        {/* Rotating spiral lines */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '500px 500px' }}
        >
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180
            return (
              <motion.line
                key={`line-${i}`}
                x1="500"
                y1="500"
                x2={500 + 400 * Math.cos(angle)}
                y2={500 + 400 * Math.sin(angle)}
                stroke="rgba(15, 164, 175, 0.15)"
                strokeWidth="2"
                animate={{
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )
          })}
        </motion.g>
      </svg>
      
      {/* Pulsing center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(175, 221, 229, 0.6) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
