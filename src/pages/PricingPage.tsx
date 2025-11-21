import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SpiralBackground from '../components/backgrounds/SpiralBackground'
import ScrollReveal from '../components/ScrollReveal'

export default function PricingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }

  const features = [
    { name: 'Smart Calendar & Scheduling', free: true, premium: true },
    { name: 'Skills Tracker', free: true, premium: true },
    { name: 'Focus & Pomodoro Sessions', free: true, premium: true },
    { name: 'Budget Manager', free: true, premium: true },
    { name: 'Wellbeing Hub', free: true, premium: true },
    { name: 'Career Planning', free: true, premium: true },
    { name: 'Community Access', free: true, premium: true },
    { name: 'Study Resources', free: true, premium: true },
    { name: 'Progress Analytics', free: 'Basic', premium: 'Advanced' },
    { name: 'Cloud Storage', free: '1 GB', premium: '50 GB' },
    { name: 'Priority Support', free: false, premium: true },
    { name: 'AI Study Assistant', free: false, premium: 'Coming Soon' },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <SpiralBackground />
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
              Choose Your
              <br />
              <span className="text-accent-light">Plan</span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Start with our free plan and upgrade when you need more. All students get lifetime access to core features.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section bg-surface">
        <div className="container mx-auto max-w-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <ScrollReveal direction="up">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass border-2 border-white/30 cursor-pointer p-8 rounded-2xl"
              >
              <div className="text-center mb-6">
                <div className="mb-3 flex justify-center">
                  <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                </div>
                <h3 className="text-2xl font-heading font-bold text-neutral-dark mb-2">Free Forever</h3>
                <div className="text-4xl font-bold text-primary mb-2">$0</div>
                <p className="text-neutral-mid">Perfect for getting started</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-neutral-mid">All core features included</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-neutral-mid">Unlimited usage</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-neutral-mid">Community support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-neutral-mid">1 GB cloud storage</span>
                </li>
              </ul>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup" className="btn-secondary w-full text-center block">
                  Start Free
                </Link>
              </motion.div>
              </motion.div>
            </ScrollReveal>

            {/* Premium Plan */}
            <ScrollReveal direction="up" delay={0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass border-2 border-accent relative cursor-pointer p-8 rounded-2xl"
              >
              <div className="absolute top-0 right-0 bg-highlight text-white px-4 py-1 text-sm font-semibold rounded-bl-lg rounded-tr-lg">
                Coming Soon
              </div>
              <div className="text-center mb-6 mt-4">
                <div className="mb-3 flex justify-center">
                  <svg className="w-16 h-16 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-2xl font-heading font-bold text-neutral-dark mb-2">Premium</h3>
                <div className="text-4xl font-bold text-accent mb-2">
                  $9<span className="text-lg">/month</span>
                </div>
                <p className="text-neutral-mid">Advanced features for power users</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-neutral-mid">Everything in Free</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-neutral-mid">Advanced analytics & insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-neutral-mid">50 GB cloud storage</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-neutral-mid">Priority email support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-neutral-mid">AI Study Assistant (soon)</span>
                </li>
              </ul>
                <button disabled className="btn-primary w-full opacity-50 cursor-not-allowed">
                  Coming Soon
                </button>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="section bg-bg-light">
        <div className="container mx-auto max-w-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-heading font-bold text-primary mb-4">Feature Comparison</h2>
            <p className="text-neutral-mid">See what's included in each plan</p>
          </motion.div>
          <motion.div {...fadeInUp} className="bg-surface rounded-2xl shadow-card p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-neutral-mid/20">
                  <th className="text-left py-4 px-4 font-heading font-semibold text-neutral-dark">Feature</th>
                  <th className="text-center py-4 px-4 font-heading font-semibold text-neutral-dark">Free</th>
                  <th className="text-center py-4 px-4 font-heading font-semibold text-accent">Premium</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr key={i} className="border-b border-neutral-mid/10">
                    <td className="py-4 px-4 text-neutral-mid">{feature.name}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <span className="text-accent text-xl">✓</span>
                        ) : (
                          <span className="text-neutral-mid/30">—</span>
                        )
                      ) : (
                        <span className="text-neutral-dark text-sm">{feature.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.premium === 'boolean' ? (
                        feature.premium ? (
                          <span className="text-accent text-xl">✓</span>
                        ) : (
                          <span className="text-neutral-mid/30">—</span>
                        )
                      ) : (
                        <span className="text-accent text-sm font-medium">{feature.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* FAQ About Pricing */}
      <section className="section bg-surface">
        <div className="container mx-auto max-w-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-heading font-bold text-primary mb-4">Pricing FAQs</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { q: 'Is the free plan really free forever?', a: 'Yes! All core features will always be free for students. We believe everyone deserves access to tools that help them succeed.' },
              { q: 'When will Premium be available?', a: 'We\'re currently perfecting our Premium features and plan to launch them in the coming months. Sign up for free now to get early access!' },
              { q: 'Can I cancel Premium anytime?', a: 'Absolutely. When Premium launches, you can cancel anytime and revert to the free plan with no loss of your data.' },
              { q: 'Are there student discounts?', a: 'The entire platform is designed for students with student-friendly pricing. Plus, our free plan has everything most students need!' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="card cursor-pointer group"
              >
                <h3 className="font-heading font-semibold text-neutral-dark mb-2 group-hover:text-accent transition-colors duration-300">
                  {faq.q}
                </h3>
                <p className="text-neutral-mid">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-r from-accent to-primary">
        <div className="container mx-auto max-w-container">
          <motion.div {...fadeInUp} className="text-center text-white space-y-6">
            <h2 className="font-heading font-bold">Ready to Get Started?</h2>
            <p className="text-lg opacity-90">Join thousands of students succeeding with RiseReady</p>
            <Link
              to="/signup"
              className="inline-block px-8 py-4 rounded-md bg-white text-primary font-semibold hover:scale-105 hover:shadow-2xl transition-all"
            >
              Sign Up Free
            </Link>
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
