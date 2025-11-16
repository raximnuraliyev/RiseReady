import express from 'express'
import { auth } from '../middleware/auth.js'
import {
  getMentors,
  getMentorById,
  getResources,
  getResourceById,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  getSummary
} from '../controllers/careerController.js'

const router = express.Router()

// All career routes require authentication
router.use(auth)

// Mentor routes (read-only for users)
router.get('/mentors', getMentors)
router.get('/mentors/:id', getMentorById)

// Resource routes (read-only for users)
router.get('/resources', getResources)
router.get('/resources/:id', getResourceById)

// Task routes (user-specific CRUD)
router.get('/tasks', getTasks)
router.post('/tasks', createTask)
router.put('/tasks/:id', updateTask)
router.delete('/tasks/:id', deleteTask)
router.get('/tasks/stats', getTaskStats)
router.get('/summary', getSummary)

export default router
