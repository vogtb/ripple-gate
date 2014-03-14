var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;

function RippleGate(options) {
  this.payment = options.payment;
  this.wallet = options.wallet;
  this.timeLimit = options.timelimit;
  this.askURL = options.askURL
  
  this.check = function(request, response, next) {
    if (request.session.isVerified) {
      return next();
    } else {
      if (request.cookies.wallet) {
        //Check our wallet for recent transactions with this wallet.
      } else {
        response.redirect(this.askURL)
      }
    }
  }
}

module.exports = RippleGate;