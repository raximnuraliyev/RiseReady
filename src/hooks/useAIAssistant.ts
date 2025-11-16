import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

// Map pages to context strings
const PAGE_CONTEXT_MAP: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/focus': 'Focus',
  '/dashboard/calendar': 'Calendar',
  '/dashboard/budget': 'Budget',
  '/dashboard/skills': 'Skills',
  '/dashboard/career': 'Career',
  '/dashboard/internships': 'Internships',
  '/dashboard/projects': 'Projects',
  '/dashboard/wellbeing': 'Wellbeing',
  '/about': 'About',
  '/features': 'Features',
  '/pricing': 'Pricing',
  '/faq': 'FAQ',
  '/login': 'Login',
  '/signup': 'Signup',
  '/contact': 'Contact',
}

export const useAIAssistantContext = () => {
  const location = useLocation()
  const [pageContext, setPageContext] = useState<string>('General')

  useEffect(() => {
    // Find the matching context for current route
    let context = 'General'

    for (const [path, ctx] of Object.entries(PAGE_CONTEXT_MAP)) {
      if (location.pathname.startsWith(path)) {
        context = ctx
        break
      }
    }

    setPageContext(context)
  }, [location.pathname])

  return pageContext
}

// Hook to get suggestions based on context
export const useContextSuggestions = (pageContext: string) => {
  const suggestions: Record<string, string[]> = {
    Dashboard: [
      'Show me my progress',
      'How do I use the dashboard?',
      'What are my stats?',
    ],
    Focus: [
      'How do I start a focus session?',
      'What is the Pomodoro technique?',
      'How to build a streak?',
    ],
    Calendar: [
      'How do I add an event?',
      'What is the calendar feature?',
      'How to manage deadlines?',
    ],
    Budget: [
      'How do I track my spending?',
      'What is budgeting?',
      'How to create a budget?',
    ],
    Skills: [
      'How do I track skills?',
      'How to add new skills?',
      'What is skill development?',
    ],
    Career: [
      'How to find internships?',
      'What is career development?',
      'How to build my resume?',
    ],
    Internships: [
      'How to search for internships?',
      'How to apply for internships?',
      'What are internship opportunities?',
    ],
    Projects: [
      'How to create a project?',
      'What is project management?',
      'How to collaborate?',
    ],
    Wellbeing: [
      'What is the wellbeing check-in?',
      'How to track my mental health?',
      'What are wellbeing resources?',
    ],
    General: [
      'What is RiseReady?',
      'How do I get started?',
      'Tell me about the features',
    ],
  }

  return suggestions[pageContext] || suggestions.General
}
