# RiseReady Full Stack Setup Guide - npm run dev:all

## Overview

The `npm run dev:all` command starts all RiseReady services simultaneously:

1. **Frontend** (React/Vite) → http://localhost:5173
2. **Backend API** (Express) → http://localhost:5000/api
3. **Background Worker** (Jobs/Tasks)
4. **Discord Bot** (if configured)
5. **Telegram Bot** (if configured)
6. **AI Assistant** (integrated in backend)
7. **MongoDB** (database - requires separate startup)

---

## Prerequisites

### Required Software

```bash
# Install Node.js (v18+ recommended)
# Download from: https://nodejs.org

# Verify installation
node --version   # Should be v18+
npm --version    # Should be v9+
```

### Database Setup

```bash
# Option 1: MongoDB Local (Recommended for Development)
# Download from: https://www.mongodb.com/try/download/community
# Install and start MongoDB Community Server
# Default connection: mongodb://localhost:27017

# Verify MongoDB is running
mongosh --eval "db.adminCommand('ping')"
# Should output: { ok: 1 }

# Option 2: MongoDB Atlas (Cloud)
# Sign up at: https://www.mongodb.com/cloud/atlas
# Create cluster and get connection string
# Add to server/.env: MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/riseready
```

### API Keys

```bash
# Get OpenRouter API Key for AI Assistant
# Sign up at: https://openrouter.ai
# Save in server/.env: OPENROUTER_API_KEY=sk-or-v1-...

# Discord Bot Token (optional)
# Get from: https://discord.com/developers/applications
# Save in bots/discord/.env: DISCORD_TOKEN=...

# Telegram Bot Token (optional)
# Get from: @BotFather on Telegram
# Save in bots/telegram/.env: TELEGRAM_BOT_TOKEN=...
```

---

## Environment Files Setup

### Root Directory (`.env.local`)

```bash
# Frontend Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Server Directory (`server/.env`)

```bash
# API Configuration
PORT=5000
NODE_ENV=development

# Database
# Option 1: Local MongoDB
MONGODB_HOST=localhost
MONGODB_DBNAME=riseready

# Option 2: MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/riseready

# AI Assistant
OPENROUTER_API_KEY=YOUR_OWN_KEY
APP_URL=http://localhost:5173

# JWT Secret
JWT_SECRET=your-secret-key-here

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Discord Bot (`bots/discord/.env`)

```bash
# Discord Bot Configuration
DISCORD_TOKEN=your-discord-bot-token
DISCORD_CLIENT_ID=your-client-id
COMMAND_PREFIX=!
```

### Telegram Bot (`bots/telegram/.env`)

```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
NODE_ENV=development
```

---

## Installation Steps

### Step 1: Install Dependencies

```bash
# Install all dependencies (frontend, backend, bots)
npm run bootstrap

# This will:
# - npm install (root)
# - npm install --prefix server
# - npm install --prefix bots/discord
# - npm install --prefix bots/telegram
```

### Step 2: Start MongoDB

```bash
# Option 1: If installed locally (Windows)
mongod --dbpath "C:\data\db"

# Option 2: If using MongoDB Atlas
# Connection happens automatically via MONGO_URI
```

### Step 3: Verify Services

```bash
# Test backend database connection
npm run dev --prefix server
# Should print: "✅ Connected to MongoDB"
# Press Ctrl+C to stop

# Test frontend
npm run dev
# Should print: "VITE v7.x.x  ready in XXX ms"
# Visit http://localhost:5173
# Press Ctrl+C to stop
```

---

## Starting All Services

### Method 1: npm run dev:all (Recommended)

```bash
npm run dev:all
```

This starts all services simultaneously:
- Frontend on port 5173
- Backend on port 5000
- Worker process
- Discord Bot
- Telegram Bot

