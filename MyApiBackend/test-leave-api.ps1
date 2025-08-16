# Test Leave API endpoints

Write-Host "Testing Leave API endpoints..." -ForegroundColor Green

# Test 1: Get leave types
Write-Host "`n1. Testing GET /api/leave/types" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/leave/types" -Method GET
    Write-Host "✓ Leave types retrieved successfully" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 2
} catch {
    Write-Host "✗ Failed to get leave types: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Create a leave request
Write-Host "`n2. Testing POST /api/leave/requests" -ForegroundColor Yellow
$leaveRequest = @{
    empName = "Test Employee"
    subject = "Sick Leave Request"
    text = "I need sick leave due to illness"
    parentUkid = "1"
    status = "PENDING"
    addedDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    leaveDays = 2
    position = "Developer"
    leaveType = "sick"
    fromDate = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
    toDate = (Get-Date).AddDays(2).ToString("yyyy-MM-dd")
    reason = "Feeling unwell and need rest"
}

try {
    $headers = @{ 'Content-Type' = 'application/json' }
    $body = $leaveRequest | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/leave/requests" -Method POST -Body $body -Headers $headers
    Write-Host "✓ Leave request created successfully" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 2
    $createdId = $response.data.id
} catch {
    Write-Host "✗ Failed to create leave request: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

# Test 3: Get all leave requests
Write-Host "`n3. Testing GET /api/leave/requests" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/leave/requests" -Method GET
    Write-Host "✓ Leave requests retrieved successfully" -ForegroundColor Green
    Write-Host "Total leave requests: $($response.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Failed to get leave requests: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get leave requests by user
Write-Host "`n4. Testing GET /api/leave/requests/user/1" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/leave/requests/user/1" -Method GET
    Write-Host "✓ User leave requests retrieved successfully" -ForegroundColor Green
    Write-Host "User leave requests count: $($response.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Failed to get user leave requests: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get leave summary
Write-Host "`n5. Testing GET /api/leave/summary/1" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/leave/summary/1" -Method GET
    Write-Host "✓ Leave summary retrieved successfully" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 2
} catch {
    Write-Host "✗ Failed to get leave summary: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get leave balance
Write-Host "`n6. Testing GET /api/leave/balance/1" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/leave/balance/1" -Method GET
    Write-Host "✓ Leave balance retrieved successfully" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 2
} catch {
    Write-Host "✗ Failed to get leave balance: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting complete!" -ForegroundColor Green
Write-Host "Press any key to continue..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
