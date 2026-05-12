# Codyssey - Script de inicializacao local
Write-Host "Iniciando Codyssey..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\Frontend'; npm install --silent; npm run dev"

Start-Sleep -Seconds 8
Start-Process "http://localhost:5173"

Write-Host "Frontend rodando! Backend esta na nuvem (Vercel)." -ForegroundColor Green