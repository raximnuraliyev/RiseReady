import { UserProgress } from '../models/UserProgress.js'
import { User } from '../models/User.js'
import { UserReminder } from '../models/UserReminder.js'
import { CalendarEvent } from '../models/CalendarEvent.js'
import { Project } from '../models/Project.js'
import { FocusSession } from '../models/FocusSession.js'
import { CheckIn } from '../models/CheckIn.js'

// Get user progress overview
export const getProgress = async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user.id })
    
    // Create progress if it doesn't exist
    if (!progress) {
      progress = await UserProgress.create({
        userId: req.user.id,
        level: 1,
        experience: 0
      })
    }

    res.json({
      level: progress.level,
      experience: progress.experience,
      nextLevelXp: progress.level * 1000,
      projects: {
        total: progress.totalProjects,
        completed: progress.completedProjects,
        active: progress.activeProjects,
        pending: progress.pendingProjects
      },
      history: progress.progressHistory.slice(-10) // Last 10 changes
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update project status
export const updateProjectStatus = async (req, res) => {
  try {
    const { projectId, status, change = 1 } = req.body
    if (!['completed', 'active', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    let progress = await UserProgress.findOne({ userId: req.user.id })
    if (!progress) {
      progress = await UserProgress.create({ userId: req.user.id })
    }

    const result = await progress.updateProjectCounts(status, change)
    
    // Award XP for completing projects
    if (status === 'completed' && change > 0) {
      await progress.addExperience(100) // 100 XP per completed project
    }

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get user reminders
export const getReminders = async (req, res) => {
  try {
    const userId = req.user.id
    const today = new Date()
    const next7Days = new Date(today)
    next7Days.setDate(next7Days.getDate() + 7)

    // Get upcoming calendar events
    const events = await CalendarEvent.find({
      userId,
      startTime: { $gte: today, $lte: next7Days }
    }).sort('startTime').limit(5)

    // Get active projects with upcoming due dates
    const projects = await Project.find({
      userId,
      dueDate: { $gte: today, $lte: next7Days },
      status: 'active'
    }).sort('dueDate').limit(5)

    // Get pending check-ins
    const checkIns = await CheckIn.find({
      userId,
      date: { $gte: today, $lte: next7Days },
      completed: false
    }).sort('date').limit(3)

    // Format all items as reminders
    let reminders = [
      ...events.map(event => ({
        id: event._id,
        title: event.title,
        time: event.startTime,
        type: 'calendar'
      })),
      ...projects.map(project => ({
        id: project._id,
        title: `Project due: ${project.title}`,
        time: project.dueDate,
        type: 'project'
      })),
      ...checkIns.map(checkin => ({
        id: checkin._id,
        title: 'Daily Check-in',
        time: checkin.date,
        type: 'checkin'
      }))
    ]

    // Sort by time
    reminders = reminders.sort((a, b) => new Date(a.time) - new Date(b.time))

    res.json(reminders)
  } catch (err) {
    console.error('Error fetching reminders:', err)
    res.status(500).json({ error: 'Failed to fetch reminders' })
  }
}

// Add XP manually (for testing)
export const addExperience = async (req, res) => {
  try {
    const { amount } = req.body
    let progress = await UserProgress.findOne({ userId: req.user.id })
    if (!progress) {
      progress = await UserProgress.create({ userId: req.user.id })
    }

    const result = await progress.addExperience(amount)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}