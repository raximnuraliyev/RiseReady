import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { getCheckIns, createCheckIn, getStreak, getBestDay, getStats } from '../controllers/checkInsController.js'

const router = Router()

router.get('/', auth, getCheckIns)
router.post('/', auth, createCheckIn)
router.get('/streak', auth, getStreak)
router.get('/best-day', auth, getBestDay)
router.get('/stats', auth, getStats)

export default router
