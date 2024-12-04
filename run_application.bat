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

REM Check if npm is in the local node_modules/.bin directory
set NPM_PATH=node_modules\.bin\npm.cmd
if exist "%NPM_PATH%" (
    echo Starting the application using local npm...
    call "%NPM_PATH%" start
) else (
    echo Local npm not found. Trying global npm...
    REM Fallback to global npm if local npm is not found
    call "C:\Program Files\nodejs\npm.cmd" start
)

pause
