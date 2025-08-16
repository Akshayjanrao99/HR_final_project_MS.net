#!/bin/bash

# Start the backend
echo "Starting MyApiBackend..."
cd MyApiBackend
start cmd /c "dotnet run"

# Wait a few seconds
sleep 5

# Start the frontend
echo "Starting React frontend..."
cd ../my-react-app
start cmd /c "npm run dev"

echo "Both servers are starting..."
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:5173"
