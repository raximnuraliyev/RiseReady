// Example integration of AI Assistant into App.tsx

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AIAssistant from './components/AIAssistant'
import { useAIAssistantContext } from './hooks/useAIAssistant'

// Import your existing pages and components
import HomePage from './pages/HomePage'
import DashboardLayout from './pages/dashboard/DashboardLayout'
// ... other imports

export function AppContent() {
  const pageContext = useAIAssistantContext()

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        {/* ... other routes */}
      </Routes>

      {/* AI Assistant - Available on all pages */}
      <AIAssistant pageContext={pageContext} />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
