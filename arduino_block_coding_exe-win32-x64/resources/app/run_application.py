import subprocess
import os
import sys
import tkinter as tk
from tkinter import messagebox

def show_message(message):
    root = tk.Tk()
    root.withdraw()  # Hide the main window
    messagebox.showinfo("Information", message)
    root.destroy()

def find_npm_path():
    # Check common npm installation paths
    possible_paths = [
        r'C:\Program Files\nodejs\npm.cmd',  # Standard install location on Windows
        r'C:\Users\{username}\AppData\Roaming\npm\npm.cmd',  # User-specific install location
        '/usr/local/bin/npm',  # Standard location on macOS/Linux
        '/usr/bin/npm'  # Another possible location on Linux
    ]
    
    # Replace {username} with the actual username on Windows
    if sys.platform == "win32":
        username = os.getlogin()
        possible_paths[1] = possible_paths[1].replace("{username}", username)

    for path in possible_paths:
        if os.path.isfile(path):
            return path
    
    return None

def main():
    # Get the base path depending on whether we're running in a frozen state (i.e., exe)
    if hasattr(sys, '_MEIPASS'):
        base_path = sys._MEIPASS  # Path to the temporary directory when running as an exe
    else:
        base_path = os.path.dirname(os.path.abspath(__file__))  # Regular path when running as a script

    arduino_cli_path = os.path.join(base_path, 'resources', 'Arduino-cli', 'arduino-cli.exe')

    # Print the constructed path for debugging
    print(f"Arduino CLI Path: {arduino_cli_path}")

    # Check if the Arduino CLI file exists
    if not os.path.isfile(arduino_cli_path):
        show_message("Error: Arduino CLI executable not found!")
        return

    # Step 1: Install necessary Arduino cores using the bundled arduino-cli
    print("Checking if ESP32 core is already installed...")
    result = subprocess.run([arduino_cli_path, 'core', 'list'], capture_output=True, text=True)

    if 'esp32:esp32' not in result.stdout:
        print("ESP32 core not found. Installing...")
        subprocess.run([arduino_cli_path, 'core', 'install', 'esp32:esp32'])
    else:
        print("ESP32 core already installed.")

    # Step 2: Navigate to the project directory and start npm
    project_dir = os.path.join(base_path)  # Use base_path to ensure correct navigation
    print("Navigating to project directory...")
    os.chdir(project_dir)

    # Find npm path dynamically
    npm_path = find_npm_path()
    if not npm_path:
        show_message("Error: npm executable not found!")
        return

    print("Starting the application...")
    subprocess.run([npm_path, 'start'])

if __name__ == "__main__":
    main()
    show_message("Press OK to exit.")
