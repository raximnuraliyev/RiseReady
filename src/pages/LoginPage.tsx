import { motion } from 'framer-motion'
import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HexagonBackground from '../components/backgrounds/HexagonBackground'
import ApiClient from '../utils/apiClient'

export default function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.password) newErrors.password = 'Password is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    setErrors({})
    try {
      const data = await ApiClient.post('/auth/login', { email: formData.email.trim(), password: formData.password })
      if (!data || !(data as any).token) throw new Error((data as any)?.error || 'Login failed')
      // Store authentication data
      localStorage.setItem('token', (data as any).token)
      localStorage.setItem('user', JSON.stringify((data as any).user))
      // Force a page reload to ensure all authentication states are updated
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setErrors({ email: ' ', password: message || 'Login failed' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 overflow-hidden">
      <HexagonBackground />
      <div className="absolute inset-0 bg-black/30 z-10" />
      <motion.div
        className="relative z-20 w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-center border border-white/20">
          {/* Animated Logo Shape */}
          <motion.div
            className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent" />
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${35 + i * 18}px`,
                  height: `${35 + i * 18}px`,
                  background: `rgba(255, 255, 255, ${0.3 - i * 0.08})`,
                  left: `${i * 12}%`,
                  top: `${i * 18}%`,
                }}
                animate={{
                  x: [0, 20, 0],
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
            <svg className="absolute inset-0 w-12 h-12 m-auto text-white z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </motion.div>

          <h1 className="text-4xl font-heading font-bold text-primary mb-3">Welcome Back</h1>
          <p className="text-neutral-mid mb-10 text-lg">Log in to continue your journey</p>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label htmlFor="email" className="block font-semibold text-neutral-dark mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-5 py-4 rounded-xl border-2 ${
                  errors.email ? 'border-red-500' : 'border-neutral-mid/20'
                } focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition bg-white`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block font-semibold text-neutral-dark mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-5 py-4 rounded-xl border-2 ${
                  errors.password ? 'border-red-500' : 'border-neutral-mid/20'
                } focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition bg-white`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-mid/30 text-accent focus:ring-accent" />
                <span className="text-neutral-mid">Remember me</span>
              </label>
              <a href="#" className="text-accent hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-mid/20">
            <p className="text-neutral-mid text-sm">
              Don't have an account?{' '}
              <motion.span whileHover={{ x: 3 }} className="inline-block">
                <Link to="/signup" className="text-accent hover:underline font-semibold">
                  Sign up for free
                </Link>
              </motion.span>
            </p>
          </div>

          <div className="mt-6 text-xs text-neutral-mid">
            By logging in, you agree to our{' '}
            <Link to="/terms" className="text-accent hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
