@echo off
echo Starting .NET Backend on http://localhost:8080...
echo Press Ctrl+C to stop the server
dotnet run --launch-profile http
echo Backend stopped.
pause
