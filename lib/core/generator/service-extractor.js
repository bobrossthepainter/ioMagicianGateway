let normalizedPath = require("path").join(__dirname, "./../../api/service");
const debug = require('debug')('ioMagicianBackend');

let exports = [];

require("fs").readdirSync(normalizedPath).forEach(function (file) {
    if (file.match(/\.js$/) !== null) {
        //let name = file.replace('.js', '');
        let service = require('./../../api/service/' + file);
        exports[service.name] = service.service;
        debug(`Extracted Service name={${service.name}}`)
        global[service.name] = service.service;
    }
});

module.exports = exports;


// Continue application logic here