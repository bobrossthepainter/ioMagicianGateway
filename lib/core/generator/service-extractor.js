let normalizedPath = require("path").join(__dirname, "./../../api");
const debug = require('debug')('ioMagicianBackend');

let exports = [];

let serviceDirs = getFilesInDirectory(normalizedPath, "service");

for (let serviceDir of serviceDirs) {

  require("fs").readdirSync(serviceDir).forEach(function (file) {
    if (file.match(/\.js$/) !== null) {
      //let name = file.replace('.js', '');
      let service = require(serviceDir + '/' + file);
      exports[service.name] = service.service;
      debug(`Extracted service name={${service.name}}`)
      global[service.name] = service.service;
    }
  });
}

module.exports = exports;

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
