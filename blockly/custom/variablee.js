Blockly.Blocks['set_variable'] = {
    init: function() {
        this.appendValueInput("VALUE")
            .setCheck("Number")
            .appendField("set")
            .appendField(new Blockly.FieldVariable("item"), "VAR")
            .appendField("to");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['change_variable'] = {
    init: function() {
        this.appendValueInput("DELTA")
            .setCheck("Number")
            .appendField("change")
            .appendField(new Blockly.FieldVariable("item"), "VAR")
            .appendField("by");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['show_variable'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("show variable")
            .appendField(new Blockly.FieldVariable("item"), "VAR");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['hide_variable'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("hide variable")
            .appendField(new Blockly.FieldVariable("item"), "VAR");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


// Arduino code generator for "set variable"
Blockly.Arduino['set_variable'] = function(block) {
    var variable_name = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var value = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC);
    return variable_name + ' = ' + value + ';\n';
};

// Arduino code generator for "change variable"
Blockly.Arduino['change_variable'] = function(block) {
    var variable_name = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var delta = Blockly.Arduino.valueToCode(block, 'DELTA', Blockly.Arduino.ORDER_ATOMIC);
    return variable_name + ' += ' + delta + ';\n';
};

// Arduino code generator for "show variable" (printing to Serial Monitor)
Blockly.Arduino['show_variable'] = function(block) {
    var variable_name = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return 'Serial.println(' + variable_name + ');\n';
};

// Arduino code generator for "hide variable"
// Since 'hide' typically refers to UI, you can implement it as a comment or a placeholder action
Blockly.Arduino['hide_variable'] = function(block) {
    var variable_name = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return '// Hide variable ' + variable_name + ' (depends on actual implementation)\n';
};

