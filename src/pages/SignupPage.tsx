import { motion } from 'framer-motion'
import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConstellationBackground from '../components/backgrounds/ConstellationBackground'
import ApiClient from '../utils/apiClient'

export default function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    setApiError(null)
    try {
      const data = await ApiClient.post('/auth/signup', { name: formData.name.trim(), email: formData.email.trim(), password: formData.password })
      if (!data || !(data as any).token) throw new Error((data as any)?.error || 'Signup failed')
      localStorage.setItem('token', (data as any).token)
      localStorage.setItem('user', JSON.stringify((data as any).user))
      localStorage.setItem('isLoggedIn', 'true')
      navigate('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setApiError(message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 overflow-hidden">
      <ConstellationBackground />
      <div className="absolute inset-0 bg-black/30 z-10" />
      <motion.div
        className="relative z-20 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl text-center border border-white/20">
          {/* Animated Logo Shape */}
          <motion.div
            className="relative w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden shadow-xl"
            whileHover={{ scale: 1.05, rotate: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-light" />
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: `${20 + i * 12}px`,
                  height: `${20 + i * 12}px`,
                  background: `rgba(255, 255, 255, ${0.4 - i * 0.08})`,
                  borderRadius: '50%',
                  left: `${i * 12}%`,
                  top: `${i * 15}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
            <svg className="absolute inset-0 w-10 h-10 m-auto text-white z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </motion.div>

          <h1 className="text-2xl font-heading font-bold text-primary mb-1">Join RiseReady</h1>
          <p className="text-neutral-mid mb-4 text-xs">Start your journey to success today</p>

          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            {apiError && <div className="p-2 rounded-lg bg-red-50 text-red-700 text-xs">{apiError}</div>}
            <div>
              <label htmlFor="name" className="block font-semibold text-neutral-dark mb-1 text-xs">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.name ? 'border-red-500' : 'border-neutral-mid/20'
                } focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20 transition bg-white text-sm`}
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block font-semibold text-neutral-dark mb-1 text-xs">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-neutral-mid/20'
                } focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20 transition bg-white text-sm`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block font-semibold text-neutral-dark mb-1 text-xs">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-neutral-mid/20'
                } focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20 transition bg-white text-sm`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block font-semibold text-neutral-dark mb-1 text-xs">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-neutral-mid/20'
                } focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20 transition bg-white text-sm`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 mt-1 rounded border-neutral-mid/30 text-accent focus:ring-accent"
              />
              <label htmlFor="terms" className="text-sm text-neutral-mid">
                I agree to the{' '}
                <Link to="/terms" className="text-accent hover:underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-4 pt-4 border-t border-neutral-mid/20">
            <p className="text-neutral-mid text-xs">
              Already have an account?{' '}
              <motion.span whileHover={{ x: 3 }} className="inline-block">
                <Link to="/login" className="text-accent hover:underline font-semibold">
                  Log in
                </Link>
              </motion.span>
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 border-t border-neutral-mid/20"></div>
            <span className="text-xs text-neutral-mid">100% Free Forever</span>
            <div className="flex-1 border-t border-neutral-mid/20"></div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
