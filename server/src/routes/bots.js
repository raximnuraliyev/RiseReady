import { Router } from 'express'
import {
	linkDiscordAccount,
	botCreateFocus,
	botCheckIn,
	botGetStats,
	botGetBadges,
	botGetInternships,
	botGetLeaderboard,
	botGetSettings,
	botUpdateSettings,
	botLogout,
	generateLinkCode
} from '../controllers/botsController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.post('/discord/link', linkDiscordAccount)
router.post('/discord/focus', botCreateFocus)
router.post('/discord/checkin', botCheckIn)
router.get('/discord/stats', botGetStats)
router.get('/discord/badges', botGetBadges)
router.get('/discord/internships', botGetInternships)
router.get('/discord/leaderboard', botGetLeaderboard)
router.get('/discord/settings', botGetSettings)
router.put('/discord/settings', botUpdateSettings)
router.post('/discord/logout', botLogout)
// Duplicate routes for Telegram to reuse same controller logic (accepts telegramId or telegramUsername)
router.post('/telegram/link', linkDiscordAccount)
router.post('/telegram/focus', botCreateFocus)
router.post('/telegram/checkin', botCheckIn)
router.get('/telegram/stats', botGetStats)
router.get('/telegram/badges', botGetBadges)
router.get('/telegram/internships', botGetInternships)
router.get('/telegram/leaderboard', botGetLeaderboard)
router.get('/telegram/settings', botGetSettings)
router.put('/telegram/settings', botUpdateSettings)
router.post('/telegram/logout', botLogout)
// Authenticated endpoint used by website to create a short link code for the user to copy into Discord
router.post('/link-code', auth, generateLinkCode)

export default router
