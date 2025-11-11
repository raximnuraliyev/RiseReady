module.exports = {
  name: 'checkin',
  // Usage: /checkin good
  async execute(ctx, { axios, BACKEND_URL }) {
    const text = ctx.message && ctx.message.text ? ctx.message.text : ''
    const parts = text.split(/\s+/)
    const mood = parts.slice(1).join(' ') || null
    if (!mood) return ctx.reply('Usage: /checkin <mood> — e.g. /checkin good')

    const telegramId = ctx.from && ctx.from.id
    const telegramUsername = ctx.from && ctx.from.username
    try {
      const res = await axios.post(`${BACKEND_URL}/api/bots/telegram/checkin`, { telegramId, telegramUsername, mood })
      const d = res.data || {}
      return ctx.reply(`Thanks for checking in (Mood = ${mood}). Avg mood this week: ${d.averageThisWeek || 'N/A'}`)
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to check in'
      return ctx.reply(`❌ ${message}`)
    }
  }
}
