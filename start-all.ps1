#!/usr/bin/env pwsh
# RiseReady Full Stack Startup Script
# Starts: Frontend, Backend (with AI), Worker, Discord Bot, Telegram Bot
# Requirements: Node.js, npm, MongoDB running

Write-Host "🚀 Starting RiseReady Full Stack..." -ForegroundColor Green
Write-Host ""

# Check for required commands
$missingDeps = @()

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    $missingDeps += "Node.js"
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    $missingDeps += "npm"
}

if ($missingDeps.Count -gt 0) {
    Write-Host "❌ Missing dependencies: $($missingDeps -join ', ')" -ForegroundColor Red
    Write-Host "Please install the missing dependencies and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ All required dependencies found" -ForegroundColor Green
Write-Host ""

# Check MongoDB
Write-Host "Checking MongoDB connection..." -ForegroundColor Cyan
$mongoReady = $false

# Try to connect to MongoDB locally
try {
    $testConnection = & mongosh --eval "db.adminCommand('ping')" --quiet 2>&1
    if ($LASTEXITCODE -eq 0) {
        $mongoReady = $true
        Write-Host "✅ MongoDB is running locally" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  MongoDB not found locally. Ensure MongoDB is running or set MONGO_URI in .env" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Cyan
Write-Host ""

# Show what's starting
Write-Host "📦 Services starting:" -ForegroundColor Yellow
Write-Host "  1. Frontend (React/Vite) - http://localhost:5173" -ForegroundColor Cyan
Write-Host "  2. Backend (Express + AI) - http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "  3. Worker (Background jobs)" -ForegroundColor Cyan
Write-Host "  4. Discord Bot (if configured)" -ForegroundColor Cyan
Write-Host "  5. Telegram Bot (if configured)" -ForegroundColor Cyan
Write-Host ""

# Check for .env files
$envChecks = @(
    @{ path = ".\.env.local"; name = "Frontend ENV" },
    @{ path = ".\server\.env"; name = "Backend ENV" },
    @{ path = ".\bots\discord\.env"; name = "Discord Bot ENV" },
    @{ path = ".\bots\telegram\.env"; name = "Telegram Bot ENV" }
)

Write-Host "Checking environment files..." -ForegroundColor Cyan
foreach ($check in $envChecks) {
    if (Test-Path $check.path) {
        Write-Host "  ✅ $($check.name) found" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  $($check.name) not found at $($check.path)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Starting with: npm run dev:all" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Run the dev:all command
npm run dev:all
