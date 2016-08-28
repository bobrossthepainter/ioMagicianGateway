import {PortState, PortType} from "../model/port"

module.exports = {
  service: {
    getConfig: getConfig,

    saveConfig: saveConfig,

    changeInputState: changeInputState

  },
  name: 'LeafService'
};


function getConfig(address) {
  return getBackendLeafConfigWithFallbackLocal(address);
}

function saveConfig(address, config) {
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

function changeInputState(leafAddress, portAddress, state) {
  let leaf = Leaf.find(leafAddress);
  if (!leaf) {
    return;
  }
  changeState(state, portAddress, leaf);
  BackendService.changeLeafInputState(leafAddress, portAddress, state);
}


// Port functions
function changeState(state, portAddress, leaf) {
  nobe.log.d(`Changing port state of leaf ${leaf.address} with portAddress ${portAddress}.`);
  let portstates = leaf.state.ports;
  if (!portstates) {
    nobe.log.e(`Leaf ${leaf.address} has no port states!`);
    return;
  }
  for (let i = 0; i < portstates; i++) {
    if (portstates[i].address === portAddress) {
      portstates[i].lastState = portstates[i].state;
      portstates[i].state = state;
      portstates[i].lastChange = new Date().toISOString();
      BackendService.changeState(portstates[i], leaf);
      break;
    }
  }

}
