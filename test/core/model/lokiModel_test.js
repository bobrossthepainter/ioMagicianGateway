import assert from 'assert';

let db = require('../../../lib/core/db').initDb();
let leaf = require('../../../lib/api/common/model/Leaf');
leaf.init(db);
let leafModel = leaf.model;
const testAddress = "node123";

describe("DB querys for leaf (auto-id=address)", function() {

  before(function(){
    let leaf = leafModel.findByAddress(testAddress);
    if (leaf){
      leafModel.delete(leaf);
    }
  });


  let foundLeaf = {};
  let createdLeaf;

  it('Create', function() { // (A)

    createdLeaf = leafModel.create({
      "address" : testAddress,
      "foo": "bar"
    });

    assert.strictEqual(createdLeaf.foo, "bar");
    assert.strictEqual(createdLeaf.address, testAddress);
    assert.ok(createdLeaf.id);
  });

  it('FindById', function() { // (A)

    foundLeaf = leafModel.find(createdLeaf.id);

    assert.ok(foundLeaf);
    assert.strictEqual(foundLeaf.foo, "bar");
    assert.strictEqual(foundLeaf.address, testAddress);
  });

  it('FindByAddress', function() { // (A)

    foundLeaf = leafModel.findByAddress(testAddress);

    assert.strictEqual(foundLeaf.foo, "bar");
    assert.strictEqual(foundLeaf.address, testAddress);
  });

  it('Update', function() { // (A)

    foundLeaf.foo = "foo";
    let updatedLeaf = leafModel.update(foundLeaf);

    assert.strictEqual(updatedLeaf.foo, "foo");
    assert.strictEqual(updatedLeaf.address, testAddress);
  });

  it('Delete', function() { // (A)

    leafModel.delete(foundLeaf);
    foundLeaf = leafModel.find(testAddress)

    assert.strictEqual(foundLeaf, null);
  });
});
