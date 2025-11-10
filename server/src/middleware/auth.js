import jwt from 'jsonwebtoken'

// Middleware to authenticate requests
export function auth(req, res, next) {
  try {
    // Get token from header
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' })
    }

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    
    // Add user info to request (provide both `sub` and `id` for compatibility)
    const userId = payload.sub || payload.id || payload._id
    req.user = {
      sub: String(userId),
      id: String(userId),
      role: payload.role
    }

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }
    console.error('Auth middleware error:', error)
    res.status(401).json({ error: 'Authentication failed' })
  }
}

// Middleware to check admin role
export function adminRequired(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

// Optional auth middleware - doesn't require auth but adds user if present
export function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
      const userId = payload.sub || payload.id || payload._id
      req.user = {
        sub: String(userId),
        id: String(userId),
        role: payload.role
      }
    }
    
    next()
  } catch (error) {
    // Continue without user info if token is invalid
    next()
  }
}
