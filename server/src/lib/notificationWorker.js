import { Notification } from '../models/Notification.js'
import { getIO } from './socket.js'
import nodemailer from 'nodemailer'
import { User } from '../models/User.js'

// Configure mailer if environment variables present
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
    console.warn('Failed to create SMTP transporter', err)
    return null
  }
})()

// Periodically scan for due notifications (createdAt <= now) that haven't been sent yet
export function startNotificationWorker(intervalMs = 30 * 1000) {
  async function runOnce() {
    try {
      const io = getIO()
      const BATCH_SIZE = Number(process.env.WORKER_BATCH_SIZE || 25)

      // 1) Find candidate ids
      const candidates = await Notification.find({ sent: false, claimedId: { $exists: false }, createdAt: { $lte: new Date() } })
        .sort({ createdAt: 1 })
        .limit(BATCH_SIZE)

      if (!candidates || candidates.length === 0) return

      const ids = candidates.map(c => c._id)
      const claimId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.floor(Math.random()*1000000)}`

      const res = await Notification.updateMany(
        { _id: { $in: ids }, sent: false, claimedId: { $exists: false } },
        { $set: { claimedId: claimId, claimedAt: new Date() } }
      )

      if (!res || res.modifiedCount === 0) return

      const claimedDocs = await Notification.find({ claimedId: claimId })

      for (const n of claimedDocs) {
        try {
          try {
            io.to(String(n.userId)).emit('notification', n)
          } catch (err) {
            console.warn('Failed to emit notification via socket', err)
          }

          // Send email notification if enabled
          try {
            if (mailTransporter) {
              const user = await User.findById(n.userId).lean()
              if (user && user.email && user.settings?.notifications?.email) {
                // Check notification type and user preferences
                let shouldSendEmail = false
                const notifType = n.type || 'reminders'
                
                if (notifType === 'reminder' && user.settings.notifications.email.reminders) {
                  shouldSendEmail = true
                } else if (notifType === 'achievement' && user.settings.notifications.email.achievements) {
                  shouldSendEmail = true
                } else if (notifType === 'social' && user.settings.notifications.email.social) {
                  shouldSendEmail = true
                } else if (notifType === 'career' && user.settings.notifications.email.career) {
                  shouldSendEmail = true
                }

                if (shouldSendEmail) {
                  const from = process.env.FROM_EMAIL || `no-reply@${process.env.SMTP_HOST || 'riseready.app'}`
                  await mailTransporter.sendMail({
                    from,
                    to: user.email,
                    subject: n.title || 'Notification from RiseReady',
                    text: `${n.message || ''}\n\nOpen: ${process.env.APP_URL || ''}${n.link || ''}`,
                    html: `<p>${n.message || ''}</p><p><a href="${(process.env.APP_URL || '') + (n.link || '')}">Open event</a></p>`
                  })
                }
              }
            }
          } catch (err) {
            console.warn('Failed to send email notification', err)
          }

          // Send push notification if enabled
          try {
            const user = await User.findById(n.userId).lean()
            if (user && user.settings?.notifications?.push) {
              // Check notification type and user preferences
              let shouldSendPush = false
              const notifType = n.type || 'reminders'
              
              if (notifType === 'reminder' && user.settings.notifications.push.reminders) {
                shouldSendPush = true
              } else if (notifType === 'achievement' && user.settings.notifications.push.achievements) {
                shouldSendPush = true
              } else if (notifType === 'social' && user.settings.notifications.push.social) {
                shouldSendPush = true
              } else if (notifType === 'career' && user.settings.notifications.push.career) {
                shouldSendPush = true
              }

              if (shouldSendPush) {
                io.to(String(n.userId)).emit('push-notification', {
                  title: n.title || 'RiseReady Notification',
                  body: n.message,
                  data: { link: n.link }
                })
              }
            }
          } catch (err) {
            console.warn('Failed to send push notification', err)
          }

          // mark as sent
          n.sent = true
          n.sentAt = new Date()
          await n.save()
        } catch (err) {
          console.error('Failed to process scheduled notification', err)
        }
      }
    } catch (err) {
      console.error('Notification worker error', err)
    }
  }

  // Run immediately and then on interval
  runOnce().catch(() => {})
  const timer = setInterval(runOnce, intervalMs)
  return () => clearInterval(timer)
}
