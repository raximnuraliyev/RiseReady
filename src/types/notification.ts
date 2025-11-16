export type AppNotification = {
  _id: string
  type: 'reminder' | 'achievement' | 'alert' | 'social' | 'career'
  title: string
  message: string
  link?: string
  isRead: boolean
  priority: 'high' | 'medium' | 'low'
  createdAt: string
}

export default AppNotification
