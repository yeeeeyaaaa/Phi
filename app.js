var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
//var users = require('./routes/users');
var pluginHelper = require('utils');

var app = express();

var Orvibo = require("lib/orvibo.js")
var o = new Orvibo()


// We've listened, and now we're ready to go.
o.on("ready", function() {
  timer1 = setInterval(function() { // Set up a timer to search for sockets every second until found
    o.discover()
  }, 1000)
})

// A device has been found and added to our list of devices
o.on("deviceadded", function(device) {
  clearInterval(timer1) // Clear our first timer, as we've found at least one socket
  o.discover() // Ask around again, just in case we missed something
  timer2[device.macAddress] = setInterval(function() { // Set up a new timer for subscribing to this device. Repeat until we get confirmation of subscription
    o.subscribe(device)
  }, 1000)
})

// We've asked to subscribe (control) a device, and now we've had a response.
// Next, we will query the device for its name and such
o.on("subscribed", function(device) {
  clearInterval(timer2[device.macAddress]) // Stop the second subscribe timer for this device
  timer3[device.macAddress] = setInterval(function() { // Set up another timer, this time for querying
    o.query({
      device: device, // Query the device we just subscribed to
      table: "04" // See PROTOCOL.md for info. "04" = Device info, "03" = Timing info
    })
  }, 1000)
})

// Our device has responded to our query request
o.on("queried", function(device, table) {
  clearInterval(timer3[device.macAddress]) // Stop the query timer
  if (device.type == "Socket") { // If this is a socket
    timer4[device.macAddress] = setInterval(function() { // Set up another timer that toggles the state of the unit every 5 seconds
      o.setState({
        device: device,
        state: !device.state // The inverse of the current state
      })
    }, 5000)
  } else if (device.type == "AllOne") { // If we've got an AllOne instead
    o.enterLearningMode(device) // Put it into learning mode
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.set('plugin folder', __dirname + '/plugins');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

var pluginList = [];
pluginList.push({
    id: "1",
    name: "Arduino",
    icon: "arduino.jpg"
});
app.set('plugins', pluginList);


app.use('/', routes);
//app.use('/users', users);
//app.get('settings', routes.settings);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose_express4');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
