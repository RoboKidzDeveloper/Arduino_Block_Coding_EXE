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
    project_dir = os.path.join('P:\\', 'Block_Coding', 'Arduino_Block_Coding_EXE')
    print("Navigating to project directory...")
    os.chdir(project_dir)

    # Use the full path to npm
    npm_path = r'C:\Program Files\nodejs\npm.cmd'  # Update to your npm path if necessary
    print("Starting the application...")
    subprocess.run([npm_path, 'start'])

if __name__ == "__main__":
    main()
    show_message("Press OK to exit.")
