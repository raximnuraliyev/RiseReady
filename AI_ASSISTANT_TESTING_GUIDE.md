# AI Assistant Testing Guide

## Pre-Launch Testing Checklist

### ✅ Backend Setup Tests

#### 1. Environment Variables
```bash
# Check OPENROUTER_API_KEY is set
echo $OPENROUTER_API_KEY

# Should output: sk-or-v1-... (first 20+ characters)
# If empty, add to server/.env
```

#### 2. Server Health
```bash
# Terminal: cd server
npm run dev

# In another terminal:
curl http://localhost:5000/api/health
# Expected: {"ok":true}
```

#### 3. Session Creation
```bash
curl -X POST http://localhost:5000/api/ai/session \
  -H "Content-Type: application/json" \
  -d '{"metadata":{"pageContext":"general"}}'

# Expected response:
# {"sessionId":"session_1234567890_abcdef"}
```

#### 4. Chat Endpoint
```bash
# First, create a session (see above, save the sessionId)

curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId":"session_1234567890_abcdef",
    "message":"What is RiseReady?",
    "pageContext":"general"
  }'

# Expected response:
# {
#   "message": "RiseReady is...",
#   "sessionId": "session_...",
#   "usedCache": false,
#   "timestamp": "2024-..."
# }
```

#### 5. Get History
```bash
curl http://localhost:5000/api/ai/history/session_1234567890_abcdef

# Expected response:
# {
#   "sessionId": "...",
#   "messages": [
#     {"role":"user","content":"What is RiseReady?"},
#     {"role":"assistant","content":"RiseReady is..."}
#   ],
#   "metadata": {...},
#   "createdAt": "..."
# }
```

#### 6. Submit Feedback
```bash
curl -X POST http://localhost:5000/api/ai/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId":"session_1234567890_abcdef",
    "messageIndex":0,
    "helpful":true,
    "comment":"Great answer!"
  }'

# Expected: {"success":true}
```

#### 7. Analytics
```bash
curl "http://localhost:5000/api/ai/analytics"

# Expected response with metrics like:
# {
#   "totalSessions": 1,
#   "totalMessages": 2,
#   "cacheHitRate": 0,
#   ...
# }
```

---

### ✅ Frontend Setup Tests

#### 1. Environment File
```bash
# Check .env.local in root directory
cat .env.local

# Should contain:
# VITE_API_URL=http://localhost:5000/api
```

#### 2. Component Imports
```bash
# Verify files exist:
ls src/components/AIAssistant.tsx
ls src/components/AIAssistant.css
ls src/hooks/useAIAssistant.ts
ls src/hooks/useAIAnalytics.ts
```

#### 3. Start Frontend
```bash
npm run dev

# Open http://localhost:5173 in browser
```

#### 4. Visual Checks
- [ ] Green orb visible in bottom-right corner
- [ ] Orb has animated glowing effect
- [ ] Dots rotating inside orb
- [ ] Orb is clickable (cursor changes)

---

### ✅ UI/UX Tests

#### 1. Chat Window Opening
- [ ] Click orb → smooth animation
- [ ] Chat window slides up from bottom
- [ ] Header shows "RiseReady Assistant"
- [ ] Close button (X) visible
- [ ] Refresh button visible

#### 2. Initial Message
- [ ] Greeting message appears
- [ ] 4 quick-reply suggestion buttons visible
- [ ] Buttons are styled correctly
- [ ] Buttons are clickable

#### 3. Sending Messages
- [ ] Type text in input field
- [ ] Press Enter → message sent
- [ ] Click send button → message sent
- [ ] Input clears after sending
- [ ] User message appears on right side
- [ ] Message bubble has green background

#### 4. Assistant Response
- [ ] Loading dots appear while waiting
- [ ] Response arrives from backend
- [ ] Assistant message appears on left side
- [ ] Message bubble has gray background
- [ ] Text is readable and formatted correctly

