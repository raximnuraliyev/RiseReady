import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import opportunitiesRoutes from './routes/opportunities.js'
import internshipRoutes from './routes/internships.js'
import calendarRoutes from './routes/calendar.js'
import notificationRoutes from './routes/notifications.js'
import skillsRoutes from './routes/skills.js'
import budgetRoutes from './routes/budget.js'
import checkInsRoutes from './routes/checkIns.js'
import focusRoutes from './routes/focus.js'
import careerRoutes from './routes/career.js'
import progressRoutes from './routes/progress.js'
import projectsRoutes from './routes/projects.js'
import communityRoutes from './routes/community.js'
import dashboardRoutes from './routes/dashboard.js'
import wellbeingRoutes from './routes/wellbeing.js'
import botsRoutes from './routes/bots.js'
import telegramRoutes from './routes/telegram.js'

import { notFound, errorHandler } from './middleware/error.js'

const app = express()

// Core middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:*"], // Allow local development
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      fontSrc: ["'self'", "data:", "https:"]
    }
  }
}))

// CORS configuration
// Development-only CORS configuration
const corsOptions = {
  origin: true,  
  // origin: 'http://10.30.2.76:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'Accept',
  ],
  exposedHeaders: ['Content-Length', 'Authorization'],
  maxAge: 86400, // 24 hours
}

// Enable CORS for all routes
app.use(cors(corsOptions))

// Handle preflight requests using the cors middleware so we don't hardcode a single origin.
// This will reflect the request Origin and honor the corsOptions (credentials, headers, methods, etc.).
app.options('*', cors(corsOptions))

app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

// Basic rate limiting (tune as needed)
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 })
app.use(limiter)

// Routes (versioned)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/opportunities', opportunitiesRoutes)
app.use('/api/internships', internshipRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/skills', skillsRoutes)
app.use('/api/budget', budgetRoutes)
app.use('/api/checkins', checkInsRoutes)
app.use('/api/focus', focusRoutes)
app.use('/api/career', careerRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/wellbeing', wellbeingRoutes)
app.use('/api/bots', botsRoutes)
app.use('/api/bots', telegramRoutes)

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Error handling
app.use(notFound)
app.use(errorHandler)

export default app
