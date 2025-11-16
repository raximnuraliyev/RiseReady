export function notFound(req, res, next) {
  res.status(404)
  next(new Error(`Not Found - ${req.originalUrl}`))
}

export function errorHandler(err, req, res, next) {  
  // Add CORS headers for errors
  res.header('Access-Control-Allow-Origin', 'http://10.30.2.76:5173')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
  
  // Get status from response or error, defaulting to 500
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : err.status || 500
  
  // Determine error type and message
  let message = err.message || 'Server error'
  let details = undefined

  if (err.name === 'ValidationError') {
    // Mongoose validation error
    status = 400
    message = 'Validation error'
    details = Object.values(err.errors).map(e => e.message)
  } else if (err.name === 'MongoError' && err.code === 11000) {
    // Duplicate key error
    status = 400
    message = 'Duplicate key error'
    details = err.keyValue
  }

  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('[error]', err)
  }

  // Ensure CORS headers are set even during errors
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Send error response
  res.status(status).json({
    error: message,
    details: details,
    path: req.path,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  })
}
