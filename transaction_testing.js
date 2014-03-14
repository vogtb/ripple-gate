var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;
var env = (function(){
  var Habitat = require('habitat');
  Habitat.load();
  return new Habitat();
} ());


var MY_ADDRESS = env.get('WALLET_B');
var MY_SECRET  = env.get('SECRET');
var RECIPIENT  = env.get('WALLET_A');
var AMOUNT     = Amount.from_human('1XRP');

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
  remote.set_secret(MY_ADDRESS, MY_SECRET);

  var transaction = remote.transaction();

  transaction.payment({
    from: MY_ADDRESS, 
    to: RECIPIENT, 
    amount: AMOUNT
  });

  transaction.submit(function(err, res) {
    console.log(res);
    console.log('\n');
    console.log(err);
  });
});
