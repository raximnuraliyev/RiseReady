# 🔐 GET YOUR OPENROUTER API KEY - STEP BY STEP

## 🎯 Goal
Get a valid OpenRouter API key with active credits to fix the 401 error

## ⏱️ Time Required
**~5 minutes** to sign up and get your key

---

## 📋 Steps

### Step 1: Sign Up for OpenRouter (2 minutes)

1. **Go to:** https://openrouter.ai
2. **Click:** "Sign Up" in top right corner
3. **Choose method:**
   - Google (easiest)
   - GitHub
   - Email
4. **Verify:** Check your email and verify your account
5. **Login:** You're now on OpenRouter dashboard

✅ **Done with Step 1**

---

### Step 2: Add Credits (2 minutes)

**Free $5 Credit!** OpenRouter gives all new users $5 free.

1. **In OpenRouter dashboard, click:** Left sidebar → "Credits"
2. **Click:** "Add Payment Method"
3. **Add:** Your credit card details
   - Won't charge immediately
   - Only charges when you use credits
4. **Confirm:** You should see $5.00 available now

✅ **Done with Step 2** - You have free credits!

---

### Step 3: Create API Key (1 minute)

1. **Click:** Left sidebar → "API Keys"
2. **Click:** "Create Key" button
3. **Name it:** `RiseReady`
4. **Click:** "Create"
5. **Copy:** The entire key (starts with `sk-or-v1-`)
   - Click the copy button next to the key
   - Or select and Ctrl+C

✅ **Done with Step 3** - Key copied!

---

### Step 4: Update Your server/.env

**Open file:** `d:\pdp\RiseReady-main\server\.env`

**Find this line:**
```
OPENROUTER_API_KEY=YOUR_OWN_API
```

**Replace with your new key:**
```
OPENROUTER_API_KEY=sk-or-v1-YOUR_NEW_KEY_HERE
```

Example (your actual key will be longer):
```
OPENROUTER_API_KEY=sk-or-v1-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
```

**Save the file** (Ctrl+S)

✅ **Done with Step 4**

---

### Step 5: Restart Backend

**In your backend terminal:**
1. **Stop it:** Press `Ctrl+C`
2. **Wait:** 2-3 seconds
3. **Restart:** `npm run dev --prefix server`
4. **Wait:** Until you see "✅ Server running on port 4000"

✅ **Done with Step 5**

---

### Step 6: Test It!

**In browser:**
1. **Go to:** http://localhost:5173
2. **Look for:** Green glowing orb (bottom-right)
3. **Click it:** Chat opens
4. **Type:** "What is RiseReady?"
5. **Press:** Enter or click Send
6. **Wait:** 2-3 seconds
7. **See response:** ✅ It works!

---

## ✅ Success Indicators

When it's working, you'll see:

```
✅ No 401 error
✅ No red errors in backend terminal
✅ Chat window responds
✅ Response appears in 2-3 seconds
✅ Asked again = instant response (cached)
```

---

## 🆘 Troubleshooting

### Still Getting 401?

**Check 1:** Is your new key in the file?
```bash
# Open: d:\pdp\RiseReady-main\server\.env
# Find: OPENROUTER_API_KEY=...
# Make sure it's your NEW key, not the old one
```

**Check 2:** Did you restart the backend?
```bash
# Terminal 1 should show:
# "Server running on port 4000"
# (if not, restart with: npm run dev --prefix server)
```

**Check 3:** Is there a typo in the key?
```bash
# Open your new key in OpenRouter
# https://openrouter.ai/account/api-keys
# Copy it again, make sure no spaces
# Paste into server/.env exactly as is
```

**Check 4:** Does your account have credits?
```bash
# Go to: https://openrouter.ai/account/balance
# Should show $5.00 available
# If $0.00, add payment method again
```

---

## 🧪 Advanced: Test Your Key

If you want to verify your key works:

```bash
cd d:\pdp\RiseReady-main
node test-openrouter-key.js
```

This will:
- ✅ Check if key exists
- ✅ Check if format is correct
- ✅ Test if API accepts the key
- ✅ Show you if it works!

---

## 📊 What You Get

With your free $5 credit:
- ~2,500 questions answered
- Each question: $0.002
- After free credits: you set your own budget/limits

---

## 🎯 Summary

| Step | Action | Time |
|------|--------|------|
| 1 | Sign up OpenRouter | 2 min |
| 2 | Add credits | 2 min |
| 3 | Create API key | 1 min |
| 4 | Update .env file | 1 min |
| 5 | Restart backend | 1 min |
| 6 | Test in browser | 1 min |
| **Total** | **All Done!** | **~8 min** |

---

## ✨ You're Almost There!

Just complete these 6 quick steps and your AI chat will be working perfectly!

**Start now:** https://openrouter.ai 🚀

---

**Status After Completion:**
- ✅ API Key: Valid
- ✅ Credits: Active  
- ✅ Backend: Configured
- ✅ Chat: Working
- ✅ AI: Responding

**Let's go!** 🎉
