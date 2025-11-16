import { LinkCode } from '../models/LinkCode.js'
import { User } from '../models/User.js'
import { FocusSession } from '../models/FocusSession.js'
import { CheckIn } from '../models/CheckIn.js'
import { UserBadge } from '../models/Badge.js'
import { Internship } from '../models/Internship.js'

// Helper: resolve user by discordId/telegramId or by discord tag / telegram username
async function resolveUser(id, tag) {
  // Try by id first (could be discordId or telegramId)
  if (id) {
    let user = await User.findOne({ discordId: id }).exec()
    if (user) return user
    user = await User.findOne({ telegramId: String(id) }).exec()
    if (user) return user
  }
  // Fallback: try by discord tag (username#1234) or telegram username
  if (tag) {
    let userByTag = await User.findOne({ discord: tag }).exec()
    if (userByTag) return userByTag
    userByTag = await User.findOne({ telegram: tag }).exec()
    if (userByTag) return userByTag
  }
  return null
}

// POST /api/bots/discord/link
// Body: { discordId, linkCode }
export async function linkDiscordAccount(req, res) {
  const { discordId, telegramId, linkCode } = req.body || {}
  if ((!discordId && !telegramId) || !linkCode) return res.status(400).json({ error: 'discordId or telegramId and linkCode required' })

  try {
    const code = await LinkCode.findOne({ code: linkCode }).exec()
    if (!code) return res.status(404).json({ error: 'Invalid code' })
    if (code.used) return res.status(400).json({ error: 'Code already used' })
    if (code.expiresAt && code.expiresAt < new Date()) return res.status(400).json({ error: 'Code expired' })

    const user = await User.findById(code.userId).exec()
    if (!user) return res.status(404).json({ error: 'User not found for this code' })

    // If linking a Discord account
    if (discordId) {
      const existing = await User.findOne({ discordId }).exec()
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'This Discord account is already linked to another user' })
      }
      user.discordId = discordId
      const { discordTag } = req.body || {}
      if (discordTag) user.discord = discordTag
    }

    // If linking a Telegram account
    if (telegramId) {
      const existing = await User.findOne({ telegramId: String(telegramId) }).exec()
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'This Telegram account is already linked to another user' })
      }
      user.telegramId = String(telegramId)
      const { telegramUsername } = req.body || {}
      if (telegramUsername) user.telegram = telegramUsername
    }

    await user.save()

    code.used = true
    await code.save()

    return res.json({ ok: true, userId: user._id.toString(), discordTag: user.discord || null, telegram: user.telegram || null })
  } catch (err) {
    console.error('linkDiscordAccount error', err)
    return res.status(500).json({ error: 'internal_error' })
  }
}

// POST /api/bots/discord/focus
// Body: { discordId, minutes }
export async function botCreateFocus(req, res) {
  const { discordId, telegramId, minutes, discordTag, telegramUsername } = req.body || {}
  const id = discordId || telegramId
  if (!id || !minutes) return res.status(400).json({ error: 'discordId or telegramId and minutes required' })
  try {
    const user = await resolveUser(id, discordTag || telegramUsername)
    if (!user) return res.status(404).json({ error: 'User not linked' })

    const now = new Date()
    const end = new Date(now.getTime() + Number(minutes) * 60000)
    const session = await FocusSession.create({ userId: user._id, duration: Number(minutes), startTime: now, endTime: end, completed: true })

    // Award points (simple heuristic)
    const points = Math.max(1, Math.floor(Number(minutes) / 25)) * 10
    await user.addPoints(points)

    // Compute total this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const sessions = await FocusSession.find({ userId: user._id, startTime: { $gte: weekAgo }, completed: true })
    const totalThisWeek = sessions.reduce((s, it) => s + (it.duration || 0), 0)

    // Compute streak (simple approach based on sessions in last days)
    const allSessions = await FocusSession.find({ userId: user._id, completed: true }).sort({ startTime: -1 })
    let streak = 0
    if (allSessions.length) {
      const daysWith = new Set(allSessions.map(s => new Date(s.startTime).toDateString()))
      const today = new Date(); today.setHours(0,0,0,0)
      let cursor = new Date(today)
      while (daysWith.has(cursor.toDateString())) { streak++; cursor.setDate(cursor.getDate() - 1) }
    }

    return res.status(201).json({ ok: true, totalThisWeek, streak })
  } catch (err) {
    console.error('botCreateFocus error', err)
    return res.status(500).json({ error: 'internal_error' })
  }
}

