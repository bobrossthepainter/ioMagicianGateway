function init(params) {

  let path = "./../../config";
  if (params.env) {
    path += "/" + params.env;
  }
  let normalizedPath = require("path").join(__dirname, path);
  const debug = require('debug')('ioMagicianBackend');

  let configs = [];

  require("fs").readdirSync(normalizedPath).forEach(function (file) {
    if (file.match(/\.js$/) !== null) {
      //let name = file.replace('.js', '');
      let config = require(path + '/' + file);
      mergeObject(configs, config);
    }
  });

  global['nobe.config'] = configs;

}

module.exports = {
  init: init
};


function mergeObject(mergedObject, addedObject){
  Object.keys(addedObject).forEach(function(key,index) {
    console.log(key);

    if (mergedObject[key]){
      nobe.log.e(`Config-Key ${key} already registered!`)
      return;
    }

    mergedObject[key] = addedObject[key];

  });
}

// Continue application logic here
