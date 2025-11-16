# Environment Configuration for AI Assistant

# === SERVER CONFIGURATION (.env) ===

# OpenRouter API Configuration
OPENROUTER_API_KEY=YOUR_OWN_KEY

# Application URLs
APP_URL=http://localhost:5173
# For production: APP_URL=https://yourdomain.com

# === FRONTEND CONFIGURATION (.env.local) ===

# API Configuration
VITE_API_URL=http://localhost:5000/api
# For production: VITE_API_URL=https://api.yourdomain.com/api

# === DEPLOYMENT ENVIRONMENTS ===

# Development (Local Machine)
# OPENROUTER_API_KEY=sk-or-v1-... (your key)
# APP_URL=http://localhost:5173
# VITE_API_URL=http://localhost:5000/api

# Staging (Test Server)
# OPENROUTER_API_KEY=sk-or-v1-... (same key or new one)
# APP_URL=https://staging.yourdomain.com
# VITE_API_URL=https://staging-api.yourdomain.com/api

# Production (Live Server)
# OPENROUTER_API_KEY=sk-or-v1-... (same key - rates based on usage)
# APP_URL=https://yourdomain.com
# VITE_API_URL=https://api.yourdomain.com/api

# === OPTIONAL ADVANCED CONFIGURATION ===

# Database
# MONGODB_URI=mongodb://localhost:27017/riseready
# (Usually configured in server/.env)

# Cache Settings (in aiController.js)
# AI_CACHE_SIMILARITY_THRESHOLD=0.65 (0-1, higher = stricter matching)
# AI_CACHE_MAX_AGE_DAYS=90 (how long to keep cached answers)

# Rate Limiting (in app.js)
# RATE_LIMIT_WINDOW_MS=60000 (1 minute)
# RATE_LIMIT_MAX_REQUESTS=120 (per window)

# === NOTES ===

# 1. Never commit OPENROUTER_API_KEY to git - use environment variables
# 2. Use different keys for development and production (optional but recommended)
# 3. For production, use HTTPS URLs only
# 4. Keep API URLs secret - only use in secure backend
# 5. Monitor your API usage to prevent unexpected costs
