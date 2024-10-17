### Welcome to Blockly Coding



python -m http.server
 py arduino_web_server.py   

http://localhost:8000/blockly/apps/blocklyduino/index.html

BlocklyDuino is a **web-based visual programming editor for [Arduino](http://www.arduino.cc/)**.

TO check install 
C:\Users\lapto\Downloads\arduino-resources\arduino-cli\arduino-cli.exe lib list

### Colours
0 (Red)
20 (Orange)
60 (Yellow)
120 (Green)
160 (Teal/Light Green)
180 (Cyan)
210 (Blue)
230 (Dark Blue)
260 (Purple)
290 (Magenta)
330 (Pink)

to check boards
arduino-cli board listall
### Features

* Programming Arduino with visually drag and drop code blocks
* Generate fully compatible Arduino source code
* Interactive Arduino board with 10+ predefined Grove sensor blocks
* Load different on-site examples with url parameters

### Run locally on your web browser
If you want to install it locally. Get code from github and open `blockly/apps/blocklyduino/index.html` in your browser. 

The preffered way is to put the `BlocklyDuino/web` folder into a web server and open the url like `localhost/public/blockly/apps/blocklyduino/index.html` for use.

### Integrated Arduino upload
To avoid the tedious step of manually pasting code to the Arduino IDE, you can run a mini webserver that uses
the [Arduino IDE](https://www.arduino.cc/en/Main/Software) to upload the code to a connected Arduino board on Windows, Mac OS X and Linux systems.
Invoke this command from the BlocklyDuino root folder:
```
python arduino_web_server.py 
```

You can optionally specify the port with `--port=COM3` (or `--port=/dev/tty.foo` on Linux and Mac); 
if you don't, it will try and guess which port to use.

When the webserver is running, you can access BlocklyDuino itself on [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

### Usage
1. Open browser to BlocklyDuino, drag and drop blocks to make an Arduino program
2. Select the `Arduino` tab and copy all of the source code into an existing or new project in the Arduino IDE
3. Press the `Upload` button in the Arduino IDE to burn the code into a connected Arduino board

OR (if running `arduino_web_server.py`):
1. Open browser to BlocklyDuino, drag and drop blocks to make an Arduino program.
2. Select the `Arduino` tab and press the `Upload` button. (press the `Reset` button to upload an empty program)

In GNU/Linux OS (i.e. Ubuntu 18.04x64) 
1. Open one terminal, go the BlocklyDuino path and run:   
python arduino_web_server.py --port=/dev/ttyUSB0   
2. Open a new terminal and run:   
firefox http://127.0.0.1:8080/ 
3. Once BlocklyDuino is open in the browser, drag and drop blocks to make an Arduino program or 
load an example by clicking on `LoadXML` (e.g. /blocky/apps/blockyduino/examples/blink.xml or other in the same path)
4. Press `Upload` and wait until you see `Program uploaded ok` and press OK!
5. Close terminals with `Ctrl+c` or `Ctrl+d`

"# Arduino_Block_Coding_EXE" 
