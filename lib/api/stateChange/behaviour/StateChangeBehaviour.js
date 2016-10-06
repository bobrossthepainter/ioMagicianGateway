let Seneca = require('seneca')();

function init(){
  registerForMessageEvents();
  nobe.log.d("StateChangeBehaviour initialized.");
}

function registerForMessageEvents(){
  MQTTClientService.registerForTopic("state", listener);
}

let listener = {
  newMessage :  function(state, leafAddress, messageType, portAddress){
    LeafService.changeInputState(leafAddress, portAddress, state);
    BackendService.changeLeafInputState(leafAddress, portAddress, state);
  }
}


module.exports = {
  behaviour: {
    init: init
  },
  name: 'StateChangeBehaviour'
};