#### 5. Feedback System
- [ ] Feedback buttons (👍 👎) appear after response
- [ ] Click 👍 → "Was this helpful?" popup
- [ ] Click "Yes" button → feedback submitted
- [ ] Click 👎 → "Was this helpful?" popup
- [ ] Click "No" button → feedback submitted
- [ ] Popup closes after feedback

#### 6. Chat History
- [ ] Multiple messages visible in scroll area
- [ ] Scrollbar appears when needed
- [ ] New messages auto-scroll to bottom
- [ ] Old messages remain visible
- [ ] Conversation persists on refresh

#### 7. Window Controls
- [ ] Click reset button → new conversation starts
- [ ] Greeting message reappears
- [ ] Message history clears
- [ ] Quick suggestions show again

#### 8. Closing Chat
- [ ] Click close (X) button → smooth animation
- [ ] Chat window closes
- [ ] Orb returns to view
- [ ] Conversation state preserved (if needed)
- [ ] Can click orb again to reopen

---

### ✅ Context Awareness Tests

#### 1. Page Context Detection
```tsx
// Test by navigating to different pages:

// On /dashboard/focus
- Assistant mentions "Focus" in suggestions
- Quick replies include focus-related questions

// On /dashboard/budget  
- Assistant mentions "Budget" 
- Quick replies include budget-related questions

// On /about
- Assistant mentions general RiseReady info
- Quick replies include navigation help
```

#### 2. Context-Specific Responses
```bash
# Send same message on different pages:

# On Focus page: "What should I do?"
# Expected: Focus-related guidance

# On Budget page: "What should I do?"
# Expected: Budget-related guidance
```

---

### ✅ Performance Tests

#### 1. Response Time
- [ ] First message: 1-3 seconds (API call)
- [ ] Second similar message: <500ms (cached)
- [ ] Subsequent messages: <1 second average

#### 2. Cache Hit Rate
```bash
# Send 10 similar questions (e.g., "How do I use Focus?")
# 1st: ~3 seconds (API call)
# 2-10: ~0.5 seconds each (cached)
# Cache hit rate should show ~80% in analytics
```

#### 3. Memory Usage
- [ ] Chat window doesn't lag with 100+ messages
- [ ] Scrolling smooth
- [ ] No memory leaks (check DevTools)

---

### ✅ Mobile Tests

#### 1. Responsive Layout
- [ ] Orb visible on mobile
- [ ] Chat window fills most of screen
- [ ] Input field large enough to use
- [ ] Send button clickable on touch

#### 2. Input Methods
- [ ] Keyboard works (iOS/Android)
- [ ] Text selection works
- [ ] Copy/paste works
- [ ] Emoji support works

#### 3. Orientation Changes
- [ ] Portrait mode: works
- [ ] Landscape mode: works
- [ ] Chat persists after rotation
- [ ] Layout adjusts properly

---

### ✅ Error Handling Tests

#### 1. No API Key
```bash
# Remove OPENROUTER_API_KEY from .env
# Try to send message

# Expected: User-friendly error message
# Actual error: "I'm having trouble right now..."
```

#### 2. API Down
```bash
# Stop backend server
# Try to send message in chat

# Expected: User-friendly error message
# User directed to try again or contact support
```

#### 3. Bad Session ID
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId":"invalid_session",
    "message":"test"
  }'

# Expected: Creates new session or handles gracefully
```

#### 4. Empty Message
```bash
# Try to send empty message
# Try to send just whitespace

# Expected: Nothing happens (gracefully handled)
```

---

### ✅ Analytics Tests

#### 1. Session Tracking
```bash
# After 5 different conversations:
curl http://localhost:5000/api/ai/analytics

# Expected:
# - totalSessions: 5
# - totalMessages: >= 10
```

#### 2. Cache Hit Rate
```bash
# Send 10 messages total, 7 should be from cache
curl http://localhost:5000/api/ai/analytics

