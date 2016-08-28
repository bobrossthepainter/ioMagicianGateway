let normalizedPath = require("path").join(__dirname, "./../../api/model");
const debug = require('debug')('ioMagicianBackend');

let exports = [];

require("fs").readdirSync(normalizedPath).forEach(function (file) {
    if (file.match(/\.js$/) !== null) {
        //let name = file.replace('.js', '');
        let model = require('./../../api/model/' + file);
        exports[model.modelName] = model.model;
        debug(`Extracted Model name={${model.modelName}}`)
        global[model.modelName] = model.model;
    }
});

module.exports = exports;


// Continue application logic here