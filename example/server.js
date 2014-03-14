var RippleGate = require('../lib/ripple-gate.js');
var express = require('express');
var app = express();

var gate = new RippleGate({
  payment: 1.0,
  timeLimit: 1000000,
  wallet : 'rLrrWn6BPzzYCi23r9W7wcyQMkjD7sq8TW'
});

app.use(express.cookieParser('S3CRE7'));
app.use(express.session());

app.get('/dummy', function(req, res) {
  console.log(req);
})

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});