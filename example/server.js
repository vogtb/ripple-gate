var RippleGate = require('../lib/ripple-gate.js');
var fs = require('fs');
var express = require('express');
var app = express();

var gate = new RippleGate({
  payment: 1.0,
  timeLimit: 86400,
  wallet : 'ra1UbcPh8y5BeBtfMqtMspfVeT7dZTj7qk',
  askPath: '/ask'
});

app.use(express.cookieParser('eac926631c1d21fe868dbf3ef150dfe884d92ee455f1e388a6d1dd225ed7e4ab'));
app.use(express.session());

app.get('/ask', gate.ensureID, function(req, res) {
  res.send(fs.readFileSync('ask.html', {encoding: 'utf8'}).replace(new RegExp('{{dt}}', 'g'), req.session.rgid));
});

app.get('/vip', gate.ensureID, gate.check, function(req, res) {
  res.send(fs.readFileSync('vip.html', {encoding: 'utf8'}));
});

app.get('/home', gate.ensureID, function(req, res) {
  console.log(req);
  res.send(fs.readFileSync('home.html', {encoding: 'utf8'}));
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
