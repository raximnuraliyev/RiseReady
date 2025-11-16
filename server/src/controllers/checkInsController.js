import { CheckIn } from '../models/CheckIn.js'

export async function getCheckIns(req, res) {
  const { days = 30 } = req.query
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - parseInt(days))
  
  const checkIns = await CheckIn.find({
    userId: req.user.id,
    date: { $gte: startDate }
  }).sort({ date: -1 })
  
  res.json(checkIns)
}

export async function createCheckIn(req, res) {
  const { mood, energy, stress, sleep, exercise, notes } = req.body
  
  // Check if user already checked in today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const existingCheckIn = await CheckIn.findOne({
    userId: req.user.id,
    date: { $gte: today, $lt: tomorrow }
  })
  
  if (existingCheckIn) {
    return res.status(400).json({ error: 'Already checked in today' })
  }
  
  const checkIn = await CheckIn.create({
    userId: req.user.id,
    mood,
    energy,
    stress,
    sleep: sleep || 0,
    exercise: exercise || false,
    notes: notes || '',
    date: new Date()
  })
  
  res.status(201).json(checkIn)
}

export async function getStreak(req, res) {
  const checkIns = await CheckIn.find({ userId: req.user.id })
    .sort({ date: -1 })
    .limit(365)
  
  if (checkIns.length === 0) {
    return res.json({ streak: 0, lastCheckIn: null })
  }
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Check if checked in today or yesterday
  const lastCheckIn = new Date(checkIns[0].date)
  lastCheckIn.setHours(0, 0, 0, 0)
  
  const daysDiff = Math.floor((today - lastCheckIn) / (1000 * 60 * 60 * 24))
  
  if (daysDiff > 1) {
    // Streak broken
    return res.json({ streak: 0, lastCheckIn: checkIns[0].date })
  }
  
  // Calculate streak
  let currentDate = new Date(today)
  if (daysDiff === 1) {
    currentDate.setDate(currentDate.getDate() - 1)
  }
  
  for (const checkIn of checkIns) {
    const checkInDate = new Date(checkIn.date)
    checkInDate.setHours(0, 0, 0, 0)
    
    if (checkInDate.getTime() === currentDate.getTime()) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (checkInDate < currentDate) {
      break
    }
  }
  
  res.json({ streak, lastCheckIn: checkIns[0].date })
}

export async function getBestDay(req, res) {
  // Get check-ins from the last 7 days
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  const checkIns = await CheckIn.find({
    userId: req.user.id,
    date: { $gte: weekAgo }
  })
  
  if (checkIns.length === 0) {
    return res.json({ bestDay: null, score: 0 })
  }
  
  // Calculate score for each check-in (higher is better)
  // Score = energy + (6 - stress) + mood_value + (exercise ? 2 : 0)
  const moodValues = { terrible: 1, bad: 2, okay: 3, good: 4, great: 5 }
  
  let bestCheckIn = checkIns[0]
  let bestScore = 0
  
  checkIns.forEach(checkIn => {
    const score = 
      checkIn.energy + 
      (6 - checkIn.stress) + 
      (moodValues[checkIn.mood] || 3) +
      (checkIn.exercise ? 2 : 0)
    
    if (score > bestScore) {
      bestScore = score
      bestCheckIn = checkIn
    }
  })
  
  res.json({ 
    bestDay: bestCheckIn.date, 
    score: bestScore,
    mood: bestCheckIn.mood,
    energy: bestCheckIn.energy
  })
}

export async function getStats(req, res) {
  const { period = 'week' } = req.query
  
  const daysAgo = period === 'week' ? 7 : 30
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysAgo)
  
  const checkIns = await CheckIn.find({
    userId: req.user.id,
    date: { $gte: startDate }
  })
  
  if (checkIns.length === 0) {
    return res.json({
      avgEnergy: 0,
      avgStress: 0,
      avgSleep: 0,
      exerciseDays: 0,
      totalCheckIns: 0
    })
  }
  
  const avgEnergy = checkIns.reduce((sum, c) => sum + c.energy, 0) / checkIns.length
  const avgStress = checkIns.reduce((sum, c) => sum + c.stress, 0) / checkIns.length
  const avgSleep = checkIns.reduce((sum, c) => sum + (c.sleep || 0), 0) / checkIns.length
  const exerciseDays = checkIns.filter(c => c.exercise).length
  
  res.json({
    avgEnergy: Math.round(avgEnergy * 10) / 10,
    avgStress: Math.round(avgStress * 10) / 10,
    avgSleep: Math.round(avgSleep * 10) / 10,
    exerciseDays,
    totalCheckIns: checkIns.length
  })
}
