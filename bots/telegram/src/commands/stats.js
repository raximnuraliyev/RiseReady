module.exports = {
  name: 'stats',
  async execute(ctx, { axios, BACKEND_URL }) {
    const telegramId = ctx.from && ctx.from.id
    const telegramUsername = ctx.from && ctx.from.username
    try {
      const res = await axios.get(`${BACKEND_URL}/api/bots/telegram/stats`, { params: { telegramId, telegramUsername } })
      const d = res.data || {}
      const reply = `📊 Stats\nStudy sessions this week: ${d.studySessionsThisWeek || 0}\nFocus streak: ${d.focusStreak || 0}\nBadges: ${d.badgesCount || 0}`
      return ctx.reply(reply)
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to fetch stats'
      return ctx.reply(`❌ ${message}`)
    }
  }
}
