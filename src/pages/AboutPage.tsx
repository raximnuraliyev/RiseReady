import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import BlobBackground from '../components/backgrounds/BlobBackground'
import ScrollReveal from '../components/ScrollReveal'

export default function AboutPage() {
  // Modern motion presets
  const modernEase = [0.16, 1, 0.3, 1]
  const sectionReveal = {
    hidden: { opacity: 0, y: 32 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: modernEase }
    },
  }
  const staggered = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  }
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: modernEase } },
  }
  // (fadeInUp preset removed — not used in this page)

  const modules = [
    { icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, title: 'Smart Calendar', desc: 'Manage classes, assignments, and events' },
    { icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>, title: 'Skills Tracker', desc: 'Build and track your competencies' },
    { icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Focus Sessions', desc: 'Pomodoro-based productivity sessions' },
    { icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Budget Manager', desc: 'Track income, expenses, and savings' },
    { icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>, title: 'Wellbeing Hub', desc: 'Mental and physical health resources' },
    { icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, title: 'Career Builder', desc: 'Plan your career path and goals' },
    { icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, title: 'Community', desc: 'Connect with peers and mentors' },
    { icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, title: 'Study Resources', desc: 'Access curated learning materials' },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <BlobBackground />
        <div className="absolute inset-0 bg-black/20 z-10" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 text-center text-white px-4"
        >
          <motion.h1
            className="font-heading font-bold mb-6 text-5xl md:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Why RiseReady
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We're on a mission to empower students to thrive in their university journey
          </motion.p>
        </motion.div>
      </section>

      {/* Purpose Section */}
      <section className="section bg-surface">
        <div className="container mx-auto max-w-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy with modern stagger & gradient headline */}
            <motion.div
              variants={staggered}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.h2
                variants={sectionReveal}
                className="font-heading font-bold text-primary mb-2"
              >
                <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#003135,40%,#0FA4AF,60%,#AFDDE5)] bg-[length:200%_100%] inline-block">
                  Our Purpose
                </span>
              </motion.h2>
              <motion.div
                variants={item}
                className="h-1 w-24 bg-gradient-to-r from-accent to-accent-light rounded-full mb-6"
              />
              <div className="space-y-4 text-neutral-mid">
                <motion.p variants={item} className="text-lg">
                  University life is exciting but overwhelming. Between classes, assignments, social commitments, finances, and planning for the future, students face unique challenges that traditional tools don't address.
                </motion.p>
                <motion.p variants={item} className="text-lg">
                  RiseReady was born from the experience of students who struggled to balance it all. We built a platform that brings together everything you need to not just survive university, but truly thrive.
                </motion.p>
                <motion.ul variants={staggered} className="space-y-3 mt-6">
                  {[
                    'All-in-one platform for student success',
                    'Evidence-based productivity techniques',
                    'Holistic approach to academic and personal growth',
                    'Free for all students, forever',
                  ].map((text, i) => (
                    <motion.li key={i} variants={item} className="group flex items-start gap-3">
                      <motion.span
                        className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent"
                        initial={{ scale: 0.8, rotate: -15 }}
                        whileHover={{ scale: 1.15, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        ✓
                      </motion.span>
                      <span className="relative">
                        <span>{text}</span>
                        <motion.span
                          className="absolute left-0 -bottom-1 h-[2px] bg-accent/60"
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.35, ease: modernEase }}
                          style={{ right: 'auto' }}
                        />
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>

            {/* Right: 3D Saturn/Black Hole Animation */}
            <ScrollReveal direction="right">
              <motion.div
                whileHover={{ rotateX: -5, rotateY: 8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-white shadow-card will-change-transform"
                style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
              >
                {/* Central Black Hole Core */}
                <motion.div
                  className="absolute inset-0 m-auto w-32 h-32 rounded-full z-20"
                  style={{
                    background: 'radial-gradient(circle, #003135 0%, #0FA4AF 40%, transparent 70%)',
                    boxShadow: '0 0 60px rgba(15, 164, 175, 0.6), inset 0 0 40px rgba(0, 49, 53, 0.8)',
                  }}
                  animate={{
                    scale: [1, 1.08, 1],
                    boxShadow: [
                      '0 0 60px rgba(15, 164, 175, 0.6), inset 0 0 40px rgba(0, 49, 53, 0.8)',
                      '0 0 80px rgba(15, 164, 175, 0.8), inset 0 0 50px rgba(0, 49, 53, 0.9)',
                      '0 0 60px rgba(15, 164, 175, 0.6), inset 0 0 40px rgba(0, 49, 53, 0.8)',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Saturn Rings - Multiple Layers */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 m-auto"
                    style={{
                      width: `${150 + i * 60}px`,
                      height: `${60 + i * 25}px`,
                      border: `${3 - i * 0.4}px solid rgba(15, 164, 175, ${0.4 - i * 0.06})`,
                      borderRadius: '50%',
                      transform: `rotateX(75deg) translateZ(${-20 + i * 10}px)`,
                      transformStyle: 'preserve-3d',
                    }}
                    animate={{
                      rotateZ: 360,
                      opacity: [0.3 + i * 0.1, 0.5 + i * 0.1, 0.3 + i * 0.1],
                    }}
                    transition={{
                      rotateZ: { duration: 20 + i * 5, repeat: Infinity, ease: 'linear' },
                      opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 },
                    }}
                  />
                ))}

                {/* Accretion Disk Particles */}
                {[...Array(30)].map((_, i) => {
                  const angle = (i * 360) / 30
                  const radius = 100 + Math.random() * 80
                  const size = 2 + Math.random() * 4
                  return (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        background: i % 3 === 0 ? '#0FA4AF' : i % 3 === 1 ? '#AFDDE5' : '#003135',
                        left: '50%',
                        top: '50%',
                        boxShadow: `0 0 ${size * 2}px rgba(15, 164, 175, 0.6)`,
                      }}
                      animate={{
                        x: [
                          Math.cos((angle * Math.PI) / 180) * radius,
                          Math.cos(((angle + 180) * Math.PI) / 180) * radius,
                          Math.cos((angle * Math.PI) / 180) * radius,
                        ],
                        y: [
                          Math.sin((angle * Math.PI) / 180) * radius * 0.3,
                          Math.sin(((angle + 180) * Math.PI) / 180) * radius * 0.3,
                          Math.sin((angle * Math.PI) / 180) * radius * 0.3,
                        ],
                        opacity: [0.8, 0.3, 0.8],
                        scale: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.1,
                      }}
                    />
                  )
                })}

                {/* Gravitational Wave Effect */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`wave-${i}`}
                    className="absolute inset-0 m-auto rounded-full border-2"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderColor: `rgba(15, 164, 175, ${0.4 - i * 0.08})`,
                    }}
                    animate={{
                      width: ['80px', `${300 + i * 50}px`],
                      height: ['80px', `${300 + i * 50}px`],
                      opacity: [0.6, 0],
                      borderWidth: ['2px', '0px'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeOut',
                      delay: i * 0.7,
                    }}
                  />
                ))}

                {/* Background Starfield */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={`star-${i}`}
                    className="absolute w-1 h-1 bg-accent rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0.2, 0.8, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="section bg-bg-light">
        <div className="container mx-auto max-w-container">
          <ScrollReveal direction="up" className="text-center mb-12">
            <h2 className="font-heading font-bold text-primary mb-4">What We Offer</h2>
            <p className="text-neutral-mid max-w-2xl mx-auto">
              A comprehensive suite of tools designed specifically for university students
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="card text-center cursor-pointer group"
                >
                <motion.div
                  className="text-accent mb-3 flex justify-center"
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {module.icon}
                </motion.div>
                <h3 className="font-heading font-semibold text-neutral-dark mb-2 group-hover:text-accent transition-colors duration-300">
                  {module.title}
                </h3>
                  <p className="text-sm text-neutral-mid">{module.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Student Stories Section */}
      <section className="section bg-surface">
        <div className="container mx-auto max-w-container">
          <ScrollReveal direction="up" className="text-center mb-12">
            <h2 className="font-heading font-bold text-primary mb-4">Student Stories</h2>
            <p className="text-neutral-mid max-w-2xl mx-auto">
              Hear from students who are thriving with RiseReady
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Alex K.', role: 'Engineering Student', quote: 'The focus sessions helped me ace my finals. I went from struggling to thriving!' },
              { name: 'Maria S.', role: 'Business Major', quote: 'Budgeting was my nightmare. Now I actually save money every month thanks to RiseReady.' },
              { name: 'James T.', role: 'Arts Student', quote: 'The career planning tools gave me clarity on my future. I feel confident about my path now.' },
            ].map((story, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card cursor-pointer group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {/* Animated avatar shape */}
                    <motion.div
                      className="w-16 h-16 rounded-full border-2 border-transparent group-hover:border-accent transition-colors duration-300"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        background: `linear-gradient(135deg, ${
                          i % 3 === 0 ? 'rgba(15, 164, 175, 0.7), rgba(175, 221, 229, 0.5)' :
                          i % 3 === 1 ? 'rgba(175, 221, 229, 0.7), rgba(0, 49, 53, 0.5)' :
                          'rgba(0, 49, 53, 0.7), rgba(15, 164, 175, 0.5)'
                        })`,
                      }}
                    />
                    <div>
                      <div className="font-semibold text-neutral-dark group-hover:text-accent transition-colors duration-300">
                        {story.name}
                      </div>
                      <div className="text-sm text-neutral-mid">{story.role}</div>
                    </div>
                  </div>
                  <p className="text-neutral-mid italic">"{story.quote}"</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section bg-gradient-to-r from-accent to-primary">
        <div className="container mx-auto max-w-container">
          <ScrollReveal direction="up">
            <div className="text-center text-white space-y-6">
              <h2 className="font-heading font-bold">Join Our Community</h2>
              <p className="text-lg max-w-2xl mx-auto opacity-90">
                Start your journey to academic success and personal growth today
              </p>
              <motion.div whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="inline-block px-8 py-4 rounded-md bg-white text-primary font-semibold shadow-2xl transition-all"
                >
                  Get Started Free
                </Link>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
