#ripple-gate
###A penny for your request, dear?

ripple-gate is a piece of node.js middlewear that requires a small Ripple fee before http calls are made to a specified URI.

##Install

  $ git clone https://github.com/vogtb/ripple-wall


##  Usage

```js
var RippleGate = require('ripple-wall');

var gate = new RippleGate({
  payment: 1.0
  timeLimit: 1000000,
  wallet : 'rLrrWn6BPzzYCi23r9W7wcyQMkjD7sq8TW'
});

/*Use as a middlewear function in an Express.js setup.*/
app.get('/exlcusive', gate.check, function() {
  return 'Welcome to the VIP.';
});
```

#### `feedOptions`

 * `payment` **number** The payment amount in XRP
 * `timeLimit` **number** The length of time, in milliseconds, that this user will have access to this URI.
 * `wallet` **string** The address of your Ripple wallet. This is where the payments will be routed.


##  Philosophy
There are certain directories on your server that you want to limit access to. By specifying a micropayment in XRP -- less than a penny if you'd like -- you can limit the access to that directory. As the use of Ripple increases, you can use this to limit webcrawlers, or even fake users on your site.

So far this is just proof-of-concept and hasn't been used on any live site.