<#
Start all development services in separate PowerShell windows.

Usage: run from project root in PowerShell:
  .\scripts\start-dev.ps1

This will open new windows for:
- frontend (Vite)
- server (nodemon)
- server worker (nodemon)
- discord bot (nodemon / node)

Make sure you've run `npm run bootstrap` first to install subproject dependencies.
#>

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Start-Window($name, $command, $workingDir) {
  Write-Host "Starting $name in new window (cwd: $workingDir)"
  Start-Process pwsh -ArgumentList "-NoExit","-Command","Set-Location -Path '$workingDir'; $command" -WindowStyle Normal
}

# Ensure from project root
Set-Location -Path $root

Start-Window 'Frontend (Vite)' 'npm run dev' (Join-Path $root '.')
Start-Window 'Server' 'npm run dev --prefix server' (Join-Path $root 'server')
Start-Window 'Server Worker' 'npm run dev:worker --prefix server' (Join-Path $root 'server')
Start-Window 'Discord Bot' 'npm run dev --prefix bots/discord' (Join-Path $root 'bots/discord')

Write-Host 'All dev windows started.'
