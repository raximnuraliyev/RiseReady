import { motion } from 'framer-motion'

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent-light">
      {/* Floating particles */}
      {[...Array(40)].map((_, i) => {
        const size = 3 + (i % 8)
        const startX = (i * 13) % 100
        const startY = 100 + (i * 7) % 20
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: `rgba(175, 221, 229, ${0.6 - (i % 10) * 0.05})`,
              left: `${startX}%`,
            }}
            animate={{
              y: [startY + '%', '-20%'],
              x: [0, `${(i % 2 === 0 ? 1 : -1) * 30}px`],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: 15 + (i % 10),
              delay: (i * 0.2) % 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )
      })}
      
      {/* Horizontal drifting shapes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`drift-${i}`}
          className="absolute"
          style={{
            width: `${40 + i * 10}px`,
            height: `${40 + i * 10}px`,
            top: `${10 + i * 11}%`,
          }}
          animate={{
            x: ['-10%', '110%'],
            rotate: [0, 360],
          }}
          transition={{
            duration: 25 + i * 3,
            delay: i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(15, 164, 175, 0.3) 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      ))}
      
      {/* Pulsing grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(175, 221, 229, 0.1) 2px, transparent 2px)`,
          backgroundSize: '80px 80px',
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
