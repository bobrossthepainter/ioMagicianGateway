import {PortState, PortType} from "../model/port"

module.exports = {
  service: {
    getConfig: getConfig,

    saveConfig: saveConfig,

    changeInputState : changeInputState

  },
  name: 'LeafService'
};


function getConfig(address){
  return getBackendLeafConfigWithFallbackLocal(address);
}

function saveConfig(address, config){
  if (!Leaf.find(address)) {
    Leaf.create(address, config);
  } else {
    Leaf.update(address, config);
  }
  BackendService.saveConfig(address, config);
}

function getBackendLeafConfigWithFallbackLocal(address) {
  let config = BackendService.getLeafConfig(address);
  if (!config) {
    let leaf = Leaf.find(address);
    if (leaf) {
      config = leaf.config;
    }
    return config;
  }
}

function changeInputState(leafAddress,portAddress,state){
  let leaf = Leaf.find(leafAddress);
  if (!leaf){
    return;
  }
  PortService.changeState(state, portAddress, leaf);
  BackendService.changeLeafInputState(leafAddress, portAddress, state);
}


