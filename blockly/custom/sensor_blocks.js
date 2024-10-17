Blockly.Blocks['ultrasonic_get_distance'] = {
    init: function() {
        this.appendValueInput("TRIG_PIN")
            .setCheck("Number")
            .appendField("get distance using trig pin");
        this.appendValueInput("ECHO_PIN")
            .setCheck("Number")
            .appendField("and echo pin");
        this.setOutput(true, "Number"); // This block returns a number
        this.setColour(230);
        this.setTooltip('Get distance using ultrasonic sensor with specified trig and echo pins.');
        this.setHelpUrl('');
    }
};

Blockly.Arduino['ultrasonic_get_distance'] = function(block) {
    var trigPin = Blockly.Arduino.valueToCode(block, 'TRIG_PIN', Blockly.Arduino.ORDER_ATOMIC);
    var echoPin = Blockly.Arduino.valueToCode(block, 'ECHO_PIN', Blockly.Arduino.ORDER_ATOMIC);

    // Define the function to measure distance if not already defined
    Blockly.Arduino.definitions_['define_getDistance'] = `
float getDistance(int trig, int echo){
    pinMode(trig, OUTPUT);
    digitalWrite(trig, LOW);
    delayMicroseconds(2);
    digitalWrite(trig, HIGH);
    delayMicroseconds(10);
    digitalWrite(trig, LOW);
    pinMode(echo, INPUT);
    return pulseIn(echo, HIGH, 30000) / 58.0;
}
    `;

    // Set up the pins
    Blockly.Arduino.setups_['setup_trig_' + trigPin + '_echo_' + echoPin] = `
    pinMode(${trigPin}, OUTPUT);
    pinMode(${echoPin}, INPUT);
    `;

    // Generate the code to call the function with the selected pins
    var code = `getDistance(${trigPin}, ${echoPin})`;
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};
