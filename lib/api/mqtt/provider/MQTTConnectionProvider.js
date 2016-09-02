let mqtt = require('mqtt');
const config = require('config').get('mqttProvider');
let client;

let MQTTConnectionProvider = {};

let topicListener = {};

module.exports = {
  initMQTTClient: function () {

    client = mqtt.connect();

    client.on('connect', connect);

    client.on('message', message);

    console.log("mqtt connection provider loaded...");
  },

  publish: publish,

  registerForTopic: registerForTopic,

  forwardMessage : message

};

function connect() {
  // for (let subTopic of config.subTopics) {
  //   client.subscribe(subTopic);
  //   nobe.log.d("mqtt client registered for topic: " + subTopic);
  // }
};

function message(topic, message) {
  // message is Buffer


  nobe.log.d("Incoming topic: " + topic);
  let parsedMessage = parseMessage(message);
  nobe.log.d(JSON.stringify(parsedMessage, null, '\t'));

  if (!parsedMessage) {
    nobe.log.d("Couldn't parse message");
    return;
  }

  let splittedTopic = topic.split("/");
  let leafAddress = splittedTopic[1];
  let messageType = splittedTopic[2];
  let portAddress;
  if (splittedTopic.length == 4) {
    portAddress = splittedTopic[3];
  }

  if (typeof messageType != 'string') {
    return;
  }

  if (topicListener[messageType]) {
    for (let i = 0; i < 3; i++) {
      for (let listener of topicListener[messageType]) {
        if (listener.priority == i || (!listener.priority && i == 2)) {
          listener.object.newMessage(parsedMessage, leafAddress, messageType, portAddress);
        }
      }
    }
  }

};

function publish(message, leafAddress, type, portAddress) {
  if (!client) {
    nobe.log.e("MQTT Client not connected! Could not transmit message...");
    return;
  }
  if (!portAddress) {
    client.publish(`/${leafAddress}/${type}`, message);
  } else {
    client.publish(`/${leafAddress}/${type}/${portAddress}`, message);
  }
}

// max priority = 0, min priority = 2
function registerForTopic(topic, newListener, priority) {
  let addListener = true;
  if (topicListener[topic]) {
    for (let listener of topicListener[topic]) {
      if (listener.object === newListener) {
        addListener = false;
        break;
      }
    }
  } else {
    topicListener[topic] = [];
  }

  if (addListener) {
    topicListener[topic].push({"object": newListener, "priority": priority || 1});
    nobe.log.d(`Listener registered for {topic = ${topic}} with {priority = ${priority}}.`);
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

function getInputAdressesAsArray(config) {
  let inputPortAdresses = [];
  config.ports.forEach(function (port) {
    if (PortState.INPUT == port.state) {
      inputPortAdresses.push(port.address)
    }
  });
  return inputPortAdresses;
}
