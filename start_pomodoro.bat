@echo off
chcp 65001 >nul
title 🍅 桌面番茄钟

echo 启动番茄钟...
start "" "%~dp0pomodoro.html"
echo 已在浏览器中打开番茄钟。
timeout /t 2 /nobreak >nul
