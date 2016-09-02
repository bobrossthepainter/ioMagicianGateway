function init(){
  registerForMessageEvents();
  nobe.log.d("BonjourBehaviour initialized.");
}

function registerForMessageEvents(){
  MQTTClientService.registerForTopic("hello", helloListener);
  MQTTClientService.registerForTopic("config", configListener);
}

let helloListener = {
  newMessage :  function(parsedMessage, leafAddress, messageType, portAddress){
    let config = LeafService.getConfig(leafAddress);
    if (config) {
      MQTTClientService.publish(config, leafAddress, 'updateConfig'); // TODO update only if config differs
      MQTTClientService.publish(getInputAdressesAsArray(config), leafAddress, 'getInput');
    } else {
      MQTTClientService.publish(config, leafAddress, 'getConfig');
    }
  }
}

let configListener = {
  newMessage :  function(parsedMessage, leafAddress, messageType, portAddress){
    LeafService.saveConfig(leafAddress, parsedMessage);
    MQTTClientService.publish(getInputAdressesAsArray(parsedMessage), leafAddress, 'getInput');
  }
}

function getInputAdressesAsArray(config){
  let inputPortAdresses = [];

  if(!config.ports){
    return null;
  }

  config.ports.forEach(function (port) {
    if (port.ioState && "input" === port.ioState){
      inputPortAdresses.push(port.address)
    }
  });
  return inputPortAdresses;
}

module.exports = {
  behaviour: {
    init: init
  },
  name: 'BonjourBehaviour'
};