**Output will show:**
```
[0] > riseready@0.0.0 dev
[0] > vite --host
[0]
[0] VITE v7.1.14 ready in 1234 ms
[0]
[0] ➜  Local:   http://localhost:5173/
[0] ➜  press q to quit

[1] > riseready-server@0.1.0 dev
[1] > nodemon src/index.js
[1]
[1] [nodemon] 3.0.1
[1] [nodemon] watching path(s): src/**/* ...
[1] [nodemon] to ignore: lib/**/* node_modules/**/*
[1] [nodemon] watching extensions: js,json,mjs
[1] [nodemon] starting `node src/index.js`
[1]
[1] ✅ Connected to MongoDB at mongodb://localhost:27017/riseready

[2] > riseready-server@0.1.0 dev:worker
[2] > nodemon src/worker.js
[2]
[2] [nodemon] 3.0.1
...
```

### Method 2: PowerShell Script (Windows)

```bash
.\start-all.ps1
```

This script:
- Checks Node.js and npm installation
- Verifies MongoDB connection
- Checks environment files
- Displays service URLs
- Starts npm run dev:all

### Method 3: Individual Services (For Debugging)

If you want to start services individually:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (requires npm install --prefix server first)
npm run dev --prefix server

# Terminal 3: Worker
npm run dev:worker --prefix server

# Terminal 4: Discord Bot
npm run dev --prefix bots/discord

# Terminal 5: Telegram Bot
npm run dev --prefix bots/telegram
```

---

## Service URLs & Endpoints

### Frontend
- **URL**: http://localhost:5173
- **Hot Reload**: Yes (auto-refresh on code changes)
- **Features**: AI Assistant available here

### Backend API
- **Base URL**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **AI Endpoints**:
  - POST `/ai/session` - Create session
  - POST `/ai/chat` - Send message
  - GET `/ai/analytics` - Get metrics

### WebSocket (Real-time)
- **URL**: ws://localhost:5000
- **For**: Live notifications, chat updates

### Discord Bot
- **Connects to**: Discord servers (if configured)
- **Prefix**: `!` (or configured prefix)

### Telegram Bot
- **Connects to**: Telegram (if configured)
- **Commands**: Inline or direct messages

---

## Troubleshooting

### "MongoDB connection failed"

```bash
# Check MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# If not running, start MongoDB:
# Windows: mongod --dbpath "C:\data\db"
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Or use MongoDB Atlas (cloud)
# Update server/.env: MONGO_URI=mongodb+srv://...
```

### "Port 5000 or 5173 already in use"

```bash
# Find and kill process using the port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or let the system auto-assign (backend tries PORT+1)
```

### "Cannot find module" errors

```bash
# Reinstall dependencies
npm run bootstrap

# Or individually:
npm install
npm install --prefix server
npm install --prefix bots/discord
npm install --prefix bots/telegram
```

### "Environment variables not found"

```bash
# Create .env files in the right locations:
# - .env.local (root directory)
# - server/.env
# - bots/discord/.env
# - bots/telegram/.env

# See "Environment Files Setup" section above
```

### "Frontend can't connect to backend"

```bash
# Check VITE_API_URL in .env.local
VITE_API_URL=http://localhost:5000/api

# Backend must be running on port 5000
# Check terminal 2 (backend should show "✅ Connected to MongoDB")

# Check CORS is enabled in server/src/app.js
```

### "Discord/Telegram bot not connecting"

```bash
# Check tokens are correct:
# Discord: https://discord.com/developers/applications
# Telegram: @BotFather

# Check .env files in bot directories:
# bots/discord/.env
# bots/telegram/.env

# Verify bot tokens are valid and not expired
```

### "AI Assistant not responding"

```bash
# Check OPENROUTER_API_KEY in server/.env
OPENROUTER_API_KEY=sk-or-v1-...

# Verify key is valid at https://openrouter.ai

# Check backend is running and connected to MongoDB
# Frontend should show: "AI Assistant" orb in bottom-right

