#ripple-gate
###A penny for your request, dear?

![alt tag](https://raw.github.com/vogtb/ripple-gate/master/header_img.png)

Ripple Gate requires a small Ripple fee before http calls are made to a specified path. It is a piece of node.js middlewear intended to be used in an express.js configuration.

##  Usage

```js
var RippleGate = require('../path/to/ripple-gate.js');
var gate = new RippleGate({
  payment: 1.0,
  timeLimit: 86400,
  wallet : 'ra1UbcPh8y5BeBtfMqtMspfVeT7dZTj7qk',
  askPath: '/ask'
});

/*Use as a middlewear function in an Express.js setup.*/
app.get('/vip',  gate.ensureID, gate.check, function(req, res) {
  res.send('Welcome!');
});

app.get('/ask',  gate.ensureID, function(req, res) {
  res.send('Pay here please: ' + gate.constructPaymentURI(req));
  //sends 'Pay here please: https://ripple.com//send?to=ra1UbcPh8y5BeBtfMqtMspfVeT7dZTj7qk&amount=1&dt=1286961596';
});
```
If a user tries to go to /vip, they'll be rejected to /ask unless they've made a payment to your wallet with a DestinationTag that matches the session variable 'rgid'. The rgid is between 0 and 2^32 - 1, so you'd need a lot of users before you started seeing rgid collisions. If you restart your server, or re-initialize the gate, your users will be requested to pay the fee again.

Take a look at the [example](https://github.com/vogtb/ripple-gate/tree/master/example) for more info.

#### `options`

 * `payment` **number** The payment amount in XRP.
 * `timeLimit` **number** The length of time, in seconds, that this user will have access to this URI.
 * `wallet` **string** The address of your Ripple wallet. This is where the payments will be routed.
 * `askPath` **string** The path to which a user will be routed when asking for payment.

#### `functions`

 * `ensureID(req, res, next)` **function** Used to ensure that the session variable rgid (req.session.rgid) has been set. This is the DestinationTag in the transaction, so when it checks your Ripple Wallet it can identify the transaction that corresponds to your session.
 * `check(req, res, next)` **function** Should be used as a middlewear function on any path that you want to put a gate on. It checks the transactions of your wallet to see if any have a DestinationTag that matches req.session.rgid
 * `constructPaymentURI(req)` **function** Constructs a ripple URI that opens the users wallet and sets up a transaction with the correct payment amount, destination tag, and wallet address. Example: https://ripple.com//send?to=ra1UbcPh8y5BeBtfMqtMspfVeT7dZTj7qk&amount=1&dt=727584372

##  Philosophy
There are certain directories on your server that you want to limit access to. By specifying a micropayment in XRP -- less than a penny if you'd like -- you can limit the access to that directory. As the use of Ripple increases, you can use this to limit webcrawlers, or even fake users on your site.

So far this is just proof-of-concept and hasn't been used on a live site.


##  Testing
Run tests with mocha
```
  $ mocha
```
