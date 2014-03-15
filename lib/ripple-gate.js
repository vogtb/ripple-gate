var Remote = require('ripple-lib').Remote;

function RippleGate(options) {
  this.payment = options.payment;
  this.wallet = options.wallet;
  this.timeLimit = options.timelimit;
  this.askPath = options.askPath;

  this.check = function(req, res, next) {
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
        var id = req.session.rgid;
        for (var i = 0; i < data.transactions.length; i++) {
          if (data.transactions[i].tx.DestinationTag == id && data.transactions[i].meta.TransactionResult == 'tesSUCCESS') {
            return next();
          }
        }
        res.redirect(options.askPath);
      });
      request.request();
    });
  }

  this.ensureID = function(req, res, next) {
    if (!req.session.hasOwnProperty('rgid')) {
      req.session.rgid = Math.random()*4294967296;
    }
    return next();
  }
}

module.exports = RippleGate;