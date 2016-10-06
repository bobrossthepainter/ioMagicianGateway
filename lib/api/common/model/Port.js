import {LokiModel} from "../../../core/model/lokiModel";

const idKey = "id";
const parentKey = "leafId";
const addressKey = "address";
const parentAddressKey = "leafAddress";
const uniqueKeys = [idKey];
const indices = [idKey, parentKey, parentAddressKey, addressKey];
const uniqueKeyParent = "id";

const collectionName = "ports";
let self;
let Seneca = require('seneca')();

function init(db) {
  self = this;
  this.db = db;
  LokiModel.initCollection(collectionName, db, uniqueKeys, indices);
  Seneca.use(port);
}

function port(){
  this.add('comp:port,cmd:find', findMapper);
  this.add(`comp:port,cmd:findByAddress,${parentAddressKey}:*`, findByAddressMapper);
  this.add('comp:port,cmd:create', createMapper);
  this.add('comp:port,cmd:update', updateMapper);
  this.add('comp:port,cmd:remove', removeMapper);

  function findMapper(msg, respond){
    respond(null, find(msg[idKey]));
  }

  function findByAddressMapper(msg, respond){
    let port = find(msg[parentAddressKey], msg[addressKey]);
    if (port && port.length == 1){
      respond(null, port[0]);
    } else {
      respond("No or to many ports found.", null);
    }
  }

  function createMapper(msg, respond){
    respond(null, create(msg.leaf, msg.port));
  }

  function updateMapper(msg, respond){
    respond(null, update(msg.port));
  }

  function removeMapper(msg, respond){
    respond(null, remove(msg.port));
  }
}

function find(id) {
  let port = new Port();
  return port.findById(id);
}

function findByAddress(parentAddress, address) {
  let data = {};
  data[parentAddressKey] = parentAddress;
  data[addressKey] = address;
  let port = new Port(data);
  return port.find();
}

function create(leaf, data) {
  data[parentKey] = leaf[uniqueKeyParent];
  let port = new Port(data);
  return port.create();
}

function update(data) {
  let port = new Port(data);
  return port.update();
}

function remove(data) {
  let port = new Port(data);
  return port.remove();
}

class Port extends LokiModel {
  constructor(data) {
    super(self.db, collectionName, data, idKey);
  }
}


module.exports = {
  init: init,
  model: {
    find: find,
    create: create,
    update: update,
    delete: remove
  },
  name: 'Port'
};
