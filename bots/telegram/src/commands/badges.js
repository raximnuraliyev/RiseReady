module.exports = {
  name: 'badges',
  async execute(ctx, { axios, BACKEND_URL }) {
    const telegramId = ctx.from && ctx.from.id
    const telegramUsername = ctx.from && ctx.from.username
    try {
      const res = await axios.get(`${BACKEND_URL}/api/bots/telegram/badges`, { params: { telegramId, telegramUsername } })
      const badges = res.data || []
      if (!Array.isArray(badges) || badges.length === 0) return ctx.reply('You have no badges yet.')
      const list = badges.map(b => `• ${b.name || b.title || 'Badge'}${b.earnedAt ? ` — ${new Date(b.earnedAt).toLocaleDateString()}` : ''}`).join('\n')
      return ctx.reply(`🏅 Your badges:\n${list}`)
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to fetch badges'
      return ctx.reply(`❌ ${message}`)
    }
  }
}
