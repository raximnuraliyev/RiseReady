// src/types/progress.d.ts
export interface UserProgress {
  level: number
  experience: number
  nextLevelXp: number
  projects: {
    total: number
    completed: number
    active: number
    pending: number
  }
  history: Array<{
    date: string
    metric: string
    value: number
    change: number
  }>
}

export interface Reminder {
  id: string
  title: string
  time: string
  type: 'calendar' | 'task'
}