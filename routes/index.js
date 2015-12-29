var express = require('express');
var passport = require('passport');
var http = require('http');
var Account = require('../models/account');
var Sensor = require('../models/sensorHttp');
var router = express.Router();
var SensorCtrl = require('../controllers/sensorHttpController');
var DataCtrl = require('../controllers/dataController');

//module.exports = function(app) {

router.get('/', function(req, res) {
    var pluginList = [];
    pluginList.push({
        id: "1",
        name: "Arduino",
        icon: "arduino.jpg"
    });

    res.render('index', {
        user: req.user,
        title: 'Domoticon Home',
        plugins: pluginList
    });
});

router.get('/register', function(req, res) {
    res.render('register', {
        title: 'Domoticon Register'
    });
});

router.post('/register', function(req, res) {
    Account.register(new Account({
        username: req.body.username
    }), req.body.password, function(err, account) {
        if (err) {
            return res.render("register", {
                info: "Sorry. That username already exists. Try again."
            });
        }

        passport.authenticate('local')(req, res, function() {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', {
        user: req.user,
        title: 'Domoticon Login'
    });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/settings', function(req, res) {
    if (req.user === undefined)
        res.redirect('/');
    res.render('settings', {
        title: 'Domoticon settings',
        user: req.user
    });
    //settings(req, res);
});

router.get('/monitor', function(req, res) {
    if (req.user === undefined)
        res.redirect('/');

    res.render('monitor', {
        title: 'Domoticon monitor sensors',
        user: req.user
    });
});

function isAutenticated(req, res) {
    if (req.user === undefined)
        res.redirect('/');
    return true;
}

function settings(req, res) {
    if (isAutenticated(req, res)) {
        var sensors = SensorCtrl.findAllSensors(req, res);
        /*console.log("sensors " + sensors);
        for (sensor in sensors) {
            console.log("sensor " + sensor);
        }
        res.render('settings', {
            title: 'Domoticon settings',
            user: req.user,
            items: sensors
        });*/
    }
}

function addSensor(req, res) {
    if (isAutenticated(req, res)) {
        var sensors = SensorCtrl.addSensor(req, res);
        /*res.render('settings', {
            title: 'Domoticon settings',
            user: req.user,
            items: sensors
        });*/
    }
}

function listSensor(req, res) {
    if (isAutenticated(req, res)) {
        var sensors = SensorCtrl.findAllSensors(req, res);
        /*res.render('settings', {
            title: 'Domoticon settings',
            user: req.user,
            items: sensors
        });*/
    }
}

function updateSensor(req, res) {
    if (isAutenticated(req, res)) {
        var sensors = SensorCtrl.updateSensor(req, res);
        /*res.render('settings', {
            title: 'Domoticon settings',
            user: req.user,
            items: sensors
        });*/
    }
}

function deleteSensor(req, res) {
    if (isAutenticated(req, res)) {
        var sensors = SensorCtrl.deleteSensor(req, res);
        /*res.render('settings', {
            title: 'Domoticon settings',
            user: req.user,
            items: sensors
        });*/
    }
}

function connectArduino(req, res) {
    var pathRec;
    var desc = req.query.description.toLowerCase();
    console.log(desc + " index of " + desc.indexOf("light"));
    if (desc.indexOf('temp') > 0) {
        pathRec = "/arduino/temperature";
    } else if (desc.indexOf('light') > 0) {
        pathRec = "/arduino/light";
    } else if (desc.indexOf('pir') > 0) {
        pathRec = "/arduino/PIR";
    } else {
        pathRec = req.query.path;
    }
    console.log(pathRec);
    var options = {
        host: req.query.host,
        port: req.query.port,
        path: pathRec
    };

    http.get(options, function(resp) {
        resp.on('data', function(chunk) {
            var body = JSON.parse(chunk);
            console.log("chunk " + chunk);
            res.status(200).send(body);
        });
    }).on("error", function(e) {
        console.log("Got error: " + e.message);
        res.status(500).send(e.message);
    });
}

router.get('/apiArduino/get', connectArduino);
router.post('/apiArduino/get', connectArduino);

router.post('/data/add', DataCtrl.addData);

router.post('/settings/save', addSensor);
router.get('/settings/list', listSensor);
router.get('/settings/update/:id', updateSensor);
router.get('/settings/delete/:id', deleteSensor);
router.get('/settings/:id', SensorCtrl.findById);


router.get('/ping', function(req, res) {
    res.status(200).send("pong!");
});

module.exports = router;
