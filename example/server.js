var RippleGate = require('../lib/ripple-gate.js');
var fs = require('fs');
var express = require('express');
var app = express();

var gate = new RippleGate({
  payment: 1.0,
  timeLimit: 1000000,
  wallet : 'rLrrWn6BPzzYCi23r9W7wcyQMkjD7sq8TW'
});

app.use(express.cookieParser('eac926631c1d21fe868dbf3ef150dfe884d92ee455f1e388a6d1dd225ed7e4ab'));
app.use(express.session());

app.get('/ask', ensureID, function(req, res) {
  if (!req.session.hasOwnProperty('rgid')) {
    req.session.rgid = Math.random()*4294967296;
  }
  console.log(req);
  res.send(fs.readFileSync('ask.html', {encoding: 'utf8'}).replace(new RegExp('{{dt}}', 'g'), req.session.rgid));
});

app.get('/vip', checkPoint, function(req, res) {
  res.send(fs.readFileSync('vip.html', {encoding: 'utf8'}));
});

app.get('/home', ensureID, function(req, res) {
  console.log(req);
  res.send(fs.readFileSync('home.html', {encoding: 'utf8'}));
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});


function ensureID(req, res, next) {
  if (!req.session.hasOwnProperty('rgid')) {
    req.session.rgid = Math.random()*4294967296;
  }
}

function checkPoint(req, res, next) {
  if (req.session.hasOwnProperty('rgid')) {
    if (gate.check(req.session.rgid)) {
      return next();
    }
  } else {
    req.session.rgid = Math.random()*4294967296;
    res.redirect('/ask');
  }
}