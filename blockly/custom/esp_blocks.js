//  ESP8266 Appetizer: Set ESP8266 Network
Blockly.Blocks['set_esp'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(" Set ESP8266 Name")
            .appendField(new Blockly.FieldTextInput("ESP8266Board"), "NAME")
            .appendField(" Password")
            .appendField(new Blockly.FieldTextInput("12345678"), "PASSWORD");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);  // Light green
        this.setTooltip("Set the ESP8266's network name and password.");
        this.setHelpUrl("");
    }
};

Blockly.Arduino['set_esp'] = function (block) {
    var name = Blockly.Arduino.quote_(block.getFieldValue('NAME'));
    var password = Blockly.Arduino.quote_(block.getFieldValue('PASSWORD'));
    
    Blockly.Arduino.definitions_['esp_wifi'] = '#include <ESP8266WiFi.h>';
    Blockly.Arduino.setups_['wifi_setup'] = `
        WiFi.softAP(${name}, ${password});
        Serial.begin(115200);
        Serial.println("ESP Access Point Started");
        Serial.print("SSID: ");
        Serial.println(${name});
        Serial.print("Password: ");
        Serial.println(${password});
    `;
    return '';
};

//  ESP8266 Main Course: Initialize Server Port
Blockly.Blocks['init_esp_port'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(" Init ESP8266 Port")
            .appendField(new Blockly.FieldTextInput("80"), "PORT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);  // Medium green
        this.setTooltip("Initialize ESP8266 on the given port.");
        this.setHelpUrl("");
    }
};

Blockly.Arduino['init_esp_port'] = function (block) {
    var port = block.getFieldValue('PORT');
    Blockly.Arduino.definitions_['global_server'] = `WiFiServer server(${port});`;
    Blockly.Arduino.setups_['wifi_server_setup'] = `
        WiFi.mode(WIFI_AP);
        server.begin();
        Serial.print("Server started at port: ");
        Serial.println(${port});
    `;
    return '';
};

//  ESP8266 Dessert: Read Data
Blockly.Blocks['read_esp_data'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(" Read ESP8266 Data");
        this.setOutput(true, "String");
        this.setColour(260);  // Light blue
        this.setTooltip("Read data from the ESP8266.");
        this.setHelpUrl("");
    }
};

Blockly.Arduino['read_esp_data'] = function (block) {
    Blockly.Arduino.definitions_['wifi_client'] = 'WiFiClient client;';
    Blockly.Arduino.definitions_['read_esp'] = `
        char readESP() {
            String data = "";
            char X;
            client = server.available();
            if (client) {
                data = client.readStringUntil('X');
                X = data[0];
                client.flush();
            }
            return X;
        }
    `;
    return ['readESP()', Blockly.Arduino.ORDER_ATOMIC];
};

//  ESP32 Appetizer: Set ESP32 Network
Blockly.Blocks['set_esp32'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(" Set ESP32 Name")
            .appendField(new Blockly.FieldTextInput("ESP32Board"), "NAME")
            .appendField(" Password")
            .appendField(new Blockly.FieldTextInput("12345678"), "PASSWORD");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(60);  // Orange
        this.setTooltip("Set the ESP32's network name and password.");
        this.setHelpUrl("");
    }
};

Blockly.Arduino['set_esp32'] = function (block) {
    var name = Blockly.Arduino.quote_(block.getFieldValue('NAME'));
    var password = Blockly.Arduino.quote_(block.getFieldValue('PASSWORD'));

    Blockly.Arduino.definitions_['esp_wifi'] = '#include <WiFi.h>';
    Blockly.Arduino.setups_['wifi_setup'] = `
        WiFi.softAP(${name}, ${password});
        Serial.begin(115200);
        Serial.println("ESP32 Access Point Started");
        Serial.print("SSID: ");
        Serial.println(${name});
        Serial.print("Password: ");
        Serial.println(${password});
    `;
    return '';
};

//  ESP01x Appetizer: Set ESP01x Network
Blockly.Blocks['set_esp01x'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(" Set ESP01 Name")
            .appendField(new Blockly.FieldTextInput("ESP01xBoard"), "NAME")
            .appendField(" Password")
            .appendField(new Blockly.FieldTextInput("12345678"), "PASSWORD");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);  // Red
        this.setTooltip("Set the ESP01x's network name and password.");
        this.setHelpUrl("");
    }
};

Blockly.Arduino['set_esp01x'] = function (block) {
    var name = block.getFieldValue('NAME');
    var password = block.getFieldValue('PASSWORD');

    Blockly.Arduino.setups_['initSerial'] = `
        Serial.begin(115200);
    `;

    var code = `
        Serial.println("AT");
        delay(300);
        Serial.println("AT+CWSAP=\\"${name}\\",\\"${password}\\",1,4");
        delay(2000);
    `;
    return code;
};

//  ESP01x Main Course: Initialize Server Port
Blockly.Blocks['init_esp01x_port'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(" Init ESP01x Port")
            .appendField(new Blockly.FieldTextInput("1234"), "PORT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);  // Pink
        this.setTooltip("Initialize ESP01x on the given port.");
        this.setHelpUrl("");
    }
};

Blockly.Arduino['init_esp01x_port'] = function (block) {
    var port = block.getFieldValue('PORT');
    Blockly.Arduino.setups_['initSerial'] = `
        Serial.begin(115200);
    `;

    var code = `
        Serial.println("AT");
        delay(300);
        Serial.println("AT+CWMODE=2");
        delay(300);
        Serial.println("AT+CIPMUX=1");
        delay(300);
        Serial.println("AT+CIPSERVER=1,${port}");
        delay(300);
    `;
    return code;
};

// ESP01x Dessert: Read Data
Blockly.Blocks['read_esp01x_data'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Read ESP01x Data");
        this.setOutput(true, "String");
        this.setColour(300);  // Purple
        this.setTooltip("Read data received from the ESP01x module.");
        this.setHelpUrl("");
    }
};

Blockly.Arduino['read_esp01x_data'] = function (block) {
    Blockly.Arduino.setups_['initSerial'] = `
        Serial.begin(115200);
    `;
    Blockly.Arduino.definitions_['read_esp_function'] = `
        char _A;
        char _B;
        String _Port;

        char readESP() {
            do {
                _A = Serial.read();
            } while (_A != ':');
            
            _Port = Serial.readStringUntil('\\n');
            _B = _Port[0];
            return _B;
        }
    `;

    var code = 'readESP();';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

// ESP01x Sweet Treat: Get IP Address
Blockly.Blocks['get_esp01x_ip_address'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Get ESP01x IP Address");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);  // Light purple
        this.setTooltip("Retrieve and store the IP address of the ESP01x.");
        this.setHelpUrl("");
    }
};

Blockly.Arduino['get_esp01x_ip_address'] = function (block) {
    Blockly.Arduino.definitions_['ipAddress'] = 'String ipAddress = "";';
    
    var code = `
        Serial.println("AT+CIFSR");
        delay(300);
        if (Serial.available()) {
            ipAddress = Serial.readStringUntil('\\n');
        }
    `;
    return code;
};

// ESP01x Sweet Treat: Display IP Address
Blockly.Blocks['esp01x_ip_address'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("IP Address");
        this.setOutput(true, "String");
        this.setColour(290);  // Light pink
        this.setTooltip("Display or utilize the current IP address of the ESP01x.");
        this.setHelpUrl("");
    }
};

Blockly.Arduino['esp01x_ip_address'] = function (block) {
    var code = 'ipAddress';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};
