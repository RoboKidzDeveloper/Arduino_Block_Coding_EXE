# #!/usr/bin/python
# # -*- coding: utf-8 -*-

# import BaseHTTPServer
# import SimpleHTTPServer
# import itertools
# import logging
# import platform
# import os
# import subprocess
# import tempfile
# from optparse import OptionParser

# logging.basicConfig(level=logging.DEBUG)

# arduino_cmd = None

# def get_arduino_command():
#     """Return the path to the Arduino binary."""
#     arduino_path = "C:\\Program Files\\PictoBlox\\resources\\arduino-1.8.19\\arduino.exe"
#     if os.path.exists(arduino_path):
#         logging.info("Using Arduino command at %s", arduino_path)
#         return arduino_path
#     else:
#         logging.error("Arduino command not found at specified path: %s", arduino_path)
#         return None

# def guess_port_name():
#     """Attempt to guess a port name that we might find an Arduino on."""
#     portname = None
#     if platform.system() == "Windows":
#         try:
#             import _winreg as winreg
#             key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, "HARDWARE\\DEVICEMAP\\SERIALCOMM")
#             for i in itertools.count():
#                 try:
#                     portname = winreg.EnumValue(key, i)[1]
#                 except WindowsError:
#                     break
#         except ImportError:
#             logging.error("Could not import _winreg; guessing port name failed.")
#     else:
#         ttys = [filename for filename in os.listdir("/dev")
#                 if (filename.startswith("tty.") or filename.startswith("cu."))
#                 and "luetooth" not in filename]
#         ttys.sort(key=lambda k: (k.startswith("cu."), k))
#         if ttys:
#             portname = "/dev/" + ttys[0]
#     logging.info("Guessing port name as %s", portname)
#     return portname

# parser = OptionParser()
# parser.add_option("--port", dest="port", help="Upload to serial port named PORT", metavar="PORT")
# parser.add_option("--board", dest="board", help="Board definition to use", metavar="BOARD")
# parser.add_option("--command", dest="cmd", help="Arduino command name", metavar="CMD")

# class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
#     def translate_path(self, path):
#         """Map the request path to the correct directory."""
#         base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__)))
#         path = SimpleHTTPServer.SimpleHTTPRequestHandler.translate_path(self, path)
#         rel_path = os.path.relpath(path, os.getcwd())
#         return os.path.join(base_dir, rel_path)

#     def do_HEAD(self):
#         """Send response headers"""
#         if self.path != "/":
#             return SimpleHTTPServer.SimpleHTTPRequestHandler.do_HEAD(self)
#         self.send_response(200)
#         self.send_header("content-type", "text/html;charset=utf-8")
#         self.send_header('Access-Control-Allow-Origin', '*')
#         self.end_headers()

#     def do_GET(self):
#         """Serve files from the correct directory"""
#         if self.path == "/":
#             self.path = "/blockly/apps/blocklyduino/index.html"
#         return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

#     def do_POST(self):
#         """Handle POST request for Arduino sketch upload"""
#         if self.path != "/":
#             return SimpleHTTPServer.SimpleHTTPRequestHandler.do_POST(self)

#         options, args = parser.parse_args()

#         length = int(self.headers.getheader('content-length'))
#         if length:
#             text = self.rfile.read(length)

#             print("sketch to upload: " + text)

#             dirname = tempfile.mkdtemp()
#             sketchname = os.path.join(dirname, os.path.basename(dirname)) + ".ino"
#             with open(sketchname, "wb") as f:
#                 f.write(text + "\n")

#             print("created sketch at %s" % (sketchname,))

#             compile_command = options.cmd or get_arduino_command()
#             if not compile_command:
#                 logging.error("Arduino command not found, cannot upload sketch.")
#                 self.send_response(400)
#                 return

#             compile_args = [
#                 compile_command,
#                 "--upload",
#                 "--port",
#                 options.port or guess_port_name(),
#                 "--verbose",
#                 "--board", "arduino:avr:nano:cpu=atmega328old"
#             ]
#             compile_args.append(sketchname)

#             print("Uploading with %s" % (" ".join(compile_args)))
#             rc = subprocess.call(compile_args)

#             if not rc == 0:
#                 print("arduino --upload returned", rc)
#                 self.send_response(400)
#             else:
#                 self.send_response(200)
#                 self.send_header('Access-Control-Allow-Origin', '*')
#                 self.end_headers()
#         else:
#             self.send_response(400)

# if __name__ == '__main__':
#     print("Blocklyduino can now be accessed at http://127.0.0.1:8080/")
    
#     current_dir = os.path.abspath(os.path.dirname(__file__))
#     os.chdir(current_dir)
    
#     server = BaseHTTPServer.HTTPServer(("127.0.0.1", 8080), Handler)
#     server.pages = {}
#     server.serve_forever()
