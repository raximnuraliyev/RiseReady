import { motion } from 'framer-motion'

export default function GeometricBackground() {
  const shapes = [
    { type: 'rect', size: 60, color: 'rgba(15, 164, 175, 0.3)' },
    { type: 'circle', size: 80, color: 'rgba(175, 221, 229, 0.35)' },
    { type: 'triangle', size: 70, color: 'rgba(0, 49, 53, 0.4)' },
    { type: 'rect', size: 50, color: 'rgba(2, 73, 80, 0.3)' },
    { type: 'circle', size: 90, color: 'rgba(15, 164, 175, 0.25)' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-accent via-primary to-secondary">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Grid pattern */}
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Animated geometric shapes */}
        {[...Array(12)].map((_, i) => {
          const shape = shapes[i % shapes.length]
          const startX = (i * 17 + 10) % 90
          const startY = (i * 23 + 15) % 80
          
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                x: [0, 20, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 8 + (i % 4) * 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {shape.type === 'circle' && (
                <motion.circle
                  cx={`${startX}%`}
                  cy={`${startY}%`}
                  r={shape.size / 2}
                  fill={shape.color}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
              )}
              
              {shape.type === 'rect' && (
                <motion.rect
                  x={`${startX}%`}
                  y={`${startY}%`}
                  width={shape.size}
                  height={shape.size}
                  fill={shape.color}
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: 'center' }}
                />
              )}
              
              {shape.type === 'triangle' && (
                <motion.polygon
                  points={`${startX},${startY - shape.size/2} ${startX - shape.size/2},${startY + shape.size/2} ${startX + shape.size/2},${startY + shape.size/2}`}
                  fill={shape.color}
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </motion.g>
          )
        })}
      </svg>
      
      {/* Connecting lines effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0, 49, 53, 0.3) 100%)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
