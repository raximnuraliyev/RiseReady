import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ParticleBackground from '../components/backgrounds/ParticleBackground'

export default function TermsPage() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 bg-black/10 z-10" />
        <div className="container mx-auto max-w-container text-center relative z-20">
          <motion.div {...fadeInUp} className="text-white">
            <h1 className="font-heading font-bold text-5xl md:text-6xl mb-4">Terms & Conditions</h1>
            <p className="text-lg md:text-xl">Last updated: January 3, 2025</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section bg-surface">
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeInUp} className="prose prose-lg max-w-none">
            <div className="space-y-8 text-neutral-mid">
              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using RiseReady ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">2. Description of Service</h2>
                <p>
                  RiseReady provides students with tools and resources to manage their academic, financial, and personal development. The Service includes but is not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Smart calendar and scheduling tools</li>
                  <li>Skills tracking and development resources</li>
                  <li>Focus and productivity features</li>
                  <li>Budget management tools</li>
                  <li>Wellbeing and mental health resources</li>
                  <li>Career planning features</li>
                  <li>Community and networking capabilities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">3. User Accounts</h2>
                <p>
                  To use certain features of the Service, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Be responsible for all activities that occur under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">4. User Conduct</h2>
                <p>
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on the rights of others</li>
                  <li>Transmit harmful, offensive, or inappropriate content</li>
                  <li>Attempt to gain unauthorized access to any portion of the Service</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Use automated systems to access the Service without permission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">5. Intellectual Property</h2>
                <p>
                  The Service and its original content, features, and functionality are owned by RiseReady and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p className="mt-4">
                  You retain ownership of any content you create and upload to the Service. By uploading content, you grant RiseReady a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content as necessary to provide the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">6. Free and Premium Services</h2>
                <p>
                  RiseReady offers both free and premium services. Core features are provided free of charge. Premium features, when available, require a paid subscription. We reserve the right to modify pricing and features at any time with reasonable notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">7. Termination</h2>
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
                </p>
                <p className="mt-4">
                  You may terminate your account at any time through your account settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">8. Disclaimer of Warranties</h2>
                <p>
                  The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the Service will be uninterrupted, timely, secure, or error-free.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">9. Limitation of Liability</h2>
                <p>
                  In no event shall RiseReady be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">10. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">11. Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p className="mt-4">
                  Email: legal@riseready.com<br />
                  Website: <a href="/contact" className="text-accent hover:underline">Contact Page</a>
                </p>
              </section>
            </div>
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

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-accent text-white rounded-full shadow-lg hover:scale-110 transition-all z-40"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  )
}
