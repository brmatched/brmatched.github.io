@echo off
title BRMatched! - Servidor Oficial (http://localhost:3001)
cd /d "%~dp0"
echo ====================================================
echo   INICIANDO SITE OFICIAL DO BRMATCHED!
echo   Acesse: http://localhost:3001
echo ====================================================
start "" http://localhost:3001
node server/index.js
pause
