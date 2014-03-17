#ripple-gate
###A penny for your request, dear?

![alt tag](https://raw.github.com/vogtb/ripple-gate/master/img/header_img.png)

Ripple Gate requires a small Ripple fee before http calls are made to a specified URI. It is a piece of node.js middlewear intended to be used in an express.js configuration.

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
app.get('/vip',  gate.ensureID, gate.check, function() {
  return 'Welcome to the VIP.';
});
```

#### `feedOptions`

 * `payment` **number** The payment amount in XRP.
 * `timeLimit` **number** The length of time, in milliseconds, that this user will have access to this URI.
 * `wallet` **string** The address of your Ripple wallet. This is where the payments will be routed.
 * `askPath` **string** The path to which a user will be routed when asking for payment.


##  Philosophy
There are certain directories on your server that you want to limit access to. By specifying a micropayment in XRP -- less than a penny if you'd like -- you can limit the access to that directory. As the use of Ripple increases, you can use this to limit webcrawlers, or even fake users on your site.

So far this is just proof-of-concept and hasn't been used on a live site.