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
  uploadFile
} from '../controllers/projectController.js'

const router = express.Router()

// Project CRUD
router.get('/projects', auth, getUserProjects)
router.post('/projects', auth, createProject)
router.put('/projects/:projectId', auth, updateProject)

// Project membership
router.post('/projects/join', auth, joinProject)
router.post('/projects/:projectId/leave', auth, leaveProject)

// Tasks
router.post('/projects/:projectId/tasks', auth, addTask)
router.put('/projects/:projectId/tasks/:taskId', auth, toggleTask)

// Messages
router.post('/projects/:projectId/messages', auth, addMessage)

// Files
router.post('/projects/:projectId/files', auth, uploadFile)

export default router