import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { getFocusSessions, createSession, getStreak, getTotalTime, getUserBadges } from '../controllers/focusController.js'
import { FocusSession } from '../models/FocusSession.js'

const router = Router()

router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id

    // Total completed sessions
    const totalSessions = await FocusSession.countDocuments({ userId, completed: true })

    // Compute streak: number of consecutive days (including today) with at least one completed session
    const sessions = await FocusSession.find({ userId, completed: true })
      .sort({ startTime: -1 })
      .select('startTime')

    if (!sessions || sessions.length === 0) {
      return res.json({ totalSessions, streak: 0 })
    }

    // Build a set of date strings for quick lookup
    const daysWithSessions = new Set()
    sessions.forEach(s => daysWithSessions.add(new Date(s.startTime).toDateString()))

    let streak = 0
    const today = new Date()
    let cursor = new Date(today)
    cursor.setHours(0, 0, 0, 0)

    // Count consecutive days backwards while day exists in set
    while (daysWithSessions.has(cursor.toDateString())) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }

    res.json({ totalSessions, streak })
  } catch (error) {
    console.error('Error getting focus stats:', error)
    res.status(500).json({ message: 'Failed to get focus statistics', error: error.message })
  }
})

router.get('/sessions', auth, getFocusSessions)
router.post('/sessions', auth, createSession)
router.get('/streak', auth, getStreak)
router.get('/total', auth, getTotalTime)
router.get('/badges', auth, getUserBadges)

export default router
