import assert from 'assert';
let Seneca = require('seneca')()
  .use(require('../../../lib/api/common/service/PortService'))
  .error(assert.fail);


describe("Change Port State", function () {

  it("receive message", function (done) {
    Seneca.add('comp:port,cmd:findByAddress', function (msg, respond) {
      let answer = {
        state: null,
        address: "testAddress",
        parentAddress: "testParentAddress"
      };
      respond(null, answer);
    });
    Seneca.add('comp:port,cmd:update', function (msg, respond) {
      respond(null, msg.port);
    });


    let testData = {
      leafAddress: "bla",
      portAddress: "blabla",
      state: {
        foo: "bar"
      }
    };

    Seneca.act('role:port,cmd:changeInputState', testData, function (err, updatedPort) {
      assert.strictEqual(updatedPort.state.foo, "bar2");
      if (err) {
        done(err);
      }
      else {
        done();
      }
    });
  });
});
