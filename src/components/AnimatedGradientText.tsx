import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export default function AnimatedGradientText({ children, className = '' }: Props) {
  return (
    <motion.span
      className={`bg-clip-text text-transparent bg-gradient-to-r ${className}`}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundImage: 'linear-gradient(90deg, #0FA4AF, #AFDDE5, #0FA4AF, #024950)',
        backgroundSize: '200% 100%',
      }}
    >
      {children}
    </motion.span>
  )
}
