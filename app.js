var express = require('express'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  phantom = require('phantom');

var app = express();

app.use(logger('dev'));
app.use(bodyParser());

// create a store that holds html until rendering
app.store = {};

// phantom helper
app.phantom = {};

// setup phantom
phantom.create(function (ph) {
  // save phantom instance
  app.phantom._instance = ph;

  // create function for running commands
  app.phantom.run = function (callback) { callback(app.phantom._instance); };

  // make sure phantom exits when node does
  process.on('exit', function (code, signal) {
    app.phantom._instance.exit();
  });
});

// route that listens to mailgun
require('./process')(app);

// route that renders html
require('./output')(app);

// 404
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.send(err.status || 500);
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.send(err.status || 500);
});

module.exports = app;
