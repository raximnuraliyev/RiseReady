# RiseReady Startup Verification Script
# Run this to verify everything is ready before starting

Write-Host "🔍 RiseReady Startup Verification" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$errors = @()
$warnings = @()

# Check 1: .env.local exists
Write-Host "1. Checking .env.local..." -ForegroundColor Yellow
if (Test-Path "d:\pdp\RiseReady-main\.env.local") {
    Write-Host "   ✅ .env.local exists" -ForegroundColor Green
    $content = Get-Content "d:\pdp\RiseReady-main\.env.local"
    if ($content -match "VITE_API_URL") {
        Write-Host "   ✅ VITE_API_URL configured" -ForegroundColor Green
    } else {
        $errors += ".env.local missing VITE_API_URL"
    }
} else {
    $errors += ".env.local not found"
}

# Check 2: server/.env exists
Write-Host "2. Checking server/.env..." -ForegroundColor Yellow
if (Test-Path "d:\pdp\RiseReady-main\server\.env") {
    Write-Host "   ✅ server/.env exists" -ForegroundColor Green
    $content = Get-Content "d:\pdp\RiseReady-main\server\.env"
    
    if ($content -match "MONGO_URI") {
        Write-Host "   ✅ MONGO_URI configured" -ForegroundColor Green
    } else {
        $errors += "MONGO_URI not found in server/.env"
    }
    
    if ($content -match "OPENROUTER_API_KEY") {
        Write-Host "   ✅ OPENROUTER_API_KEY configured" -ForegroundColor Green
    } else {
        $errors += "OPENROUTER_API_KEY not found in server/.env"
    }
} else {
    $errors += "server/.env not found"
}

# Check 3: App.tsx AIAssistantProvider removed
Write-Host "3. Checking App.tsx..." -ForegroundColor Yellow
$appContent = Get-Content "d:\pdp\RiseReady-main\src\App.tsx" -Raw
if ($appContent -match "AIAssistantProvider") {
    $errors += "❌ AIAssistantProvider still in App.tsx (should be removed!)"
} else {
    Write-Host "   ✅ AIAssistantProvider correctly removed" -ForegroundColor Green
}

if ($appContent -match "import AIAssistant from") {
    Write-Host "   ✅ AIAssistant component imported" -ForegroundColor Green
} else {
    $errors += "AIAssistant component not imported"
}

# Check 4: AIAssistant component exists
Write-Host "4. Checking AIAssistant component..." -ForegroundColor Yellow
if (Test-Path "d:\pdp\RiseReady-main\src\components\AIAssistant.tsx") {
    Write-Host "   ✅ AIAssistant.tsx exists" -ForegroundColor Green
} else {
    $errors += "AIAssistant.tsx not found"
}

# Check 5: CSS files
Write-Host "5. Checking CSS files..." -ForegroundColor Yellow
if (Test-Path "d:\pdp\RiseReady-main\src\index.css") {
    Write-Host "   ✅ index.css exists" -ForegroundColor Green
} else {
    $warnings += "index.css not found (might be okay)"
}

if (Test-Path "d:\pdp\RiseReady-main\src\components\AIAssistant.css") {
    Write-Host "   ✅ AIAssistant.css exists" -ForegroundColor Green
} else {
    $warnings += "AIAssistant.css not found"
}

# Check 6: Node modules
Write-Host "6. Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "d:\pdp\RiseReady-main\node_modules") {
    Write-Host "   ✅ node_modules exists" -ForegroundColor Green
} else {
    $warnings += "node_modules not found (run 'npm install' first)"
}

if (Test-Path "d:\pdp\RiseReady-main\server\node_modules") {
    Write-Host "   ✅ server/node_modules exists" -ForegroundColor Green
} else {
    $warnings += "server/node_modules not found (run 'npm --prefix server install' first)"
}

# Check 7: Vite config
Write-Host "7. Checking Vite config..." -ForegroundColor Yellow
if (Test-Path "d:\pdp\RiseReady-main\vite.config.ts") {
    Write-Host "   ✅ vite.config.ts exists" -ForegroundColor Green
} else {
    $errors += "vite.config.ts not found"
}

# Summary
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "📋 VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

if ($errors.Count -eq 0) {
    Write-Host "✅ All checks passed! Ready to start." -ForegroundColor Green
} else {
    Write-Host "❌ Errors found:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "   ❌ $error" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host "`n⚠️  Warnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   ⚠️  $warning" -ForegroundColor Yellow
    }
}

# Startup instructions
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "🚀 STARTUP INSTRUCTIONS" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Terminal 1 - Backend:" -ForegroundColor Cyan
Write-Host "  cd d:\pdp\RiseReady-main" -ForegroundColor White
Write-Host "  npm run dev --prefix server" -ForegroundColor White

Write-Host "`nTerminal 2 - Frontend:" -ForegroundColor Cyan
Write-Host "  cd d:\pdp\RiseReady-main" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White

Write-Host "`nBrowser:" -ForegroundColor Cyan
Write-Host "  http://localhost:5173" -ForegroundColor White

Write-Host "`nExpected to see:" -ForegroundColor Cyan
Write-Host "  ✅ Website loads (not white!)" -ForegroundColor Green
Write-Host "  ✅ Header and content visible" -ForegroundColor Green
Write-Host "  ✅ Green glowing orb in bottom-right" -ForegroundColor Green
Write-Host "  ✅ Click orb → chat opens" -ForegroundColor Green

if ($errors.Count -eq 0) {
    Write-Host "`n🎉 All systems go! Start the servers now!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Please fix the errors above before starting." -ForegroundColor Yellow
}
