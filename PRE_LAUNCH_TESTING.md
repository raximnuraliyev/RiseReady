# Pre-Launch Testing & Troubleshooting

## ✅ Pre-Launch Checklist (Before Running npm run dev:all)

### System Requirements
- [ ] Node.js v18+ installed
  ```bash
  node --version  # Should show v18+
  ```
- [ ] npm v9+ installed
  ```bash
  npm --version   # Should show v9+
  ```
- [ ] MongoDB installed (local or Atlas account)
  ```bash
  mongosh --version  # Should show version
  ```
- [ ] 500MB+ free disk space
- [ ] 1GB+ available RAM

### Environment Files
- [ ] `.env.local` exists in root directory
  ```bash
  ls -la .env.local  # Should exist
  ```
- [ ] `server/.env` exists in server directory
  ```bash
  ls -la server/.env  # Should exist
  ```
- [ ] All required variables set (see FULL_STACK_SETUP.md)

### Code Integration
- [ ] App.tsx has AIAssistant import
  ```bash
  grep -n "import AIAssistant" src/App.tsx
  # Should find the import
  ```
- [ ] App.tsx has AIAssistantProvider
  ```bash
  grep -n "AIAssistantProvider" src/App.tsx
  # Should find the provider
  ```
- [ ] AIAssistant component used in JSX
  ```bash
  grep -n "<AIAssistant" src/App.tsx
  # Should find component usage
  ```

### Dependencies
- [ ] npm run bootstrap completed
  ```bash
  ls -la node_modules  # Should have modules
  ls -la server/node_modules  # Should have modules
  ```
- [ ] No errors during bootstrap
  ```bash
  npm run bootstrap 2>&1 | grep -i error
  # Should return nothing (no errors)
  ```

---

## 🚀 Launch Steps

### Step 1: Start MongoDB

```bash
# Option 1: If installed locally (Windows)
mongod --dbpath "C:\data\db"

# Option 2: If installed locally (Mac/Linux)
brew services start mongodb-community
# or
sudo systemctl start mongod

# Option 3: If using MongoDB Atlas
# (connection handled automatically via MONGO_URI)
```

**Verify MongoDB is running:**
```bash
mongosh --eval "db.adminCommand('ping')"
# Expected output: { ok: 1 }
```

### Step 2: Start All Services

```bash
npm run dev:all
```

**Expected terminal output** (should see multiple service logs):
```
[0] VITE v7.x.x ready in XXX ms
[0] ➜  Local:   http://localhost:5173/

[1] ✅ Connected to MongoDB at mongodb://localhost:27017/riseready

[2] [nodemon] starting `node src/worker.js`

[3] Discord bot connected (if enabled)

[4] Telegram bot connected (if enabled)
```

### Step 3: Verify Frontend Loads

```bash
# In browser, visit:
http://localhost:5173

# Check:
- [ ] Page loads without errors
- [ ] No white screen of death
- [ ] Browser console (F12) has no major errors
- [ ] CSS styles applied (RiseReady colors visible)
```

### Step 4: Verify AI Orb Appears

```bash
# Look for the AI orb:
- [ ] Glowing green circle in bottom-right corner
- [ ] Has animated rotating dots
- [ ] Visible above other page content
- [ ] Stays in view when scrolling
```

---

## 🧪 Functionality Testing

### Test 1: Chat Functionality

```bash
# Step 1: Click the AI orb
# Expected: Chat window slides open from bottom-right

# Step 2: Focus text input
# Expected: Cursor appears in input field, blue highlight

# Step 3: Type message
# Expected: Text appears in input field

# Step 4: Click send or press Enter
# Expected: 
# - Message appears in chat as "You: [message]"
# - Input clears
# - "Thinking..." indicator appears

# Step 5: Wait for response
# Expected:
# - "Thinking..." disappears (1-3 seconds)
# - AI response appears in chat
# - Response is relevant to your question
```

**Browser console check:**
```javascript
// Open Developer Tools (F12)
// Console tab
// Should have no red errors about:
// - AIAssistant is not defined
// - Cannot fetch /api/ai/session
// - Cannot read properties of null
```

**Network check:**
```
// Open Developer Tools (F12)
// Network tab
// Should see successful requests:
- POST /api/ai/session (200 OK)
- POST /api/ai/chat (200 OK)
// Response should contain "message" and "sessionId"
```

### Test 2: Caching Functionality

