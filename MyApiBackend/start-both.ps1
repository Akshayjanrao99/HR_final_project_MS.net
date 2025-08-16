# PowerShell script to start both backend and frontend

$rootPath = "C:\Users\abhiv\Desktop\HRMG\1\HR-Management-Portal-hrSphere"

Write-Host "Starting MyApiBackend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\MyApiBackend'; dotnet run"

# Wait a few seconds for backend to start
Start-Sleep -Seconds 5

Write-Host "Starting React frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\my-react-app'; npm install; npm run dev"

Write-Host "Both servers are starting..." -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8080" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Press any key to continue..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
