#!/bin/bash
# Quick Start Script for Money Laundering Detection System v2.0

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   💰 Money Laundering Detection System - Quick Start        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Prerequisites:${NC}"
echo "✓ Node.js 16+"
echo "✓ MongoDB (local or MongoDB Atlas)"
echo "✓ npm or yarn"
echo ""

# Backend setup
echo -e "${YELLOW}Setting up Backend...${NC}"
cd NEW-Backend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/money-laundering-detection
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
EOF
    echo -e "${GREEN}✓ .env created${NC}"
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

echo ""
echo -e "${YELLOW}Starting Backend Server...${NC}"
echo -e "${GREEN}Backend will start on http://localhost:5000${NC}"
echo ""

# Start backend in background
npm start &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Frontend setup
echo -e "${YELLOW}Setting up Frontend...${NC}"
cd ../NEW-Frontend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi

echo ""
echo -e "${YELLOW}Starting Frontend Server...${NC}"
echo -e "${GREEN}Frontend will start on http://localhost:5173${NC}"
echo ""

npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
