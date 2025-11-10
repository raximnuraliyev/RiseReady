import { motion } from 'framer-motion'

interface Props {
  variant?: 'primary' | 'secondary' | 'accent'
}

export default function WaveBackground({ variant = 'primary' }: Props) {
  const colors = {
    primary: {
      bg: 'linear-gradient(135deg, #003135 0%, #024950 100%)',
      wave1: 'rgba(15, 164, 175, 0.3)',
      wave2: 'rgba(15, 164, 175, 0.2)',
      wave3: 'rgba(175, 221, 229, 0.15)',
    },
    secondary: {
      bg: 'linear-gradient(135deg, #024950 0%, #0FA4AF 100%)',
      wave1: 'rgba(0, 49, 53, 0.4)',
      wave2: 'rgba(175, 221, 229, 0.3)',
      wave3: 'rgba(255, 255, 255, 0.1)',
    },
    accent: {
      bg: 'linear-gradient(135deg, #0FA4AF 0%, #AFDDE5 100%)',
      wave1: 'rgba(2, 73, 80, 0.5)',
      wave2: 'rgba(0, 49, 53, 0.3)',
      wave3: 'rgba(255, 255, 255, 0.2)',
    },
  }

  const theme = colors[variant]

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: theme.bg }}>
      {/* Animated SVG Waves */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M0,400 C320,300 420,500 720,400 C1020,300 1120,500 1440,400 L1440,800 L0,800 Z"
            fill={theme.wave1}
            animate={{
              d: [
                'M0,400 C320,300 420,500 720,400 C1020,300 1120,500 1440,400 L1440,800 L0,800 Z',
                'M0,450 C320,350 420,550 720,450 C1020,350 1120,550 1440,450 L1440,800 L0,800 Z',
                'M0,400 C320,300 420,500 720,400 C1020,300 1120,500 1440,400 L1440,800 L0,800 Z',
              ],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, -150, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M0,500 C360,400 480,600 840,500 C1200,400 1320,600 1440,500 L1440,800 L0,800 Z"
            fill={theme.wave2}
            animate={{
              d: [
                'M0,500 C360,400 480,600 840,500 C1200,400 1320,600 1440,500 L1440,800 L0,800 Z',
                'M0,550 C360,450 480,650 840,550 C1200,450 1320,650 1440,550 L1440,800 L0,800 Z',
                'M0,500 C360,400 480,600 840,500 C1200,400 1320,600 1440,500 L1440,800 L0,800 Z',
              ],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, 80, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M0,600 C400,500 520,700 960,600 C1400,500 1520,700 1440,600 L1440,800 L0,800 Z"
            fill={theme.wave3}
            animate={{
              d: [
                'M0,600 C400,500 520,700 960,600 C1400,500 1520,700 1440,600 L1440,800 L0,800 Z',
                'M0,650 C400,550 520,750 960,650 C1400,550 1520,750 1440,650 L1440,800 L0,800 Z',
                'M0,600 C400,500 520,700 960,600 C1400,500 1520,700 1440,600 L1440,800 L0,800 Z',
              ],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </motion.div>

      {/* Floating abstract shapes */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)' }}
        animate={{
          x: ['10%', '80%', '10%'],
          y: ['10%', '70%', '10%'],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)' }}
        animate={{
          x: ['80%', '20%', '80%'],
          y: ['20%', '80%', '20%'],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
