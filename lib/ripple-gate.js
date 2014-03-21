var Remote = require('ripple-lib').Remote;

function RippleGate(options) {
  this.payment = options.payment;
  this.wallet = options.wallet;
  this.timeLimit = options.timeLimit;
  this.askPath = options.askPath;
  // Setting default max ledger index to be the first one.
  this.ledgerIndex = -1;

  // Connecting and setting the ledgerIndex to be the second most recent one.
  // This allows us to get a more reasonable list of transactions.
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
    var request = remote.request_ledger_header();
    request.callback(function(err, data) {
      this.ledgerIndex = data.ledger_current_index - 1;
    });
    request.request();
  });

  //Check for a payment
  this.check = function(req, res, next) {
    //If this session doesn't have a ripple-gate expiration date.
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
          ledger_index_max: options.ledgerIndex
        });
        request.callback(function(err, data) {
          for (var i = 0; i < data.transactions.length; i++) {
            //Check DestinationTag with rgid
            if (data.transactions[i].tx.DestinationTag == req.session.rgid) {
              //Check payment ammount and transaction success
              if (options.payment*1000000 <= parseInt(data.transactions[i].tx.Amount) && data.transactions[i].meta.TransactionResult == 'tesSUCCESS') {
                req.session.rgExpire = data.transactions[i].tx.date + options.timeLimit;
                return next();
              }
            }
          }
          res.redirect(options.askPath);
        });
        request.request();
      });
    }
    //If this session does have a ripple-gate expiration date.
    else {
      //Check the current date against the expiration date. 946684800000 is used to convert to UNIX epoch.
      if (new Date() < new Date(req.session.rgExpire*1000 + 946684800000)) {
        return next();
      } else {
        req.session.rgExpire = null;
        res.redirect(options.askPath);
      }
    }
  }

  //Ensure that the ripple-gate id (rgid) has been set. This is the DestinationTag in the actual XRP tx.
  this.ensureID = function(req, res, next) {
    if (!req.session.hasOwnProperty('rgid')) {
      req.session.rgid = Math.floor(Math.random()*4294967295);
    }
    return next();
  }

  this.constructPaymentURI = function(req) {
    return 'https://ripple.com//send?to=' + options.wallet + '&amount=' + options.payment + '&dt=' + req.session.rgid;
  }
}

module.exports = RippleGate;