var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();


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
    if (req.user == undefined)
        res.redirect('/');
    res.render('settings', {
        title: 'Domoticon settings',
        user: req.user
    });
});

router.post('/settings/save', function(req, res) {
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
    //s'hauria de mantindre en la mateixa pagina però llençar event per recarregar la taula superior
});


router.get('/ping', function(req, res) {
    res.status(200).send("pong!");
});

module.exports = router;
