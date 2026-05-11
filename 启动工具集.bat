@echo off
cd /d "%~dp0"
title 🍅 桌面效率工具集

echo =====================================
echo       🍅 桌面效率工具集
echo =====================================
echo.
echo  [1] 📋 启动计划清单挂件
echo     桌面便签风格，管理每日任务
echo.
echo  [2] 🍅 启动番茄钟
echo     浏览器打开番茄钟计时器
echo.
echo  [3] 📂 打开文件目录
echo.
echo  [4] ❌ 退出
echo.
echo =====================================
choice /c 1234 /n /m "请输入选项 (1-4): "

if %errorlevel%==1 (
    start "" pythonw widget_desktop.py
    goto end
)
if %errorlevel%==2 (
    start "" pomodoro.html
    goto end
)
if %errorlevel%==3 (
    start explorer "%~dp0"
    goto end
)
if %errorlevel%==4 (
    exit /b
)

:end
timeout /t 1 /nobreak >nul
