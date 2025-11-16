import { useEffect, useRef } from 'react'

// Theme #7: Infinite loop of green dots & glowing stripes
export default function GreenDotsStripesBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create dots
    const dotCount = window.innerWidth < 768 ? 30 : 60
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div')
      dot.className = 'absolute rounded-full'
      dot.style.width = dot.style.height = `${Math.random() * 4 + 2}px`
      dot.style.left = `${Math.random() * 100}%`
      dot.style.top = `${Math.random() * 100}%`
      dot.style.backgroundColor = '#FFD500'
      dot.style.opacity = `${Math.random() * 0.5 + 0.3}`
      container.appendChild(dot)

      // Animate dots with vertical wave motion
      const amplitude = 20
      const duration = 15 + Math.random() * 5
      const delay = Math.random() * duration
      dot.animate(
        [
          { transform: 'translateY(0px)' },
          { transform: `translateY(${amplitude}px)` },
          { transform: 'translateY(0px)' }
        ],
        {
          duration: duration * 1000,
          delay: delay * 1000,
          iterations: Infinity,
          easing: 'ease-in-out'
        }
      )
    }

    // Create stripes
    const stripeCount = 5
    for (let i = 0; i < stripeCount; i++) {
      const stripe = document.createElement('div')
      stripe.className = 'absolute w-full h-1'
      stripe.style.top = `${(i * 20) + 10}%`
      stripe.style.background = `linear-gradient(90deg, transparent, rgba(255, 213, 0, 0.3), transparent)`
      stripe.style.opacity = '0.4'
      container.appendChild(stripe)

      // Animate stripes horizontally
      const translateX = -50
      const duration = 30
      stripe.animate(
        [
          { transform: 'translateX(0px)' },
          { transform: `translateX(${translateX}px)` }
        ],
        {
          duration: duration * 1000,
          iterations: Infinity,
          easing: 'linear'
        }
      )
    }

    return () => {
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ zIndex: -1, backgroundColor: '#155332' }}
    />
  )
}

