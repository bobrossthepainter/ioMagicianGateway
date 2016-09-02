let mqttProvider = require('./../provider/MQTTConnectionProvider');
let mqttBroker = require('./../MQTTBrokerService').service;
mqttProvider.initMQTTClient();

module.exports = {
  service: {
    publish : mqttBroker.publish,

    registerForTopic : mqttProvider.registerForTopic
  },
  name: 'MQTTClientService'
};
