let mqtt = require('mqtt');
const config = require('config').get('mqttProvider');
let client;

let MQTTConnectionProvider = {};

let topicListener = {};

module.exports = {
  service: {
    initClient: function initClient() {

      client = mqtt.connect();

      client.on('connect', connect);

      client.on('message', message);
    },

    publish : publish,

    registerForTopic : registerForTopic
  },
  name: 'MQTTClientService'
};

console.log("mqttClientService loaded...");
module.exports = MQTTClientService;

function connect() {
  for (subTopic of config.subTopics){
    client.subscribe(subTopic);
  }
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

  if (topicListener[messageType]){
    for (listener in topicListener[messageType]){
      listener.newMessage(parsedMessage, leafAddress, messageType, portAddress);
    }
  }

};

function publish(message, leafAddress, type, portAddress){
  if (!client){
    nobe.log.e("MQTT Client not connected! Could not transmit message...");
    return;
  }
  if (!portAddress) {
    client.publish(`/${address}/${type}`, message);
  } else {
    client.publish(`/${address}/${type}/${portAddress}`, message);
  }
}

function registerForTopic(topic, newListener){
  let addListener = true;
  if (topicListener[topic]){
    for (listener of topicListener[topic]) {
      if (listener === newListener){
        addListener = false;
        break;
      }
    }
  } else {
    topicListener[topic] = [];
  }

  if (addListener){
    topicListener[topic].push(newListener);
  }
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
