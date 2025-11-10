import express from 'express'
import { getProgress, updateProjectStatus, getReminders, addExperience } from '../controllers/progressController.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

router.get('/progress', auth, getProgress)
router.get('/reminders', auth, getReminders)
router.post('/progress/project', auth, updateProjectStatus)
router.post('/progress/xp', auth, addExperience)

export default router