# Integration Verification Checklist

## Pre-Launch Verification

- [ ] **Node.js installed**
  - Run: `node --version` (expect v18+)
  - Run: `npm --version` (expect v9+)

- [ ] **MongoDB running**
  - Run: `mongosh --eval "db.adminCommand('ping')"`
  - Expect: `{ ok: 1 }`

- [ ] **Dependencies installed**
  - Run: `npm run bootstrap`
  - All packages installed without errors

- [ ] **Environment files created**
  - [ ] `.env.local` in root with:
    - VITE_API_URL=http://localhost:5000/api
    - VITE_SOCKET_URL=http://localhost:5000
  - [ ] `server/.env` with:
    - OPENROUTER_API_KEY=sk-or-v1-...
    - MONGODB settings or MONGO_URI
    - JWT_SECRET set
  - [ ] `bots/discord/.env` (if using Discord bot)
  - [ ] `bots/telegram/.env` (if using Telegram bot)

---

## Launch Verification

### Step 1: Start Services
```bash
npm run dev:all
```

### Step 2: Verify Each Service

#### Frontend (Port 5173)
- [ ] Terminal shows "✓ Built in XXXms"
- [ ] Can access http://localhost:5173
- [ ] Page loads without errors
- [ ] **AI Assistant orb visible** in bottom-right corner (glowing green circle with animated dots)

#### Backend (Port 5000)
- [ ] Terminal shows "✅ Connected to MongoDB"
- [ ] No error messages in terminal
- [ ] Can access http://localhost:5000/api/health
- [ ] Response contains `{"ok":true}` (check Network tab in F12)

#### Database
- [ ] MongoDB connection successful
- [ ] Collections created: `aiassistants`, `aicaches`, `users` (if first time)

#### AI Assistant
- [ ] Orb visible on frontend
- [ ] Click orb → chat window opens
- [ ] Type message → response received (may show "Thinking..." first time)
- [ ] Check Network tab → `/api/ai/chat` returns 200 status
- [ ] Browser console has no major errors (warnings OK)

#### Discord Bot (if enabled)
- [ ] Terminal shows connection status
- [ ] Bot appears online in Discord server
- [ ] Bot responds to commands (e.g., `!ping`)

#### Telegram Bot (if enabled)
- [ ] Terminal shows connection established
- [ ] Bot responds to messages in Telegram
- [ ] No error messages in terminal

#### Worker Process
- [ ] Terminal shows nodemon watching
- [ ] No crash messages

---

## Functional Verification

### Test AI Chat Feature

1. **Open AI Chat**
   - [ ] Click floating orb in bottom-right
   - [ ] Chat window slides open smoothly
   - [ ] Text input field is focused

2. **Send First Message**
   - [ ] Type: "What is RiseReady?"
   - [ ] Click send or press Enter
   - [ ] Message appears in chat
   - [ ] "Thinking..." indicator shows
   - [ ] Response received within 5 seconds
   - [ ] Response is relevant to RiseReady

3. **Test Caching (Second Message)**
   - [ ] Type: "What is RiseReady?" again
   - [ ] Response appears much faster (< 1 second)
   - [ ] Network tab shows `/api/ai/chat` but no external API call
   - [ ] Analytics show cache hit

4. **Quick Replies**
   - [ ] Click a quick-reply button
   - [ ] Message sent automatically
   - [ ] Response received

5. **Feedback System**
   - [ ] After response, click thumbs up/down
   - [ ] Feedback dialog appears
   - [ ] Can submit feedback
   - [ ] No errors in console

### Test Page Context

- [ ] On Focus page → AI suggests Focus-related questions
- [ ] On Budget page → AI suggests Budget-related questions
- [ ] On Calendar page → AI suggests Calendar-related questions
- [ ] AI remembers page context in suggestions

### Test Analytics

1. **Access Dashboard**
   - [ ] Navigate to `/dashboard/ai-analytics`
   - [ ] Page loads without errors

2. **View Metrics**
   - [ ] Total sessions shows > 0
   - [ ] Total messages shows > 0
   - [ ] Cache hit rate displays
   - [ ] Average response time displays
   - [ ] Satisfaction metrics show (if feedback given)

