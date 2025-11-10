import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Bell,
  Calendar,
  Award,
  Wallet,
  HeartPulse,
  Target,
  Rocket,
  Users,
  FolderKanban,
  Briefcase,
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
  { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
  { icon: Award, label: 'Skills', path: '/dashboard/skills' },
  { icon: Wallet, label: 'Budget', path: '/dashboard/budget' },
  { icon: HeartPulse, label: 'Well-being', path: '/dashboard/wellbeing' },
  { icon: Target, label: 'Focus', path: '/dashboard/focus' },
  { icon: Rocket, label: 'Career', path: '/dashboard/career' },
  { icon: Users, label: 'Community', path: '/dashboard/community' },
  { icon: FolderKanban, label: 'Projects', path: '/dashboard/projects' },
  { icon: Briefcase, label: 'Internships', path: '/dashboard/internships' },
]

const DashboardNav: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const active = isActive(item.path)
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              active
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon
              className={`mr-3 flex-shrink-0 h-5 w-5 ${
                active ? 'text-white' : 'text-gray-400'
              }`}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default DashboardNav