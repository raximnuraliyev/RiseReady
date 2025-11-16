try { require('dotenv').config() } catch (e) {}
const { Telegraf } = require('telegraf')
const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
const PORT = parseInt(process.env.PORT, 10) || 3002

if (!TELEGRAM_TOKEN) {
  console.error('TELEGRAM_TOKEN not set. Create a .env file based on .env.example')
  process.exit(1)
}

const bot = new Telegraf(TELEGRAM_TOKEN)

// Load commands from ./commands
const commandsPath = path.join(__dirname, 'commands')
if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))
  for (const file of files) {
    const mod = require(path.join(commandsPath, file))
    if (mod && mod.name && typeof mod.execute === 'function') {
      // Register as a Telegram command
      bot.command(mod.name, async (ctx) => {
        try {
          await mod.execute(ctx, { axios, BACKEND_URL })
        } catch (err) {
          console.error('Command error', mod.name, err)
          try { await ctx.reply('There was an error while executing this command.') } catch (e) {}
        }
      })
    }
  }
}

bot.launch().then(async () => {
  console.log('Telegram bot started')
  // Register command list so Telegram clients show available commands
  try {
    await bot.telegram.setMyCommands([
      { command: 'start', description: 'Show help and available commands' },
      { command: 'link', description: 'Link your RiseReady account using a code' },
      { command: 'stats', description: 'Show your study stats (sessions, streaks, badges)' },
      { command: 'focus', description: 'Log a focus session: /focus <minutes>' },
      { command: 'checkin', description: 'Submit a wellbeing check-in: /checkin <mood>' },
      { command: 'badges', description: 'List earned badges' },
      { command: 'internships', description: 'Show latest internships (optionally pass a limit)' },
      { command: 'leaderboard', description: 'Show top users leaderboard' },
      { command: 'settings', description: 'View or update bot settings' },
      { command: 'logout', description: 'Logout from your RiseReady account' }
    ])
    console.log('Registered Telegram command list')
  } catch (err) {
    console.warn('Failed to register Telegram commands', err && err.message)
  }
}).catch(err => {
  console.error('Telegram bot failed to start', err)
  process.exit(1)
})

// Simple HTTP receiver so backend can ask bot to push notifications
const app = express()
app.use(bodyParser.json())

app.post('/api/notifications/send', async (req, res) => {
  const payload = req.body || {}
  const { platform, telegramId, title, message, link } = payload
  if (platform !== 'telegram') return res.status(400).json({ error: 'platform must be telegram' })
  if (!telegramId) return res.status(400).json({ error: 'telegramId required' })
  try {
    const text = `${title ? `*${title}*\n` : ''}${message || ''}${link ? `\n${link}` : ''}`
    await bot.telegram.sendMessage(String(telegramId), text, { parse_mode: 'Markdown' })
    return res.json({ ok: true })
  } catch (err) {
    console.error('Failed to send telegram notification', err)
    return res.status(500).json({ error: 'failed' })
  }
})

app.listen(PORT, () => console.log(`Telegram webhook receiver listening on ${PORT}`))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
