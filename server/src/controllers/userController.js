import { User } from '../models/User.js'
import { FocusSession } from '../models/FocusSession.js'
import { UserBadge } from '../models/Badge.js'
import { CareerTask } from '../models/Career.js'
import { Group } from '../models/Community.js'
import { InternshipApplication } from '../models/InternshipApplication.js'

export async function me(req, res) {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({
    id: String(user._id),
    email: user.email,
    name: user.name || '',
    role: user.role,
    avatarUrl: user.avatarUrl || '',
    pronouns: user.pronouns || '',
    major: user.major || '',
    year: user.year || '',
    university: user.university || '',
    bio: user.bio || '',
    linkedin: user.linkedin || '',
    github: user.github || '',
    discord: user.discord || '',
    telegram: user.telegram || '',
    totalPoints: user.totalPoints || 0,
    level: user.level,
    settings: user.settings,
  })
}

export async function updateProfile(req, res) {
  const updates = req.body
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true })
  res.json({
    id: String(user._id),
    email: user.email,
    name: user.name || '',
    role: user.role,
    avatarUrl: user.avatarUrl || '',
    pronouns: user.pronouns || '',
    major: user.major || '',
    year: user.year || '',
    university: user.university || '',
    bio: user.bio || '',
    linkedin: user.linkedin || '',
    github: user.github || '',
    discord: user.discord || '',
    telegram: user.telegram || '',
    settings: user.settings,
  })
}

export async function updateSettings(req, res) {
  const { notifications, privacy } = req.body
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (notifications) user.settings.notifications = { ...user.settings.notifications, ...notifications }
  if (privacy) user.settings.privacy = { ...user.settings.privacy, ...privacy }
  await user.save()
  res.json({ ok: true })
}

// Get user stats
export async function getStats(req, res) {
  try {
    const userId = req.user.id
    
    // Get study sessions for the week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const sessions = await FocusSession.find({
      userId,
      startTime: { $gte: weekAgo }
    })
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    
    // Get badges count
  const badgesCount = await UserBadge.countDocuments({ userId })
    
    // Get completed career tasks
    const completedTasks = await CareerTask.countDocuments({
      userId,
      completed: true
    })
    
    // Get joined groups
    const groupsJoined = await Group.countDocuments({
      members: userId
    })
    
    res.json([
      { label: 'Study Sessions (week)', value: `${hours}h ${minutes}m` },
      { label: 'Badges Earned', value: String(badgesCount) },
      { label: 'Career Tasks Completed', value: String(completedTasks) },
      { label: 'Groups Joined', value: String(groupsJoined) }
    ])
  } catch (err) {
    console.error('Error fetching user stats:', err)
    res.status(500).json({ error: 'Failed to fetch user stats' })
  }
}

// Get recent activity
export async function getRecentActivity(req, res) {
  try {
    const userId = req.user.id
    const activities = []
    
    // Get group joins in last 30 days
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)
    
    const groups = await Group.find({
      members: userId,
      createdAt: { $gte: monthAgo }
    }).sort('-createdAt').limit(3)
    
    groups.forEach(g => {
      activities.push({
        id: `g${g._id}`,
        text: `Joined group "${g.name}"`,
        href: '/dashboard/community'
      })
    })
    
    // Get recent internship applications
    const applications = await InternshipApplication.find({
      userId,
      createdAt: { $gte: monthAgo }
    })
    .sort('-createdAt')
    .limit(3)
    
    applications.forEach(app => {
      const title = app.internshipId?.title || app.internshipId || 'Opportunity'
      activities.push({
        id: `a${app._id}`,
        text: `Applied to "${title}"`,
        href: '/dashboard/internships',
        date: app.createdAt || app.appliedAt
      })
    })
    
    // Get recently earned badges
    const badges = await UserBadge.find({
      userId,
      earnedAt: { $gte: monthAgo }
    }).sort('-earnedAt').limit(3)

    badges.forEach(b => {
      activities.push({
        id: `b${b._id}`,
        text: `Earned badge "${b.badgeName}"`,
        href: '/dashboard/skills',
        date: b.earnedAt
      })
    })
    
    // Sort by date and return most recent 5
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    res.json(activities.slice(0, 5))
  } catch (err) {
    console.error('Error fetching recent activity:', err)
    res.status(500).json({ error: 'Failed to fetch recent activity' })
  }
}
