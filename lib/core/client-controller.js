const co = require('co');
const log = require('./../misc/logger')


export default class ClientController {
  constructor(express, controllerRoutes, model) {
    this.express = express;
    this.controllerRoutes = controllerRoutes;
    this.model = model;
  }

  init() {
    let self = this;
    let routes = this.controllerRoutes.controllers;
    if (!routes){
      return;
    }
    for (let route of routes) {

      self.express[route.type](route.path, function (req, res) {
        let controller = require('../api/controller/' + route.controller);
        co(function*() {

          let method = controller[route.method](req, res);

          return yield co(method);

        }).then(function (value) {
          //console.log(value);
        }, function (err) {
          console.error(err.stack);
          res.status(500).send(err.message);
        });
        //
        //res.send('Hello World!');
        //console.log('hello world requested');
      });
    }
  }
}
