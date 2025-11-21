import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Target,
  HeartPulse,
  Award,
  Rocket,
  CalendarDays,
  DollarSign,
  Users,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Folders
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Overview' },
  { path: '/dashboard/focus', icon: Target, label: 'Focus' },
  { path: '/dashboard/achievements', icon: Award, label: 'Achievements' },
  { path: '/dashboard/projects', icon: Folders, label: 'Projects' },
  { path: '/dashboard/wellbeing', icon: HeartPulse, label: 'Wellbeing' },
  { path: '/dashboard/skills', icon: Award, label: 'Skills' },
  { path: '/dashboard/career', icon: Rocket, label: 'Career' },
  { path: '/dashboard/internships', icon: Briefcase, label: 'Internships' },
  { path: '/dashboard/calendar', icon: CalendarDays, label: 'Calendar' },
  { path: '/dashboard/budget', icon: DollarSign, label: 'Budget' },
  { path: '/dashboard/community', icon: Users, label: 'Community' },
];

const DashboardSidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  return (
    <div className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-20'
    }`}>
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {isOpen && (
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="RiseReady" className="h-8 w-8" />
            <span className="font-semibold text-xl text-primary">RiseReady</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="mt-6 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="absolute bottom-4 w-full px-2">
        <Link
          to="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Settings size={20} />
          {isOpen && <span>Settings</span>}
        </Link>
      </div>
    </div>
  );
};

export default DashboardSidebar;