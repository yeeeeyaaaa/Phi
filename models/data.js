var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var data = new Schema({
    description: String,
    value: Number,
    date: {
        type: Date,
        default: Date.now
    },
    device: String
});

module.exports = mongoose.model('data', data);
