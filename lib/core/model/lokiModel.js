export class LokiModel {
  constructor(db, collectionName, id) {
    let self = this;
    self.db = db;
    self.collectionName = collectionName;
    self.collection = db.getCollection(collectionName);
    self.idKey = id;
  }

  find(id) {
    let searchId = {};
    searchId[this.idKey] = id;
    let results = this.collection.findOne(searchId);
    return results;
  }

  create(data) {
    return this.collection.insert(data);
  }

  update(data) {
    return this.collection.update(data);
  }

  remove(data) {
    if ('object' !== typeof data){
      data = this.find(data);
    }
    return this.collection.remove(data);
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
