#!/bin/bash

# Render Build Script for Django + Vite React
set -e

echo "=== Starting Django + Vite React Build on Render ==="

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Build Vite React app (if frontend directory exists)
if [ -d "frontend" ]; then
    echo "Building Vite React frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
else
    echo "Frontend directory not found, skipping React build"
fi

# Collect static files (includes Vite build)
echo "Collecting static files..."
python manage.py collectstatic --no-input

# Apply database migrations
echo "Running database migrations..."
python manage.py migrate --no-input

echo "=== Build completed successfully! ==="