module.exports = {
  name: 'internships',
  // Usage: /internships 5
  async execute(ctx, { axios, BACKEND_URL }) {
    const text = ctx.message && ctx.message.text ? ctx.message.text : ''
    const parts = text.split(/\s+/)
    const limit = Math.min(50, parseInt(parts[1] || '5'))
    const telegramId = ctx.from && ctx.from.id
    const telegramUsername = ctx.from && ctx.from.username
    try {
      const res = await axios.get(`${BACKEND_URL}/api/bots/telegram/internships`, { params: { telegramId, telegramUsername, limit } })
      const items = res.data || []
      if (!items.length) return ctx.reply('No internships found.')
      const list = items.map(i => `• ${i.title} — ${i.url || i.link || ''}`).join('\n')
      return ctx.reply(`🔎 Internships:\n${list}`)
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to fetch internships'
      return ctx.reply(`❌ ${message}`)
    }
  }
}