# Expected:
# - cacheHitRate: ~70%
# - avgResponseTime: < 500ms
```

#### 3. Feedback Tracking
```bash
# Submit feedback multiple times
curl http://localhost:5000/api/ai/analytics

# Expected:
# - totalFeedback: > 0
# - helpfulRate: 0-100%
```

#### 4. Page Context Tracking
```bash
# Use assistant on different pages
curl http://localhost:5000/api/ai/analytics

# Expected:
# - topPageContexts includes multiple pages
# - Focus, Budget, Calendar, etc.
```

---

## Test Scenarios

### Scenario 1: New User
```
1. User opens RiseReady for first time
2. Clicks orb (no session exists yet)
3. Greeting appears with suggestions
4. User clicks "Tell me about Focus"
5. Gets Focus information
6. Rates response as helpful ✅
```

### Scenario 2: Returning User
```
1. User opens RiseReady (has previous session)
2. Clicks orb 
3. Chat window opens
4. User asks "What about Focus again?"
5. Gets instant response (from cache) ⚡
6. Rate unhelpful ❌
```

### Scenario 3: Multi-Message Conversation
```
1. User: "How do I start a focus session?"
2. AI: Explains focus sessions
3. User: "How long should it be?"
4. AI: (Uses context from previous message)
5. User: "Tell me about rewards"
6. AI: Explains rewards system
```

### Scenario 4: Mobile User
```
1. User on phone opens RiseReady
2. Sees orb in bottom-right
3. Taps orb → chat opens
4. Types question with phone keyboard
5. Gets response in landscape and portrait
6. Gives feedback via touch
```

---

## Debugging Tips

### Enable Detailed Logging
```javascript
// In AIAssistant.tsx, add console logs:
console.log('Session ID:', sessionId)
console.log('Message sent:', messageContent)
console.log('Response:', response.data)
```

### Check Network Requests
1. Open DevTools → Network tab
2. Filter: XHR
3. Send a message
4. You should see:
   - POST /ai/session (first time)
   - POST /ai/chat (message)
   - POST /ai/feedback (when rating)

### Check Storage
```javascript
// In DevTools → Application → Local Storage
// Session should be stored with conversation data
```

### Check MongoDB
```bash
# If you have MongoDB local:
mongosh

# Check collections:
db.aiassistants.find()
db.aicaches.find()
```

---

## Test Automation

### Example Test (Jest)
```javascript
describe('AI Assistant', () => {
  test('should create session', async () => {
    const response = await axios.post('/api/ai/session', {
      metadata: { pageContext: 'general' }
    })
    expect(response.data.sessionId).toBeDefined()
  })

  test('should send message and get response', async () => {
    const sessionRes = await axios.post('/api/ai/session', {})
    const chatRes = await axios.post('/api/ai/chat', {
      sessionId: sessionRes.data.sessionId,
      message: 'What is RiseReady?'
    })
    expect(chatRes.data.message).toBeDefined()
    expect(chatRes.data.message.length > 0).toBe(true)
  })
})
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Orb not showing | Check CSS import, verify component in App.tsx |
| Chat not responding | Check OPENROUTER_API_KEY, verify MongoDB |
| Slow responses | First call is normal (3s), cached should be <500ms |
| Mobile issues | Check viewport, test touch events |
| Cache not working | Check MongoDB connection, verify schema |
| Wrong context | Check useAIAssistantContext hook, verify page routing |

---

## Sign-Off Checklist

- [ ] All backend endpoints respond correctly
- [ ] Frontend component renders without errors
- [ ] Chat sends and receives messages
- [ ] Feedback system works
- [ ] Analytics endpoint returns data
- [ ] Mobile responsive
- [ ] Caching works (second messages faster)
- [ ] Error handling graceful
- [ ] Performance acceptable (<3s first message)
- [ ] Context awareness works
- [ ] Ready for production ✅

---

**After all tests pass, your AI Assistant is production-ready!** 🚀

