// import {PortState, PortType} from "../model/port"

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
  let leaf = Leaf.find(address);
  if (!leaf) {
    leaf = createLeafForConfig(config, address);
  } else {
    leaf = updateLeafForConfig(leaf, config);
    Leaf.update(leaf);
  }
  BackendService.saveConfig(address, config);
}

function createPortInLeafForConfig(portConfig, leaf){
  let port = Port.create(leaf, portConfig);
  if (!leaf.ports){
    leaf[ports] = [];
  }
  leaf.ports.push(port);
  return Leaf.update(leaf);
}

function createLeafForConfig(config, address) {
  let ports = config.ports;
  config.ports = [];
  let leaf = Leaf.createWithAddress(config, address);

  if (ports) {
    for (let port of config.ports) {
      createPortInLeafForConfig(port, leaf);
    }
  }

  return leaf;
}


function updateLeafForConfig(leaf, config) {

  for (let att in config) {
    if (att !== "ports") {
      leaf[att] = config[att];
    }
  }

  let portConfigs = config.ports;
  if (!portConfigs) {
    return leaf;
  }
  if (leaf.ports) {
    for (let port of leaf.ports) {
      let portConfig = findObjectWithIdValueInArray("address", port.address, portConfigs);
      if (portConfig) {
        for (let att in portConfig) {
          port[att] = portConfig[att];
        }
      }
    }
  } else {
    leaf.ports = config.ports;
  }
  return leaf;
}

function findObjectWithIdValueInArray(id, value, array) {
  if (!array || !(array instanceof Array)) {
    return null;
  }
  for (let element of array) {
    if (element[id]) {
      if (element[id] === value) {
        return element;
      }
    }
  }
  return null;
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
  leaf = changeState(state, portAddress, leaf);
  Leaf.update(leaf);
}

// Port functions
function changeState(state, portAddress, leaf) {
  nobe.log.d(`Changing port state of leaf ${leaf.address} with portAddress ${portAddress}.`);
  let ports = leaf.ports;
  if (!ports) {
    nobe.log.e(`Leaf ${leaf.address} has no ports!`);
    return leaf;
  }

  let port = findObjectWithIdValueInArray("address", portAddress, ports);
  if (port) {
    port.lastState = port.state;
    port.state = state;
    port.lastSateChange = new Date().toISOString();
    nobe.log.d(`Changed port state {leaf = ${leaf.address}}, {portAddress = ${portAddress}}, {state = ${state}}, {lastState = ${port.lastState}} .`);
  }

  return leaf;
}