```bash
# Step 1: Send a message
# Message: "What is RiseReady?"

# Step 2: Note the response time
# Expected: 1-3 seconds (API call)

# Step 3: Clear input and send same message again
# Message: "What is RiseReady?"

# Step 4: Compare response times
# Expected: < 500ms (cached response)
# Difference: Should be noticeably faster

# Step 5: Check Network tab
# Expected: POST /api/ai/chat returns cached response
# No external OpenRouter API call on 2nd attempt
```

### Test 3: Context-Aware Suggestions

```bash
# Step 1: Visit Focus page
# URL: http://localhost:5173/dashboard/focus

# Step 2: Open AI chat
# Expected: Quick-reply buttons show Focus-related suggestions
# Examples: "How do I improve focus?", "Pomodoro tips?"

# Step 3: Visit Budget page
# URL: http://localhost:5173/dashboard/budget

# Step 4: Open AI chat again
# Expected: Quick-reply buttons show Budget-related suggestions
# Examples: "How do I save money?", "Budget tips?"
```

### Test 4: Analytics Dashboard

```bash
# Step 1: After chatting, visit analytics
# URL: http://localhost:5173/dashboard/ai-analytics

# Step 2: Check page loads
# Expected: No errors, dashboard visible

# Step 3: Check metrics
# Expected:
# - Total sessions: > 0 (at least 1)
# - Total messages: > 0 (at least 1 message you sent)
# - Cache hit rate: > 0% (at least 1 cached message)
# - Average response time: Shows milliseconds

# Step 4: Submit feedback and check again
# Expected: Satisfaction metrics update
```

### Test 5: Feedback System

```bash
# Step 1: Send a message and wait for response

# Step 2: Look for feedback buttons below response
# Expected: Thumbs up (👍) and thumbs down (👎) buttons

# Step 3: Click thumbs up
# Expected: Button highlight changes, optional comment dialog

# Step 4: Check analytics
# Expected: Satisfaction score increases

# Step 5: Test thumbs down
# Expected: Can optionally leave a comment
```

### Test 6: Error Handling

```bash
# Step 1: Close database (simulate MongoDB failure)
# In MongoDB terminal: ^C to stop

# Step 2: Try sending a message
# Expected: 
# - Graceful error message in chat
# - No red error screens
# - App remains responsive
# - Can restart without issues

# Step 3: Restart MongoDB
# Expected: Chat works again after reconnection
```

---

## 🔍 Debugging Guide

### If Orb Doesn't Appear

**Checklist:**
```bash
# 1. Check if component imported
grep -n "import AIAssistant" src/App.tsx
# Should find: import AIAssistant from './components/AIAssistant'

# 2. Check if component used
grep -n "<AIAssistant" src/App.tsx
# Should find: <AIAssistant />

# 3. Check browser console errors
# Open DevTools (F12) → Console tab
# Look for red errors mentioning AIAssistant

# 4. Check if styles loaded
# Right-click orb area → Inspect
# Look in Elements tab for component structure
```

**Solutions:**
- Reload page (Ctrl+R or Cmd+R)
- Clear browser cache (Ctrl+Shift+Delete)
- Check that App.tsx was saved
- Verify backend is running (port 5000)

### If Chat Doesn't Respond

**Checklist:**
```bash
# 1. Check backend is running
curl http://localhost:5000/api/health
# Expected: { "ok": true }

# 2. Check API endpoint exists
curl http://localhost:5000/api/ai/session
# Expected: 200 status code

# 3. Check database connection
# Look at backend terminal for: "✅ Connected to MongoDB"

# 4. Check API key is set
grep OPENROUTER_API_KEY server/.env
# Should show: OPENROUTER_API_KEY=sk-or-v1-...
```

