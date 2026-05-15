# Start ngrok tunnel for client access
$ngrokPath = (Get-Command ngrok -ErrorAction SilentlyContinue).Source

if (-not $ngrokPath) {
    Write-Host "ngrok not found in PATH" -ForegroundColor Red
    exit 1
}

# Kill any existing ngrok processes
Get-Process ngrok -ErrorAction SilentlyContinue | Stop-Process -Force

# Start ngrok tunnel on port 3002
Write-Host "Starting tunnel on port 3002..." -ForegroundColor Cyan
& ngrok http 3002 --log=stdout
