var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Sensor = require('../models/sensorHttp');
var router = express.Router();

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
    /*res.render('settings', {
        title: 'Domoticon settings',
        user: req.user
    });*/
    settings(req, res);
});


/**
 * GET /settings
 * 
 * @method settings
 * @param {Object} req The request
 * @param {Object} res The response
 * @param {Object} next Next route
 */
function settings(req, res) {

    var pluginList = [];

    Sensor.find({}, function(err, sensors) {
        if (err) throw err;
        console.log(sensors);
        /*req.app.get('jade').renderFile(__dirname + '/../plugins/httpRequest/views/table-plugins.jade', {
            items: sensors
        }, function(err, html) {
            if (!err) {*/
        res.render('settings', {
            //content: html,
            //plugin: plugin.id,
            //title: plugin.name + ' Settings',
            title: 'Domoticon settings',
            user: req.user,
            items: sensors
        });
        /*} else {
            console.log(err);
            return res.render(500, '500', {
                title: '500 Internal Server Error'
            });
        }*/
    });
}

/*req.app.get('plugins').forEach(function(plugin) {
            pluginList.push(plugin.id);
        });
        if (pluginList.indexOf(req.params.plugin) >= 0) {
            req.app.get('plugins').forEach(function(plugin) {
                if (plugin.id == req.params.plugin) {
                    req.app.get('db').collection(plugin.collection, function(err, collection) {
                        collection.find({}).toArray(function(err, items) {
                            function render(items, meta) {
                                var meta = meta || {};
                                req.app.get('jade').renderFile(__dirname + '/../plugins/httpRequest/views/table-plugins.jade', {
                                    items: items,
                                    meta: meta
                                }, function(err, html) {
                                    if (!err) {
                                        return res.render('settings', {
                                            content: html,
                                            plugin: plugin.id,
                                            title: plugin.name + ' Settings'
                                        });
                                    } else {
                                        console.log(err);
                                        return res.render(500, '500', {
                                            title: '500 Internal Server Error'
                                        });
                                    }
                                });
                            }
                            // If the plugin has a beforeRender() method, call it
                            if (plugin.beforeRender) {
                                plugin.beforeRender(items, function(err, result, meta) {
                                    render(result, meta);
                                });
                            } else {
                                render(items);
                            }
                        });
                    });
                }
            });
        } else {
            return next();
        }
    } else {
        renderSettings(req, res);
    }*/



/**
 * Render the settings page
 * 
 * @method renderSettings
 * @param {Object} req The Request
 * @param {Object} res The Reponse
 * @param {Object options Additional vars for the settings view
 */
function renderSettings(req, res, options) {
    req.app.get('db').collection('User', function(err, collection) {
        collection.find({}).toArray(function(err, users) {
            var vars = {
                title: 'Settings',
                themes: fs.readdirSync(req.app.get('theme folder')),
                users: users
            };

            if (options) {
                for (var key in options) {
                    vars[key] = options[key];
                }
            }

            return res.render('settings', vars);
        });
    });
}


router.post('/settings/save', function(req, res) {
    var sensorArduino = new Sensor({
        description: req.body.description,
        ip: req.body.ip,
        port: req.body.port,
        pin: req.body.pin,
        mesure: req.body.mesure
    });
    /*Account.register(new Account({
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
    });*/
    //guardar les dades del plugin a mongo
    sensorArduino.save(function(err) {
        if (err) throw err;

        console.log('Plugins sensor saved successfully!');
    });
    Sensor.find({}, function(err, sensors) {
        if (err) throw err;
        console.log(sensors);
        /*req.app.get('jade').renderFile(__dirname + '/../plugins/httpRequest/views/table-plugins.jade', {
            items: sensors
        }, function(err, html) {
            if (!err) {*/
        res.render('settings', {
            title: 'Domoticon settings',
            user: req.user,
            items: sensors
        });
    });
    //s'hauria de mantindre en la mateixa pagina però llençar event per recarregar la taula superior
});


router.get('/ping', function(req, res) {
    res.status(200).send("pong!");
});

module.exports = router;
/*var exports = router;

return exports;*/
//}
