#!/bin/bash

echo "🚀 Starting AI Developer Platform (Prompt to Production)..."

# Activate Virtualenv & Start FastAPI Backend on Port 8000
source backend/venv/bin/activate
PYTHONPATH=backend python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "🟢 Backend Orchestrator running on http://localhost:8000 (PID: $BACKEND_PID)"

# Start Frontend Vite Server on Port 3000
cd frontend
npm run dev -- --port 3000 --host &
FRONTEND_PID=$!
echo "🟢 Mobile Responsive Dashboard running on http://localhost:3000 (PID: $FRONTEND_PID)"

wait $BACKEND_PID $FRONTEND_PID
