import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

// Helper function to safely extract user data
function safeUser(u) {
  const { 
    _id, 
    email, 
    name, 
    role, 
    avatarUrl, 
    pronouns, 
    major, 
    year, 
    university, 
    bio, 
    linkedin, 
    github, 
    discord, 
    telegram,
    progress
  } = u
  
  return { 
    id: String(_id), 
    email, 
    name: name || '', 
    role: role || 'user',
    avatarUrl: avatarUrl || '',
    pronouns: pronouns || '',
    major: major || '',
    year: year || '',
    university: university || '',
    bio: bio || '',
    linkedin: linkedin || '',
    github: github || '',
    discord: discord || '',
    telegram: telegram || '',
    progress: progress || {
      level: 1,
      xp: 0,
      streakDays: 0,
      lastActive: new Date()
    }
  }
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Sign up new user
export async function signup(req, res) {
  try {
    const { email, password, name } = req.body

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Check if user exists
    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' })
    }

    // Create user with progress tracking
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({
      email,
      passwordHash,
      name,
      // Ensure new accounts are created as 'student'
      role: 'student',
      progress: {
        level: 1,
        xp: 0,
        streakDays: 0,
        lastActive: new Date()
      }
    })

    // Generate token
    const token = jwt.sign(
      { 
        sub: String(user._id), 
        role: user.role 
      }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, user: safeUser(user) })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Failed to create account' })
  }
}

// Login user
export async function login(req, res) {
  try {
    const { email, password } = req.body

    console.log('Login attempt for email:', email) // Debug log

    // Validate required fields
    if (!email || !password) {
      console.log('Missing email or password') // Debug log
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      console.log('User not found:', email) // Debug log
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      console.log('Invalid password for user:', email) // Debug log
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Update last active time
    user.progress = {
      ...user.progress,
      lastActive: new Date()
    }
    await user.save()

    // Generate token
    const token = jwt.sign(
      { 
        sub: String(user._id), 
        role: user.role 
      }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.json({ token, user: safeUser(user) })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Failed to login' })
  }
}

// Get current user
export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ user: safeUser(user) })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({ error: 'Failed to get user data' })
  }
}
