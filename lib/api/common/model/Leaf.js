import {LokiModel} from "../../../core/model/lokiModel";

const idKey = "id";
const addressKey = "address";
const uniqueKeys = [idKey, addressKey];
const indices = [idKey, addressKey];
const collectionName = "leafs";
let self;
let Seneca = require('seneca')();

function init(db) {
  self = this;
  this.db = db;
  LokiModel.initCollection(collectionName, db, uniqueKeys, indices);
  Seneca.use(leaf);
}

function leaf(){
  this.add('comp:leaf,cmd:find', findMapper);
  this.add('comp:leaf,cmd:find,address:*', findAddressMapper);
  this.add('comp:leaf,cmd:create', createMapper);
  this.add('comp:leaf,cmd:update', updateMapper);
  this.add('comp:leaf,cmd:remove', removeMapper);

  function findMapper(msg, respond){
    respond(null, find(msg.id));
  }

  function findAddressMapper(msg, respond){
    respond(null, findByAddress(msg.address));
  }

  function createMapper(msg, respond){
    respond(null, create(msg.leaf, msg.leaf));
  }

  function updateMapper(msg, respond){
    respond(null, update(msg.leaf));
  }

  function removeMapper(msg, respond){
    respond(null, remove(msg.leaf));
  }
}

function find(id) {
  let leaf = new Leaf();
  return leaf.findById(id);
}

function findByAddress(address) {
  let leaf = new Leaf();
  let o = {};
  o[addressKey] = address;
  let results = leaf.findByKeyValue(o);
  if (results.length > 0) {
    return results[0];
  }
  return null;
}

function create(data, address) {
  if (address) {
    data[addressKey] = address;
  }
  let leaf = new Leaf(data);
  return leaf.create();
}

function update(data) {
  let leaf = new Leaf(data);
  return leaf.update();
}

function remove(data) {
  let leaf = new Leaf(data);
  return leaf.remove();
}

class Leaf extends LokiModel {
  constructor(data) {
    super(self.db, collectionName, data, idKey);
  }
}


module.exports = {
  init: init,
  model: {
    find: find,
    findByAddress: findByAddress,
    create: create,
    createWithAddress: create,
    update: update,
    delete: remove
  },
  name: 'Leaf'
};
