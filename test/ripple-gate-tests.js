/*
    run tests using mocha
*/
var assert = require("assert");
var expect = require('chai').expect;
var RippleGate = require('../lib/ripple-gate.js');

describe('ripple-gate module', function(){

  this.timeout(15000);
  var gate = new RippleGate({
    payment: 1.0,
    timeLimit: 31536000,
    wallet : 'ra1UbcPh8y5BeBtfMqtMspfVeT7dZTj7qk',
    askPath: '/ask'
  });
  
  it('should simply initialize properly', function() {
    assert.equal(gate.payment, 1000000);
    assert.equal(gate.timeLimit, 31536000);
    assert.equal(gate.wallet, 'ra1UbcPh8y5BeBtfMqtMspfVeT7dZTj7qk');
    assert.equal(gate.askPath, '/ask');
  });
  
  it('should be able to ensure IDs', function(done) {
    var request = {
      session: {}
    };
    gate.ensureID(request, {}, function() {
      expect(request.session).to.have.property('rgid');
      done();
    });
  });
  
  it('should be able to check and set rgExpire on a specific transaction that happened within the last year', function(done) {
    var request = {
      session: {
        rgid: 3476584235
      }
    };
    gate.check(request, {}, function() {
      assert.equal(request.session.rgExpire, 448333360 + gate.timeLimit);
      done();
    });
  });
  
  it('should be able to check an acceptable rgExpire date', function(done) {
    var request = {
      session: {
        rgid: 1,
        rgExpire: 947164669360
      }
    };
    gate.check(request, {}, function() {
      assert.equal(request.session.rgExpire, 947164669360);
      done();
    });
  });

  it('should be able to check an expired rgExpire date', function(done) {
    var request = {
      session: {
        rgid: 1,
        rgExpire: 0
      }
    };
    gate.check(request, {redirect: function(askPath) {
      expect(request.session).to.have.property('rgExpire');
      expect(request.session.rgExpire).to.equal(null);
      done();
    }}, function(){
      expect('ngExpire should be expired but somehow passed').to.equal('Hint: check the date comparisons.');
    });
  });

});