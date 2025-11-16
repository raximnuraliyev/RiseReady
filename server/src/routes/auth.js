import { Router } from 'express'
import { validate, schemas } from '../middleware/validate.js'
import { signup, login, getCurrentUser } from '../controllers/authController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

// Auth routes
router.post('/signup', validate(schemas.signup), signup)
router.post('/login', validate(schemas.login), login)
router.get('/me', auth, getCurrentUser)

export default router
