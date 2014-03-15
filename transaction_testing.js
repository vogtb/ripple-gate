var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;
var env = (function(){
  var Habitat = require('habitat');
  Habitat.load();
  return new Habitat();
} ());


var MY_ADDRESS = env.get('WALLET_B');

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
    account: MY_ADDRESS,
    ledger_index_min: -1,
    ledger_index_max: -1,
    limit: 1000
  });
  request.callback(function(err, res) {
    console.log(res.transactions);
  });
  request.request();
});

