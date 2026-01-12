#!/bin/bash

# Fix Local Development Script
# This script ensures you are running the correct Root version of the app.

echo "🔧 Fixing Project State..."

# 1. Check if we are inside the 'web' folder and move up if needed
if [[ "$PWD" == */web ]]; then
  echo "⚠️  Detected running inside 'web' folder. Moving up..."
  cd ..
fi

# 2. Delete the stale 'web' folder if it exists
if [ -d "web" ]; then
  echo "🗑️  Removing stale 'web/ folder..."
  rm -rf web
fi

# 3. Validating Root Files
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found in $(pwd). Something is wrong."
  exit 1
fi

# 4. Install Dependencies
echo "📦 Installing Dependencies (this might take a minute)..."
npm install

# 5. Start Server
echo "🚀 Starting Server..."
echo "✅ Everything is fixed! Your app is running at http://localhost:3000"
npm run dev
