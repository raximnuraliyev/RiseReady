# Add AI Assistant to App.tsx - Copy & Paste Guide

## Overview

The AI Assistant component needs to be added to your main App.tsx file. This is a **one-time setup** that takes 2 minutes.

## Current App.tsx Structure

Your App.tsx probably looks like:

```tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DashboardRoutes from './routes/DashboardRoutes'
import Header from './components/Header'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard/*" element={<DashboardRoutes />} />
          {/* Other routes */}
        </Routes>
        <Footer />
      </Router>
    </ErrorBoundary>
  )
}

export default App
```

## Step-by-Step Integration

### Step 1: Add Imports

At the top of App.tsx, add these two lines after your existing imports:

```tsx
import AIAssistant from './components/AIAssistant'
import { AIAssistantProvider } from './hooks/useAIAssistant'
```

**Example - After Step 1:**

```tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DashboardRoutes from './routes/DashboardRoutes'
import Header from './components/Header'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import AIAssistant from './components/AIAssistant'           // ← ADD THIS
import { AIAssistantProvider } from './hooks/useAIAssistant' // ← ADD THIS
import './App.css'
```

### Step 2: Wrap with Provider

Replace the Router component with the AIAssistantProvider wrapper.

**Before:**
```tsx
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard/*" element={<DashboardRoutes />} />
        </Routes>
        <Footer />
      </Router>
    </ErrorBoundary>
  )
}
```

**After:**
```tsx
function App() {
  return (
    <ErrorBoundary>
      <AIAssistantProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard/*" element={<DashboardRoutes />} />
          </Routes>
          <Footer />
          <AIAssistant />
        </Router>
      </AIAssistantProvider>
    </ErrorBoundary>
  )
}
```

## Complete Example

Here's the complete updated App.tsx:

```tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DashboardRoutes from './routes/DashboardRoutes'
import Header from './components/Header'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import AIAssistant from './components/AIAssistant'
import { AIAssistantProvider } from './hooks/useAIAssistant'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <AIAssistantProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard/*" element={<DashboardRoutes />} />
            {/* Other routes */}
          </Routes>
          <Footer />
          <AIAssistant />
        </Router>
      </AIAssistantProvider>
    </ErrorBoundary>
  )
}

export default App
```

## What Changed?

1. **Added imports** (lines 7-8):
   - `AIAssistant` - The component that renders the floating orb
   - `AIAssistantProvider` - Context provider for page detection

2. **Wrapped Router** (line 14):
   - `<AIAssistantProvider>` wraps the entire Router
   - This provides context to the AI component

3. **Added component** (line 26):
   - `<AIAssistant />` - Renders the floating orb
   - Place anywhere inside the provider, typically before closing Router

## Order Matters

The hierarchy should be:

```
ErrorBoundary (outermost)
  ↓
AIAssistantProvider
  ↓
Router
  ↓
Header
Routes
Footer
AIAssistant (renders floating orb)
```

## Verification

After adding the component:

1. **Save the file**
2. **Check browser console** (F12) - should have no errors
3. **Look for the AI orb** - green glowing circle in bottom-right corner
4. **Click the orb** - chat window should open
5. **Send a message** - AI should respond

## Common Issues

### "AIAssistant is not defined"
- Check line 1 has the import
- Check file path is correct: `'./components/AIAssistant'`
- Verify file exists: `src/components/AIAssistant.tsx`

### "AIAssistantProvider is not defined"
- Check line 2 has the import
- Check import path is correct: `'./hooks/useAIAssistant'`
- Verify file exists: `src/hooks/useAIAssistant.ts`

### Orb doesn't appear
- Check AIAssistant component is rendered (line 26)
- Open browser DevTools (F12)
- Check Console for errors
- Check Network tab to see if `/api/ai/session` is being called
- Verify backend is running on port 5000

### Chat doesn't work
- Check browser console for errors
- Verify backend API is running: `curl http://localhost:5000/api/health`
- Check VITE_API_URL is set in `.env.local`
- Verify OpenRouter API key is set in `server/.env`

## Rollback

If you need to remove the AI Assistant:

```tsx
// Remove these imports
import AIAssistant from './components/AIAssistant'
import { AIAssistantProvider } from './hooks/useAIAssistant'

// Replace AIAssistantProvider with just Router
return (
  <ErrorBoundary>
    <Router>
      {/* ... */}
    </Router>
  </ErrorBoundary>
)

// Remove <AIAssistant /> component
```

## Next Steps

1. **Make the change** to App.tsx using the code above
2. **Start the app** with `npm run dev` (frontend only) or `npm run dev:all` (all services)
3. **Test the chat** by clicking the orb and sending messages
4. **Check analytics** at `/dashboard/ai-analytics`
5. **Follow the INTEGRATION_VERIFICATION_CHECKLIST.md** to verify everything works

---

**That's it!** The AI Assistant is now integrated into your app. 🚀

**Time to complete**: 2 minutes  
**Difficulty**: Easy ✅
