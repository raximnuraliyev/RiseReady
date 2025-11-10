$urls = @(
  'http://localhost:5173/',
  'http://localhost:5173/dashboard/focus',
  'http://localhost:5173/dashboard/career',
  'http://localhost:5173/dashboard/community',
  'http://localhost:5173/dashboard/projects',
  'http://localhost:5173/dashboard/internships',
  'http://localhost:5173/dashboard/notifications'
)

Write-Output "Waiting for dev server at ${urls[0]} (timeout 60s)..."
$up = $false
for ($i = 0; $i -lt 60; $i++) {
  try {
    $r = Invoke-WebRequest -Uri $urls[0] -UseBasicParsing -TimeoutSec 2
    if ($r.StatusCode -ge 200) { $up = $true; break }
  } catch {
    Start-Sleep -Seconds 1
  }
}

if (-not $up) {
  Write-Output 'Server did not become ready within timeout'
  exit 2
}

Write-Output 'Server is up — running smoke requests:'
foreach ($u in $urls) {
  try {
    $res = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 10
    $status = $res.StatusCode
    Write-Output "----\n$u -> $status"
    $body = $res.Content
    if ($null -ne $body) {
      $snippet = if ($body.Length -gt 400) { $body.Substring(0,400) } else { $body }
      Write-Output $snippet
    } else {
      Write-Output '<no body returned>'
    }
  } catch {
    Write-Output "----\n$u -> ERROR: $($_.Exception.Message)"
  }
}

Write-Output 'Smoke test complete.'
exit 0
