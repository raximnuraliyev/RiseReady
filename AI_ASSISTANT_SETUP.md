# RiseReady AI Assistant - Setup & Integration Guide

## Overview

The RiseReady AI Assistant is a context-aware chatbot embedded throughout the platform that helps users navigate features, get guidance, and understand how to use RiseReady's modules. It uses OpenRouter's API with intelligent caching to reduce costs while providing personalized, helpful responses.

## Features

- 🤖 **Context-Aware**: Understands which page the user is on and tailors responses accordingly
- 💬 **Smart Caching**: Reduces API costs by caching similar questions and reusing answers
- ✨ **Animated UI**: Beautiful orb widget with smooth transitions and responsive design
- 📱 **Mobile Responsive**: Works seamlessly on all device sizes
- 📊 **Analytics**: Track engagement, satisfaction rates, and usage metrics
- 🔒 **Privacy-First**: Works with optional authentication, respects user data

## Backend Setup

### 1. Environment Variables

Add these to your `.env` file in the `server` directory:

```env
OPENROUTER_API_KEY=YOUR_OWN_KEY
APP_URL=http://localhost:5173  # Your frontend URL
```

### 2. Database Models

The following MongoDB models are automatically created:

- **AIAssistant**: Stores conversation sessions, messages, and feedback
- **AICache**: Stores cached Q&A to reduce API calls

### 3. API Endpoints

The AI assistant uses the following endpoints:

#### Create or Get Session
- **POST** `/api/ai/session`
- Creates a new conversation session or returns existing one
- Optional authentication (works for both logged-in and guest users)

#### Chat
- **POST** `/api/ai/chat`
- Sends a message and receives AI response
- Automatically checks cache first, then calls API if needed
- Returns cached answer status

#### Get History
- **GET** `/api/ai/history/:sessionId`
- Retrieves full conversation history for a session

#### Submit Feedback
- **POST** `/api/ai/feedback`
- Records user feedback (helpful/not helpful)
- Helps improve assistant over time

#### Analytics (Admin)
- **GET** `/api/ai/analytics?startDate=X&endDate=Y`
- Returns metrics: sessions, messages, cache hit rate, satisfaction rate, etc.

#### Maintenance
- **POST** `/api/ai/maintenance/clear-sessions?days=30`
- Clears old sessions to manage database size

### 4. System Prompt Customization

The AI assistant uses a detailed system prompt to stay focused on RiseReady. You can customize this in `server/src/controllers/aiController.js`. The current prompt includes:

- List of RiseReady features (Focus, Calendar, Budget, etc.)
- Instructions to stay on-topic
- Personality guidelines (friendly, helpful, knowledgeable)
- Rules for handling out-of-scope questions

Example customization:

```javascript
const SYSTEM_PROMPT = `You are RiseReady Assistant...
// Add or modify RiseReady features list
// Adjust personality tone
// Add domain-specific knowledge
`
```

## Frontend Setup

### 1. Environment Variables

Add this to your `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Integrate AI Assistant Component

Add the AI Assistant to your main App layout (`src/App.tsx`):

```tsx
import AIAssistant from './components/AIAssistant'
import { useAIAssistantContext } from './hooks/useAIAssistant'

function App() {
  const pageContext = useAIAssistantContext()
  
  return (
    <div className="app">
      {/* Your existing layout */}
      <AIAssistant pageContext={pageContext} />
    </div>
  )
}
```

### 3. Use Context-Aware Hooks

The `useAIAssistant` hook provides context awareness:

```tsx
import { useAIAssistantContext, useContextSuggestions } from './hooks/useAIAssistant'

function MyComponent() {
  const pageContext = useAIAssistantContext()  // 'Focus', 'Budget', etc.
  const suggestions = useContextSuggestions(pageContext)
  
  return <div>{/* Component code */}</div>
}
```

### 4. Use Analytics Hook

Track assistant metrics:

```tsx
import { useAIAnalytics } from './hooks/useAIAnalytics'

function AnalyticsDashboard() {
  const { metrics, isLoading } = useAIAnalytics()
  
  return (
    <div>
      <p>Total Sessions: {metrics?.totalSessions}</p>
      <p>Help Rate: {metrics?.helpfulRate}%</p>
      <p>Cache Hit Rate: {metrics?.cacheHitRate}%</p>
    </div>
  )
}
```

## Usage

### For Users

1. **Open Assistant**: Click the animated green orb in the bottom-right corner
2. **Ask Questions**: Type any question about RiseReady
3. **Use Quick Replies**: Click suggested questions for common topics
4. **Provide Feedback**: Rate if the response was helpful
5. **New Conversation**: Click the refresh button to start over

### For Developers

#### Get Session ID
```typescript
const response = await axios.post('/api/ai/session', {
  metadata: { pageContext: 'Focus' }
})
const sessionId = response.data.sessionId
```

#### Send Message
```typescript
const response = await axios.post('/api/ai/chat', {
  sessionId,
  message: 'How do I start a focus session?',
  pageContext: 'Focus'
})
const assistantResponse = response.data.message
```

#### Submit Feedback
```typescript
await axios.post('/api/ai/feedback', {
  sessionId,
  messageIndex: 5,
  helpful: true,
  comment: 'Very helpful!'
})
```

#### Get Analytics
```typescript
const response = await axios.get('/api/ai/analytics', {
  params: {
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  }
})
```

## Customization

### Styling

The assistant uses RiseReady's green/gold color scheme. To customize:

1. Edit `src/components/AIAssistant.css`
2. Main colors:
   - Green: `#22c55e` (primary), `#16a34a` (dark)
   - Gold: Add to gradients as needed

