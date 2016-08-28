import { PortType, PortState } from "../general/model/action"


function generateActionsFromPort(port) {
    let type = port.type;

    if (PortType.GPIO === type) {
        return  createGPIO(port);
    }

}

function createGPIO(port) {
    let name = `${ port.controlableUnit.name } - ${ port.name } - `;

    let actionState = createAction(name + 'state', 'state', port._id);

    if (port.state === PortState.OUTPUT) {
        let actionOn = createAction(name + 'on', 'on', port._id);
        let actionOff = createAction(name + 'off', 'off', port._id);
        return [actionState, actionOn, actionOff];
    }
    return [actionState];
}

function createAction(name, command, portId) {
    let action = new Action({
        name: name,
        command: command,
        port: portId + ''
    });

    action.save();

    console.log(`Created Action ${action} for ${name}`);

    return action;
}


module.exports = {
    service: {
        generateActionsFromPort : generateActionsFromPort
    },
    name: 'ActionService'
}
