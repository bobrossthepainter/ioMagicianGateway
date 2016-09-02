import assert from 'assert';

let db = require('../../../lib/core/db').initDb();
let leaf = require('../../../lib/api/common/model/Leaf');
leaf.init(db);
let leafModel = leaf.model;

describe("DB querys for leaf (auto-id=address)", () => {

  let foundLeaf = {};
  it('Create', () => { // (A)

    let createdLeaf = leafModel.create("node123", {
      "foo": "bar"
    });

    assert.strictEqual(createdLeaf.foo, "bar");
    assert.strictEqual(createdLeaf.address, "node123");
  });

  it('Find', () => { // (A)

    foundLeaf = leafModel.find("node123");

    assert.strictEqual(foundLeaf.foo, "bar");
    assert.strictEqual(foundLeaf.address, "node123");
  });

  it('Update', () => { // (A)

    foundLeaf.foo = "foo";
    let updatedLeaf = leafModel.update(foundLeaf);

    assert.strictEqual(updatedLeaf.foo, "foo");
    assert.strictEqual(updatedLeaf.address, "node123");
  });

  it('Delete', () => { // (A)

    leafModel.delete(foundLeaf);
    foundLeaf = leafModel.find("node123")

    assert.strictEqual(foundLeaf, null);
  });
});
