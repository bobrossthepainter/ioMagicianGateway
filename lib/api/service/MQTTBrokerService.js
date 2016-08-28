const co = require('co');
const config = require('config').get('mosca');
const mosca = require('mosca');
const server = new mosca.Server(config);   //here we start mosca

server.on('ready', setup);  //on init it fires up setup()

server.on('clientConnected', clientConnected);

//fired when a message is received
//server.on('published', published);



let sayHello = function* sayHelloService() {
  return 'Hello I am the real Service';
}

let publish = function* publish(topic, payload) {

  var message = {
    topic: topic,
    payload: JSON.stringify(payload), // or a Buffer
    qos: 0, // 0, 1, or 2
    retain: false // or true
  };

  server.publish(message, function () {
    var message = {
      'published to': topic,
      'payload': payload
    };
    console.log(message);
  });
}

module.exports = {
  service: {
    publish: publish,
    sayHello: sayHello
  },
  name: 'MQTTBrokerService'
}

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
  MQTTClientService.initClient();
}


function clientConnected(client) {
  console.log('client connected', client.id);
}

function published(packet, client) {
  var topic = packet.topic;
  console.log("Incoming topic: " + topic);
  var payload = parsePayload(packet.payload);
  if (!payload) {
    console.log("Couldn't parse payload of: " + JSON.stringify(packet, null, '\t'));
    return;
  }
  //try {
  if (isConfig(topic)) {
    MQTTClientService.saveConfig(payload)
  } else if (isStatusChange(topic)) {
    MQTTClientService.statusChange(payload)
  } else {
    packet.payload = payload;
    console.log('Published', JSON.stringify(packet, null, '\t'));
  }
  //} catch (err) {
  //  console.log(err.message)
  //}g
}


function isConfig(topic) {
  if (typeof(topic) == 'string') {
    return topic.substring(topic.lastIndexOf('/')) == '/config';
  }
  return false;
}

function isStatusChange(topic) {
  if (typeof(topic) == 'string') {
    return topic.substring(topic.lastIndexOf('/')) == '/status';
  }
  return false;
}

function parsePayload(payload) {
  try {
    if (typeof(payload) == 'string') {
      return JSON.parse(payload);
    } else if (payload instanceof Buffer) {
      return JSON.parse(new Buffer(payload).toString('utf-8'));
    } else if (payload instanceof Object) {
      return payload;
    }
  } catch (err) {

  }
  return null;
}
