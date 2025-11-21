import express from 'express'
import { auth } from '../middleware/auth.js'
import {
  getUserProjects,
  createProject,
  updateProject,
  joinProject,
  leaveProject,
  addTask,
  toggleTask,
  addMessage,
  uploadFile,
  removeMember
} from '../controllers/projectController.js'

const router = express.Router()

// Project CRUD
router.get('/', auth, getUserProjects)
router.post('/', auth, createProject)
router.put('/:projectId', auth, updateProject)

// Project membership
router.post('/join', auth, joinProject)
router.post('/:projectId/leave', auth, leaveProject)
router.delete('/:projectId/members/:memberId', auth, removeMember)

// Tasks
router.post('/:projectId/tasks', auth, addTask)
router.put('/:projectId/tasks/:taskId', auth, toggleTask)

// Messages
router.post('/:projectId/messages', auth, addMessage)

// Files
router.post('/:projectId/files', auth, uploadFile)

export default router