### Quick Reply Suggestions

Modify `QUICK_REPLY_SUGGESTIONS` in `src/components/AIAssistant.tsx`:

```tsx
const QUICK_REPLY_SUGGESTIONS = [
  { text: 'Your custom question', icon: '🎯' },
  // Add more suggestions
]
```

### Behavior Rules

Customize assistant behavior in `server/src/controllers/aiController.js`:

```javascript
// Adjust similarity threshold for cache matching
const bestSimilarity = 0.65  // Change to 0.7+ for stricter matching

// Modify response temperature
temperature: 0.7  // Lower = more consistent, Higher = more creative

// Adjust max tokens
max_tokens: 500  // Shorter/longer responses
```

## Cost Optimization

### How Caching Works

1. **Exact Match**: If question hash matches cached answer, use cache immediately
2. **Similarity Match**: If 65%+ similar to cached question, use cached answer
3. **New Question**: If no match, call OpenRouter API and cache result
4. **Automatic Reuse**: Future similar questions use cache instead of API

### Monitor Usage

```bash
# Get analytics with date range
curl http://localhost:5000/api/ai/analytics?startDate=2024-01-01&endDate=2024-01-31

# Check cache hit rate
metrics.cacheHitRate  # Percentage of queries served from cache
```

### Cost Estimates

- **API Call**: ~$0.0005 per query (gpt-3.5-turbo, ~300 tokens avg)
- **100 queries/day with 70% cache hit**: ~$0.015/day = ~$0.45/month
- **1000 queries/day with 80% cache hit**: ~$0.10/day = ~$3/month

## Troubleshooting

### Assistant Not Responding

1. Check `OPENROUTER_API_KEY` is set correctly
2. Verify MongoDB connection
3. Check browser console for errors
4. Test API directly: `POST /api/ai/chat`

### Cache Not Working

1. Verify MongoDB cache model created
2. Check `calculateSimilarity` threshold (default 0.65)
3. Review cache logs: `AICache.find({})`

### Session Issues

1. Session ID should be generated automatically
2. If missing, check `/api/ai/session` endpoint
3. Sessions persist in MongoDB for 30 days by default

### Style Issues

1. Verify CSS file imported correctly
2. Check for CSS conflicts with Tailwind
3. Inspect `.ai-assistant-container` in DevTools

## API Model Selection

The assistant currently uses `gpt-3.5-turbo` (as fallback for gpt-5.1 availability through OpenRouter). To use other models:

```javascript
// In aiController.js
model: 'openai/gpt-4-turbo',  // More expensive but better
model: 'anthropic/claude-3-sonnet',  // Alternative provider
model: 'meta-llama/llama-2-70b',  // Open source option
```

## Deployment Checklist

- [ ] Set `OPENROUTER_API_KEY` in production env
- [ ] Update `APP_URL` to production domain
- [ ] Update `VITE_API_URL` in frontend
- [ ] Test all API endpoints
- [ ] Verify database indexes created for performance
- [ ] Set up analytics monitoring
- [ ] Configure cache clear schedule (optional)
- [ ] Test on mobile devices
- [ ] Set up error monitoring/logging

## Performance Tips

1. **Increase Caching**: Lower similarity threshold to cache more questions
2. **Batch Queries**: Aggregate analytics calls
3. **Index Database**: Ensure MongoDB indexes on frequently queried fields
4. **Rate Limiting**: Consider adding rate limits per user/session
5. **Lazy Load**: Component loads only when user opens chat window

## Next Steps

1. **Phase 2**: Add proactive suggestions when user lands on feature pages
2. **Phase 3**: Implement conversation memory for multi-turn context
3. **Phase 4**: Build admin dashboard to manage cache and analytics
4. **Phase 5**: Add voice input/output for accessibility
5. **Phase 6**: Integrate with email/notification system

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review API logs: `POST /api/ai/chat` responses
3. Check OpenRouter API status
4. Review MongoDB logs for errors

---

**Last Updated**: November 2024
**Status**: Production Ready
