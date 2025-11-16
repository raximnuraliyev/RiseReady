import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardProvider } from '../contexts/DashboardContext'
import DashboardLayout from '../pages/dashboard/DashboardLayout'
import OverviewPage from '../pages/dashboard/OverviewPage'
import NotificationsPage from '../pages/dashboard/NotificationsPage'
import CalendarPage from '../pages/dashboard/CalendarPage'
import SkillsPage from '../pages/dashboard/SkillsPage'
import BudgetPage from '../pages/dashboard/BudgetPage'
import WellbeingPage from '../pages/dashboard/WellbeingPage'
import FocusPage from '../pages/dashboard/FocusPage'
import CareerPage from '../pages/dashboard/CareerPage'
import CommunityPage from '../pages/dashboard/CommunityPage'
import ProjectsPage from '../pages/dashboard/ProjectsPage'
import InternshipsPage from '../pages/dashboard/InternshipsPage'
import ProfilePage from '../pages/dashboard/ProfilePage'
import SettingsPage from '../pages/dashboard/SettingsPage'

const DashboardRoutes: React.FC = () => {
  return (
    <DashboardProvider>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="wellbeing" element={<WellbeingPage />} />
          <Route path="focus" element={<FocusPage />} />
          <Route path="career" element={<CareerPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="internships" element={<InternshipsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </DashboardProvider>
  )
}

export default DashboardRoutes