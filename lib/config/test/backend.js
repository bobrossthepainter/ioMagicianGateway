'use strict';

module.exports.backend = {
  port: 1883, //mosca (mqtt) port
  //logger: {level: 'debug'},
  backend: {
    //using ascoltatore
    type: 'mongo',
    url: 'mongodb://localhost:27017/pubSub',
    pubsubCollection: 'mqttPubSub',
    mongo: {}
  }
};
