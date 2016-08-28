import {} from "../service/ActionService"
const log = require('./../../misc/logger');

module.exports = {

  register: function* register(req, res) {
    log.d('Register ControlableUnit called');
    console.info('Registering:\n\t' + req.body);

    let unitBody = req.body;
    let ports = req.body.ports;

    // delete req.body.ports;

    let unit = new ControlableUnit(req.body);
    yield unit.save();

    log.d(`Controlable Unit registered {name=${unit.name}, id=${unit._id}, portcnt=${ports ? ports.length : "0"}`);

    let unitId = unit.get('_id') + '';

    let persistedPortIds = [];

    // if (ports) {
    //   for (let port of ports) {
    //     port.controlableUnit = unitId;
    //     let persistedPort = new Port(port);
    //     yield persistedPort.save();
    //
    //     let actions = yield ActionService.generateActionsFromPort(persistedPort.attributes);
    //     let actionArray = [];
    //     for (let action of actions) {
    //       actionArray.push(action.attributes);
    //     }
    //     persistedPort.set('actions', actionArray);
    //     yield persistedPort.save();
    //
    //     persistedPortIds.push(persistedPort.get('_id') + '');
    //   }
    // }
    //
    // unit.set('ports', persistedPortIds);
    // yield unit.save();


    res.status(201).send(unit.get('_id'));
  },

  getAll: function* getAll(req, res) {
    log.d('GetAll ControlableUnit called');

    let units = yield ControlableUnit.find();

    res.send(units);
    return units;
  },

  get: function* get(req, res) {

    let id = req.params.id;

    log.d(`Get ControlableUnit called {id=${id}}`);

    if (!id) {
      res.sendStatus(404);
      return;
    }

    let unit = ControlableUnitService.getById(id);

    if (!unit) {
      res.sendStatus(404);
      return;
    }

    res.send(unit);
    return unit;
  },

  put: function* put(req, res) {

    let id = req.params.id;

    if (!id) {
      res.sendStatus(404);
      return;
    }

    log.d(`Put ControlableUnit called {id=${id}}`);

    let units = yield ControlableUnit.find({_id: id});

    if (units.length == 0) {
      res.sendStatus(404);
      return;
    }

    let unit = units[0];

    unit.set(req.body);
    yield unit.save();

    res.sendStatus(200);
    return unit;
  },

  post: function* post(req, res) {
    log.d(`Post ControlableUnit called`);

    let unit = new ControlableUnit(req.body);

    try {
      yield unit.save();
    } catch (err) {
      res.status(500).send(err.message);
      return;
    }

    let id = unit.get('_id');

    log.d(`New ControlableUnit created {id=${id}}`);

    res.status(201).send(id);
  },

  getPort: function*(req, res) {

    let concId = req.params.id;

    if (!concId) {
      res.sendStatus(404);
      return;
    }

    concId = concId.split('#');
    let unitId = concId[0];
    let portId = concId[1];

    let unit = ControlableUnitService.getById(unitId);

    if (!unit || !unit.ports) {
      res.sendStatus(404);
      return;
    }

    for (let port of unit.ports) {
      if (port.id == portId) {
        res.status(200).send(port);
        return;
      }
    }
    res.sendStatus(404);
  }

};
