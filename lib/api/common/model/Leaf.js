import {LokiModel} from "../../../core/model/lokiModel";

const idKey = "id";
const addressKey = "address";
const uniqueKeys = [idKey, addressKey];
const indices = [idKey, addressKey];
const collectionName = "leafs";
let self;

function init(db) {
  self = this;
  this.db = db;
  LokiModel.initCollection(collectionName, db, uniqueKeys, indices);
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
  let leaf = new Leaf();
  return leaf.create(data);
}

function update(data) {
  let leaf = new Leaf();
  return leaf.update(data);
}

function remove(data) {
  let leaf = new Leaf();
  return leaf.remove(data);
}

class Leaf extends LokiModel {
  constructor() {
    super(self.db, collectionName, uniqueKeys, uniqueKeys);
  }
}


module.exports = {
  init: init,
  model: {
    find: find,
    create: create,
    createWithAddress: create,
    update: update,
    delete: remove
  },
  name: 'Leaf'
};
