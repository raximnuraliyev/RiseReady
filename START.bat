@echo off
REM RiseReady Startup Script - Windows Batch
REM This opens both backend and frontend in separate terminal windows

echo.
echo ======================================
echo 🚀 RiseReady Startup
echo ======================================
echo.
echo Starting Backend Server...
start cmd /k "cd d:\pdp\RiseReady-main && npm run dev --prefix server"

timeout /t 3

echo.
echo Starting Frontend Server...
start cmd /k "cd d:\pdp\RiseReady-main && npm run dev"

echo.
echo ======================================
echo ✅ Servers starting in separate windows
echo ======================================
echo.
echo Next steps:
echo 1. Wait 10-15 seconds for both to start
echo 2. Open browser: http://localhost:5173
echo 3. Look for green orb in bottom-right
echo 4. Click it and start chatting!
echo.
echo ✅ Backend should show: "Connected to MongoDB"
echo ✅ Frontend should show: "VITE ready in XXX ms"
echo.
echo If you see errors, check the terminal windows for details.
echo.
timeout /t 5
