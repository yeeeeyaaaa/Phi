var Data = require('../models/data');

//POST - Insert a new Data in the DB
exports.addData = function(req, res) {
    console.log('POST');
    console.log(req.body);
    var ara = new Date;



    var data = new Data({
        description: req.body.description,
        value: req.body.ip,
        date: ara,
        device: req.body.device
    });

    data.save(function(err, data) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(data);
        console.log('successfuly saved');
    });
};