// POST /api/bots/discord/checkin
// Body: { discordId, mood }
export async function botCheckIn(req, res) {
  const { discordId, telegramId, mood, discordTag, telegramUsername } = req.body || {}
  const id = discordId || telegramId
  if (!id || !mood) return res.status(400).json({ error: 'discordId or telegramId and mood required' })
  try {
    const user = await resolveUser(id, discordTag || telegramUsername)
    if (!user) return res.status(404).json({ error: 'User not linked' })

    // Map mood input to allowed enum
    const map = { '😊': 'good', '😄': 'great', '🙂': 'good', '😐': 'okay', '😞': 'bad', '😠': 'terrible' }
    const moodEnum = map[mood] || (['great','good','okay','bad','terrible'].includes(mood) ? mood : 'good')

    const checkin = await CheckIn.create({ userId: user._id, mood: moodEnum, energy: 3, stress: 3 })

    // Compute average mood this week (very simple: map to scores)
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
    const checks = await CheckIn.find({ userId: user._id, date: { $gte: weekAgo } })
    const scoreMap = { great: 5, good: 4, okay: 3, bad: 2, terrible: 1 }
    const avg = checks.length ? (checks.reduce((s,ch) => s + (scoreMap[ch.mood]||3), 0) / checks.length) : 4
    const avgLabel = avg >= 4.5 ? 'Great' : avg >= 3.5 ? 'Good' : avg >= 2.5 ? 'Okay' : 'Low'

    return res.status(201).json({ ok: true, averageThisWeek: avgLabel })
  } catch (err) {
    console.error('botCheckIn error', err)
    return res.status(500).json({ error: 'internal_error' })
  }
}

// GET /api/bots/discord/stats?discordId=...
export async function botGetStats(req, res) {
  const { discordId, telegramId, discordTag, telegramUsername } = req.query || {}
  const id = discordId || telegramId
  if (!id) return res.status(400).json({ error: 'discordId or telegramId required' })
  try {
    const user = await resolveUser(id, discordTag || telegramUsername)
    if (!user) return res.status(404).json({ error: 'User not linked' })

    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
    const sessions = await FocusSession.find({ userId: user._id, startTime: { $gte: weekAgo }, completed: true })
    const studySessionsThisWeek = sessions.length

    // Compute streak
    const allSessions = await FocusSession.find({ userId: user._id, completed: true }).sort({ startTime: -1 })
    let streak = 0
    if (allSessions.length) {
      const daysWith = new Set(allSessions.map(s => new Date(s.startTime).toDateString()))
      const today = new Date(); today.setHours(0,0,0,0)
      let cursor = new Date(today)
      while (daysWith.has(cursor.toDateString())) { streak++; cursor.setDate(cursor.getDate() - 1) }
    }

    const badgesCount = await UserBadge.countDocuments({ userId: user._id })

    return res.json({ studySessionsThisWeek, focusStreak: streak, badgesCount })
  } catch (err) {
    console.error('botGetStats error', err)
    return res.status(500).json({ error: 'internal_error' })
  }
}

// GET /api/bots/discord/badges?discordId=...
export async function botGetBadges(req, res) {
  const { discordId, telegramId, discordTag, telegramUsername } = req.query || {}
  const id = discordId || telegramId
  if (!id) return res.status(400).json({ error: 'discordId or telegramId required' })
  try {
    const user = await resolveUser(id, discordTag || telegramUsername)
    if (!user) return res.status(404).json({ error: 'User not linked' })
    const badges = await UserBadge.find({ userId: user._id }).sort({ earnedAt: -1 })
    return res.json(badges)
  } catch (err) {
    console.error('botGetBadges error', err)
    return res.status(500).json({ error: 'internal_error' })
  }
}

