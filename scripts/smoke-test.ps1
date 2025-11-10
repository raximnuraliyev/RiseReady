# Function to test an endpoint
function Test-Endpoint {
    param(
        [string]$Route,
        [string]$Description
    )

    $baseUrl = "http://127.0.0.1:5173"
    $url = "$baseUrl$Route"
    
    Write-Host "`nTesting $Description ($url)..." -ForegroundColor Yellow
    
    try {
        $result = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 0 -ErrorAction SilentlyContinue
        if ($result.StatusCode -eq 200) {
            Write-Host "✓ $Description is accessible (Status: $($result.StatusCode))" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ $Description returned unexpected status: $($result.StatusCode)" -ForegroundColor Red
            return $false
        }
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 308) {
            # This is fine - it means we got a permanent redirect response from the SPA
            Write-Host "✓ $Description is accessible (SPA Route)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ Failed to access $Description`: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
}

# Function to wait for server
function Wait-ForServer {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 60,
        [int]$RetryIntervalSeconds = 5
    )
    
    Write-Host "Waiting for server at $Url..." -ForegroundColor Yellow
    
    $start = Get-Date
    $ready = $false
    
    while (-not $ready -and ((Get-Date) - $start).TotalSeconds -lt $TimeoutSeconds) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 308) {
                Write-Host "Server is ready!" -ForegroundColor Green
                return $true
            }
        } catch {
            Write-Host "Server not ready yet, waiting $RetryIntervalSeconds seconds... ($(([int]((Get-Date) - $start).TotalSeconds))/$TimeoutSeconds seconds elapsed)" -ForegroundColor Yellow
            Start-Sleep -Seconds $RetryIntervalSeconds
        }
    }
    
    Write-Host "Server did not become ready within $TimeoutSeconds seconds" -ForegroundColor Red
    return $false
}

# Wait for servers
if (-not (Wait-ForServer -Url "http://127.0.0.1:5173")) {
    exit 1
}
if (-not (Wait-ForServer -Url "http://127.0.0.1:4000")) {
    exit 1
}

# Test each dashboard page
$pages = @(
    @{Route = "/"; Description = "Home page"}
    @{Route = "/dashboard"; Description = "Dashboard overview"}
    @{Route = "/calendar"; Description = "Calendar page"}
    @{Route = "/career"; Description = "Career page"}
    @{Route = "/skills"; Description = "Skills page"}
    @{Route = "/focus"; Description = "Focus page"}
    @{Route = "/wellbeing"; Description = "Wellbeing page"}
    @{Route = "/budget"; Description = "Budget page"}
)

$successCount = 0
$failCount = 0

foreach ($page in $pages) {
    if (Test-Endpoint -Route $page.Route -Description $page.Description) {
        $successCount++
    } else {
        $failCount++
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "✅ $successCount pages accessible" -ForegroundColor Green
Write-Host "❌ $failCount pages failed" -ForegroundColor Red