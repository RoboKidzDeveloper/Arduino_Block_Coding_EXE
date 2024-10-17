/**
 * Initialize Blockly workspace and handle code generation.
 */
var workspace = Blockly.inject('blocklyDiv', {
  toolbox: document.getElementById('toolbox')
});

/**
 * Generate JavaScript code from the blocks and execute it.
 */
function runJS() {
  var code = Blockly.JavaScript.workspaceToCode(workspace);
  try {
    eval(code);
  } catch (e) {
    alert('Program error:\n' + e);
  }
}

/**
 * Backup code blocks to localStorage.
 */
function backup_blocks() {
  if ('localStorage' in window) {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    window.localStorage.setItem('arduino', Blockly.Xml.domToText(xml));
  }
}

/**
 * Restore code blocks from localStorage.
 */
function restore_blocks() {
  if ('localStorage' in window && window.localStorage.arduino) {
    var xml = Blockly.Xml.textToDom(window.localStorage.arduino);
    Blockly.Xml.domToWorkspace(workspace, xml);
  }
}

/**
 * Save Arduino generated code to a local file.
 */
function SaveArduinoCode() {
  var fileName = window.prompt('What would you like to name your file?', 'BlocklyDuino');
  if (fileName) {
    var blob = new Blob([Blockly.Arduino.workspaceToCode(workspace)], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, fileName + '.ino');
  }
}





/**
 * Discard all blocks from the workspace.
 */
function discard() {
  var count = workspace.getAllBlocks().length;
  if (count < 2 || window.confirm('Delete all ' + count + ' blocks?')) {
    workspace.clear();
    renderContent();
  }
}


/**
 * Bind an event to a function call.
 */
function bindEvent(element, name, func) {
  if (element.addEventListener) {  // W3C
    element.addEventListener(name, func, false);
  } else if (element.attachEvent) {  // IE
    element.attachEvent('on' + name, func);
  }
}

/**
 * AJAX setup for loading examples.
 */
var ajax;
function createAJAX() {
  if (window.ActiveXObject) { // IE
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        return new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e2) {
        return null;
      }
    }
  } else if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  } else {
    return null;
  }
}

function onSuccess() {
  if (ajax.readyState == 4) {
    if (ajax.status == 200) {
      try {
        var xml = Blockly.Xml.textToDom(ajax.responseText);
      } catch (e) {
        alert('Error parsing XML:\n' + e);
        return;
      }
      var count = workspace.getAllBlocks().length;
      if (count && confirm('Replace existing blocks?\n"Cancel" will merge.')) {
        workspace.clear();
      }
      Blockly.Xml.domToWorkspace(workspace, xml);
    } else {
      alert("Server error");
    }
  }
}

function load_by_url(uri) {
  ajax = createAJAX();
  if (!ajax) {
    alert('Not compatible with XMLHttpRequest');
    return 0;
  }
  if (ajax.overrideMimeType) {
    ajax.overrideMimeType('text/xml');
  }

  ajax.onreadystatechange = onSuccess;
  ajax.open("GET", uri, true);
  ajax.send("");
}

/**
 * Upload the generated code to the Arduino.
 */
function uploadCode(code, callback) {
  var target = document.getElementById('content_arduino');
  var spinner = new Spinner().spin(target);

  var url = "http://127.0.0.1:8080/";
  var method = "POST";

  var async = true;
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (request.readyState != 4) {
      return;
    }

    spinner.stop();

    var status = parseInt(request.status);
    var errorInfo = null;
    switch (status) {
      case 200:
        break;
      case 0:
        errorInfo = "code 0\n\nCould not connect to server at " + url + ".  Is the local web server running?";
        break;
      case 400:
        errorInfo = "code 400\n\nBuild failed - probably due to invalid source code.  Make sure that there are no missing connections in the blocks.";
        break;
      case 500:
        errorInfo = "code 500\n\nUpload failed.  Is the Arduino connected to USB port?";
        break;
      case 501:
        errorInfo = "code 501\n\nUpload failed.  Is 'ino' installed and in your path?  This only works on Mac OS X and Linux at this time.";
        break;
      default:
        errorInfo = "code " + status + "\n\nUnknown error.";
        break;
    }

    callback(status, errorInfo);
  };

  request.open(method, url, async);
  request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
  request.send(code);
}

/**
 * Handle the upload button click event.
 */
function uploadClick() {
  var code = Blockly.Arduino.workspaceToCode(workspace);

  alert("Ready to upload to Arduino.");

  uploadCode(code, function(status, errorInfo) {
    if (status == 200) {
      alert("Program uploaded ok");
    } else {
      alert("Error uploading program: " + errorInfo);
    }
  });
}

/**
 * Handle the reset button click event.
 */
function resetClick() {
  var code = "void setup() {} void loop() {}";

  uploadCode(code, function(status, errorInfo) {
    if (status != 200) {
      alert("Error resetting program: " + errorInfo);
    }
  });
}
