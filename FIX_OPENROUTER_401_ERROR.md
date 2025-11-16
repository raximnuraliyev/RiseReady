# 🔧 FIX OPENROUTER API 401 ERROR

## Problem
```
Error: API error: 401
at chat (file:///D:/pdp/RiseReady-main/server/src/controllers/aiController.js:213:17)
```

**Meaning:** Your OpenRouter API key is not authenticated or has no credits.

---

## Solution - Get a Real API Key

### Step 1: Create OpenRouter Account (Free!)
1. Go to: https://openrouter.ai
2. Click "Sign Up" (top right)
3. Sign in with Google, GitHub, or email
4. Verify your email

### Step 2: Add Payment Method (Get Free Credits)
1. After signing up, go to: https://openrouter.ai/account/api-keys
2. Look for "Credits" section on left sidebar
3. Click "Add Payment Method"
4. You get **$5 free credits** to start!
   - With free credits: ~2,500 questions (at $0.002 per question)
5. Add a credit card (won't charge until you use credits)

### Step 3: Get Your API Key
1. Go to: https://openrouter.ai/account/api-keys
2. Click "Create Key"
3. Name it "RiseReady"
4. Click "Create"
5. **Copy the entire key** (starts with `sk-or-v1-`)

### Step 4: Update Your server/.env

**Option A: Direct Edit**
```bash
# Open: d:\pdp\RiseReady-main\server\.env
# Find: OPENROUTER_API_KEY=...
# Replace with your NEW key:
OPENROUTER_API_KEY=sk-or-v1-YOUR_NEW_KEY_HERE
```

**Option B: Using Terminal**
```powershell
# In PowerShell:
(Get-Content "d:\pdp\RiseReady-main\server\.env") -replace `
  'OPENROUTER_API_KEY=.*', `
  'OPENROUTER_API_KEY=sk-or-v1-YOUR_NEW_KEY_HERE' | `
  Set-Content "d:\pdp\RiseReady-main\server\.env"
```

### Step 5: Restart Backend
```bash
# Stop current backend: Ctrl+C
# Restart: npm run dev --prefix server
```

### Step 6: Test Again
1. Reload browser: http://localhost:5173
2. Click AI orb
3. Ask: "What is RiseReady?"
4. Should respond in 2-3 seconds now! ✅

---

## 🚀 Quick Fix - Copy Your New Key Here

After getting your key from OpenRouter:

```bash
# PASTE YOUR NEW KEY HERE (replace the one below):
OPENROUTER_API_KEY=YOUR_OWN_API
```

Then update your `server/.env` file and restart.

---

## ✅ How to Verify It Works

### Check 1: API Key is Being Read
```powershell
# In PowerShell, check if key is loaded:
Get-Content "d:\pdp\RiseReady-main\server\.env" | Select-String "OPENROUTER_API_KEY"
```

**Should show:** `OPENROUTER_API_KEY=sk-or-v1-...`

### Check 2: Backend Recognizes Key
```bash
# Look at backend terminal output when you restart
# Should show: No errors about OPENROUTER_API_KEY
```

### Check 3: Test API Call
```bash
# Try asking the AI a simple question through the chat
# First response takes 2-3 seconds
# If it works, you're good! ✅
# If 401 again, key is still invalid
```

---

## 🔴 If Still Getting 401

### Possible Causes

1. **Key is still invalid**
   - ✓ Double-check you copied the entire key
   - ✓ Make sure there are no spaces before/after
   - ✓ Verify it starts with `sk-or-v1-`

2. **Key wasn't added to file correctly**
   - ✓ Open `server/.env` in text editor
   - ✓ Search for `OPENROUTER_API_KEY`
   - ✓ Make sure the line has no typos

3. **Backend not restarted after change**
   - ✓ Stop backend: `Ctrl+C` in backend terminal
   - ✓ Restart: `npm run dev --prefix server`
   - ✓ Wait 5 seconds for startup

4. **No credits on OpenRouter account**
   - ✓ Go to: https://openrouter.ai/account
   - ✓ Check "Credits" balance
   - ✓ If $0.00, add payment method for free $5 credit

5. **Using a revoked/old key**
   - ✓ Generate a brand new key from OpenRouter dashboard
   - ✓ Delete old keys if you have duplicates
   - ✓ Use only the newest key

---

## 📊 OpenRouter Pricing (For Reference)

```
GPT-3.5-Turbo (what you're using):
  - $0.0005 per 1K input tokens
  - $0.0015 per 1K output tokens
  - Average question: $0.002 total

Free Credits: $5 (when you sign up)
  = ~2,500 questions for free!
```

---

## 🎯 Next Steps

1. **Create OpenRouter account** → https://openrouter.ai
2. **Add payment method** → Get $5 free credit
3. **Create API key** → Copy the `sk-or-v1-...` key
4. **Update `server/.env`** → Replace OPENROUTER_API_KEY
5. **Restart backend** → `Ctrl+C` then `npm run dev --prefix server`
6. **Test chat** → Ask AI a question through orb
7. **Verify response** → Should get answer in 2-3 seconds

---

## 🆘 Still Not Working?

### Troubleshooting Steps

```bash
# 1. Verify key format
Get-Content "d:\pdp\RiseReady-main\server\.env" | grep "OPENROUTER_API_KEY"

# 2. Check backend is running
# Terminal should show: "Server running on port 4000"

# 3. Check backend for errors
# Look at backend terminal for any error messages

# 4. Try a fresh key
# Generate new key from https://openrouter.ai/account/api-keys
# Update server/.env
# Restart backend

# 5. Check API endpoint
# Make sure it's: https://openrouter.ai/api/v1/chat/completions
```

---

## ✨ Success Indicators

When it's working, you'll see:

✅ **Chat window** opens when you click orb  
✅ **Message sends** with no errors  
✅ **Loading indicator** shows for 2-3 seconds  
✅ **Response appears** from AI  
✅ **No "401" errors** in backend terminal  

---

## 📝 Summary

| Issue | Fix |
|-------|-----|
| 401 Error | Get new API key from OpenRouter |
| No Credits | Add payment method for $5 free credit |
| Key not updating | Restart backend after changing .env |
| Still 401 | Generate brand new key, restart, try again |

---

**The key you have isn't working. You need to generate a fresh one from your OpenRouter account.**

Go to https://openrouter.ai now to get started! 🚀
