import { motion } from 'framer-motion'

export default function DotsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-accent-light via-secondary to-primary">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Multi-layered dot pattern */}
        {[...Array(3)].map((_, layer) => (
          <motion.g
            key={layer}
            animate={{
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 5 + layer * 2,
              delay: layer * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {[...Array(80)].map((_, i) => {
              const x = ((i % 10) * 10 + layer * 3) % 100
              const y = (Math.floor(i / 10) * 10 + layer * 3) % 100
              const size = 4 + layer * 2
              
              return (
                <motion.circle
                  key={`${layer}-${i}`}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={size}
                  fill={
                    layer === 0
                      ? 'rgba(0, 49, 53, 0.4)'
                      : layer === 1
                      ? 'rgba(15, 164, 175, 0.35)'
                      : 'rgba(175, 221, 229, 0.3)'
                  }
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 4 + (i % 5),
                    delay: i * 0.03,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )
            })}
          </motion.g>
        ))}
      </svg>
      
      {/* Flowing lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-accent to-transparent"
          style={{
            width: '100%',
            top: `${20 + i * 15}%`,
          }}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            delay: i * 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
