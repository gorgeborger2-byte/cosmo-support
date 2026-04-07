$ErrorActionPreference = "SilentlyContinue"

function Keep-Alive {
    param([string]$exePath, [string]$exeName, [int]$wait=5)
    $name = Split-Path $exePath -Leaf
    $start = Get-Date
    $fail = 0

    while ($true) {
        $proc = Get-Process $exeName -ErrorAction SilentlyContinue
        if (-not $proc) {
            Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Starting $exeName..."
            $proc = Start-Process $exePath -PassThru
        }
        Start-Sleep $wait
    }
}

Write-Host "Starting Cosmo Server Auto-Restart..."
Write-Host "Press Ctrl+C to stop"
Write-Host ""

Keep-Alive -exePath "node" -exeName "node" -wait 10