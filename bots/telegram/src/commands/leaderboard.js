module.exports = {
  name: 'leaderboard',
  async execute(ctx, { axios, BACKEND_URL }) {
    const telegramId = ctx.from && ctx.from.id
    try {
      const res = await axios.get(`${BACKEND_URL}/api/bots/telegram/leaderboard`, { params: { metric: 'focusSessions', limit: 10 } })
      const list = res.data || []
      if (!list.length) return ctx.reply('No leaderboard data available.')
      const text = list.map((u, i) => `${i+1}. ${u.username} — ${u.points}`).join('\n')
      return ctx.reply(`🏆 Leaderboard:\n${text}`)
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to fetch leaderboard'
      return ctx.reply(`❌ ${message}`)
    }
  }
}
