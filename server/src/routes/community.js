import express from 'express'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// Get all groups
router.get('/groups', auth, async (req, res) => {
  try {
    // TODO: Replace with actual DB query once model is ready
    const sampleGroups = [
      {
        id: '1',
        name: 'Web Development',
        description: 'Discussion about web technologies and development practices',
        members: 156,
        topics: ['React', 'Node.js', 'JavaScript'],
        recentActivity: true
      },
      {
        id: '2',
        name: 'Career Growth',
        description: 'Share experiences and advice about career development',
        members: 89,
        topics: ['Interviews', 'Resume Tips', 'Networking'],
        recentActivity: false
      },
      {
        id: '3',
        name: 'Student Life',
        description: 'Connect with other students and share resources',
        members: 234,
        topics: ['Study Tips', 'Time Management', 'Campus Life'],
        recentActivity: true
      }
    ]
    res.json(sampleGroups)
  } catch (err) {
    console.error('Error fetching groups:', err)
    res.status(500).json({ message: 'Failed to fetch groups' })
  }
})

// Get group by ID
router.get('/groups/:id', auth, async (req, res) => {
  try {
    // TODO: Replace with actual DB query
    const { id } = req.params
    const group = {
      id,
      name: 'Sample Group',
      description: 'This is a sample group',
      members: 100,
      topics: ['Sample Topic'],
      recentActivity: true
    }
    res.json(group)
  } catch (err) {
    console.error('Error fetching group:', err)
    res.status(500).json({ message: 'Failed to fetch group' })
  }
})

// Create new group
router.post('/groups', auth, async (req, res) => {
  try {
    const { name, description, topics } = req.body
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' })
    }
    // TODO: Replace with actual DB creation
    const newGroup = {
      id: Date.now().toString(),
      name,
      description,
      topics: topics || [],
      members: 1,
      recentActivity: false
    }
    res.status(201).json(newGroup)
  } catch (err) {
    console.error('Error creating group:', err)
    res.status(500).json({ message: 'Failed to create group' })
  }
})

// Join group
router.post('/groups/:id/join', auth, async (req, res) => {
  try {
    const { id } = req.params
    // TODO: Add actual join logic with DB
    res.json({ message: `Successfully joined group ${id}` })
  } catch (err) {
    console.error('Error joining group:', err)
    res.status(500).json({ message: 'Failed to join group' })
  }
})

// Leave group
router.post('/groups/:id/leave', auth, async (req, res) => {
  try {
    const { id } = req.params
    // TODO: Add actual leave logic with DB
    res.json({ message: `Successfully left group ${id}` })
  } catch (err) {
    console.error('Error leaving group:', err)
    res.status(500).json({ message: 'Failed to leave group' })
  }
})

export default router