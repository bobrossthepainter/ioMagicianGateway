import {PortType, PortState} from "../general/model/action"


function* getById(id) {

  if (!id) {
    return;
  }

  let unit = yield ControlableUnit.populate('ports', Port).find({_id: id});

  return unit;
}

module.exports = {
  service: {
    getById: getById
  },
  name: 'ControlableUnitService'
}
