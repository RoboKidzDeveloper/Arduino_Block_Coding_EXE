Blockly.Blocks['single_quote_text'] = {
    init: function() {
        this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
        this.setColour(160);  // Set block color (green in this case)
        this.appendDummyInput()
            .appendField("'")  // Opening single quote
            .appendField(new Blockly.FieldTextInput(''), 'TEXT')  // Text input field
            .appendField("'");  // Closing single quote
        this.setOutput(true, 'String');
        this.setTooltip('Represents a string with single quotes.');
        this.setHelpUrl('');
    }
};

Blockly.Arduino['single_quote_text'] = function(block) {
    var text = block.getFieldValue('TEXT');
    var code = "'" + text + "'";
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};
