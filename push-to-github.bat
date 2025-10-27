@echo off
echo ========================================
echo  Pushing to GitHub
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit - Rubber Plantation Management System with Netlify + Railway deployment configuration"
    git branch -M main
)

echo.
echo Please follow these steps:
echo.
echo 1. Go to https://github.com/new
echo 2. Create a new repository (e.g., "rubber-plantation")
echo 3. Copy the repository URL
echo 4. Come back here and run:
echo    git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
echo    git push -u origin main
echo.
echo OR if you already have the repository URL ready, paste it here:
set /p REPO_URL="Enter your GitHub repository URL: "

if not "%REPO_URL%"=="" (
    echo.
    echo Adding remote...
    git remote add origin %REPO_URL%
    echo.
    echo Pushing to GitHub...
    git push -u origin main
    echo.
    echo Done! Your code is now on GitHub.
) else (
    echo.
    echo No URL provided. Please create a GitHub repository first.
)

echo.
pause

