import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import DotsBackground from '../components/backgrounds/DotsBackground'

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        { q: 'How do I create an account?', a: 'Click "Sign Up" in the header, enter your email and create a password. You\'ll receive a confirmation email to activate your account.' },
        { q: 'Is RiseReady really free?', a: 'Yes! All core features are completely free for students forever. We may offer optional premium features in the future, but the essential tools will always be free.' },
        { q: 'Do I need a credit card to sign up?', a: 'No credit card required! Just your email address to get started.' },
      ],
    },
    {
      category: 'Features',
      questions: [
        { q: 'Can I sync my Google Calendar?', a: 'Yes, our Smart Calendar can integrate with Google Calendar to show all your events in one place.' },
        { q: 'How does the budget tracker work?', a: 'Enter your income sources and expenses by category. The system automatically calculates your balance and shows spending trends over time.' },
        { q: 'What is a Pomodoro session?', a: 'Pomodoro is a time management technique: work for 25 minutes, take a 5-minute break. Our Focus tool guides you through these sessions with timers and ambient sounds.' },
        { q: 'Can I track multiple skills at once?', a: 'Absolutely! Add as many skills as you want to track. Organize them by categories like Technical, Soft Skills, or Academic.' },
      ],
    },
    {
      category: 'Privacy & Security',
      questions: [
        { q: 'Is my data secure?', a: 'Yes. We use industry-standard encryption and never share your personal data with third parties. Read our Privacy Policy for details.' },
        { q: 'Can I export my data?', a: 'Yes, you can export your data at any time from your account settings in standard formats like CSV and JSON.' },
        { q: 'Can I delete my account?', a: 'Yes, you can permanently delete your account and all associated data from your account settings.' },
      ],
    },
    {
      category: 'Technical Support',
      questions: [
        { q: 'What browsers are supported?', a: 'RiseReady works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.' },
        { q: 'Is there a mobile app?', a: 'Not yet, but our website is fully responsive and works great on mobile browsers. A native app is on our roadmap!' },
        { q: 'I found a bug. How do I report it?', a: 'Please use the Contact page to report bugs. Include details about what happened and what browser you\'re using.' },
      ],
    },
    {
      category: 'Account Management',
      questions: [
        { q: 'Can I change my email address?', a: 'Yes, you can update your email from your account settings. You\'ll need to verify the new email address.' },
        { q: 'I forgot my password. What do I do?', a: 'Click "Forgot Password" on the login page. Enter your email and we\'ll send you a reset link.' },
        { q: 'Can I have multiple accounts?', a: 'We recommend using one account per person, but you can create separate accounts with different email addresses if needed.' },
      ],
    },
  ]

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0)

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <DotsBackground />
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
              Frequently Asked
              <br />
              <span className="text-accent-light">Questions</span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Find answers to common questions about RiseReady
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="section bg-surface">
        <div className="container mx-auto max-w-container">
          <motion.div {...fadeInUp} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-lg border-2 border-neutral-mid/20 focus:border-accent focus:outline-none transition"
              />
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-mid"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section bg-bg-light">
        <div className="container mx-auto max-w-container">
          <div className="max-w-4xl mx-auto space-y-12">
            {filteredFAQs.map((category, catIndex) => (
              <div key={catIndex}>
                <motion.h2
                  {...fadeInUp}
                  className="text-2xl font-heading font-bold text-primary mb-6"
                >
                  {category.category}
                </motion.h2>
                <div className="space-y-4">
                  {category.questions.map((faq, qIndex) => {
                    const globalIndex = catIndex * 100 + qIndex
                    const isOpen = openIndex === globalIndex
                    return (
                      <motion.div
                        key={qIndex}
                        {...fadeInUp}
                        transition={{ delay: qIndex * 0.05 + 0.1, duration: 0.4 }}
                        className="bg-surface rounded-lg shadow-card overflow-hidden"
                      >
                        <motion.button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          whileHover={{ backgroundColor: 'rgba(15, 164, 175, 0.05)' }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full px-6 py-5 flex items-center justify-between text-left transition"
                        >
                          <span className="font-heading font-semibold text-neutral-dark pr-4 hover:text-accent transition-colors">
                            {faq.q}
                          </span>
                          <motion.svg
                            className="w-5 h-5 text-accent flex-shrink-0"
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.2 }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        </motion.button>
                        {isOpen && (
                          <div className="px-6 pb-5 text-neutral-mid border-t border-neutral-mid/10 pt-4">
                            {faq.a}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
            {filteredFAQs.length === 0 && (
              <motion.div {...fadeInUp} className="text-center py-12">
                <p className="text-neutral-mid text-lg">No results found for "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-accent font-medium hover:underline"
                >
                  Clear search
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="section bg-surface">
        <div className="container mx-auto max-w-container">
          <motion.div {...fadeInUp} className="text-center space-y-6">
            <h2 className="font-heading font-bold text-primary">Still Have Questions?</h2>
            <p className="text-neutral-mid max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <motion.div whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact" className="btn-primary inline-block">
                Contact Support
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
