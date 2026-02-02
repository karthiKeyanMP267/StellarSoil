@echo off
REM StellarSoil Platform - Quick Setup Script for Windows
REM Run this script to set up the entire project

echo ========================================
echo 🌾 StellarSoil Platform - Installation
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Check MongoDB
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  MongoDB not found in PATH. Make sure MongoDB is installed and running.
) else (
    echo ✅ MongoDB found
)

echo.
echo 📦 Installing Server Dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Server installation failed
    exit /b 1
)
echo ✅ Server dependencies installed

echo.
echo 📦 Installing Client Dependencies...
cd ..\client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Client installation failed
    exit /b 1
)
echo ✅ Client dependencies installed

echo.
echo 🔧 Setting up Database...
cd ..\server
call npm run init:db
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Database initialization failed. Make sure MongoDB is running.
    echo    You can run 'npm run init:db' manually later.
)

echo.
echo 👤 Creating Admin Account...
call npm run seed:admin

echo.
echo ✅ Installation Complete!
echo.
echo 📝 Next Steps:
echo 1. Configure environment variables:
echo    - Copy server\.env.example to server\.env
echo    - Copy client\.env.example to client\.env
echo    - Update the values in both files
echo.
echo 2. Start the application:
echo    Terminal 1: cd server ^&^& npm run dev
echo    Terminal 2: cd client ^&^& npm run dev
echo.
echo 3. Access the application:
echo    Frontend: http://localhost:5173
echo    Backend: http://localhost:5000
echo.
echo 📚 For more details, see QUICK_START.md
echo.
pause
