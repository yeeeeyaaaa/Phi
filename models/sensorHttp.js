var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sensorHttp = new Schema({
    description: String,
    ip: String,
    port: String,
    pin: String,
    mesure: String
});

module.exports = mongoose.model('sensor', sensorHttp);
