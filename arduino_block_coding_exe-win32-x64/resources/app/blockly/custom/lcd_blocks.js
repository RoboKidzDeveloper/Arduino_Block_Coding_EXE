
Blockly.Blocks['lcd_set_cursor'] = {
    init: function() {
        this.appendValueInput("COL")
            .setCheck("Number")
            .appendField("set cursor at column");
        this.appendValueInput("ROW")
            .setCheck("Number")
            .appendField("row");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
        this.setTooltip('Set cursor position on the LCD');
        this.setHelpUrl('');
    }
};

Blockly.Arduino['lcd_set_cursor'] = function(block) {
    var col = Blockly.Arduino.valueToCode(block, 'COL', Blockly.Arduino.ORDER_ATOMIC);
    var row = Blockly.Arduino.valueToCode(block, 'ROW', Blockly.Arduino.ORDER_ATOMIC);

    Blockly.Arduino.definitions_['lcd'] = '#include <LiquidCrystal.h>\n' +
                                          'LiquidCrystal lcd(13, 12, 11, 10, 19, 18);';
    Blockly.Arduino.setups_['lcd_begin'] = 'lcd.begin(16, 2);';

    var code = 'lcd.setCursor(' + col + ', ' + row + ');\n';
    return code;
};


Blockly.Blocks['lcd_show_text'] = {
    helpUrl: 'https://www.arduino.cc/en/Reference/LiquidCrystal',
    init: function() {
        this.setColour(65);
        this.appendValueInput("TEXT", 'String')
            .appendField("show text on LCD");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Displays text on the LCD at the current cursor position.');
    }
};

Blockly.Arduino['lcd_show_text'] = function(block) {
    var text = Blockly.Arduino.valueToCode(block, 'TEXT', Blockly.Arduino.ORDER_ATOMIC);

    Blockly.Arduino.definitions_['lcd'] = '#include <LiquidCrystal.h>\n' +
                                          'LiquidCrystal lcd(13, 12, 11, 10, 19, 18);';
    Blockly.Arduino.setups_['lcd_begin'] = 'lcd.begin(16, 2);';

    var code = 'lcd.print(' + text + ');\n';
    return code;
};




Blockly.Blocks['lcd_show_cursor'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("show cursor on LCD");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
        this.setTooltip('Show cursor on the LCD');
        this.setHelpUrl('');
    }
};

Blockly.Arduino['lcd_show_cursor'] = function(block) {
    Blockly.Arduino.definitions_['lcd'] = '#include <LiquidCrystal.h>\n' +
                                          'LiquidCrystal lcd(13, 12, 11, 10, 19, 18);';
    Blockly.Arduino.setups_['lcd_begin'] = 'lcd.begin(16, 2);';

    return 'lcd.cursor();\n';
};



Blockly.Blocks['lcd_hide_cursor'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("hide cursor on LCD");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
        this.setTooltip('Hide cursor on the LCD');
        this.setHelpUrl('');
    }
};

Blockly.Arduino['lcd_hide_cursor'] = function(block) {
    Blockly.Arduino.definitions_['lcd'] = '#include <LiquidCrystal.h>\n' +
                                          'LiquidCrystal lcd(13, 12, 11, 10, 19, 18);';
    Blockly.Arduino.setups_['lcd_begin'] = 'lcd.begin(16, 2);';

    return 'lcd.noCursor();\n';
};


Blockly.Blocks['lcd_blink_cursor_on'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("blink cursor on LCD");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
        this.setTooltip('Blink cursor on the LCD');
        this.setHelpUrl('');
    }
};

Blockly.Arduino['lcd_blink_cursor_on'] = function(block) {
    Blockly.Arduino.definitions_['lcd'] = '#include <LiquidCrystal.h>\n' +
                                          'LiquidCrystal lcd(13, 12, 11, 10, 19, 18);';
    Blockly.Arduino.setups_['lcd_begin'] = 'lcd.begin(16, 2);';

    return 'lcd.blink();\n';
};


Blockly.Blocks['lcd_blink_cursor_off'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("stop blinking cursor on LCD");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
        this.setTooltip('Stop blinking cursor on the LCD');
        this.setHelpUrl('');
    }
};

Blockly.Arduino['lcd_blink_cursor_off'] = function(block) {
    Blockly.Arduino.definitions_['lcd'] = '#include <LiquidCrystal.h>\n' +
                                          'LiquidCrystal lcd(13, 12, 11, 10, 19, 18);';
    Blockly.Arduino.setups_['lcd_begin'] = 'lcd.begin(16, 2);';

    return 'lcd.noBlink();\n';
};



Blockly.Blocks['lcd_clear'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("clear LCD");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
        this.setTooltip('Clear LCD');
        this.setHelpUrl('');
    }
};


Blockly.Arduino['lcd_clear'] = function(block) {
    Blockly.Arduino.definitions_['lcd'] = '#include <LiquidCrystal.h>\n' +
                                          'LiquidCrystal lcd(13, 12, 11, 10, 19, 18);';
    Blockly.Arduino.setups_['lcd_begin'] = 'lcd.begin(16, 2);';

    return 'lcd.clear();\n';
};



