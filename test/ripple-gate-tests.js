var assert = require("assert");
var expect = require('chai').expect;
var RippleGate = require('../lib/ripple-gate.js');

describe('ripple-gate module', function(){

  it('should simply initialize properly', function() {
    var gate = new RippleGate({
      payment: 1.0,
      timeLimit: 86400,
      wallet : 'ra1UbcPh8y5BeBtfMqtMspfVeT7dZTj7qk',
      askPath: '/ask'
    });
    assert.equal(gate.payment, 1.0);
    assert.equal(gate.timeLimit, 86400000000);
    assert.equal(gate.wallet, 'ra1UbcPh8y5BeBtfMqtMspfVeT7dZTj7qk');
    assert.equal(gate.askPath, '/ask');
  });

  it('should be able to ensure IDs', function(done) {
    var gate = new RippleGate({
      payment: 1.0,
      timeLimit: 86400,
      wallet : 'ra1UbcPh8y5BeBtfMqtMspfVeT7dZTj7qk',
      askPath: '/ask'
    });
    var request = {session: {}};
    var response = {};
    gate.ensureID(request, {}, function() {
      expect(request.session).to.have.property('rgid');
      done();
    });
  });

});