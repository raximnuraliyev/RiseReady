import { Router } from 'express'
import {
  linkTelegramAccount,
  botCreateFocus,
  botCheckIn,
  botGetStats,
  botGetBadges,
  botGetInternships,
  botGetLeaderboard,
  botGetSettings,
  botUpdateSettings
} from '../controllers/telegramController.js'

const router = Router()

router.post('/telegram/link', linkTelegramAccount)
router.post('/telegram/focus', botCreateFocus)
router.post('/telegram/checkin', botCheckIn)
router.get('/telegram/stats', botGetStats)
router.get('/telegram/badges', botGetBadges)
router.get('/telegram/internships', botGetInternships)
router.get('/telegram/leaderboard', botGetLeaderboard)
router.get('/telegram/settings', botGetSettings)
router.put('/telegram/settings', botUpdateSettings)

export default router
