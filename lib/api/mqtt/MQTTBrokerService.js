const winston = require('winston');
const co = require('co');
const config = require('config');
const moscaConfig = config.get('mosca');
const mosca = require('mosca');
let server;
const mqttHandler = require('./provider/MQTTConnectionProvider');

const mqttConfig = config.get('mqttProvider');

function init() {
    server = new mosca.Server(config);   //here we start mosca

    server.on('ready', setup);  //on bonjour it fires up setup()

    server.on('clientConnected', clientConnected);

    //fired when a message is received
    server.on('published', published);
}


let sayHello = function* sayHelloService() {
    return 'Hello I am the real Service';
}

function publish(message, leafAddress, type, portAddress) {

    let topic;
    if (!portAddress) {
        topic = `/${leafAddress}/${type}`;
    } else {
        topic = `/${leafAddress}/${type}/${portAddress}`;
    }

    let mqttMessage = {
        topic: topic,
        payload: JSON.stringify(message), // or a Buffer
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };

    winston.debug(`Publishing to {topic=${topic}}:\n${mqttMessage.payload}`);

    server.publish(mqttMessage, function () {
        let logMsg = {
            'published to': topic,
            'payload': mqttMessage.payload
        };
        nobe.log.d(logMsg);
    });
}

module.exports = {
    service: {
        init: init,
        publish: publish,
        sayHello: sayHello
    },
    name: 'MQTTBrokerService'
}

// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running');
}


function clientConnected(client) {
    console.log('client connected', client.id);
}

function published(packet, client) {
    // nobe.log.d(`new message {client = ${client}}`);
    if (!client) { //internal message
        return;
    }

    let topic = packet.topic;
    if (matchHandlerFormat(topic)) {
        mqttHandler.forwardMessage(packet.topic, packet.payload);
    }
    // var topic = packet.topic;
    // console.log("Incoming topic: " + topic);
    // var payload = parsePayload(packet.payload);
    // if (!payload) {
    //   console.log("Couldn't parse payload of: " + JSON.stringify(packet, null, '\t'));
    //   return;
    // }
    // //try {
    // if (isConfig(topic)) {
    //   MQTTClientService.saveConfig(payload)
    // } else if (isStatusChange(topic)) {
    //   MQTTClientService.statusChange(payload)
    // } else {
    //   packet.payload = payload;
    //   console.log('Published', JSON.stringify(packet, null, '\t'));
    // }
    //} catch (err) {
    //  console.log(err.message)
    //}g
}

function matchHandlerFormat(topic) {
    let dividedTopic = topic.split('/');
    if (dividedTopic.length !== 3 && dividedTopic.length !== 4) {
        return false;
    }
    return true;
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
