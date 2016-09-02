let routes = require('config').get('routes'); //require('./../../config/routes-client').routes;
const debug = require('debug')('ioMagicianBackend');
const _ = require('underscore');

let routePairs = _.pairs(routes);

class ControllerRoute {
  constructor(type, path, controller, method) {
    this.type = type;
    this.path = path;
    this.controller = controller;
    this.method = method;
  }
}

let controllers = [];

for (let route of routePairs) {

  let key = route[0].split(' ');
  let value = route[1].split('.');

  let type = key[0].toLowerCase();
  let path = key[1];
  let controller = value[0];
  let method = value[1];


  let controllerRoute = new ControllerRoute(type, path, controller, method);
  controllers.push(controllerRoute);

  debug(`${controllerRoute.type} Route found!\n\tpath={${controllerRoute.path}}, \n\tcontroller={${controllerRoute.controller}}, \n\tmethod={${controllerRoute.method}}`);

}

module.exports = {controllers: controllers};
