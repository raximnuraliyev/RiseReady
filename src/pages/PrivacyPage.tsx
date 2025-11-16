import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import AuroraBackground from '../components/backgrounds/AuroraBackground'

export default function PrivacyPage() {
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
        <AuroraBackground />
        <div className="absolute inset-0 bg-black/10 z-10" />
        <div className="container mx-auto max-w-container text-center relative z-20">
          <motion.div {...fadeInUp} className="text-white">
            <h1 className="font-heading font-bold text-5xl md:text-6xl mb-4">Privacy Policy</h1>
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
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">1. Introduction</h2>
                <p>
                  Welcome to RiseReady. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-heading font-semibold text-neutral-dark mb-3 mt-6">Personal Information</h3>
                <p>
                  When you create an account, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and email address</li>
                  <li>Profile information (optional)</li>
                  <li>Educational institution (optional)</li>
                </ul>

                <h3 className="text-xl font-heading font-semibold text-neutral-dark mb-3 mt-6">Usage Data</h3>
                <p>
                  We automatically collect:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and features used</li>
                  <li>Time and date of access</li>
                  <li>Referring website addresses</li>
                </ul>

                <h3 className="text-xl font-heading font-semibold text-neutral-dark mb-3 mt-6">User-Generated Content</h3>
                <p>
                  Content you create within the Service, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Calendar events and tasks</li>
                  <li>Budget data and financial records</li>
                  <li>Skills assessments and progress</li>
                  <li>Notes and study materials</li>
                  <li>Community posts and messages</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">3. How We Use Your Information</h2>
                <p>
                  We use your information to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve the Service</li>
                  <li>Personalize your experience</li>
                  <li>Send you service-related communications</li>
                  <li>Respond to your requests and support inquiries</li>
                  <li>Analyze usage patterns and optimize performance</li>
                  <li>Detect and prevent fraud or abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">4. Information Sharing</h2>
                <p>
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> Third parties who help us operate the Service (e.g., hosting, analytics)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
                  <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">5. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Secure data centers and infrastructure</li>
                </ul>
                <p className="mt-4">
                  However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">6. Your Rights</h2>
                <p>
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Export your data in a portable format</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at privacy@riseready.com
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">7. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze usage patterns</li>
                  <li>Improve user experience</li>
                  <li>Provide personalized content</li>
                </ul>
                <p className="mt-4">
                  You can control cookies through your browser settings, but this may affect Service functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">8. Third-Party Services</h2>
                <p>
                  The Service may integrate with third-party services (e.g., Google Calendar). Your use of these services is governed by their respective privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">9. Children's Privacy</h2>
                <p>
                  The Service is not intended for users under 13 years of age. We do not knowingly collect information from children under 13. If you believe we have collected such information, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">10. Data Retention</h2>
                <p>
                  We retain your information for as long as your account is active or as needed to provide the Service. You may request deletion of your account and data at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">11. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes via email or through the Service. Your continued use after such changes constitutes acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">12. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <p className="mt-4">
                  Email: privacy@riseready.com<br />
                  Website: <a href="/contact" className="text-accent hover:underline">Contact Page</a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>

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
