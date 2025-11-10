import { motion } from 'framer-motion'

export default function RippleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
      {/* Concentric ripple waves */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
          style={{
            width: `${(i + 1) * 150}px`,
            height: `${(i + 1) * 150}px`,
            borderColor: `rgba(175, 221, 229, ${0.3 - i * 0.03})`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4,
            delay: i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full blur-xl"
          style={{
            width: `${80 + i * 20}px`,
            height: `${80 + i * 20}px`,
            background: `radial-gradient(circle, rgba(175, 221, 229, 0.4) 0%, transparent 70%)`,
            left: `${20 + i * 15}%`,
            top: `${10 + i * 12}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Rotating gradient circle */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'conic-gradient(from 0deg, rgba(15, 164, 175, 0.5), transparent, rgba(175, 221, 229, 0.5), transparent)',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}
