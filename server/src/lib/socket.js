import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'

let io = null

export function initSocket(server) {
  if (io) return io
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    }
  })

  io.on('connection', (socket) => {
    try {
      // Attempt to get token from handshake auth
      const token = socket.handshake.auth && socket.handshake.auth.token
      if (token) {
        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
          const userId = payload.sub || payload.id || payload._id
          if (userId) {
            socket.join(String(userId))
          }
        } catch (err) {
          // ignore token errors for socket; client may join later via 'join' message
        }
      }

      socket.on('join', (data) => {
        if (data && data.userId) {
          socket.join(String(data.userId))
        }
      })

      // Allow a trusted worker process to ask the server to emit a notification
      socket.on('emitNotification', (data) => {
        try {
          const secret = data && data.secret
          if (!secret || secret !== process.env.WORKER_SECRET) {
            console.warn('Rejected emitNotification from unauthenticated socket')
            return
          }
          const { userId, notification } = data
          if (!userId || !notification) return
          io.to(String(userId)).emit('notification', notification)
        } catch (err) {
          console.warn('emitNotification handler error', err)
        }
      })

      socket.on('disconnect', () => {
        // noop
      })
    } catch (err) {
      console.error('Socket connection error', err)
    }
  })

  return io
}

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}
