import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validate.js'
import { me, updateProfile, updateSettings, getStats, getRecentActivity } from '../controllers/userController.js'

const router = Router()

router.get('/me', auth, me)
router.put('/me', auth, validate(schemas.updateProfile), updateProfile)
router.put('/me/settings', auth, validate(schemas.settings), updateSettings)
router.get('/stats', auth, getStats)
router.get('/activity', auth, getRecentActivity)

export default router
