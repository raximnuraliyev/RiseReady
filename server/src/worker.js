import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import mongoose from 'mongoose'
import { Notification } from './models/Notification.js'
import { User } from './models/User.js'
import nodemailer from 'nodemailer'
import { io as ClientIO } from 'socket.io-client'
import fetch from 'node-fetch'

dotenv.config()

const WORKER_SECRET = process.env.WORKER_SECRET || ''
const SERVER_URL = process.env.WORKER_SOCKET_URL || (process.env.API_URL ? process.env.API_URL.replace(/\/api\/?$/, '') : `http://localhost:${process.env.PORT || 4000}`)

async function start() {
  await connectDB()
  console.log('[worker] connected to DB')
  // Wait for the API server to be reachable (health check) before connecting socket
  async function waitForServer(url, attempts = 20, delayMs = 500) {
    const health = (url.replace(/\/$/, '') + '/api/health')
    for (let i = 0; i < attempts; i++) {
      try {
        const res = await fetch(health, { method: 'GET', timeout: 2000 })
        if (res.ok) return true
      } catch (err) {
        // ignore and retry
      }
      await new Promise(r => setTimeout(r, delayMs))
    }
    return false
  }

  const ok = await waitForServer(SERVER_URL, 40, 500)
  if (!ok) {
    console.warn('[worker] API server not reachable, will still try socket connect but expect retries')
  }

  // Socket client to the API server so the worker can request the server to emit to user rooms
  const socket = ClientIO(SERVER_URL, {
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    transports: ['websocket', 'polling']
  })

  socket.on('connect', () => console.log('[worker] connected to server socket'))
  socket.on('connect_error', (err) => console.warn('[worker] socket connect error', err))

  const mailTransporter = (function createTransporter() {
    const host = process.env.SMTP_HOST
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const secure = process.env.SMTP_SECURE === 'true'
    if (!host || !port || !user || !pass) return null
    try {
      return nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
    } catch (err) {
      console.warn('[worker] Failed to create SMTP transporter', err)
      return null
    }
  })()

  async function runOnce() {
    try {
      // Batch-claim up to N notifications atomically then process them
      const BATCH_SIZE = Number(process.env.WORKER_BATCH_SIZE || 25)

      // 1) Find candidate ids
      const candidates = await Notification.find({ sent: false, claimedId: { $exists: false }, createdAt: { $lte: new Date() } })
        .sort({ createdAt: 1 })
        .limit(BATCH_SIZE)

      if (!candidates || candidates.length === 0) return

      const ids = candidates.map(c => c._id)
      // generate a claim id
      const claimId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.floor(Math.random()*1000000)}`

      // 2) Attempt to claim them atomically
      const res = await Notification.updateMany(
        { _id: { $in: ids }, sent: false, claimedId: { $exists: false } },
        { $set: { claimedId: claimId, claimedAt: new Date() } }
      )

      if (!res || res.modifiedCount === 0) {
        // nothing claimed — likely raced with another worker
        return
      }

      // 3) Fetch the claimed docs by claimId
      const claimedDocs = await Notification.find({ claimedId: claimId })

      for (const n of claimedDocs) {
        try {
          // process each: emit and email, then mark sent
          try {
            socket.emit('emitNotification', { secret: WORKER_SECRET, userId: String(n.userId), notification: n })
          } catch (err) {
            console.warn('[worker] failed to emit notification to server socket', err)
          }

          try {
            if (mailTransporter) {
              const user = await User.findById(n.userId).lean()
              if (user && user.email && user.settings && user.settings.notifications && user.settings.notifications.reminders) {
                const from = process.env.FROM_EMAIL || `no-reply@${process.env.SMTP_HOST || 'riseready.app'}`
                await mailTransporter.sendMail({
                  from,
                  to: user.email,
                  subject: n.title || 'Reminder from RiseReady',
                  text: `${n.message || ''}\n\nOpen: ${process.env.APP_URL || ''}${n.link || ''}`,
                  html: `<p>${n.message || ''}</p><p><a href="${(process.env.APP_URL || '') + (n.link || '')}">Open</a></p>`
                })
              }
            }
          } catch (err) {
            console.warn('[worker] failed to send reminder email', err)
          }

          // mark sent and clear claimId
          n.sent = true
          n.sentAt = new Date()
          // keep claimedId/claimedAt for audit; alternatively, remove claimedId
          await n.save()
        } catch (err) {
          console.error('[worker] Failed to process scheduled notification', err)
        }
      }
    } catch (err) {
      console.error('[worker] Notification worker error', err)
    }
  }

  // Run immediately then every 30s
  await runOnce()
  const t = setInterval(runOnce, 30 * 1000)

  const shutdown = async () => {
    clearInterval(t)
    try { await mongoose.connection.close() } catch {}
    try { socket.close() } catch {}
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

start().catch((err) => {
  console.error('[worker] fatal error:', err)
  process.exit(1)
})