// GET /api/bots/discord/internships?discordId=...&limit=5
export async function botGetInternships(req, res) {
  const { discordId, telegramId, discordTag, telegramUsername } = req.query || {}
  const limit = Math.min(50, parseInt(req.query.limit || '5'))
  try {
    const id = discordId || telegramId
    const user = id ? await resolveUser(id, discordTag || telegramUsername) : null
    let query = { isActive: true }
    if (user && user.major) query.skills = { $in: [user.major] }
    const items = await Internship.find(query).sort({ posted: -1 }).limit(limit)
    return res.json(items)
  } catch (err) {
    console.error('botGetInternships error', err)
    return res.status(500).json({ error: 'internal_error' })
  }
}

// GET /api/bots/discord/leaderboard
export async function botGetLeaderboard(req, res) {
  const limit = Math.min(50, parseInt(req.query.limit || '10'))
  try {
    const users = await User.find().sort({ 'progress.totalPoints': -1 }).limit(limit).select('name progress.totalPoints')
    const list = users.map(u => ({ username: u.name || 'Unknown', points: u.progress?.totalPoints || 0 }))
    return res.json(list)
  } catch (err) {
    console.error('botGetLeaderboard error', err)
    return res.status(500).json({ error: 'internal_error' })
  }
}

// POST /api/bots/link-code (authenticated)
// Body: { expiresInMinutes }
export async function generateLinkCode(req, res) {
  try {
    const userId = req.user && req.user.id
    if (!userId) return res.status(401).json({ error: 'unauthorized' })

    const expiresIn = parseInt(req.body.expiresInMinutes || '10')
    // Generate 6-char uppercase alphanumeric code
    const code = [...Array(6)].map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('')

    const link = await LinkCode.create({ code, userId, expiresAt: new Date(Date.now() + expiresIn * 60000) })
    return res.json({ code: link.code, expiresAt: link.expiresAt })
  } catch (err) {
    console.error('generateLinkCode error', err)
    return res.status(500).json({ error: 'internal_error' })
  }
}

// GET /api/bots/discord/settings?discordId=...
export async function botGetSettings(req, res) {
  const { discordId, telegramId, discordTag, telegramUsername } = req.query || {}
  const id = discordId || telegramId
  if (!id) return res.status(400).json({ error: 'discordId or telegramId required' })
  try {
    const user = await resolveUser(id, discordTag || telegramUsername)
    if (!user) return res.status(404).json({ error: 'User not linked' })
    return res.json(user.settings || {})
  } catch (err) {
    console.error('botGetSettings error', err)
    return res.status(500).json({ error: 'internal_error' })
  }
}

// PUT /api/bots/discord/settings
// Body: { discordId, settings }
export async function botUpdateSettings(req, res) {
  const { discordId, telegramId, settings, discordTag, telegramUsername } = req.body || {}
  const id = discordId || telegramId
  if (!id || !settings) return res.status(400).json({ error: 'discordId or telegramId and settings required' })
  try {
    const user = await resolveUser(id, discordTag || telegramUsername)
    if (!user) return res.status(404).json({ error: 'User not linked' })
    user.settings = Object.assign(user.settings || {}, settings)
    await user.save()
    return res.json({ ok: true, settings: user.settings })
  } catch (err) {
    console.error('botUpdateSettings error', err)
    return res.status(500).json({ error: 'internal_error' })
  }
}

// POST /api/bots/discord/logout
// Body: { discordId } or { telegramId }
export async function botLogout(req, res) {
  const { discordId, telegramId, discordTag, telegramUsername } = req.body || {}
  const id = discordId || telegramId
  if (!id) return res.status(400).json({ error: 'discordId or telegramId required' })
  try {
    const user = await resolveUser(id, discordTag || telegramUsername)
    if (!user) return res.status(404).json({ error: 'User not linked' })

    // Unlink the bot account
    if (discordId) {
      user.discordId = undefined
      user.discord = undefined
    }
    if (telegramId) {
      user.telegramId = undefined
      user.telegram = undefined
    }

    await user.save()
    return res.json({ ok: true, message: 'Successfully logged out' })
  } catch (err) {
    console.error('botLogout error', err)
    return res.status(500).json({ error: 'internal_error' })
  }
}
