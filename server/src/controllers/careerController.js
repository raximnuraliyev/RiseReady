import { Mentor, Resource, CareerTask } from '../models/Career.js'
import { User } from '../models/User.js'

// ============ MENTORS ============

export const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().sort({ rating: -1, sessionsCount: -1 })
    res.json(mentors)
  } catch (error) {
    console.error('Error fetching mentors:', error)
    res.status(500).json({ message: 'Failed to fetch mentors', error: error.message })
  }
}

export const getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' })
    }
    res.json(mentor)
  } catch (error) {
    console.error('Error fetching mentor:', error)
    res.status(500).json({ message: 'Failed to fetch mentor', error: error.message })
  }
}

// ============ RESOURCES ============

export const getResources = async (req, res) => {
  try {
    const { category, type, difficulty } = req.query
    const filter = {}
    
    if (category) filter.category = category
    if (type) filter.type = type
    if (difficulty) filter.difficulty = difficulty

    const resources = await Resource.find(filter).sort({ createdAt: -1 })
    res.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    res.status(500).json({ message: 'Failed to fetch resources', error: error.message })
  }
}

export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' })
    }
    res.json(resource)
  } catch (error) {
    console.error('Error fetching resource:', error)
    res.status(500).json({ message: 'Failed to fetch resource', error: error.message })
  }
}

// ============ CAREER TASKS (User-specific) ============

export const getTasks = async (req, res) => {
  try {
    const tasks = await CareerTask.find({ userId: req.user.id })
      .sort({ completed: 1, priority: -1, dueDate: 1 })
    res.json(tasks)
  } catch (error) {
    console.error('Error fetching career tasks:', error)
    res.status(500).json({ message: 'Failed to fetch career tasks', error: error.message })
  }
}

export const createTask = async (req, res) => {
  try {
    const { title, description, category, dueDate, priority } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const task = new CareerTask({
      userId: req.user.id,
      title,
      description: description || '',
      category: category || 'General',
      dueDate: dueDate || null,
      priority: priority || 'medium',
      completed: false
    })

    await task.save()
    res.status(201).json(task)
  } catch (error) {
    console.error('Error creating career task:', error)
    res.status(500).json({ message: 'Failed to create career task', error: error.message })
  }
}

export const updateTask = async (req, res) => {
  try {
    const task = await CareerTask.findOne({ _id: req.params.id, userId: req.user.id })
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const { title, description, category, completed, dueDate, priority } = req.body

    if (title !== undefined) task.title = title
    if (description !== undefined) task.description = description
    if (category !== undefined) task.category = category
    if (completed !== undefined) {
      const wasCompleted = task.completed
      task.completed = completed
      
      // Award points when task is completed
      if (!wasCompleted && completed) {
        const user = await User.findById(req.user.id)
        if (user) {
          await user.addPoints(15) // Career task completion: +15 points
        }
      }
    }
    if (dueDate !== undefined) task.dueDate = dueDate
    if (priority !== undefined) task.priority = priority

    await task.save()
    res.json(task)
  } catch (error) {
    console.error('Error updating career task:', error)
    res.status(500).json({ message: 'Failed to update career task', error: error.message })
  }
}

export const deleteTask = async (req, res) => {
  try {
    const task = await CareerTask.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting career task:', error)
    res.status(500).json({ message: 'Failed to delete career task', error: error.message })
  }
}

// ============ STATISTICS ============

export const getTaskStats = async (req, res) => {
  try {
    const tasks = await CareerTask.find({ userId: req.user.id })
    
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      byPriority: {
        high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
        medium: tasks.filter(t => t.priority === 'medium' && !t.completed).length,
        low: tasks.filter(t => t.priority === 'low' && !t.completed).length
      },
      byCategory: {}
    }

    // Count by category
    tasks.forEach(task => {
      if (!stats.byCategory[task.category]) {
        stats.byCategory[task.category] = 0
      }
      stats.byCategory[task.category]++
    })

    res.json(stats)
  } catch (error) {
    console.error('Error fetching task stats:', error)
    res.status(500).json({ message: 'Failed to fetch task stats', error: error.message })
  }
}

// Summary used by dashboard
export const getSummary = async (req, res) => {
  try {
    const tasks = await CareerTask.find({ userId: req.user.id })
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    res.json({ tasks: total, completed })
  } catch (error) {
    console.error('Error fetching career summary:', error)
    res.status(500).json({ message: 'Failed to fetch career summary', error: error.message })
  }
}
