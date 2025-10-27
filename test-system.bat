@echo off
echo ========================================
echo  Testing SPATIO SDS System
echo ========================================
echo.

echo [1/4] Testing Backend Health...
curl -s http://localhost:5000/api/health
if %errorlevel% neq 0 (
    echo ❌ Backend not responding
    goto :error
) else (
    echo ✅ Backend is healthy
)

echo.
echo [2/4] Testing Dashboard Stats...
curl -s http://localhost:5000/api/dashboard/stats
if %errorlevel% neq 0 (
    echo ❌ Dashboard stats failed
    goto :error
) else (
    echo ✅ Dashboard stats working
)

echo.
echo [3/4] Testing Dashboard Trends...
curl -s http://localhost:5000/api/dashboard/trends
if %errorlevel% neq 0 (
    echo ❌ Dashboard trends failed
    goto :error
) else (
    echo ✅ Dashboard trends working
)

echo.
echo [4/4] Testing Frontend...
curl -s http://localhost:5173 | findstr "html"
if %errorlevel% neq 0 (
    echo ❌ Frontend not responding
    goto :error
) else (
    echo ✅ Frontend is running
)

echo.
echo ========================================
echo  🎉 All Systems Operational!
echo ========================================
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:5173
echo ========================================
goto :end

:error
echo.
echo ========================================
echo  ❌ System Test Failed
echo ========================================
echo  Please check the server logs and try again.
echo ========================================

:end
echo.
pause




