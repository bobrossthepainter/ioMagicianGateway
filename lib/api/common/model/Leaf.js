import {LokiModel} from "../../../core/model/lokiModel";

const uniqueKey = "address";
const collectionName = "leafs";
let self;

function init(db) {
  self = this;
  this.db = db;
  LokiModel.initCollection(collectionName, db, [uniqueKey]);
}

function find(address) {
  let leaf = new Leaf();
  return leaf.find(address);
}

function create(address, data) {
  let leaf = new Leaf();
  data[uniqueKey] = address;
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
    super(self.db, collectionName, uniqueKey);
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
  name: 'Leaf'
};
