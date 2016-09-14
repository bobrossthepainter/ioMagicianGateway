import assert from 'assert';

let db = require('../../../lib/core/db').initDb();
let leaf = require('../../../lib/api/common/model/Leaf');
leaf.init(db);
let leafModel = leaf.model;

describe("DB querys for leaf (auto-id=address)", function() {

  let foundLeaf = {};
  let createdLeaf;
  it('Create', function() { // (A)

    createdLeaf = leafModel.create({
      "address" : "node123",
      "foo": "bar"
    });

    assert.strictEqual(createdLeaf.foo, "bar");
    assert.strictEqual(createdLeaf.address, "node123");
    assert.ok(createdLeaf.id);
  });

  it('FindById', function() { // (A)

    foundLeaf = leafModel.find(createdLeaf.id);

    assert.ok(foundLeaf);
    assert.strictEqual(foundLeaf.foo, "bar");
    assert.strictEqual(foundLeaf.address, "node123");
  });

  it('FindByAddress', function() { // (A)

    foundLeaf = leafModel.findByAddress("node123");

    assert.strictEqual(foundLeaf.foo, "bar");
    assert.strictEqual(foundLeaf.address, "node123");
  });

  it('Update', function() { // (A)

    foundLeaf.foo = "foo";
    let updatedLeaf = leafModel.update(foundLeaf);

    assert.strictEqual(updatedLeaf.foo, "foo");
    assert.strictEqual(updatedLeaf.address, "node123");
  });

  it('Delete', function() { // (A)

    leafModel.delete(foundLeaf);
    foundLeaf = leafModel.find("node123")

    assert.strictEqual(foundLeaf, null);
  });
});