# Open browser console (F12) to see errors
```

---

## Development Workflow

### Making Changes

```bash
# Frontend changes auto-reload (Vite HMR)
# Edit src/components/AIAssistant.tsx → Auto-refresh in browser

# Backend changes auto-reload (nodemon)
# Edit server/src/controllers/aiController.js → Server restarts

# Bot changes require restart
# Edit bots/discord/src/commands/... → Manual restart needed
```

### Monitoring Services

```bash
# Check service health
curl http://localhost:5000/api/health
# Response: {"ok":true}

# Check AI analytics
curl http://localhost:5000/api/ai/analytics
# Response: metrics object

# Check frontend is running
curl http://localhost:5173
# Response: HTML page
```

### Debugging

```bash
# Enable debug logging (set in .env)
DEBUG=*

# View specific service logs
# Frontend: Browser console (F12)
# Backend: Terminal window 2
# Worker: Terminal window 3

# Use Node.js debugger
node --inspect --prefix server
# Access at chrome://inspect
```

---

## Performance Tips

### Optimize for Development

1. **Close unnecessary applications** to free up system resources
2. **Use local MongoDB** instead of cloud (faster)
3. **Disable bot logging** to reduce noise
4. **Only run needed services**

### Monitor Resource Usage

```bash
# Windows Task Manager
# Watch CPU and Memory while dev:all is running

# Check MongoDB performance
mongosh
> db.stats()
> db.currentOp()
```

---

## Production Deployment

### Before Deploying

1. **Set NODE_ENV=production** in .env
2. **Use production MongoDB URI** (Atlas recommended)
3. **Set strong JWT_SECRET** (change from development)
4. **Configure real bot tokens** if using bots
5. **Use production API keys** for all services

### Deployment Commands

```bash
# Build frontend
npm run build

# Start production services
NODE_ENV=production npm start --prefix server

# Or run dev:all with production env
NODE_ENV=production npm run dev:all
```

---

## Command Reference

### Root Commands

```bash
npm run dev          # Frontend only
npm run dev:all      # All services
npm run bootstrap    # Install all dependencies
npm run build        # Build frontend for production
npm run lint         # Check code style
```

### Server Commands

```bash
npm run dev --prefix server              # Backend server (dev)
npm run dev:worker --prefix server       # Background worker (dev)
npm start --prefix server                # Backend server (production)
npm run worker --prefix server           # Background worker (production)
```

### Bot Commands

```bash
npm run dev --prefix bots/discord        # Discord bot (dev)
npm start --prefix bots/discord          # Discord bot (production)
npm run dev --prefix bots/telegram       # Telegram bot (dev)
npm start --prefix bots/telegram         # Telegram bot (production)
```

---

## Useful Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend API | 5000 | http://localhost:5000 |
| MongoDB | 27017 | (local) |
| Discord Bot | - | (websocket) |
| Telegram Bot | - | (websocket) |

---

## Getting Help

### Check Logs

1. **Frontend errors**: Open http://localhost:5173 → F12 (browser console)
2. **Backend errors**: Look at Terminal 2 output
3. **Worker errors**: Look at Terminal 3 output
4. **Bot errors**: Look at Terminal 4/5 output

### Common Issues

See "Troubleshooting" section above for detailed solutions

### Documentation

- Frontend: See `src/README.md`
- Backend: See `server/README.md`
- AI Assistant: See `AI_ASSISTANT_README.md`
- Discord Bot: See `bots/discord/README.md`
- Telegram Bot: See `bots/telegram/README.md`

---

## Summary

### To Get Started

```bash
# 1. Install dependencies
npm run bootstrap

# 2. Start MongoDB
mongod

# 3. Create .env files (see section above)

# 4. Start all services
npm run dev:all

# 5. Visit http://localhost:5173
```

That's it! All services running together. 🚀

---

**Last Updated**: November 16, 2025  
**Status**: ✅ Production Ready
