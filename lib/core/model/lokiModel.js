const uuid = require('node-uuid');

export class LokiModel {
  constructor(data, db, collectionName, idKey) {
    let self = this;
    self.data = data;
    self.db = db;
    self.collectionName = collectionName;
    self.collection = db.getCollection(collectionName);
    self.idKey = idKey;
  }

  findById(id) {
    let searchId = {};
    searchId[this.idKey] = id;
    let results = this.collection.findOne(searchId);
    return results;
  }

  findByKeyValue(keyValue) {
    let results = this.collection.find(keyValue);
    return results;
  }

  create() {
    this.data[this.idKey] = uuid.v1();
    return this.collection.insert(this.data);
  }

  update() {
    return this.collection.update(this.data);
  }

  remove() {
    return this.collection.remove(this.data[this.idKey]);
  }

  static initCollection(collectionName, db, unique, indices) {
    let leafs = db.getCollection(collectionName);
    if (leafs === null) {
      if (!unique) {
        unique = [];
      }
      if (!indices) {
        indices = [];
      }
      leafs = db.addCollection(collectionName, {indices: indices, unique: unique});
    }
  }
}
