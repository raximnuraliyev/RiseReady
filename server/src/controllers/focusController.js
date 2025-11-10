import { FocusSession } from '../models/FocusSession.js'
import { User } from '../models/User.js'
import { UserBadge, BadgeDefinition } from '../models/Badge.js'

export async function getFocusSessions(req, res) {
  const { days = 30 } = req.query
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - parseInt(days))
  
  const sessions = await FocusSession.find({
    userId: req.user.id,
    startTime: { $gte: startDate }
  }).sort({ startTime: -1 })
  
  res.json(sessions)
}

export async function createSession(req, res) {
  const { duration, type, completed, notes, startTime, endTime } = req.body
  
  const session = await FocusSession.create({
    userId: req.user.id,
    duration,
    type: type || 'Study',
    completed: completed !== false,
    notes: notes || '',
    startTime,
    endTime
  })
  
  // Award points if session completed
  if (session.completed) {
    const user = await User.findById(req.user.id)
    if (user) {
      await user.addPoints(10) // 10 points per completed session
    }
    
    // Check for badges
    await checkFocusBadges(req.user.id)
  }
  
  res.status(201).json(session)
}

export async function getStreak(req, res) {
  const sessions = await FocusSession.find({ 
    userId: req.user.id,
    completed: true 
  }).sort({ startTime: -1 }).limit(365)
  
  if (sessions.length === 0) {
    return res.json({ streak: 0, lastSession: null })
  }
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Check if had session today or yesterday
  const lastSession = new Date(sessions[0].startTime)
  lastSession.setHours(0, 0, 0, 0)
  
  const daysDiff = Math.floor((today - lastSession) / (1000 * 60 * 60 * 24))
  
  if (daysDiff > 1) {
    return res.json({ streak: 0, lastSession: sessions[0].startTime })
  }
  
  // Calculate streak
  let currentDate = new Date(today)
  if (daysDiff === 1) {
    currentDate.setDate(currentDate.getDate() - 1)
  }
  
  const sessionsByDay = {}
  sessions.forEach(s => {
    const dateKey = new Date(s.startTime).toDateString()
    sessionsByDay[dateKey] = true
  })
  
  while (sessionsByDay[currentDate.toDateString()]) {
    streak++
    currentDate.setDate(currentDate.getDate() - 1)
  }
  
  res.json({ streak, lastSession: sessions[0].startTime })
}

export async function getTotalTime(req, res) {
  const { period = 'week' } = req.query
  const daysAgo = period === 'week' ? 7 : 30
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysAgo)
  
  const sessions = await FocusSession.find({
    userId: req.user.id,
    completed: true,
    startTime: { $gte: startDate }
  })
  
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
  const totalSessions = sessions.length
  
  res.json({ 
    totalMinutes, 
    totalHours: Math.round(totalMinutes / 60 * 10) / 10,
    totalSessions 
  })
}

async function checkFocusBadges(userId) {
  const sessions = await FocusSession.find({ userId, completed: true })
  const count = sessions.length
  
  const badgesToCheck = [
    { name: 'First Focus Session', threshold: 1 },
    { name: '10 Focus Sessions', threshold: 10 },
    { name: '25 Focus Sessions', threshold: 25 },
    { name: '50 Focus Sessions', threshold: 50 },
    { name: '100 Focus Sessions', threshold: 100 }
  ]
  
  for (const badge of badgesToCheck) {
    if (count >= badge.threshold) {
      try {
        await UserBadge.create({ userId, badgeName: badge.name })
      } catch (err) {
        // Badge already exists (unique constraint)
      }
    }
  }
}

export async function getUserBadges(req, res) {
  const badges = await UserBadge.find({ userId: req.user.id }).sort({ earnedAt: -1 })
  res.json(badges)
}
