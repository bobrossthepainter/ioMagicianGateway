import assert from 'assert';

// start mqtt broker
require('../../../lib/api/mqtt/MQTTBrokerService');

let mqttService = require('../../../lib/api/mqtt/service/MQTTClientService').service;

let receivedMessages = [];
let listener = {
  newMessage: (parsedMessage, leafAddress, messageType, portAddress) => {
    receivedMessages.push({
      parsedMessage: parsedMessage,
      leafAddress: leafAddress,
      messageType: messageType,
      portAddress: portAddress
    });
  }
};

mqttService.registerForTopic("#/config", listener);

mqttService.publish({bar: "foo"}, "node123", "config");

describe("MQTT messaging and observer tests", function () {

  this.timeout(1);
  it("receive message", function () {
    this.timeout(1);
    assert.strictEqual(receivedMessages.length, 1);
    assert.strictEqual(receivedMessages[0].parsedMessage.bar, "foo");
    assert.strictEqual(receivedMessages[0].leafAddress, "node123");
    assert.strictEqual(receivedMessages[0].messageType, "config");
  });
});
