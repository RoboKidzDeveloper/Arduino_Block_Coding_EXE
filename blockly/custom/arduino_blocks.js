
Blockly.Blocks['arduino_setup'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Arduino");
        this.appendStatementInput("SETUP_CODE")
            .setCheck(null)
            .appendField("Setup code");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120); // Set the color of the block
        this.setTooltip('Add code to the setup function.');
        this.setHelpUrl('');
    }
};

Blockly.Arduino['arduino_setup'] = function(block) {
    var setupCode = Blockly.Arduino.statementToCode(block, 'SETUP_CODE');
    setupCode = setupCode.replace(/\n/g, '\n  ').trim(); // Indent and trim the setup code
    Blockly.Arduino.setups_['userSetupCode'] = setupCode; // Store the setup code
    return ''; // Return empty since setup code is handled globally
};

Blockly.Blocks['arduino_loop'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("For Ever");
        this.appendStatementInput("LOOP_CODE")
            .setCheck(null)
            .appendField("Loop");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230); // Set the color of the block
        this.setTooltip('Add code to the loop function.');
        this.setHelpUrl('');
    }
};

Blockly.Arduino['arduino_loop'] = function(block) {
    var loopCode = Blockly.Arduino.statementToCode(block, 'LOOP_CODE');
    loopCode = loopCode.replace(/\n/g, '\n  ').trim(); // Indent and trim the loop code
    return loopCode; // Return the loop code directly
};


Blockly.Blocks['serial_read_byte'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("read byte from Serial");
        this.setOutput(true, "Number");
        this.setColour(160);
        this.setTooltip("Reads a byte from the serial input.");
        this.setHelpUrl("https://www.arduino.cc/reference/en/language/functions/communication/serial/read/");
    }
};


Blockly.Arduino['serial_read_byte'] = function(block) {
    // Ensure the serial setup is included
    Blockly.Arduino.setups_['serial_begin'] = 'Serial.begin(9600);';
    
    var code = 'Serial.read()';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

