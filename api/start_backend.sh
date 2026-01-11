#!/bin/bash
# Navigate to the script's directory (api/) to handle paths with spaces correctly
cd "$(dirname "$0")"

echo "🚀 Setting up Python Backend..."

# 1. Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment 'venv'..."
    python3 -m venv venv
fi

# 2. Activate virtual environment
source venv/bin/activate

# 3. Upgrade pip and install dependencies
echo "⬇️  Installing dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

# 4. Start the server
echo "✅ Starting FastAPI Server on Port 8000..."
uvicorn main:app --reload --port 8000
