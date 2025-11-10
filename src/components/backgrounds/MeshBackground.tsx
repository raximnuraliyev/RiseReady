import { motion } from 'framer-motion'

export default function MeshBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-secondary via-primary to-accent">
      {/* Animated mesh gradient circles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: `${300 + i * 50}px`,
            height: `${300 + i * 50}px`,
            background: `radial-gradient(circle, ${
              i % 2 === 0 ? 'rgba(15, 164, 175, 0.4)' : 'rgba(175, 221, 229, 0.35)'
            } 0%, transparent 70%)`,
          }}
          animate={{
            x: [
              `${20 + i * 15}%`,
              `${40 + i * 10}%`,
              `${10 + i * 15}%`,
              `${20 + i * 15}%`,
            ],
            y: [
              `${15 + i * 12}%`,
              `${35 + i * 8}%`,
              `${25 + i * 10}%`,
              `${15 + i * 12}%`,
            ],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Floating dots */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2 h-2 rounded-full bg-white/20"
          style={{
            left: `${(i * 5) % 100}%`,
            top: `${(i * 7) % 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6 + (i % 4) * 2,
            delay: i * 0.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
