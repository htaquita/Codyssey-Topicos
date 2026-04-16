# Codyssey - Script de inicializacao
Write-Host "Iniciando Codyssey..." -ForegroundColor Cyan

# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\Backend'; if (-Not (Test-Path 'venv')) { python -m venv venv }; venv\Scripts\activate; pip install -r requirements.txt --quiet; uvicorn app.main:app --port 8000"

Write-Host "Backend iniciando..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\Frontend'; npm install --silent; npm run dev"

Write-Host "Frontend iniciando..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host "Abrindo navegador..." -ForegroundColor Green
Start-Process "http://localhost:8080"

Write-Host "Sistema rodando! Nao feche as janelas do PowerShell." -ForegroundColor Green