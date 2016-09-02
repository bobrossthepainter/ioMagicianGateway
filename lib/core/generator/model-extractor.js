function initModels(db) {
  let normalizedPath = require("path").join(__dirname, "./../../api");
  const debug = require('debug')('ioMagicianBackend');

  let exports = [];

  let modelDirs = getFilesInDirectory(normalizedPath, "model");


  for (let modelDir of modelDirs) {

    require("fs").readdirSync(modelDir).forEach(function (file) {
      if (file.match(/\.js$/) !== null) {
        //let name = file.replace('.js', '');
        let model = require(modelDir + '/' + file);
        model.init(db);
        exports[model.name] = model.model;
        debug(`Extracted Model name={${model.modelName}}`)
        global[model.name] = model.model;
      }
    });
  }
  return exports;
}

module.exports = {
  "initModels" : initModels
};

function getFilesInDirectory(rootdirectory, directoryName) {
  let filesystem = require("fs");
  let dirList = [];

  filesystem.readdirSync(rootdirectory).forEach(function (file) {

    let path = rootdirectory + '/' + file;
    var stat = filesystem.statSync(path);

    if (stat && stat.isDirectory()) {
      if (file == directoryName) {
        dirList.push(path);
      } else {
        dirList = dirList.concat(getFilesInDirectory(path, directoryName));
      }
    }
  });
  return dirList;
}

// Continue application logic here
