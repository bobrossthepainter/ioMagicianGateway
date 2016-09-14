import {LokiModel} from "../../../core/model/lokiModel";

const idKey = "id";
const parentKey = "parentId";
const uniqueKeys = [idKey];
const indices = [idKey, parentKey];
const uniqueKeyParent = "id";

const collectionName = "ports";
let self;

function init(db) {
  self = this;
  this.db = db;
  LokiModel.initCollection(collectionName, db, uniqueKeys, indices);
}

function find(id) {
  let data = {};
  data[uniqueKey] = id;
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
}h

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
