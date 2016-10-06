// import {PortState, PortType} from "../model/port"
let Seneca = require('seneca')();

Seneca.use(leafService);

module.exports = {
  service: {
    getConfig: getConfig,

    saveConfig: saveConfigInternal,

    changeInputState: changeInputStateInternal

  },
  name: 'LeafService'
};

function leafService(){
  this.add('comp:leaf,cmd:getConfig', getConfig);
  this.add('comp:leaf,cmd:saveConfig', getConfig);
  this.add('comp:port,cmd:changeInputState', getConfig);

  function getConfig(msg, respond){
    let config = getBackendLeafConfigWithFallbackLocal(msg.address);
    respond(null, config);
  }

  function saveConfig(msg, respond){
    saveConfigInternal(msg.address, msg.config);
    respond(null, null);
  }

  function changeInputState(msg, respond){
    let leaf = changeInputStateInternal(msg.leafAddress, msg.portAddress, msg.state)
    respond(null, leaf);
  }
}

function getConfig(address) {
  return getBackendLeafConfigWithFallbackLocal(address);
}

function saveConfigInternal(address, config) {
  let leaf = Leaf.find(address);
  if (!leaf) {
    leaf = createLeafForConfig(config, address);
  } else {
    leaf = updateLeafForConfig(leaf, config);
    Leaf.update(leaf);
  }
  BackendService.saveConfig(address, config);
}

function changeInputStateInternal(leafAddress, portAddress, state) {
  let leaf = Leaf.find(leafAddress);
  if (!leaf) {
    return;
  }
  leaf = changeState(state, portAddress, leaf);
  return Leaf.update(leaf);
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



