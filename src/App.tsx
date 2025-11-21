import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import useAuth from './hooks/useAuth'
import AnimatedBackground from './components/AnimatedBackground'
import AIAssistant from './components/AIAssistant'
import { useAIAssistantContext } from './hooks/useAIAssistant'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Route-based code splitting for faster initial load
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))

// Dashboard routes
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'))
const OverviewPage = lazy(() => import('./pages/dashboard/OverviewPage'))
const CalendarPage = lazy(() => import('./pages/dashboard/CalendarPage'))
const SkillsPage = lazy(() => import('./pages/dashboard/SkillsPage'))
const BudgetPage = lazy(() => import('./pages/dashboard/BudgetPage'))
const WellbeingPage = lazy(() => import('./pages/dashboard/WellbeingPage'))
const FocusPage = lazy(() => import('./pages/dashboard/FocusPage'))
const CareerPage = lazy(() => import('./pages/dashboard/CareerPage'))
const CommunityPage = lazy(() => import('./pages/dashboard/CommunityPage'))
const ProjectsPage = lazy(() => import('./pages/dashboard/ProjectsPage'))
const InternshipsPage = lazy(() => import('./pages/dashboard/InternshipsPage'))
const NotificationsPage = lazy(() => import('./pages/dashboard/NotificationsPage'))
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsNew'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

function App() {
  const { isAuthenticated, loading } = useAuth()
  const pageContext = useAIAssistantContext()
  
  if (loading) {
    return <LoadingSpinner />
  }

  const PublicLayout = ({ children }: { children: React.ReactNode }) => (
    <>
      <Header />
      <AnimatedBackground />
      {children}
      <Footer />
    </>
  )

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <ToastContainer position="top-right" />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/features" element={<PublicLayout><FeaturesPage /></PublicLayout>} />
          <Route path="/pricing" element={<PublicLayout><PricingPage /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
          
          {/* Auth routes - no header/footer */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <SignupPage /> : <Navigate to="/dashboard" replace />} 
          />
          
          {/* Protected dashboard routes */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="wellbeing" element={<WellbeingPage />} />
            <Route path="focus" element={<FocusPage />} />
            <Route path="career" element={<CareerPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="internships" element={<InternshipsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* AI Assistant floating orb, mounted globally so it appears on every page */}
        <AIAssistant pageContext={pageContext} />
      </Suspense>
    </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App