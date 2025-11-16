import { Router } from 'express'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/status', auth, async (req, res) => {
  try {
    // Disable caching for this endpoint
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Simple endpoint to verify dashboard is accessible
    res.json({
      status: 'ok',
      userId: req.user.id,
      timestamp: new Date().toISOString(),
      features: {
        focus: true,
        wellbeing: true,
        skills: true,
        career: true,
      }
    })
  } catch (error) {
    console.error('Error checking dashboard status:', error)
    res.status(500).json({ message: 'Failed to get dashboard status' })
  }
})

export default router