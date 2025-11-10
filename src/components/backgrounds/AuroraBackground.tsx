import { motion } from 'framer-motion'

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-secondary via-accent to-primary">
      {/* Aurora wave layers */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                ${90 + i * 30}deg,
                transparent 0%,
                rgba(175, 221, 229, ${0.3 - i * 0.05}) 30%,
                rgba(15, 164, 175, ${0.25 - i * 0.04}) 50%,
                rgba(0, 49, 53, ${0.2 - i * 0.03}) 70%,
                transparent 100%
              )
            `,
            transformOrigin: 'center',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30 + i * 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Glowing orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full blur-2xl"
          style={{
            width: `${150 + i * 30}px`,
            height: `${150 + i * 30}px`,
            background: `radial-gradient(circle, ${
              i % 3 === 0
                ? 'rgba(175, 221, 229, 0.4)'
                : i % 3 === 1
                ? 'rgba(15, 164, 175, 0.35)'
                : 'rgba(2, 73, 80, 0.3)'
            } 0%, transparent 70%)`,
          }}
          animate={{
            x: [`${(i * 20) % 80}%`, `${((i * 20) + 30) % 80}%`, `${(i * 20) % 80}%`],
            y: [`${(i * 15) % 80}%`, `${((i * 15) + 40) % 80}%`, `${(i * 15) % 80}%`],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}
