import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validate.js'
import { listInternships, applyInternship, listMyApplications } from '../controllers/internshipsController.js'

const router = Router()

router.get('/', auth, listInternships)
router.post('/apply', auth, validate(schemas.internshipApply), applyInternship)
router.get('/applications/me', auth, listMyApplications)

export default router
