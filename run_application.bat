@echo off

REM Step 1: Install necessary Arduino cores using the bundled arduino-cli
REM Check if the ESP32 core is already installed by checking the exit code of 'arduino-cli'
resources\arduino-cli\arduino-cli.exe core list | findstr esp32:esp32

if %ERRORLEVEL% neq 0 (
    echo Installing ESP32 core...
    resources\arduino-cli\arduino-cli.exe core install esp32:esp32
) else (
    echo ESP32 core already installed.
)

REM Step 2: Navigate to the project directory and start npm
cd /d "%~dp0"  # Change to the directory where the batch file is located
npm start

pause
