var Remote = require('ripple-lib').Remote;

function RippleGate(options) {
  options.payment = options.payment*1000000;
  this.payment = options.payment;
  this.wallet = options.wallet;
  this.timeLimit = options.timeLimit;
  this.askPath = options.askPath;

  this.check = function(req, res, next) {
    if (!req.session.hasOwnProperty('rgExpire')) {
      var remote = new Remote({
        trusted:        true,
        local_signing:  true,
        local_fee:      true,
        fee_cushion:     1.5,
        servers: [
          {
            host:    's1.ripple.com',
            port:    443,
            secure:  true
          }
        ]
      });
      remote.connect(function() {
        var request = remote.request_account_tx({
          account: options.wallet,
          ledger_index_min: -1,
          ledger_index_max: -1,
          limit: 1000
        });
        request.callback(function(err, data) {
          for (var i = 0; i < data.transactions.length; i++) {
            if (data.transactions[i].tx.DestinationTag == req.session.rgid) {
              if (options.payment <= parseInt(data.transactions[i].tx.Amount) && data.transactions[i].meta.TransactionResult == 'tesSUCCESS') {
                req.session.rgExpire = data.transactions[i].tx.date + options.timeLimit;
                return next();
              }
            }
          }
          res.redirect(options.askPath);
        });
        request.request();
      });
    } else {
      if (new Date() < new Date(req.session.rgExpire*1000 + 946684800000)) {
        return next();
      } else {
        req.session.rgExpire = null;
        res.redirect(options.askPath);
      }
    }
  }

  this.ensureID = function(req, res, next) {
    if (!req.session.hasOwnProperty('rgid')) {
      req.session.rgid = Math.floor(Math.random()*4294967295);
    }
    return next();
  }
}

module.exports = RippleGate;