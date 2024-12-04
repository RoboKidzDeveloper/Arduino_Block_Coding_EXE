Blockly.Blocks['dht_sensor_setup'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("DHT No")
            .appendField(new Blockly.FieldTextInput("1"), "DHT_NUMBER")
            .appendField("Pin")
            .appendField(new Blockly.FieldDropdown([
                ["2", "2"],
                ["3", "3"],
                ["4", "4"],  // Default selection
                ["5", "5"],
                ["6", "6"],
                ["7", "7"],
                ["8", "8"],
                ["9", "9"],
                ["10", "10"],
                ["11", "11"],
                ["12", "12"],
                ["13", "13"],
                ["14", "14"],
                ["15", "15"],
            ]), "DHT_PIN")
            .appendField("Version")
            .appendField(new Blockly.FieldDropdown([
                ["DHT11", "DHT11"],  // Default DHT11
                ["DHT21", "DHT21"], 
                ["DHT22", "DHT22"]
            ]), "DHT_VERSION");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('Setup a DHT sensor with pin and version.');
        this.setHelpUrl('');
    }
};  



Blockly.Arduino['dht_sensor_setup'] = function(block) {
    var dhtNumber = block.getFieldValue('DHT_NUMBER');
    var dhtPin = block.getFieldValue('DHT_PIN');
    var dhtVersion = block.getFieldValue('DHT_VERSION');

    Blockly.Arduino.definitions_['dht_library'] = '#include <DHT.h>';
    Blockly.Arduino.definitions_['dht_object' + dhtNumber] = 'DHT dht' + dhtNumber + '(' + dhtPin + ', ' + dhtVersion + ');';
    Blockly.Arduino.setups_['dht_setup' + dhtNumber] = 'dht' + dhtNumber + '.begin();';

    return '';
};

Blockly.Blocks['dht_get_temperature'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("DHT No")
            .appendField(new Blockly.FieldTextInput("1"), "DHT_NUMBER")
            .appendField("Temperature");
        this.setOutput(true, 'Number');
        this.setColour(230);
        this.setTooltip('Get temperature from the DHT sensor.');
        this.setHelpUrl('');
    }
};

Blockly.Arduino['dht_get_temperature'] = function(block) {
    var dhtNumber = block.getFieldValue('DHT_NUMBER');
    var code = 'dht' + dhtNumber + '.readTemperature()';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Blocks['dht_get_humidity'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("DHT No")
            .appendField(new Blockly.FieldTextInput("1"), "DHT_NUMBER")
            .appendField("Humidity");
        this.setOutput(true, 'Number');
        this.setColour(230);
        this.setTooltip('Get humidity from the DHT sensor.');
        this.setHelpUrl('');
    }
};

Blockly.Arduino['dht_get_humidity'] = function(block) {
    var dhtNumber = block.getFieldValue('DHT_NUMBER');
    var code = 'dht' + dhtNumber + '.readHumidity()';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Blocks['dht_get_temperature_int'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("DHT No")
            .appendField(new Blockly.FieldTextInput("1"), "DHT_NUMBER")
            .appendField("Temperature int");
        this.setOutput(true, 'Number');
        this.setColour(230);
        this.setTooltip('Get temperature as integer from the DHT sensor.');
        this.setHelpUrl('');
    }
};

Blockly.Arduino['dht_get_temperature_int'] = function(block) {
    var dhtNumber = block.getFieldValue('DHT_NUMBER');
    var code = 'round(dht' + dhtNumber + '.readTemperature())';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Blocks['dht_get_humidity_int'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("DHT No")
            .appendField(new Blockly.FieldTextInput("1"), "DHT_NUMBER")
            .appendField("Humidity int");
        this.setOutput(true, 'Number');
        this.setColour(230);
        this.setTooltip('Get humidity as integer from the DHT sensor.');
        this.setHelpUrl('');
    }
};

Blockly.Arduino['dht_get_humidity_int'] = function(block) {
    var dhtNumber = block.getFieldValue('DHT_NUMBER');
    var code = 'round(dht' + dhtNumber + '.readHumidity())';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};
