# RiseReady AI Assistant - Quick Start Guide

## 5-Minute Setup

### Step 1: Set Environment Variables

**Server** (`.env` in `server/` folder):
```env
OPENROUTER_API_KEY=YOUR OWN KEY
APP_URL=http://localhost:5173
```

**Frontend** (`.env.local` in root folder):
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Add AI Routes (Already Done ✅)

The AI routes are already imported in `server/src/app.js`:
```javascript
import aiRoutes from './routes/ai.js'
app.use('/api/ai', aiRoutes)
```

### Step 3: Add to App Layout

Edit `src/App.tsx` and add:

```tsx
import AIAssistant from './components/AIAssistant'
import { useAIAssistantContext } from './hooks/useAIAssistant'

function AppContent() {
  const pageContext = useAIAssistantContext()
  
  return (
    <div className="app">
      {/* Existing routes and components */}
      <Routes>
        {/* Your routes here */}
      </Routes>
      
      {/* Add this line */}
      <AIAssistant pageContext={pageContext} />
    </div>
  )
}
```

### Step 4: Start Both Servers

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev --prefix server
```

### Step 5: Test It!

1. Open http://localhost:5173
2. Look for the green orb in the bottom-right corner
3. Click it to open the chat
4. Ask: "What is RiseReady?"

That's it! 🎉

---

## What's Included

### Backend Files Created:
- `server/src/models/AIAssistant.js` - Conversation storage
- `server/src/models/AICache.js` - Answer caching
- `server/src/controllers/aiController.js` - Main logic
- `server/src/routes/ai.js` - API endpoints

### Frontend Files Created:
- `src/components/AIAssistant.tsx` - Main component
- `src/components/AIAssistant.css` - Styling
- `src/hooks/useAIAssistant.ts` - Context awareness
- `src/hooks/useAIAnalytics.ts` - Analytics tracking
- `src/pages/AIAnalyticsDashboard.tsx` - Analytics page
- `src/styles/AIAnalytics.css` - Analytics styling

### Documentation:
- `AI_ASSISTANT_SETUP.md` - Full setup guide
- `AI_ASSISTANT_INTEGRATION_EXAMPLE.tsx` - Integration example
- `QUICK_START.md` - This file

---

## How It Works

### User Flow
```
User clicks orb
    ↓
Chat window opens with greeting
    ↓
User types question
    ↓
System checks cache for similar answers
    ↓
If cache hit → return cached answer (fast!)
If cache miss → call OpenRouter API (slower, costs money)
    ↓
Add assistant response to chat
    ↓
User sees answer, can provide feedback
    ↓
Save conversation to database
```

### Cost Saving
- **First time** someone asks "How do I start a focus session?" → API call ($0.0005)
- **Second time** anyone asks similar question → Cache hit (free!)
- **Result**: 70-80% of queries typically served from cache

---

## Key Features

### 🎯 Context Awareness
The assistant knows which page the user is on:
- On Focus page? Suggestions about focus sessions
- On Calendar page? Help with event management
- Generic page? General RiseReady help

### 💬 Quick Replies
First-time users see 4 quick suggestion buttons to get started quickly.

### 👍 Feedback System
Users rate if responses are helpful, improving the system over time.

### 📊 Analytics
Track:
- How many people use the assistant
- Which features get the most questions
- How satisfied users are
- How much money you're saving with caching

### 📱 Mobile Friendly
Works perfectly on phones and tablets.

---

## Customization Ideas

### Change the Greeting
Edit `src/components/AIAssistant.tsx`, line ~70:

```tsx
content: "Hey there! 👋 I'm RiseReady Assistant — how can I help you today?"
```

### Change Colors
Edit `src/components/AIAssistant.css`:

```css
.ai-orb {
  background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR_DARK 100%);
}
```

### Change Personality
Edit `server/src/controllers/aiController.js`, the `SYSTEM_PROMPT`:

```javascript
const SYSTEM_PROMPT = `You are RiseReady Assistant...
// Change tone, add personality, customize behavior
`
```

### Add More Quick Suggestions
Edit `src/components/AIAssistant.tsx`:

```tsx
const QUICK_REPLY_SUGGESTIONS = [
  { text: "Your question", icon: '💡' },
  // Add more
]
```

---

## Troubleshooting

### Orb Not Showing?
- Check if component is added to App.tsx
- Check browser console for errors
- Verify CSS is imported

### Chat Not Responding?
- Check `OPENROUTER_API_KEY` is correct
- Check MongoDB is running
- Open browser console, look for error messages
- Try refreshing the page

### Responses Are Slow?
- This is normal for first API call (usually 2-3 seconds)
- Cache hits should be instant
- Check your internet connection

### Getting Errors?
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check frontend env
echo $VITE_API_URL

# Check API key
echo $OPENROUTER_API_KEY | head -c 20
```