3. **Filter by Date**
   - [ ] Can select date range
   - [ ] Metrics update based on filter
   - [ ] No errors in console

---

## Performance Verification

### Check Response Times

- [ ] First message: 1-3 seconds (API call)
- [ ] Cached message: < 500ms
- [ ] UI animations smooth (60fps)
- [ ] No memory leaks (DevTools → Memory)

### Check Resource Usage

- [ ] Frontend: < 100MB RAM
- [ ] Backend: < 150MB RAM
- [ ] Total: < 500MB for all services
- [ ] CPU usage < 20% idle

### Check Network

```bash
# Verify API endpoints work
curl http://localhost:5000/api/health
# Response: {"ok":true}

curl http://localhost:5000/api/ai/analytics
# Response: metrics object
```

---

## Error Handling Verification

### Test Error States

- [ ] Send empty message → shows warning
- [ ] Network error (disconnect MongoDB) → graceful error message
- [ ] Invalid API key → shows error (check server logs)
- [ ] Malformed request → 400 Bad Request

### Check Error Messages

- [ ] Errors displayed to user, not thrown
- [ ] No uncaught exceptions in console
- [ ] Server continues running after errors
- [ ] Graceful fallback for missing features

---

## Integration Points Verification

### Frontend Integration

- [ ] AIAssistant component imported in App.tsx ✓
- [ ] AIAssistantProvider wraps app ✓
- [ ] useAIAssistant hook available in components ✓
- [ ] useAIAnalytics hook available in components ✓

### Backend Integration

- [ ] AI routes mounted in app.js ✓
- [ ] All 6 endpoints accessible:
  - [ ] POST /api/ai/session (200 OK)
  - [ ] POST /api/ai/chat (200 OK)
  - [ ] GET /api/ai/history/:sessionId (200 OK)
  - [ ] POST /api/ai/feedback (200 OK)
  - [ ] GET /api/ai/analytics (200 OK)
  - [ ] POST /api/ai/maintenance/clear-sessions (200 OK)

### Database Integration

- [ ] MongoDB collections created automatically ✓
- [ ] AIAssistant model working ✓
- [ ] AICache model working ✓
- [ ] Indexes created for performance ✓

### Bot Integration

- [ ] Discord bot inherits AI context (optional)
- [ ] Telegram bot inherits AI context (optional)
- [ ] No conflicts with existing bot commands

---

## Final Checklist

- [ ] All services running (npm run dev:all)
- [ ] No critical errors in console
- [ ] Frontend loads on http://localhost:5173
- [ ] Backend API responds on http://localhost:5000/api
- [ ] Database connected
- [ ] AI orb visible and functional
- [ ] Chat works and caches correctly
- [ ] Analytics dashboard accessible
- [ ] All environment variables set
- [ ] Ready for testing with actual users

---

## Rollback Instructions

If something goes wrong:

```bash
# Stop all services
# Press Ctrl+C in terminal running "npm run dev:all"

# Wait 5 seconds for clean shutdown

# Check what failed
# Review terminal output for error messages

# If database issue:
# Stop MongoDB
# Clear database: mongosh > db.dropDatabase()
# Restart MongoDB
# Run: npm run dev:all

# If package issue:
# Clear cache: npm cache clean --force
# Reinstall: npm run bootstrap
# Run: npm run dev:all

# If environment variable issue:
# Check .env files are in correct locations
# Verify no typos in keys
# Run: npm run dev:all
```

---

## Success Criteria

All of the following must be true:

1. ✅ npm run dev:all starts without errors
2. ✅ Frontend loads on port 5173
3. ✅ Backend API responds on port 5000
4. ✅ MongoDB connected
5. ✅ AI Assistant orb visible
6. ✅ Chat functionality works
7. ✅ Caching reduces response times
8. ✅ Analytics dashboard shows metrics
9. ✅ No critical console errors
10. ✅ All bots running (if enabled)

**Status**: Ready to launch ✅

---

**Last Updated**: November 16, 2025
