import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validate.js'
import { listEvents, createEvent, updateEvent, deleteEvent } from '../controllers/calendarController.js'

const router = Router()

router.get('/events', auth, listEvents)
router.post('/events', auth, validate(schemas.calendarEvent), createEvent)
router.put('/events/:id', auth, validate(schemas.calendarEvent), updateEvent)
router.delete('/events/:id', auth, deleteEvent)

export default router