---

## Next Steps

### Immediate (Do Now):
1. ✅ Add to App layout
2. ✅ Start both servers
3. ✅ Test the chat
4. ✅ Ask a few questions

### Short Term (This Week):
1. Customize system prompt for your brand
2. Add custom quick suggestions
3. Change colors to match branding
4. Test on mobile

### Medium Term (This Month):
1. Build analytics dashboard (template provided)
2. Monitor cache hit rates
3. Improve system prompt based on feedback
4. Add to help documentation

### Long Term (This Quarter):
1. Integrate with email support
2. Add proactive tips
3. Collect user feedback for improvements
4. Expand knowledge base

---

## API Reference (Quick)

### Initialize Session
```bash
curl -X POST http://localhost:5000/api/ai/session \
  -H "Content-Type: application/json" \
  -d '{"metadata":{"pageContext":"Focus"}}'
```

Response: `{"sessionId":"session_123..."}`

### Send Message
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId":"session_123...",
    "message":"How do I use focus?",
    "pageContext":"Focus"
  }'
```

Response: `{"message":"...assistant response...","usedCache":false}`

### Get Analytics
```bash
curl http://localhost:5000/api/ai/analytics
```

Response: Detailed metrics about usage and satisfaction

---

## Performance Notes

- **First load**: ~500ms (component loads, session created)
- **User message send**: 2-3 seconds (first API call) or 100ms (cached)
- **Storage**: ~1-2KB per conversation
- **Database**: MongoDB, auto-indexed for performance

---

## Support

- **Setup Issues**: Check `AI_ASSISTANT_SETUP.md`
- **Code Examples**: Check `AI_ASSISTANT_INTEGRATION_EXAMPLE.tsx`
- **Full Details**: Check `AI_ASSISTANT_SETUP.md` for complete reference
- **Errors**: Check browser console and server logs

---

## File Checklist

After setup, you should have:

```
✅ server/src/models/AIAssistant.js
✅ server/src/models/AICache.js
✅ server/src/controllers/aiController.js
✅ server/src/routes/ai.js
✅ src/components/AIAssistant.tsx
✅ src/components/AIAssistant.css
✅ src/hooks/useAIAssistant.ts
✅ src/hooks/useAIAnalytics.ts
✅ src/pages/AIAnalyticsDashboard.tsx
✅ src/styles/AIAnalytics.css
✅ .env file (server) with OPENROUTER_API_KEY
✅ .env.local file (root) with VITE_API_URL
```

---

## Success Criteria

When everything is working:

1. ✅ Green orb visible in bottom-right
2. ✅ Can click orb to open chat
3. ✅ Can type and get responses
4. ✅ Quick reply buttons show on first message
5. ✅ Feedback buttons appear after responses
6. ✅ Can refresh for new conversation
7. ✅ Works on mobile
8. ✅ Analytics endpoint returns data

---

**Ready? Get started! 🚀**

After adding the component to App.tsx and setting env variables, your AI assistant will be live in 5 minutes!

