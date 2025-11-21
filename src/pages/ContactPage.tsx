import { motion } from 'framer-motion'
import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import MeshBackground from '../components/backgrounds/MeshBackground'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.role) newErrors.role = 'Please select your role'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validate()) {
      // In a real app, send data to backend
      console.log('Form submitted:', formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', role: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <MeshBackground />
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
              Get in
              <br />
              <span className="text-accent-light">Touch</span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Have questions, feedback, or need help? We'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section bg-surface">
        <div className="container mx-auto max-w-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div {...fadeInUp} className="space-y-8">
              <div>
                <h2 className="text-2xl font-heading font-bold text-primary mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.2, rotate: 10, backgroundColor: 'rgba(15, 164, 175, 0.2)' }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-neutral-dark mb-1">Email</h3>
                      <motion.a
                        href="mailto:support@riseready.com"
                        className="text-neutral-mid hover:text-accent transition"
                        whileHover={{ x: 3 }}
                      >
                        support@riseready.com
                      </motion.a>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.2, rotate: 10, backgroundColor: 'rgba(15, 164, 175, 0.2)' }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-neutral-dark mb-1">Discord Community</h3>
                      <motion.a
                        href="https://discord.gg/riseready"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-mid hover:text-accent transition"
                        whileHover={{ x: 3 }}
                      >
                        Join our server
                      </motion.a>
                    </div>
                  </motion.div>
                </div>
              </div>
              <div className="pt-6 border-t border-neutral-mid/20">
                <h3 className="font-semibold text-neutral-dark mb-3">Office Hours</h3>
                <p className="text-neutral-mid text-sm">
                  Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                  Saturday - Sunday: Closed
                </p>
                <p className="text-neutral-mid text-sm mt-3">
                  We typically respond within 24 hours on business days.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2, duration: 0.6 }} className="lg:col-span-2">
              <div className="card">
                <h2 className="text-2xl font-heading font-bold text-primary mb-6">Send Us a Message</h2>
                {submitted && (
                  <div className="mb-6 p-4 bg-accent/10 border border-accent rounded-lg text-accent">
                    ✓ Thank you! Your message has been sent. We'll get back to you soon.
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block font-medium text-neutral-dark mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.name ? 'border-red-500' : 'border-neutral-mid/20'
                      } focus:border-accent focus:outline-none transition`}
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-medium text-neutral-dark mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.email ? 'border-red-500' : 'border-neutral-mid/20'
                      } focus:border-accent focus:outline-none transition`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="role" className="block font-medium text-neutral-dark mb-2">
                      I am a *
                    </label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.role ? 'border-red-500' : 'border-neutral-mid/20'
                      } focus:border-accent focus:outline-none transition`}
                    >
                      <option value="">Select your role</option>
                      <option value="student">Student</option>
                      <option value="mentor">Mentor</option>
                      <option value="educator">Educator</option>
                      <option value="parent">Parent</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-medium text-neutral-dark mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.message ? 'border-red-500' : 'border-neutral-mid/20'
                      } focus:border-accent focus:outline-none transition resize-none`}
                      placeholder="Tell us how we can help..."
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                  </div>

                  <motion.button
                    type="submit"
                    className="btn-primary w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
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
