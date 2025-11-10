import type { ReactElement } from 'react'
import type { LucideProps } from 'lucide-react'
import { Target, HeartPulse, Award, Rocket } from 'lucide-react'

export interface SharedStats {
  focus: {
    totalSessions: number
    streak: number
    todayMinutes: number
  }
  wellbeing: {
    checkIns: number
    streak: number
    moodScore: number
  }
  skills: {
    total: number
    inProgress: number
    completed: number
    lastUpdated: string
  }
  career: {
    tasks: number
    completed: number
    mentorMeetings: number
    upcomingDeadlines: number
  }
}

export interface StatsConfig {
  icon: React.ForwardRefExoticComponent<LucideProps>
  color: string
  path: string
  label: string
  getValue: (stats: SharedStats) => { value: string; subValue?: string }
}

export const statsConfigs: StatsConfig[] = [
  {
    icon: Target,
    color: '#1F4E79',
    path: '/dashboard/focus',
    label: 'Focus Sessions',
    getValue: (stats) => ({
      value: `${stats.focus.totalSessions}`,
      subValue: `${stats.focus.streak} day streak`
    })
  },
  {
    icon: HeartPulse,
    color: '#E11D48',
    path: '/dashboard/wellbeing',
    label: 'Well-being',
    getValue: (stats) => ({
      value: `${stats.wellbeing.streak}`,
      subValue: 'day streak'
    })
  },
  {
    icon: Award,
    color: '#FFB600',
    path: '/dashboard/skills',
    label: 'Skills',
    getValue: (stats) => ({
      value: `${stats.skills.inProgress}/${stats.skills.total}`,
      subValue: 'in progress'
    })
  },
  {
    icon: Rocket,
    color: '#37A6FF',
    path: '/dashboard/career',
    label: 'Career Tasks',
    getValue: (stats) => ({
      value: `${stats.career.completed}/${stats.career.tasks}`,
      subValue: 'completed'
    })
  }
]