let mqtt = require('mqtt');
let client;

let MQTTClientService = {};

module.exports = {
  service: {
    initClient: function initClient() {

      client = mqtt.connect();

      client.on('connect', connect);

      client.on('message', message);
    },

    publish : publish,
  },
  name: 'MQTTClientService'
};

console.log("mqttClientService loaded...");
module.exports = MQTTClientService;

function connect() {
  client.subscribe('/#/config');
  client.subscribe('/#/input');
  client.subscribe('/#/hello');
};

function message(topic, message) {
  // message is Buffer
  nobe.log.d(JSON.stringify(message, null, '\t'));

  nobe.log.d("Incoming topic: " + topic);
  let parsedMessage = parseMessage(message);

  if (!parsedMessage) {
    nobe.log.d("Couldn't parse message");
    return;
  }

  let splittedTopic = topic.split("/");
  let leafAddress = splittedTopic[0];
  let messageType = splittedTopic[1];
  let portAddress;
  if (splittedTopic.length == 3){
    portAddress = splittedTopic[2];
  }


  if (typeof messageType != 'string') {
    return;
  }
  if (messageType == 'hello') {
    let config = LeafService.getConfig(leafAddress);
    if (config) {
      publish(leafAddress, 'updateConfig', config);
      publish(leafAddress, 'getInput', LeafService.getInputAdressesAsArray(config));
    } else {
      publish(leafAddress, 'getConfig', config);
    }

  } else if (messageType == 'config') {
    LeafService.saveConfig(parsedMessage);
    publish(leafAddress, 'getInput', getInputAdressesAsArray(parsedMessage));

  } else if (messageType == 'inputChange') {
    LeafService.changeInputState(leafAddress,portAddress,parsedMessage);

  } else {
    console.log('Published', JSON.stringify(packet, null, '\t'));
  }
};

function publish(address, type, message){
  if (!client){
    nobe.log.e("MQTT Client not connected! Could not transmit message...");
    return;
  }
  client.publish(`/${address}/${type}`, message);
}

function parseMessage(message) {
  try {
    if (typeof message == 'string') {
      nobe.log.d('Message is a string');
      return JSON.parse(message);
    } else if (message instanceof Buffer) {
      nobe.log.d('Message is a Buffer');
      return JSON.parse(new Buffer(message).toString('utf-8'));
    } else if (message instanceof Object) {
      nobe.log.d('Message is an Object');
      return message;
    }
  } catch (err) {
  }
  return null;
}

function getInputAdressesAsArray(config){
  let inputPortAdresses = [];
  config.ports.forEach(function (port) {
    if (PortState.INPUT == port.state){
      inputPortAdresses.push(port.address)
    }
  });
  return inputPortAdresses;
}
