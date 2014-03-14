var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;

function RippleGate(options) {
  this.payment = options.payment;
  this.wallet = options.wallet;
  this.timeLimit = options.timelimit;
  
  this.check = function(request, response, next) {
    if (request.session.isVerified) {
      return next();
    } else {
      
    }
  }
}

module.exports = RippleGate;