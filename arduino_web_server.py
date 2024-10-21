import http.server
import itertools
import logging
import platform
import os
import subprocess
import tempfile
import json
import webbrowser
import time

# Configure logging to log detailed output to a file
logging.basicConfig(
    level=logging.DEBUG,
    filename='arduino_web_server.log',
    filemode='w',
    format='%(asctime)s - %(levelname)s - %(message)s'
)

sketch_filename = ""  # Global variable to store the sketch file path
upload_in_progress = False  # Variable to track if an upload is in progress
board_fqbn = ""  # FQBN (Fully Qualified Board Name) for the selected board


def get_arduino_command():
    """Return the path to the Arduino CLI binary using a relative path."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    arduino_cli_path = os.path.join(script_dir, "resources", "Arduino CLI", "arduino-cli.exe")
    if os.path.exists(arduino_cli_path):
        logging.info("Using Arduino CLI command at %s", arduino_cli_path)
        return arduino_cli_path
    else:
        logging.error("Arduino CLI command not found at specified path: %s", arduino_cli_path)
        return None

def guess_port_name():
    """Attempt to guess a port name that we might find an Arduino on."""
    portname = None
    if platform.system() == "Windows":
        try:
            import winreg
            key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, "HARDWARE\\DEVICEMAP\\SERIALCOMM")
            for i in itertools.count():
                try:
                    portname = winreg.EnumValue(key, i)[1]
                except OSError:
                    break
        except ImportError:
            logging.error("Could not import winreg; guessing port name failed.")
    else:
        ttys = [filename for filename in os.listdir("/dev")
                if (filename.startswith("tty.") or filename.startswith("cu."))
                and "luetooth" not in filename]
        ttys.sort(key=lambda k: (k.startswith("cu."), k))
        if ttys:
            portname = "/dev/" + ttys[0]
    logging.info("Guessing port name as %s", portname)
    return portname

def upload_sketch(sketchname, port, fqbn):
    """Upload the sketch using Arduino CLI and stream the process."""
    compile_command = get_arduino_command()
    if compile_command:
        compile_args = [
            compile_command,
            "compile",
            "--upload",
            "-p", port,
            "--fqbn", fqbn,
            "--verbose",
            sketchname
        ]
        
        process = subprocess.Popen(compile_args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding='utf-8', errors='replace')
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                if "arduino:avr" not in output and "Used platform" not in output:
                    logging.debug(output.strip())
                    yield output.strip() + '\n'
        return process.poll()

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        """Handles GET requests for board list, ports, and upload-stream."""
        logging.info("Handling GET request for path: %s", self.path)
        if self.path == "/get-boards":
            self.get_boards()
        elif self.path == "/list-ports":
            self.list_ports()
        elif self.path == "/upload-stream" and upload_in_progress:
            self.stream_upload()
        else:
            super().do_GET()

    def do_POST(self):
        """Handles POST requests for uploading code."""
        logging.info("Handling POST request for path: %s", self.path)
        if self.path == "/upload":
            self.upload_code()
        else:
            super().do_POST()


    def get_boards(self):
        """Sends a JSON response with a list of available boards and their FQBN values."""
        boards = [
            {"name": "Nano", "fqbn": "arduino:avr:nano:cpu=atmega328old"},
            {"name": "ESP8266", "fqbn": "esp8266:esp8266:nodemcuv2"},
            {"name": "Uno", "fqbn": "arduino:avr:uno"}, 
            {"name": "Mega", "fqbn": "arduino:avr:mega"},
            {"name": "Due", "fqbn": "arduino:sam:due"},
            {"name": "Leonardo", "fqbn": "arduino:avr:leonardo"},
            {"name": "Micro", "fqbn": "arduino:avr:micro"},
            {"name": "ESP32", "fqbn": "esp32:esp32:esp32"} 
        ]
        logging.info("Sending available boards list.")
        self.send_json_response(boards)

    def list_ports(self):
        """Executes 'arduino-cli board list' and returns a JSON response with detailed available ports."""
        arduino_cli = get_arduino_command()
        if not arduino_cli:
            self.send_error(500, "Arduino CLI not found.")
            return

        try:
            result = subprocess.run([arduino_cli, "board", "list"], capture_output=True, text=True)
            if result.returncode == 0:
                lines = result.stdout.splitlines()[1:]  # Skip header
                ports = []
                for line in lines:
                    details = list(filter(None, line.split(' ')))
                    if len(details) >= 3:
                        port_info = {
                            "port": details[0],
                            "protocol": details[1],
                            "type": details[2],
                            "board_name": ' '.join(details[3:]) if len(details) > 3 else "Unknown"
                        }
                        ports.append(port_info)
                logging.info("Listing available ports: %s", ports)
                self.send_json_response({"ports": ports})
            else:
                logging.error("Error listing ports: %s", result.stderr)
                self.send_error(500, "Error listing ports.")
        except Exception as e:
            logging.error("Failed to execute board list command: %s", str(e))
            self.send_error(500, "Failed to execute board list command.")

    def stream_upload(self):
        """Streams the upload process using the 'arduino-cli' and updates the client."""
        global upload_in_progress
        self.send_response(200)
        self.send_header('Content-type', 'text/event-stream')
        self.end_headers()

        port = guess_port_name()
        if port:
            for line in upload_sketch(sketch_filename, port, board_fqbn):
                self.wfile.write(f"data: {line}\n\n".encode('utf-8'))
                self.wfile.flush()
            self.wfile.write(b"data: Upload completed\n\n")
            upload_in_progress = False
        else:
            logging.error("Could not guess port for upload.")
            self.wfile.write(b"data: Could not guess port\n\n")
            self.wfile.flush()

    def upload_code(self):
        """Handles the code upload request and starts the upload process."""
        global sketch_filename, upload_in_progress, board_fqbn

        logging.info("Upload request received.")
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length:
            post_data = json.loads(self.rfile.read(content_length))
            logging.info(f"Post data: {post_data}")
            arduino_code = post_data.get("code")
            fqbn = post_data.get("fqbn")

            if not arduino_code or not fqbn:
                logging.error("Invalid upload request: 'code' or 'fqbn' missing.")
                self.send_error(400, "Invalid request: 'code' or 'fqbn' missing.")
                return

            dirname = tempfile.mkdtemp()
            sketch_filename = os.path.join(dirname, os.path.basename(dirname)) + ".ino"
            with open(sketch_filename, "w", encoding='utf-8') as f:
                f.write(arduino_code + "\n")

            upload_in_progress = True
            board_fqbn = fqbn

            logging.info("Sketch uploaded and upload process started.")  
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Sketch uploaded. Starting upload process...\n")

    def send_json_response(self, data):
        """Send JSON response with added CORS header for client access."""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')  # Allows cross-origin requests
        self.send_header('Access-Control-Allow-Methods', 'GET, POST')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

if __name__ == '__main__':
    logging.info("Blocklyduino can now be accessed at http://127.0.0.1:8080/")
    
    current_dir = os.path.abspath(os.path.dirname(__file__))
    os.chdir(current_dir)
    
    # Start the server
    server = http.server.HTTPServer(("127.0.0.1", 8080), Handler)

    
    # Delay and open the URL in the default web browser
    time.sleep(1)
    # webbrowser.open("http://127.0.0.1:8080/blockly/apps/blocklyduino/")
    
    server.serve_forever()  