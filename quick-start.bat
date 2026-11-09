@echo off
REM Quick Start Script for Money Laundering Detection System v2.0

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   💰 Money Laundering Detection System - Quick Start        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo Prerequisites:
echo  - Node.js 16+
echo  - MongoDB (local or MongoDB Atlas)
echo  - npm or yarn
echo.

REM Backend setup
echo Setting up Backend...
cd NEW-Backend

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed
)

REM Create .env if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/money-laundering-detection
        echo NODE_ENV=development
        echo CORS_ORIGIN=http://localhost:5173
    ) > .env
    echo [SUCCESS] .env created
) else (
    echo [SUCCESS] .env already exists
)

echo.
echo Starting Backend Server...
echo Backend will start on http://localhost:5000
echo.

REM Start backend in a new terminal window
start "Money Laundering Detection - Backend" cmd /k npm start

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Frontend setup
echo Setting up Frontend...
cd ..\NEW-Frontend

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed
)

echo.
echo Starting Frontend Server...
echo Frontend will start on http://localhost:5173
echo.
echo Open your browser and navigate to: http://localhost:5173
echo.

call npm run dev

pause
