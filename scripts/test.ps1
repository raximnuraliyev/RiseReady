$pages = @(
    "/",
    "/dashboard",
    "/calendar",
    "/career",
    "/skills",
    "/focus",
    "/wellbeing",
    "/budget"
)

Write-Host "Starting smoke tests..."
Write-Host "Testing frontend server..."

foreach ($page in $pages) {
    $url = "http://localhost:5173$page"
    Write-Host "`nTesting $url"
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing
        Write-Host "✓ Page accessible ($($response.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nTesting backend server..."
$url = "http://localhost:4000"
try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing
    Write-Host "✓ Server accessible ($($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}