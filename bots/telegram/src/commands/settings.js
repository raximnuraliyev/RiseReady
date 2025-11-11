module.exports = {
  name: 'settings',
  // Usage: /settings or /settings setnotifications on
  async execute(ctx, { axios, BACKEND_URL }) {
    const text = ctx.message && ctx.message.text ? ctx.message.text : ''
    const parts = text.split(/\s+/)
    const telegramId = ctx.from && ctx.from.id
    const telegramUsername = ctx.from && ctx.from.username

    // If user wants to update notifications
    if (parts[1] === 'setnotifications') {
      const val = parts[2] === 'on' ? true : parts[2] === 'off' ? false : null
      if (val === null) return ctx.reply('Usage: /settings setnotifications <on|off>')
      try {
        const res = await axios.put(`${BACKEND_URL}/api/bots/telegram/settings`, { telegramId, notifications: { reminders: val } })
        return ctx.reply(`Notifications updated: ${val ? 'on' : 'off'}`)
      } catch (err) {
        const message = err?.response?.data?.error || err.message || 'Failed to update settings'
        return ctx.reply(`❌ ${message}`)
      }
    }

    // Otherwise fetch settings
    try {
      const res = await axios.get(`${BACKEND_URL}/api/bots/telegram/settings`, { params: { telegramId, telegramUsername } })
      const s = res.data || {}
      return ctx.reply(`⚙️ Your settings:\nNotifications: ${s.notifications?.reminders ? 'on' : 'off'}`)
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to fetch settings'
      return ctx.reply(`❌ ${message}`)
    }
  }
}
