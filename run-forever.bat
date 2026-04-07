@echo off
setlocal enabledelayedexpansion

echo ======================================
echo Cosmo Support - Auto-Restart Service
echo ======================================
echo.

:start
echo [%date% %time%] Starting Node server...
start "CosmoServer" cmd /k "cd /d %~dp0 && node server.js > server.log 2>&1"

echo [%date% %time%] Starting Tunnel...
start "CosmoTunnel" cmd /k "cd /d %~dp0 && cloudflared tunnel --url http://127.0.0.1:5000 --no-autoupdate > tunnel.log 2>&1"

echo.
echo Server and Tunnel started!
echo Waiting 30 seconds before checking...
echo.

timeout /t 30 /nobreak > nul

:monitor
echo [%date% %time%] Checking services...

curl -s http://localhost:5000 > nul 2>&1
if !errorlevel! neq 0 (
    echo [!] Server not responding, restarting...
    taskkill /F /IM node.exe > nul 2>&1
    goto start
)

netstat -an | findstr "trycloudflare.com" > nul 2>&1
if !errorlevel! neq 0 (
    echo [!] Tunnel disconnected, restarting...
    taskkill /F /IM cloudflared.exe > nul 2>&1
    timeout /t 5 /nobreak > nul
    goto start
)

echo [+] All services running
timeout /t 30 /nobreak > nul
goto monitor