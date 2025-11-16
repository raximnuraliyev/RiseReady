import express from 'express'
import {
  getOrCreateSession,
  chat,
  getHistory,
  submitFeedback,
  getAnalytics,
  clearOldSessions,
} from '../controllers/aiController.js'
import { optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// Public routes (with optional authentication)
router.post('/session', optionalAuth, getOrCreateSession)
router.post('/chat', optionalAuth, chat)
router.get('/history/:sessionId', optionalAuth, getHistory)
router.post('/feedback', optionalAuth, submitFeedback)

// Admin/Analytics routes (can be protected further if needed)
router.get('/analytics', getAnalytics)
router.post('/maintenance/clear-sessions', clearOldSessions)

export default router
