import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import GeometricBackground from '../components/backgrounds/GeometricBackground'
import ScrollReveal from '../components/ScrollReveal'

export default function FeaturesPage() {
  // Modern variants used across the page
  const modernEase = [0.16, 1, 0.3, 1]
  const sectionReveal = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: modernEase } },
  }
  const staggered = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  }
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: modernEase } },
  }

  // Custom animation components for specific features
  const renderCustomAnimation = (featureIndex: number, bgColor: string) => {
    const isWhiteBg = bgColor === 'bg-surface'
    
    // 0: Smart Calendar - Animated calendar with events popping in
    if (featureIndex === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full max-w-[280px]">
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`aspect-square rounded ${isWhiteBg ? 'bg-primary/10' : 'bg-white/10'} flex items-center justify-center`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                >
                  {/* Event dots on random days */}
                  {[5, 12, 18, 23, 28].includes(i) && (
                    <motion.div
                      className="w-2 h-2 rounded-full bg-accent"
                      animate={{
                        scale: [0, 1.2, 1],
                        opacity: [0, 1, 1],
                      }}
                      transition={{
                        delay: 1 + i * 0.1,
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )
    }
    
    // 1: Skills Tracker - Trophy with stars bursting
    if (featureIndex === 1) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Trophy */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="120" height="120" viewBox="0 0 24 24" fill={isWhiteBg ? '#0FA4AF' : '#AFDDE5'}>
              <path d="M20 7h-5V4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v3c0 2.76 2.24 5 5 5 .34 0 .68-.03 1-.1v.1c0 1.66 1.34 3 3 3h2c1.66 0 3-1.34 3-3v-.1c.32.07.66.1 1 .1 2.76 0 5-2.24 5-5V9c0-1.1-.9-2-2-2zm-10-3h4v3h-4V4zm-6 8c-1.65 0-3-1.35-3-3V9h3v2c0 .55.45 1 1 1s1-.45 1-1V9h2v2c0 .55.45 1 1 1s1-.45 1-1V9h2v3c0 1.65-1.35 3-3 3H4zm14 0h-3c-1.65 0-3-1.35-3-3V9h2v2c0 .55.45 1 1 1s1-.45 1-1V9h2v3c0 1.65-1.35 3-3 3h3zM7 21h10v2H7z"/>
            </svg>
          </motion.div>
          
          {/* Bursting stars */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8
            return (
              <motion.div
                key={i}
                className="absolute text-2xl"
                animate={{
                  x: [0, Math.cos((angle * Math.PI) / 180) * 80],
                  y: [0, Math.sin((angle * Math.PI) / 180) * 80],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: i * 0.1,
                }}
              >
                ⭐
              </motion.div>
            )
          })}
        </div>
      )
    }
    
    // 2: Focus & Pomodoro - Ticking timer with tomato
    if (featureIndex === 2) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Timer Circle */}
          <svg width="180" height="180" viewBox="0 0 180 180">
            <motion.circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke={isWhiteBg ? '#0FA4AF' : '#AFDDE5'}
              strokeWidth="8"
              strokeDasharray="440"
              strokeDashoffset="0"
              animate={{ strokeDashoffset: [0, 440] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />
            {/* Tomato emoji in center */}
            <text x="90" y="105" fontSize="60" textAnchor="middle">🍅</text>
          </svg>
          
          {/* Ticking animation */}
          <motion.div
            className="absolute text-4xl font-bold"
            style={{ color: isWhiteBg ? '#003135' : '#AFDDE5' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            25:00
          </motion.div>
        </div>
      )
    }
    
    // 3: Budget Manager - 3D Spinning Coin Stack with Pie Chart
    if (featureIndex === 3) {
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
          {/* 3D Coin Stack */}
          <motion.div
            className="relative"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ scale: 1.2, rotateY: 180 }}
            animate={{ rotateY: 360 }}
            transition={{
              rotateY: { duration: 8, repeat: Infinity, ease: 'linear' },
              scale: { duration: 0.3 },
            }}
          >
            {/* Coin Stack - Each coin is a 3D layer */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: '100px',
                  height: '20px',
                  background: `linear-gradient(135deg, #FFD700 ${20 + i * 10}%, #FFA500 100%)`,
                  borderRadius: '50%',
                  boxShadow: `0 ${2 + i}px 10px rgba(255, 193, 7, 0.5)`,
                  transform: `translateZ(${i * 15}px) translateY(${-i * 8}px)`,
                  border: '2px solid #DAA520',
                }}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }}
              >
                {/* Dollar sign on top coin */}
                {i === 7 && (
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-yellow-900">
                    $
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Floating 3D Pie Chart */}
          <motion.div
            className="absolute"
            style={{
              width: '160px',
              height: '160px',
              transformStyle: 'preserve-3d',
              top: '20%',
              right: '10%',
            }}
            animate={{
              rotateY: [0, 360],
              rotateX: [0, 15, 0],
            }}
            transition={{
              rotateY: { duration: 10, repeat: Infinity, ease: 'linear' },
              rotateX: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.15, rotateY: 180 }}
          >
            {/* Pie Chart Slices */}
            {[0, 120, 240].map((rotation, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: '160px',
                  height: '160px',
                  background: `conic-gradient(from ${rotation}deg, ${
                    i === 0 ? '#0FA4AF' : i === 1 ? '#AFDDE5' : '#003135'
                  } 0deg 120deg, transparent 120deg)`,
                  borderRadius: '50%',
                  transform: `translateZ(${10 + i * 5}px)`,
                  boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
                }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>

          {/* Money particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute text-xl"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              💵
            </motion.div>
          ))}
        </div>
      )
    }
    
    // 4: Wellbeing Hub - Heart beat animation
    if (featureIndex === 4) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-9xl"
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ❤️
          </motion.div>
          
          {/* Pulse rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-4"
              style={{
                borderColor: isWhiteBg ? 'rgba(15, 164, 175, 0.3)' : 'rgba(175, 221, 229, 0.3)',
                width: '100px',
                height: '100px',
              }}
              animate={{
                scale: [1, 2.5],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )
    }
    
    // 5: Career Planning - 3D Branching Roadmap with Avatars
    if (featureIndex === 5) {
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1200px' }}>
          {/* 3D Roadmap Path */}
          <svg className="absolute inset-0 w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#0FA4AF', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#AFDDE5', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            {/* Main career path - curved line */}
            <motion.path
              d="M 50 300 Q 100 200 150 150 T 300 100"
              stroke="url(#pathGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          </svg>

          {/* 3D Career Nodes */}
          {[
            { x: 15, y: 75, label: '🎓', rotation: 0 },
            { x: 35, y: 50, label: '💼', rotation: 45 },
            { x: 55, y: 35, label: '📊', rotation: 90 },
            { x: 75, y: 25, label: '🚀', rotation: 135 },
          ].map((node, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transformStyle: 'preserve-3d',
              }}
              initial={{ scale: 0, rotateY: 0, z: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                rotateY: [0, 360],
                z: [0, 50, 0],
              }}
              transition={{
                scale: { delay: i * 0.3, duration: 0.5 },
                rotateY: { delay: i * 0.3 + 0.5, duration: 2, repeat: Infinity, ease: 'linear' },
                z: { delay: i * 0.3, duration: 2, repeat: Infinity, repeatType: 'reverse' },
              }}
              whileHover={{
                scale: 1.5,
                rotateY: 180,
                z: 100,
                transition: { duration: 0.3 },
              }}
            >
              {/* 3D Node */}
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{
                  background: 'linear-gradient(135deg, #0FA4AF 0%, #AFDDE5 100%)',
                  boxShadow: '0 10px 30px rgba(15, 164, 175, 0.5), inset 0 -5px 10px rgba(0, 0, 0, 0.2)',
                  transform: `rotateX(${node.rotation}deg)`,
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                {node.label}
              </div>
              
              {/* Holographic glow */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(15, 164, 175, 0.4) 0%, transparent 70%)',
                  filter: 'blur(10px)',
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            </motion.div>
          ))}

          {/* 3D Avatar Walking */}
          <motion.div
            className="absolute text-5xl"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{
              left: ['10%', '80%'],
              top: ['80%', '20%'],
              rotateY: [0, 15, -15, 0],
            }}
            transition={{
              left: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
              top: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
              rotateY: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' },
            }}
          >
            🚶
          </motion.div>

          {/* Particle trail */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`trail-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: '#0FA4AF',
                boxShadow: '0 0 10px #0FA4AF',
              }}
              animate={{
                left: ['10%', '80%'],
                top: ['80%', '20%'],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )
    }
    
    // 6: Community - 3D Orbiting Spheres Network
    if (featureIndex === 6) {
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1500px' }}>
          {/* Central Hub - 3D Sphere */}
          <motion.div
            className="absolute w-24 h-24 rounded-full flex items-center justify-center text-4xl z-20"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #AFDDE5, #0FA4AF)',
              boxShadow: '0 20px 60px rgba(15, 164, 175, 0.6), inset -10px -10px 20px rgba(0, 0, 0, 0.3)',
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotateY: 360,
              rotateX: [0, 10, 0],
            }}
            transition={{
              rotateY: { duration: 8, repeat: Infinity, ease: 'linear' },
              rotateX: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{
              scale: 1.3,
              boxShadow: '0 30px 80px rgba(15, 164, 175, 0.9), inset -10px -10px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            🤝
          </motion.div>

          {/* Orbiting User Spheres in 3D */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8
            const radius = 120
            const orbitDuration = 12 + i * 0.5
            
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  rotateY: 360,
                }}
                transition={{
                  duration: orbitDuration,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.2,
                }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${isWhiteBg ? '#0FA4AF' : '#AFDDE5'}, ${isWhiteBg ? '#003135' : '#0FA4AF'})`,
                    boxShadow: `0 10px 30px rgba(15, 164, 175, 0.4), inset -5px -5px 10px rgba(0, 0, 0, 0.2)`,
                    transform: `translateX(${Math.cos((angle * Math.PI) / 180) * radius}px) translateY(${
                      Math.sin((angle * Math.PI) / 180) * radius
                    }px) translateZ(${Math.sin((i * Math.PI) / 4) * 50}px)`,
                  }}
                  animate={{
                    rotateY: [0, 360],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    rotateY: { duration: 4, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity, delay: i * 0.2 },
                  }}
                  whileHover={{
                    scale: 1.4,
                    boxShadow: '0 15px 40px rgba(15, 164, 175, 0.8), inset -5px -5px 10px rgba(0, 0, 0, 0.3)',
                    transition: { duration: 0.2 },
                  }}
                >
                  {['👤', '👥', '👨', '👩', '🧑', '👴', '👵', '🧒'][i]}
                </motion.div>
              </motion.div>
            )
          })}

          {/* 3D Connecting Web Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {[...Array(8)].map((_, i) => {
              const angle = (i * 360) / 8
              const radius = 34
              const x = 50 + Math.cos((angle * Math.PI) / 180) * radius
              const y = 50 + Math.sin((angle * Math.PI) / 180) * radius
              return (
                <motion.line
                  key={i}
                  x1="50%"
                  y1="50%"
                  x2={`${x}%`}
                  y2={`${y}%`}
                  stroke={isWhiteBg ? '#0FA4AF' : '#AFDDE5'}
                  strokeWidth="2"
                  strokeOpacity="0.4"
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: [0, 1],
                    strokeOpacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    pathLength: { duration: 2, repeat: Infinity, delay: i * 0.15 },
                    strokeOpacity: { duration: 3, repeat: Infinity, delay: i * 0.15 },
                  }}
                />
              )
            })}
          </svg>

          {/* Particle effects */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: '#0FA4AF',
                boxShadow: '0 0 8px #0FA4AF',
              }}
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      )
    }
    
    // 7: Study Resources - 3D Flying Books & Rotating Resource Globe
    if (featureIndex === 7) {
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1200px' }}>
          {/* 3D Floating Shelf */}
          <motion.div
            className="absolute"
            style={{
              width: '250px',
              height: '30px',
              background: 'linear-gradient(to bottom, #8B4513, #654321)',
              borderRadius: '10px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              transform: 'rotateX(60deg) translateZ(-50px)',
              bottom: '30%',
            }}
            animate={{
              rotateX: [58, 62, 58],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* 3D Books Flying In */}
          {[
            { color: '#0FA4AF', delay: 0, angle: -15 },
            { color: '#AFDDE5', delay: 0.3, angle: -5 },
            { color: '#003135', delay: 0.6, angle: 5 },
            { color: '#0FA4AF', delay: 0.9, angle: 15 },
          ].map((book, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: '50px',
                height: '70px',
                transformStyle: 'preserve-3d',
              }}
              initial={{
                x: (i % 2 === 0 ? -1 : 1) * 400,
                y: -200,
                rotateY: (i % 2 === 0 ? -1 : 1) * 180,
                rotateZ: Math.random() * 360,
                opacity: 0,
              }}
              animate={{
                x: (i - 1.5) * 60,
                y: 0,
                rotateY: book.angle,
                rotateZ: book.angle,
                opacity: 1,
              }}
              transition={{
                delay: book.delay,
                duration: 1.5,
                type: 'spring',
                stiffness: 100,
              }}
              whileHover={{
                y: -30,
                rotateY: 180,
                scale: 1.2,
                transition: { duration: 0.4 },
              }}
            >
              {/* Book 3D Structure */}
              <div
                className="relative w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(10px)',
                }}
              >
                {/* Front cover */}
                <div
                  className="absolute inset-0 rounded flex items-center justify-center text-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${book.color} 0%, ${book.color}dd 100%)`,
                    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)',
                    transform: 'translateZ(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  📖
                </div>
                {/* Spine */}
                <div
                  className="absolute left-0 w-5 h-full"
                  style={{
                    background: `linear-gradient(to right, ${book.color}aa, ${book.color})`,
                    transform: 'rotateY(-90deg) translateZ(-2px)',
                    borderRadius: '2px 0 0 2px',
                  }}
                />
                {/* Top */}
                <div
                  className="absolute top-0 w-full h-5"
                  style={{
                    background: book.color,
                    transform: 'rotateX(90deg) translateZ(0px)',
                  }}
                />
              </div>
            </motion.div>
          ))}

          {/* 3D Rotating Resource Globe */}
          <motion.div
            className="absolute"
            style={{
              width: '140px',
              height: '140px',
              transformStyle: 'preserve-3d',
              top: '10%',
              right: '15%',
            }}
            animate={{
              rotateY: 360,
              rotateX: [0, 10, 0],
            }}
            transition={{
              rotateY: { duration: 15, repeat: Infinity, ease: 'linear' },
              rotateX: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{
              scale: 1.2,
              rotateY: 180,
              transition: { duration: 0.5 },
            }}
          >
            {/* Globe sphere */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #AFDDE5, #0FA4AF)',
                boxShadow: '0 15px 40px rgba(15, 164, 175, 0.5), inset -10px -10px 20px rgba(0, 0, 0, 0.3)',
              }}
            />
            
            {/* Orbiting resource icons */}
            {['📄', '🎥', '🎧', '📊', '🖼️', '📝'].map((icon, i) => {
              const angle = (i * 360) / 6
              return (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: Math.cos((angle * Math.PI) / 180) * 80,
                    y: Math.sin((angle * Math.PI) / 180) * 80,
                    rotateY: -360,
                  }}
                  transition={{
                    x: { duration: 15, repeat: Infinity, ease: 'linear' },
                    y: { duration: 15, repeat: Infinity, ease: 'linear' },
                    rotateY: { duration: 15, repeat: Infinity, ease: 'linear' },
                  }}
                >
                  {icon}
                </motion.div>
              )
            })}
          </motion.div>

          {/* Sparkle particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute text-xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )
    }
    
    // 8: Progress Analytics - 3D Rotating Dashboard with Live Charts
    if (featureIndex === 8) {
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1400px' }}>
          {/* 3D Dashboard Panel */}
          <motion.div
            className="relative"
            style={{
              width: '300px',
              height: '300px',
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotateY: [0, 360],
              rotateX: [-5, 5, -5],
            }}
            transition={{
              rotateY: { duration: 20, repeat: Infinity, ease: 'linear' },
              rotateX: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{
              rotateY: 180,
              scale: 1.1,
              transition: { duration: 0.6 },
            }}
          >
            {/* Front Panel - Bar Chart */}
            <motion.div
              className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-end gap-2"
              style={{
                background: `linear-gradient(135deg, ${isWhiteBg ? '#ffffff' : '#f8f9fa'} 0%, ${isWhiteBg ? '#f0f0f0' : '#e9ecef'} 100%)`,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(15, 164, 175, 0.1)',
                transform: 'translateZ(50px)',
                border: '2px solid rgba(15, 164, 175, 0.3)',
              }}
            >
              {/* Animated Bar Chart */}
              <div className="flex items-end justify-around h-40 gap-2">
                {[30, 50, 40, 70, 60, 85].map((height, i) => (
                  <motion.div
                    key={i}
                    className="w-full rounded-t-lg relative"
                    style={{
                      background: `linear-gradient(to top, ${isWhiteBg ? '#0FA4AF' : '#AFDDE5'}, ${isWhiteBg ? '#AFDDE5' : '#fff'})`,
                      boxShadow: '0 -2px 10px rgba(15, 164, 175, 0.3)',
                    }}
                    initial={{ height: '0%' }}
                    animate={{
                      height: [`${height}%`, `${height + 10}%`, `${height}%`],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                  >
                    {/* Value labels */}
                    <motion.div
                      className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold"
                      style={{ color: isWhiteBg ? '#003135' : '#0FA4AF' }}
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                    >
                      {height}%
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              
              {/* Chart title */}
              <div className="text-center text-sm font-semibold" style={{ color: isWhiteBg ? '#003135' : '#0FA4AF' }}>
                Weekly Progress
              </div>
            </motion.div>

            {/* Right Panel - Circular Progress */}
            <motion.div
              className="absolute inset-0 rounded-2xl p-8 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${isWhiteBg ? '#0FA4AF' : '#AFDDE5'} 0%, ${isWhiteBg ? '#003135' : '#0FA4AF'} 100%)`,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                transform: 'rotateY(90deg) translateZ(50px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {/* Circular Progress Ring */}
              <svg width="160" height="160" className="relative">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="white"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="440"
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: [440, 110, 440] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
                <text
                  x="80"
                  y="90"
                  textAnchor="middle"
                  fill="white"
                  fontSize="32"
                  fontWeight="bold"
                >
                  75%
                </text>
              </svg>
            </motion.div>

            {/* Back Panel - Line Graph */}
            <motion.div
              className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-center"
              style={{
                background: `linear-gradient(135deg, ${isWhiteBg ? '#ffffff' : '#f8f9fa'} 0%, ${isWhiteBg ? '#e9ecef' : '#dee2e6'} 100%)`,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(15, 164, 175, 0.1)',
                transform: 'rotateY(180deg) translateZ(50px)',
                border: '2px solid rgba(15, 164, 175, 0.3)',
              }}
            >
              {/* Animated Line Graph */}
              <svg width="100%" height="150" viewBox="0 0 280 150">
                <motion.path
                  d="M 20 130 Q 60 100 90 80 T 150 60 T 210 40 T 260 30"
                  stroke={isWhiteBg ? '#0FA4AF' : '#AFDDE5'}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                />
                {/* Data points */}
                {[20, 90, 150, 210, 260].map((x, i) => (
                  <motion.circle
                    key={i}
                    cx={x}
                    cy={130 - i * 25}
                    r="5"
                    fill={isWhiteBg ? '#0FA4AF' : '#AFDDE5'}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.3,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                ))}
              </svg>
              <div className="text-center text-sm font-semibold mt-2" style={{ color: isWhiteBg ? '#003135' : '#0FA4AF' }}>
                Monthly Trend
              </div>
            </motion.div>

            {/* Left Panel - Achievement Badges */}
            <motion.div
              className="absolute inset-0 rounded-2xl p-6 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${isWhiteBg ? '#AFDDE5' : '#0FA4AF'} 0%, ${isWhiteBg ? '#0FA4AF' : '#003135'} 100%)`,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                transform: 'rotateY(-90deg) translateZ(50px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                {['🏆', '⭐', '🎯', '💎'].map((icon, i) => (
                  <motion.div
                    key={i}
                    className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  >
                    {icon}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Top Panel */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${isWhiteBg ? '#0FA4AF' : '#AFDDE5'}aa, ${isWhiteBg ? '#AFDDE5' : '#0FA4AF'}aa)`,
                transform: 'rotateX(90deg) translateZ(50px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              }}
            />

            {/* Bottom Panel */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${isWhiteBg ? '#003135' : '#0FA4AF'}99, ${isWhiteBg ? '#0FA4AF' : '#003135'}99)`,
                transform: 'rotateX(-90deg) translateZ(50px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              }}
            />
          </motion.div>

          {/* Floating Data Points */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`data-${i}`}
              className="absolute text-xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              {['📈', '📊', '💯', '✨'][i % 4]}
            </motion.div>
          ))}

          {/* Orbiting Stats */}
          {[...Array(6)].map((_, i) => {
            const angle = (i * 360) / 6
            const radius = 180
            return (
              <motion.div
                key={`stat-${i}`}
                className="absolute w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{
                  background: `radial-gradient(circle, ${isWhiteBg ? '#0FA4AF' : '#AFDDE5'}, ${isWhiteBg ? '#003135' : '#0FA4AF'})`,
                  boxShadow: '0 5px 20px rgba(15, 164, 175, 0.4)',
                }}
                animate={{
                  x: Math.cos((angle * Math.PI) / 180) * radius,
                  y: Math.sin((angle * Math.PI) / 180) * radius,
                  rotate: -360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  x: { duration: 15, repeat: Infinity, ease: 'linear' },
                  y: { duration: 15, repeat: Infinity, ease: 'linear' },
                  rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, delay: i * 0.3 },
                }}
              >
                {['📝', '✅', '🎯', '🔥', '⚡', '🌟'][i]}
              </motion.div>
            )
          })}

          {/* Progress Ring Pulse */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute rounded-full border-2"
              style={{
                width: '100px',
                height: '100px',
                borderColor: isWhiteBg ? '#0FA4AF' : '#AFDDE5',
              }}
              animate={{
                scale: [1, 3.5],
                opacity: [0.6, 0],
                borderWidth: ['2px', '0px'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )
    }
    
    // 9: Smart Notifications - 3D Notification Cubes & Particle Bell
    if (featureIndex === 9) {
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
          {/* 3D Notification Cubes Popping Up */}
          {[
            { x: -80, y: -60, delay: 0, color: '#0FA4AF', icon: '📧' },
            { x: 80, y: -60, delay: 0.3, color: '#AFDDE5', icon: '💬' },
            { x: -80, y: 60, delay: 0.6, color: '#003135', icon: '📱' },
            { x: 80, y: 60, delay: 0.9, color: '#0FA4AF', icon: '🔔' },
          ].map((cube, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: '70px',
                height: '70px',
                transformStyle: 'preserve-3d',
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                rotateX: 0,
                rotateY: 0,
                opacity: 0,
              }}
              animate={{
                x: cube.x,
                y: cube.y,
                scale: [0, 1.2, 1],
                rotateX: [0, 360],
                rotateY: [0, 360],
                opacity: 1,
              }}
              transition={{
                delay: cube.delay,
                duration: 1,
                rotateX: { delay: cube.delay + 1, duration: 3, repeat: Infinity, ease: 'linear' },
                rotateY: { delay: cube.delay + 1, duration: 4, repeat: Infinity, ease: 'linear' },
              }}
              whileHover={{
                scale: 1.4,
                rotateX: 180,
                rotateY: 180,
                transition: { duration: 0.4 },
              }}
            >
              {/* 3D Cube faces */}
              <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                {/* Front */}
                <div
                  className="absolute inset-0 flex items-center justify-center text-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${cube.color} 0%, ${cube.color}dd 100%)`,
                    transform: 'translateZ(35px)',
                    boxShadow: `inset 0 0 20px rgba(0, 0, 0, 0.2), 0 0 20px ${cube.color}66`,
                    borderRadius: '8px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {cube.icon}
                </div>
                {/* Back */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${cube.color}dd 0%, ${cube.color}aa 100%)`,
                    transform: 'translateZ(-35px) rotateY(180deg)',
                    borderRadius: '8px',
                  }}
                />
                {/* Right */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${cube.color}cc 0%, ${cube.color}99 100%)`,
                    transform: 'rotateY(90deg) translateZ(35px)',
                    borderRadius: '8px',
                  }}
                />
                {/* Left */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${cube.color}cc 0%, ${cube.color}99 100%)`,
                    transform: 'rotateY(-90deg) translateZ(35px)',
                    borderRadius: '8px',
                  }}
                />
                {/* Top */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${cube.color}ee 0%, ${cube.color}bb 100%)`,
                    transform: 'rotateX(90deg) translateZ(35px)',
                    borderRadius: '8px',
                  }}
                />
                {/* Bottom */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${cube.color}aa 0%, ${cube.color}77 100%)`,
                    transform: 'rotateX(-90deg) translateZ(35px)',
                    borderRadius: '8px',
                  }}
                />
              </div>
            </motion.div>
          ))}

          {/* Central Bell with Particle Formation */}
          <div className="relative">
            {/* Particles gathering to form bell */}
            {[...Array(30)].map((_, i) => {
              const angle = (i * 360) / 30
              const distance = 100
              return (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: isWhiteBg ? '#0FA4AF' : '#AFDDE5',
                    boxShadow: `0 0 10px ${isWhiteBg ? '#0FA4AF' : '#AFDDE5'}`,
                  }}
                  animate={{
                    x: [
                      Math.cos((angle * Math.PI) / 180) * distance,
                      0,
                      Math.cos((angle * Math.PI) / 180) * distance,
                    ],
                    y: [
                      Math.sin((angle * Math.PI) / 180) * distance,
                      0,
                      Math.sin((angle * Math.PI) / 180) * distance,
                    ],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.05,
                    ease: 'easeInOut',
                  }}
                />
              )
            })}

            {/* 3D Bell Icon */}
            <motion.div
              className="text-8xl relative z-10"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{
                rotateY: [0, 15, -15, 0],
                rotateZ: [-5, 5, -5, 5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotateY: { duration: 2, repeat: Infinity, repeatDelay: 2 },
                rotateZ: { duration: 0.5, repeat: Infinity, repeatDelay: 3 },
                scale: { duration: 0.3, repeat: Infinity, repeatDelay: 3 },
              }}
              whileHover={{
                scale: 1.3,
                rotateY: 360,
                transition: { duration: 0.6 },
              }}
            >
              🔔
            </motion.div>

            {/* Glow pulse */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${isWhiteBg ? 'rgba(15, 164, 175, 0.3)' : 'rgba(175, 221, 229, 0.3)'} 0%, transparent 70%)`,
                filter: 'blur(20px)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>

          {/* Sound wave rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute rounded-full border-2"
              style={{
                width: '100px',
                height: '100px',
                borderColor: isWhiteBg ? '#0FA4AF' : '#AFDDE5',
              }}
              animate={{
                scale: [1, 3],
                opacity: [0.6, 0],
                borderWidth: ['2px', '0px'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )
    }
    
    // Fallback
    return null
  }

  const modules = [
    {
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      title: 'Smart Calendar & Scheduling',
      desc: 'Never miss a deadline or double-book yourself again. Our intelligent calendar syncs your classes, assignments, exams, and personal commitments in one view.',
      features: ['Google Calendar sync', 'Assignment tracking', 'Exam countdown', 'Conflict detection'],
      img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop',
    },
    {
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
      title: 'Skills Tracker & Development',
      desc: 'Build the competencies employers are looking for. Track your progress across technical, soft, and academic skills with visual dashboards.',
      features: ['Competency mapping', 'Progress tracking', 'Skill recommendations', 'Certificate uploads'],
      img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    },
    {
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: 'Focus & Pomodoro Sessions',
      desc: 'Maximize productivity with structured study sessions. Use proven Pomodoro techniques with ambient sounds and break reminders.',
      features: ['Pomodoro timer', 'Ambient soundscapes', 'Session analytics', 'Distraction blocking'],
      img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop',
    },
    {
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: 'Budget Manager',
      desc: 'Take control of your finances as a student. Track income from jobs and loans, categorize expenses, and set savings goals.',
      features: ['Income/expense tracking', 'Category budgets', 'Savings goals', 'Financial insights'],
      img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
    },
    {
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
      title: 'Wellbeing Hub',
      desc: 'Your mental and physical health matter. Access mood tracking, mindfulness exercises, fitness logs, and campus resources.',
      features: ['Mood journal', 'Meditation guides', 'Sleep tracking', 'Campus counseling links'],
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
    },
    {
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      title: 'Career Planning',
      desc: 'Prepare for life after graduation. Explore career paths, set professional goals, and track internship applications.',
      features: ['Career exploration', 'Application tracking', 'Resume builder', 'Interview prep'],
      img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop',
    },
    {
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      title: 'Community & Networking',
      desc: 'Connect with peers, find study partners, and access mentorship. Build your professional network while still in university.',
      features: ['Peer matching', 'Study groups', 'Mentor connections', 'Event discovery'],
      img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
    },
    {
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
      title: 'Study Resources',
      desc: 'Access curated learning materials, note-taking tools, and collaboration features for group projects.',
      features: ['Note templates', 'Resource library', 'Collaboration tools', 'Study guides'],
      img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop',
    },
    {
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      title: 'Progress Analytics',
      desc: 'Visualize your growth across all areas. Track academic performance, skill development, and personal milestones.',
      features: ['Performance dashboards', 'Goal progress', 'Achievement badges', 'Export reports'],
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    },
    {
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
      title: 'Smart Notifications',
      desc: 'Stay on top of everything without feeling overwhelmed. Customizable reminders and intelligent priority alerts.',
      features: ['Custom reminders', 'Priority alerts', 'Email digests', 'Mobile push (coming soon)'],
      img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <GeometricBackground />
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="container mx-auto max-w-container text-center relative z-20 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 text-white"
          >
            <motion.h1
              className="font-heading font-bold text-5xl md:text-7xl leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Features That
              <br />
              <span className="text-accent-light">Empower You</span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Everything you need to excel academically, professionally, and personally—all in one platform.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Feature Modules - Alternating Layout */}
      {modules.map((module, i) => (
        <section key={i} className={`section ${i % 2 === 0 ? 'bg-surface' : 'bg-bg-light'}`}>
          <div className="container mx-auto max-w-container">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div
                variants={staggered}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                className={`${i % 2 === 1 ? 'lg:order-2' : ''} space-y-4`}
              >
                <motion.div
                  variants={item}
                  className="text-accent mb-4"
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  transition={{ duration: 0.25 }}
                >
                  {module.icon}
                </motion.div>
                <motion.h2
                  variants={item}
                  className="text-h2-mobile md:text-h2-desktop font-heading font-bold text-primary"
                >
                  {module.title}
                </motion.h2>
                <motion.p variants={item} className="text-lg text-neutral-mid">{module.desc}</motion.p>
                <motion.ul variants={staggered} className="space-y-2">
                  {module.features.map((feature, j) => (
                    <motion.li key={j} variants={item} className="group flex items-start gap-3">
                      <motion.span
                        className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent"
                        initial={{ scale: 0.8, rotate: -15 }}
                        whileHover={{ scale: 1.15, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        ✓
                      </motion.span>
                      <span className="relative text-neutral-mid">
                        <span>{feature}</span>
                        <motion.span
                          className="absolute left-0 -bottom-1 h-[2px] bg-accent/60"
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.3, ease: modernEase }}
                          style={{ right: 'auto' }}
                        />
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
              <ScrollReveal direction={i % 2 === 1 ? 'left' : 'right'}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className={`relative w-full h-[350px] rounded-2xl overflow-hidden shadow-card will-change-transform ${i % 2 === 1 ? 'lg:order-1' : ''}`}
                  style={{
                    background: i % 2 === 0 ? '#ffffff' : '#f8f9fa',
                  }}
                >
                  {/* Custom animations */}
                  {renderCustomAnimation(i, i % 2 === 0 ? 'bg-surface' : 'bg-bg-light')}
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      ))}

      {/* Summary Grid */}
      <section className="section bg-primary text-white">
        <div className="container mx-auto max-w-container">
          <motion.div
            variants={staggered}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-12"
          >
            <motion.h2 variants={sectionReveal} className="font-heading font-bold mb-4">
              All Features at a Glance
            </motion.h2>
            <motion.p variants={item} className="opacity-90">
              Your complete toolkit for university success
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {modules.map((module, i) => (
              <motion.div
                key={i}
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ scale: 1.08, y: -5 }}
                className="text-center cursor-pointer"
              >
                <motion.div
                  className="mb-2 flex justify-center"
                  whileHover={{ rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  {module.icon}
                </motion.div>
                <div className="text-sm font-medium hover:text-accent transition-colors">{module.title}</div>
              </motion.div>
            ))}
          </div>
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.div whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="inline-block px-8 py-4 rounded-md bg-white text-primary font-semibold shadow-2xl transition-all"
              >
                Get Started Free
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Back to Home Button */}
      <div className="fixed bottom-8 left-8 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-primary shadow-lg hover:bg-white transition-all duration-300 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
        </motion.div>
      </div>
    </>
  )
}
