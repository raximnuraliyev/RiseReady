import dotenv from 'dotenv'
import app from './app.js'
import { connectDB } from './config/db.js'
import mongoose from 'mongoose'

dotenv.config()

const PORT = process.env.PORT || 4000

async function start() {
  try {
    await connectDB()
    
    // Log all unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('[server] Unhandled Promise Rejection:', reason)
    })

    // Log all uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('[server] Uncaught Exception:', error)
      // Don't exit immediately to allow logging to complete
      setTimeout(() => process.exit(1), 100)
    })

    // Try to listen on the configured port. If occupied, try the next port (PORT+1)
    async function tryListen(startPort, attempts = 3) {
      let port = startPort
      for (let i = 0; i < attempts; i++) {
        try {
          const server = app.listen(port, '0.0.0.0', () => {
            console.log(`[server] listening on port ${port} (all interfaces)`)
          })

          server.on('error', (error) => {
            console.error('[server] server error:', error)
          })

          return server
        } catch (err) {
          if (err.code === 'EADDRINUSE') {
            console.warn(`[server] Port ${port} is in use, trying ${port + 1}`)
            port += 1
            continue
          }
          throw err
        }
      }
      throw new Error(`Unable to bind to ports starting at ${startPort}`)
    }

    const server = await tryListen(PORT)

    // Initialize real-time socket server
    try {
      const { initSocket } = await import('./lib/socket.js')
      initSocket(server)
    } catch (err) {
      console.warn('[server] Failed to initialize socket', err)
    }

    // Handle various shutdown signals
    const shutdown = async (signal) => {
      console.info(`[server] ${signal} signal received`)
      try {
        await mongoose.connection.close()
        console.log('[server] database connection closed')
        
        server.close(() => {
          console.log('[server] HTTP server closed')
          process.exit(0)
        })
      } catch (err) {
        console.error('[server] error during shutdown:', err)
        process.exit(1)
      }
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGUSR2', () => shutdown('SIGUSR2')) // For nodemon restarts

    return server // Return server instance for testing
  } catch (err) {
    console.error('[server] startup error:', err)
    throw err
  }
}

// Start server and handle fatal errors
start().catch((err) => {
  console.error('[server] fatal error:', err)
  process.exit(1)
})
