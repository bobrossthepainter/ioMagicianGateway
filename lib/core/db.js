let loki = require('lokijs');
let config = require('config').get('db');

function initDb() {
  let db = new loki(config.name,
    {
      autoload: true,
      autoloadCallback: loadHandler,
      autosave: true,
      autosaveInterval: 10000,
    });
  // let db = new loki('gateway_config.json');
  return db;
}

function loadHandler() {
  // if database did not exist it will be empty so I will intitialize here
  // let leafs = db.getCollection('leafs');
  // if (leafs === null) {
  //   leafs = db.addCollection('leafs');
  // }
  //
  // let actions = db.getCollection('actions');
  // if (actions === null) {
  //   actions = db.addCollection('actions');
  // }
}

module.exports = {
    initDb: initDb
}
