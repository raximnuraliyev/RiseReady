import { io, Socket } from 'socket.io-client'
import type { AppNotification } from '../types/notification'

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
  : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4000')

let socket: Socket | null = null

export function connectSocket(): Socket {
  if (socket) return socket
  const token = localStorage.getItem('token')

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
  })

  socket.on('connect_error', (err: unknown) => {
    // err may be an Error or string
    console.warn('Socket connect error', err)
  })

  return socket
}

export function onNotification(cb: (payload: AppNotification) => void) {
  const s = connectSocket()
  s.on('notification', cb)
  return () => s.off('notification', cb)
}

export function joinUserRoom(userId: string) {
  const s = connectSocket()
  s.emit('join', { userId })
}

export function disconnectSocket() {
  if (!socket) return
  socket.disconnect()
  socket = null
}

export function getSocket() {
  return socket
}

export default { connectSocket, onNotification, joinUserRoom, disconnectSocket, getSocket }
