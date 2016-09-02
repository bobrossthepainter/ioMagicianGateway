const express = require('express')();
const debug = require('debug')('ioMagicianBackend');
const bodyParser = require('body-parser');
// init logger
const logger = require('./misc/logger');
global['nobe'] = { log : logger};

// collect call params
let params = [];
process.argv.forEach(function (val, index, array) {
  let param = val.split("=");
  if (param.length == 2) {
    params[param[0]] = param[1];
  }
});

console.log(JSON.stringify(params));

// init configs
// const config = require('./core/generator/config-extractor').init(params);

// start mqtt broker TODO use external broker
require('./api/mqtt/MQTTBrokerService').service.init();

// init database + models
const db = require('./core/db').initDb();
const models = require('./core/generator/model-extractor').initModels(db);

// init services
const service = require('./core/generator/service-extractor');

// init client controller + routes
import ClientController from './core/client-controller';
const clientControllerRoutes = require('./core/generator/routes-client-generator');

// init behaviour
const behaviour = require('./core/generator/behaviour-executor');

// init express
express.set('port', process.env.PORT || 3000);
express.use(bodyParser.json());       // to support JSON-encoded bodies
express.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

let server = express.listen(express.get('port'), function () {
  debug('Express server listening on port ' + server.address().port);

  let clientController = new ClientController(express, db, clientControllerRoutes, models);
  clientController.init();

});

logger.d("Startup finished");


