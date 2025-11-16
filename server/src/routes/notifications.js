import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { listNotifications, markRead, markAllRead } from '../controllers/notificationsController.js'
import { Notification } from '../models/Notification.js'

const router = Router()

router.get('/', auth, listNotifications)
router.put('/:id/read', auth, markRead)
router.post('/markAllRead', auth, markAllRead)
router.delete('/:id', auth, async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
  res.json({ ok: true })
})

export default router
