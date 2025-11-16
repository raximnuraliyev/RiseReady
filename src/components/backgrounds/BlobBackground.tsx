import { motion } from 'framer-motion'

export default function BlobBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-secondary via-accent to-accent-light">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
        
        <g filter="url(#goo)">
          {/* Animated blob 1 */}
          <motion.ellipse
            cx="30%"
            cy="40%"
            rx="180"
            ry="220"
            fill="rgba(0, 49, 53, 0.4)"
            animate={{
              cx: ['30%', '35%', '25%', '30%'],
              cy: ['40%', '45%', '35%', '40%'],
              rx: [180, 200, 160, 180],
              ry: [220, 180, 240, 220],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Animated blob 2 */}
          <motion.ellipse
            cx="70%"
            cy="60%"
            rx="200"
            ry="180"
            fill="rgba(175, 221, 229, 0.5)"
            animate={{
              cx: ['70%', '65%', '75%', '70%'],
              cy: ['60%', '55%', '65%', '60%'],
              rx: [200, 180, 220, 200],
              ry: [180, 200, 160, 180],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Animated blob 3 */}
          <motion.ellipse
            cx="50%"
            cy="30%"
            rx="160"
            ry="200"
            fill="rgba(15, 164, 175, 0.45)"
            animate={{
              cx: ['50%', '55%', '45%', '50%'],
              cy: ['30%', '25%', '35%', '30%'],
              rx: [160, 180, 140, 160],
              ry: [200, 160, 220, 200],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Animated blob 4 */}
          <motion.ellipse
            cx="20%"
            cy="70%"
            rx="140"
            ry="160"
            fill="rgba(2, 73, 80, 0.3)"
            animate={{
              cx: ['20%', '25%', '15%', '20%'],
              cy: ['70%', '65%', '75%', '70%'],
              rx: [140, 160, 120, 140],
              ry: [160, 140, 180, 160],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </g>
      </svg>
      
      {/* Additional floating circles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${60 + i * 15}px`,
            height: `${60 + i * 15}px`,
            background: `rgba(255, 255, 255, ${0.1 - i * 0.01})`,
            left: `${10 + i * 18}%`,
            top: `${15 + i * 15}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
