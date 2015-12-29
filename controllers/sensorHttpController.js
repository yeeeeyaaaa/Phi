var Sensor = require('../models/sensorHttp');

//GET - Return all sensors in the DB
exports.findAllSensors = function(req, res) {
    Sensor.find(function(err, sensors) {
        console.log(sensors)
        if (err) res.status(500).send(err.message);

        console.log('GET /sensors')
        res.status(200).jsonp(sensors);
    });
};

exports.findAllNamesSensors = function(req, res) {
    var namesSensors = [];
    Sensor.find(function(err, sensors) {
        if (err) res.status(500).send(err.message);

        console.log('GET /sensors ' + sensors);
        for (sensor in sensors) {
            namesSensors.push(sensor.description);
        }
        return namesSensors;
    });
};

//GET - Return a Sensors with specified ID
exports.findById = function(req, res) {
    Sensor.findById(req.params.id, function(err, sensor) {
        if (err) return res.status(500).send(err.message);

        console.log('GET /settings/' + req.params.id);
        //res.status(200).jsonp(sensor);
        /*res.render('../plugins/httpRequest/views/form-httpRequest', {
            sensor: sensor
        });*/
        console.log('req.items ' + req.items);
        res.render('settings', {
            locals: {
                title: 'Domoticon settings',
                user: req.user,
                items: req.items,
                sensor: sensor
            }
        });

        /*function render(items, meta) {
            var meta = meta || {};
            req.app.get('jade').renderFile('../plugins/httpRequest/views/form-httpRequest.jade', {
                sensor: items,
                meta: meta,
                success: 'Settings have been updated'
            }, function(err, html) {
                if (!err) {
                    return res.render('settings', {
                        content: html,
                        //plugin: plugin.id,
                        title: 'Domoticon settings'
                    });
                } else {
                    console.log(err);
                    return res.render(500, '500', {
                        title: '500 Internal Server Error'
                    });
                }
            });
        }
        render(sensor);*/
    });
};

//POST - Insert a new Sensor in the DB
exports.addSensor = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var sensor = new Sensor({
        description: req.body.description,
        ip: req.body.ip,
        port: req.body.port,
        pin: req.body.pin,
        mesure: req.body.mesure
    });

    sensor.save(function(err, sensor) {
        if (err) return res.send(500, err.message);
        //res.status(200).jsonp(sensor);
        console.log('successfuly saved');
    });
    Sensor.find({}, function(err, sensors) {
        if (err) throw err;
        res.render('settings', {
            title: 'Domoticon settings',
            user: req.user,
            items: sensors
        });
    });
};

//PUT - Update a register already exists
exports.updateSensor = function(req, res) {
    Sensor.findById(req.params.id, function(err, sensor) {
        sensor.description = req.body.description;
        sensor.ip = req.body.ip;
        sensor.port = req.body.port;
        sensor.pin = req.body.pin;
        sensor.mesure = req.body.mesure;

        sensor.save(function(err) {
            if (err) return res.send(500, err.message);
            //res.status(200).jsonp(sensor);
            console.log('updated successfuly');
        });
        Sensor.find({}, function(err, sensors) {
            if (err) throw err;
            res.render('settings', {
                title: 'Domoticon settings',
                user: req.user,
                items: sensors
            });
        });
    });
};

//DELETE - Delete a Sensor with specified ID
exports.deleteSensor = function(req, res) {
    Sensor.findById(req.params.id, function(err, sensor) {
        sensor.remove(function(err) {
            if (err) return res.send(500, err.message);
            //res.status(200);
            console.log('remove successfuly');
        })
        Sensor.find({}, function(err, sensors) {
            if (err) throw err;
            res.render('settings', {
                title: 'Domoticon settings',
                user: req.user,
                items: sensors
            });
        });
    });
};
