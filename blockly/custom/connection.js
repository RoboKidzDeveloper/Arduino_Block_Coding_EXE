Blockly.Blocks['esp32_ota_setup'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Setup ESP32 OTA with SSID")
            .appendField(new Blockly.FieldTextInput("SSID"), "SSID")
            .appendField("Password")
            .appendField(new Blockly.FieldTextInput("Password"), "PASSWORD");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);  // Red color for networking
        this.setTooltip("Set up OTA with SSID and Password for ESP32");
        this.setHelpUrl("");
    }
};


Blockly.Arduino['esp32_ota_setup'] = function(block) {
    var ssid = Blockly.Arduino.quote_(block.getFieldValue('SSID'));
    var password = Blockly.Arduino.quote_(block.getFieldValue('PASSWORD'));

    // Include necessary libraries for WiFi and OTA functionality
    Blockly.Arduino.definitions_['include_wifi'] = '#include <WiFi.h>';
    Blockly.Arduino.definitions_['include_mdns'] = '#include <ESPmDNS.h>';
    Blockly.Arduino.definitions_['include_ota'] = '#include <ArduinoOTA.h>';
    Blockly.Arduino.definitions_['include_udp'] = '#include <NetworkUdp.h>';

    // Define WiFi credentials as global variables
    Blockly.Arduino.definitions_['ssid'] = `const char *ssid = ${ssid};`;
    Blockly.Arduino.definitions_['password'] = `const char *password = ${password};`;

    // Setup code for WiFi and OTA configuration
    Blockly.Arduino.setups_['setup_wifi_ota'] = `
        Serial.println("Booting");
        WiFi.mode(WIFI_STA);
        WiFi.begin(ssid, password);
        while (WiFi.waitForConnectResult() != WL_CONNECTED) {
            Serial.println("Connection Failed! Rebooting...");
            delay(5000);
            ESP.restart();
        }

        ArduinoOTA
            .onStart([]() {
                String type;
                if (ArduinoOTA.getCommand() == U_FLASH) {
                    type = "sketch";
                } else {  // U_SPIFFS
                    type = "filesystem";
                }
                Serial.println("Start updating " + type);
            })
            .onEnd([]() {
                Serial.println("\\nEnd");
            })
            .onProgress([](unsigned int progress, unsigned int total) {
                Serial.printf("Progress: %u%%\\r", (progress / (total / 100)));
            })
            .onError([](ota_error_t error) {
                Serial.printf("Error[%u]: ", error);
                if (error == OTA_AUTH_ERROR) {
                    Serial.println("Auth Failed");
                } else if (error == OTA_BEGIN_ERROR) {
                    Serial.println("Begin Failed");
                } else if (error == OTA_CONNECT_ERROR) {
                    Serial.println("Connect Failed");
                } else if (error == OTA_RECEIVE_ERROR) {
                    Serial.println("Receive Failed");
                } else if (error == OTA_END_ERROR) {
                    Serial.println("End Failed");
                }
            });

        ArduinoOTA.begin();
        Serial.println("Ready");
        Serial.print("IP address: ");
        Serial.println(WiFi.localIP());
    `;

    // Loop code for handling OTA and blinking LED
    var loopCode = `
        ArduinoOTA.handle();
    `;

    return loopCode;
};
