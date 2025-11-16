module.exports = {
  name: 'link',
  // Usage: /link ABC123
  async execute(ctx, { axios, BACKEND_URL }) {
    const text = ctx.message && ctx.message.text ? ctx.message.text : ''
    const parts = text.split(/\s+/)
    const code = parts[1]
    if (!code) return ctx.reply('Usage: /link <CODE> — get the code from the website and send it here')

    const telegramId = ctx.from && ctx.from.id
    const telegramUsername = ctx.from && (ctx.from.username || `${ctx.from.first_name || ''} ${ctx.from.last_name || ''}`.trim())

    try {
      const res = await axios.post(`${BACKEND_URL}/api/bots/telegram/link`, { telegramId, telegramUsername, linkCode: code })
      const data = res.data || {}
      if (data.error) return ctx.reply(`❌ ${data.error}`)
      return ctx.reply(`✅ Linked! Your account is now connected as @${telegramUsername || 'unknown'}`)
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to link'
      return ctx.reply(`❌ ${message}`)
    }
  }
}
