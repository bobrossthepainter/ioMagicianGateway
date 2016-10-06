// import {PortState, PortType} from "../model/port"
const winston = require('winston');

module.exports = function portService(options) {

  let seneca = this;

  seneca.add('role:port,cmd:changeInputState', changeInputState);

  function changeInputState(msg, respond) {
    changeInputStateInternal(msg.leafAddress, msg.portAddress, msg.state, respond);
  }

  function changeInputStateInternal(leafAddress, portAddress, state, respond) {
    let data = {
      "leafAddress": leafAddress,
      "address": portAddress
    }
    seneca.act('comp:port,cmd:findByAddress', data, function (err, port) {
      if (err) {
        respond(err, null);
        return;
      }

      port.lastState = port.state;
      port.state = state;
      port.lastSateChange = new Date().toISOString();

      seneca.act('comp:port,cmd:update', {"port": port}, function (err, updatedPort) {
        winston.debug(`Changed port state {leaf = ${updatedPort.leafAddress}}, {portAddress = ${updatedPort.address}}, {state = ${updatedPort.state}}, {lastState = ${updatedPort.lastState}} .`);
        respond(null, updatedPort);
      });

    });
  }
}
