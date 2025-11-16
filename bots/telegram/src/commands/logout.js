module.exports = {
  name: 'logout',
  // Usage: /logout
  async execute(ctx, { axios, BACKEND_URL }) {
    const telegramId = ctx.from && ctx.from.id
    if (!telegramId) return ctx.reply('❌ Unable to identify your Telegram account')

    try {
      const res = await axios.post(`${BACKEND_URL}/api/bots/telegram/logout`, { telegramId })
      const data = res.data || {}
      if (data.error) return ctx.reply(`❌ ${data.error}`)
      return ctx.reply(`✅ Successfully logged out. Your RiseReady account has been unlinked from Telegram.`)
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to logout'
      return ctx.reply(`❌ ${message}`)
    }
  }
}
