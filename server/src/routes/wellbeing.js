import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { getStats as getCheckInStats } from '../controllers/checkInsController.js'

const router = Router()

// Map wellbeing endpoints to the existing check-ins controller
router.get('/stats', auth, getCheckInStats)

export default router
