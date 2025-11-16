import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface Props {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  delay?: number
  duration?: number
  className?: string
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
}: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const variants = {
    up: { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -60 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 } },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  }

  const selected = variants[direction]

  return (
    <motion.div
      ref={ref}
      initial={selected.initial}
      animate={isInView ? selected.animate : selected.initial}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
