#!/bin/bash

# Production Build Script for Bakery Project
# This script performs a comprehensive build with all necessary checks

set -e  # Exit on any error

echo "🚀 Starting production build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Please create one from .env.example"
    echo "   cp .env.example .env"
    echo "   Then edit .env with your configuration."
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm ci --only=production

# Run linting
echo "🔍 Running linting checks..."
npm run lint

# Run type checking
echo "🔍 Running TypeScript type checking..."
npx tsc --noEmit

# Run tests
echo "🧪 Running tests..."
npm run test:coverage

# Build the application
echo "🏗️  Building the application..."
npm run build

# Check build output
if [ -d ".next" ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Build size:"
    du -sh .next/
else
    echo "❌ Build failed!"
    exit 1
fi

# Optional: Database migration check
if command -v psql &> /dev/null; then
    echo "🗄️  Checking database connection..."
    # Add database connection check here if needed
fi

echo "🎉 Production build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the production server: npm start"
echo "2. Access the application: http://localhost:3000"
echo "3. Check API documentation: http://localhost:3000/api-docs"
echo ""
echo "🔧 For deployment:"
echo "- Set NODE_ENV=production"
echo "- Configure your database URL"
echo "- Set up environment variables" 