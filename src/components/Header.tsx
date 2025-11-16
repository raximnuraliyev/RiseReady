import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll } from 'framer-motion'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setScrolled(latest > 50)
    })
  }, [scrollY])

  const navLinks = [
    ['/', 'Home'],
    ['/about', 'About'],
    ['/features', 'Features'],
    ['/pricing', 'Pricing'],
    ['/faq', 'FAQ'],
    ['/contact', 'Contact'],
  ]

  // Prefetch route chunks on hover to speed up navigation
  const prefetch: Record<string, () => void> = {
    '/': () => import('../pages/HomePage'),
    '/about': () => import('../pages/AboutPage'),
    '/features': () => import('../pages/FeaturesPage'),
    '/pricing': () => import('../pages/PricingPage'),
    '/faq': () => import('../pages/FAQPage'),
    '/contact': () => import('../pages/ContactPage'),
    '/terms': () => import('../pages/TermsPage'),
    '/privacy': () => import('../pages/PrivacyPage'),
    '/login': () => import('../pages/LoginPage'),
    '/signup': () => import('../pages/SignupPage'),
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        initial={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
        animate={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid rgba(15, 164, 175, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container mx-auto max-w-container">
          <div className="flex items-center justify-between py-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="text-2xl font-bold font-heading transition-colors duration-300"
                style={{ color: scrolled ? '#003135' : '#FFFFFF' }}
              >
                RiseReady
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(([to, label]) => (
                <motion.div key={to} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                  <NavLink
                    to={to}
                    onMouseEnter={() => prefetch[to as string]?.()}
                    className={({ isActive }) =>
                      `font-semibold transition-all duration-300 relative ${
                        isActive ? 'text-accent' : scrolled ? 'text-neutral-mid hover:text-accent' : 'text-white hover:text-accent-light'
                      }`
                    }
                  >
                    {label}
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </NavLink>
                </motion.div>
              ))}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md border border-accent text-accent hover:bg-accent hover:text-white transition-all duration-300"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md bg-accent text-white hover:brightness-110 hover:shadow-button-hover transition-all duration-300"
                >
                  Sign Up
                </Link>
              </motion.div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-dark hover:text-accent transition"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-neutral-dark/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-surface shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xl font-bold font-heading text-primary">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-neutral-dark hover:text-accent transition"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <nav className="flex flex-col gap-4">
                  {navLinks.map(([to, label]) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-md text-lg transition ${
                          isActive
                            ? 'bg-accent/10 text-accent font-semibold'
                            : 'text-neutral-dark hover:bg-neutral-mid/10'
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                  <div className="border-t border-neutral-mid/20 my-2" />
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-md border border-accent text-accent text-center hover:bg-accent hover:text-white transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-md bg-accent text-white text-center hover:scale-105 transition"
                  >
                    Sign Up
                  </Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
