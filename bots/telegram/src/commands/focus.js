module.exports = {
  name: 'focus',
  // Usage: /focus 30
  async execute(ctx, { axios, BACKEND_URL }) {
    const text = ctx.message && ctx.message.text ? ctx.message.text : ''
    const parts = text.split(/\s+/)
    const minutes = parts[1] && Number(parts[1]) ? Number(parts[1]) : null
    if (!minutes) return ctx.reply('Usage: /focus <minutes> — e.g. /focus 30')

    const telegramId = ctx.from && ctx.from.id
    const telegramUsername = ctx.from && ctx.from.username
    try {
      const res = await axios.post(`${BACKEND_URL}/api/bots/telegram/focus`, { telegramId, telegramUsername, minutes })
      const d = res.data || {}
      return ctx.reply(`Nice job! You logged ${minutes} minutes. Streak: ${d.streak || 'N/A'} days.`)
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to log focus'
      return ctx.reply(`❌ ${message}`)
    }
  }
}
