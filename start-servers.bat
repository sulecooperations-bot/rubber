@echo off
echo ========================================
echo  SPATIO SDS - Rubber Plantation System
echo ========================================
echo.

echo [1/3] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo [2/3] Waiting for backend to initialize...
timeout /t 8 /nobreak > nul

echo [3/3] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo  Servers Starting...
echo ========================================
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:5173
echo  Health:   http://localhost:5000/api/health
echo ========================================
echo.
echo  Opening application in browser...
timeout /t 3 /nobreak > nul
start http://localhost:5173

echo.
echo  Press any key to exit this window...
pause > nul