**Solutions:**
- Check OPENROUTER_API_KEY is valid (visit https://openrouter.ai)
- Verify backend has restarted after .env changes
- Check VITE_API_URL is correct in .env.local
- Check CORS is enabled in backend
- Restart all services: npm run dev:all

### If MongoDB Connection Fails

**Checklist:**
```bash
# 1. Check MongoDB is installed
mongosh --version
# Should show version number

# 2. Check MongoDB is running
ps aux | grep mongod
# Should see mongod process

# 3. Check connection string
cat server/.env | grep MONGO
# Should show correct connection

# 4. Test connection
mongosh --eval "db.adminCommand('ping')"
# Expected: { ok: 1 }
```

**Solutions:**
- Start MongoDB: `mongod --dbpath "C:\data\db"` (Windows)
- Or: `brew services start mongodb-community` (Mac)
- Or: `sudo systemctl start mongod` (Linux)
- Or use MongoDB Atlas (cloud): Set MONGO_URI in .env

### If Port is Already in Use

**Solutions:**
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or let backend auto-assign next port:
# Set in server/.env: PORT=5001

# Or find what's using the port:
# Windows: Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
# Mac/Linux: lsof -i :5000
```

---

## 📊 Performance Checks

### Response Time Benchmarks

```bash
# Test 1: New query
1. Open DevTools (F12) → Network tab
2. Send message: "What is RiseReady?"
3. Look at POST /api/ai/chat request
4. Check Response time: Should be 1-3 seconds

# Test 2: Cached query
1. Send same message again: "What is RiseReady?"
2. Check Response time: Should be < 500ms
3. Difference should be 3-6x faster
```

### Memory Usage

```bash
# While dev:all is running:
1. Open Task Manager (Windows) or Activity Monitor (Mac)
2. Look for Node.js processes
3. Expected:
   - Frontend: 50-80MB
   - Backend: 80-120MB
   - Worker: 20-50MB
   - Total: < 300MB
```

### CPU Usage

```bash
# While dev:all is running idle:
1. Open Task Manager
2. Check CPU usage
3. Expected: < 20% for Node processes
4. Spikes acceptable during message processing
```

---

## 📝 Test Report Template

```markdown
## AI Assistant Integration Test Report

**Date**: _______________
**Tester**: _______________
**Environment**: Local / Staging / Production

### Pre-Launch Checks
- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] MongoDB running
- [ ] Dependencies installed
- [ ] Environment files created
- [ ] App.tsx updated with component

### Service Startup
- [ ] Frontend starts (port 5173)
- [ ] Backend starts (port 5000)
- [ ] Worker starts
- [ ] MongoDB connects
- [ ] No critical errors

### Functionality Tests
- [ ] AI orb appears
- [ ] Chat window opens/closes smoothly
- [ ] Can send messages
- [ ] AI responds appropriately
- [ ] Responses cached correctly
- [ ] Quick-reply buttons work
- [ ] Feedback system works
- [ ] Analytics dashboard loads

### Performance Tests
- [ ] First message: 1-3 seconds ✓
- [ ] Cached message: < 500ms ✓
- [ ] Animations smooth (60fps) ✓
- [ ] No memory leaks ✓
- [ ] CPU usage acceptable ✓

### Error Handling
- [ ] Empty message handled ✓
- [ ] Network errors handled ✓
- [ ] DB errors handled ✓
- [ ] Invalid input handled ✓

### Overall Result
- [ ] ✅ PASS - Ready for production
- [ ] ⚠️ PASS WITH ISSUES - See notes below
- [ ] ❌ FAIL - Issues need resolution

### Notes
_________________________________

### Known Issues
_________________________________

### Recommendations
_________________________________
```

---

## 🆘 Emergency Troubleshooting

### Everything is broken, start from scratch

```bash
# 1. Stop all services
# Press Ctrl+C in all terminals

# 2. Clear dependencies
rm -rf node_modules
rm -rf server/node_modules
npm cache clean --force

# 3. Reinstall
npm run bootstrap

# 4. Reset database
# Stop MongoDB
# Delete data directory (usually C:\data\db on Windows)
# Restart MongoDB
# Database recreates on first connection

# 5. Start fresh
npm run dev:all

# 6. Create new browser profile
# Use incognito/private window or clear cache
```

### Services won't stop

```bash
# Find all Node processes
ps aux | grep node

# Kill specific process (Mac/Linux)
kill -9 <PID>

# Kill all Node processes (Mac/Linux)
killall node

# Windows PowerShell
Get-Process node | Stop-Process -Force
```

### Browser still shows old version

```bash
# Hard refresh
Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Or clear cache
F12 → Application → Clear Storage → Clear all

# Or use incognito window
Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)
```

---

## ✅ Sign-Off Checklist

Before considering launch complete:

- [ ] All pre-launch checklist items complete
- [ ] Frontend loads without errors
- [ ] AI orb visible and clickable
- [ ] Chat functionality works
- [ ] Responses are cached
- [ ] Analytics dashboard works
- [ ] All 5 services running
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Ready for user testing

---

## 📞 Getting Help

If you're stuck:

1. **Check documentation** (see FULL_STACK_SETUP.md)
2. **Read error messages** carefully (terminal or console)
3. **Search this file** for your error
4. **Run diagnostics** from section above
5. **Review architecture** (AI_ASSISTANT_ARCHITECTURE.md)
6. **Check test guide** (AI_ASSISTANT_TESTING_GUIDE.md)

---

**Good luck! 🚀**

Your AI Assistant is ready to launch!
