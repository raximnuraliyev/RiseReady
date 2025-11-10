import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { lazy } from 'react'
import ScrollReveal from '../components/ScrollReveal'

// Defer heavy visual components to reduce initial JS
const RippleBackground = lazy(() => import('../components/backgrounds/RippleBackground'))

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }

  const features = [
    { 
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      title: 'Smart Scheduling', 
      desc: 'Balance your academic and personal commitments with ease', 
      link: '/features' 
    },
    { 
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
      title: 'Skills Development', 
      desc: 'Track and grow your competencies for career success', 
      link: '/features' 
    },
    { 
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: 'Focus Sessions', 
      desc: 'Boost productivity with guided study sessions', 
      link: '/features' 
    },
    { 
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: 'Budget Management', 
      desc: 'Take control of your finances as a student', 
      link: '/features' 
    },
    { 
      icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
      title: 'Wellbeing Hub', 
      desc: 'Maintain physical and mental health throughout your journey', 
      link: '/features' 
    },
  ]

  const howItWorks = [
    { step: '1', title: 'Sign Up Free', desc: 'Create your account in seconds—no credit card required', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg> },
    { step: '2', title: 'Set Your Goals', desc: 'Tell us about your academic and personal objectives', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
    { step: '3', title: 'Track Progress', desc: 'Use our tools to stay on top of your commitments', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { step: '4', title: 'Rise & Thrive', desc: 'Achieve your goals with confidence and clarity', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  ]

  return (
    <>
      {/* Hero Section with Ripple Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <RippleBackground />
        
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20 z-10" />
        
        <div className="container mx-auto max-w-container relative z-20 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
                Get Ready for
                <br />
                <span className="text-accent-light">Your Next Stage</span>
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Navigate your university journey with confidence. All the tools you need in one place.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-accent-light transition-all duration-300 text-center block text-lg"
                  >
                    Start Free
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/features"
                    className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-all duration-300 text-center block text-lg"
                  >
                    Explore Features
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-6 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Value Proposition Section */}
      <section className="section bg-surface relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #0FA4AF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="container mx-auto max-w-container relative z-10">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-6">
              Why Students Choose RiseReady
            </h2>
            <p className="text-neutral-mid text-lg md:text-xl max-w-3xl mx-auto">
              We understand the challenges of student life. Our platform helps you thrive, not just survive.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, 
                title: 'Balance Your Schedule', 
                desc: 'Say goodbye to scheduling conflicts and missed deadlines with our smart calendar system.' 
              },
              { 
                icon: <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>, 
                title: 'Build Your Career Path', 
                desc: 'Track skills, set goals, and prepare for your future career with confidence.' 
              },
              { 
                icon: <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>, 
                title: 'Boost Your Wellbeing', 
                desc: 'Mental and physical health matter. Access resources to stay balanced and energized.' 
              },
            ].map((item, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="relative p-8 rounded-2xl cursor-pointer group overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(15, 164, 175, 0.1) 0%, rgba(175, 221, 229, 0.1) 100%)',
                    }}
                  />
                  
                  <div className="relative z-10 text-center">
                    <motion.div
                      className="text-accent mb-6 flex justify-center"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.div>
                    <h3 className="text-2xl font-heading font-bold text-neutral-dark mb-4 group-hover:text-accent transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-neutral-mid text-lg">{item.desc}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="section bg-bg-light">
        <div className="container mx-auto max-w-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-heading font-bold text-primary mb-4">Powerful Features for Your Success</h2>
            <p className="text-neutral-mid max-w-2xl mx-auto">
              Everything you need to manage your student life effectively, all in one place.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.08 + 0.2, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card group cursor-pointer"
              >
                <motion.div
                  className="text-accent mb-4"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-heading font-semibold text-neutral-dark mb-2 group-hover:text-accent transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-neutral-mid mb-4">{feature.desc}</p>
                <motion.div whileHover={{ x: 5 }}>
                  <Link to={feature.link} className="text-accent font-medium hover:underline inline-flex items-center gap-1">
                    Learn more
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section bg-surface">
        <div className="container mx-auto max-w-container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-heading font-bold text-primary mb-4">How It Works</h2>
            <p className="text-neutral-mid max-w-2xl mx-auto">
              Getting started is simple and takes just a few minutes.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center cursor-pointer"
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent text-white flex items-center justify-center"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-lg font-heading font-semibold text-neutral-dark mb-2 hover:text-accent transition-colors">
                  {step.title}
                </h3>
                <p className="text-neutral-mid text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="section bg-primary text-white">
        <div className="container mx-auto max-w-container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/></svg>
            </div>
            <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
              "RiseReady transformed how I manage my university life. I'm more organized, less stressed, and actually achieving my goals. It's like having a personal coach in my pocket!"
            </blockquote>
            <motion.div
              className="flex items-center justify-center gap-4"
              whileHover={{ scale: 1.05 }}
            >
              {/* Animated avatar shape */}
              <motion.div
                className="relative w-16 h-16 rounded-full border-4 border-white/20 overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(175, 221, 229, 0.8), rgba(15, 164, 175, 0.6))',
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                      'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                      'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>
              <div className="text-left">
                <div className="font-semibold">Sarah M.</div>
                <div className="text-white/80 text-sm">Computer Science Student</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="section bg-gradient-to-r from-accent to-primary">
        <div className="container mx-auto max-w-container">
          <motion.div {...fadeInUp} className="text-center text-white space-y-6">
            <h2 className="font-heading font-bold">Ready to Rise?</h2>
            <p className="text-lg max-w-2xl mx-auto opacity-90">
              Join thousands of students who are taking control of their university experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="px-8 py-4 rounded-md bg-white text-primary font-semibold shadow-2xl transition-all block"
                >
                  Get Started Free
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/contact"
                  className="px-8 py-4 rounded-md border-2 border-white text-white font-semibold hover:bg-white hover:text-primary transition-all block"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
