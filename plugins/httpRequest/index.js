define(['duino'], function(duino) {


    /**
     * Arduino Plugin. This plugin is able to control an Arduino that is attached to the USB port of the Raspberry PI
     *
     * @class Arduino
     * @param {Object} app The express application
     * @constructor 
     */
    var arduino - rcswitch = function(app) {

        this.name = 'Arduino';
        this.collection = 'Arduino';
        this.icon = 'icon-external-link';

        this.app = app;
        this.id = this.name.toLowerCase();

        /*this.board = new duino.Board();
        // this.board.debug = true;
        function warnNoDuino(e) {
            console.warn("[WARNING] error while trying to connect to Arduino:")
            console.warn(" >>> " + e);
            console.info("[INFO] continuing and hoping for the best...");
            // FIXME: we should disable this plugin in some way, though
        }
        this.board.on('error', warnNoDuino);
        this.board.setup();

        this.pins = {};
        this.pluginHelper = app.get('plugin helper');*/

        this.values = {};

        this.sensorList = [];
        this.sensors = {};

        this.init();

        var that = this;

        app.get('events').on('settings-saved', function() {
            that.init();
        });

        app.get('sockets').on('connection', function(socket) {
            // Arduino toggle
            socket.on('arduino-rcswitch', function(data) {
                that.rcswitch(data);
            });
            // Arduino toggle
            socket.on('arduino-irremote', function(data) {
                that.irremote(data);
            });
            // Arduino toggle
            socket.on('arduino-led', function(data) {
                that.led(data);
            });
        });

    };

    Arduino.prototype.init = function() {

        var that = this;
        this.sensorList.forEach(function(sensor) {
            sensor.removeAllListeners();
        });
        this.sensorList = [];

        this.sensors = {};
        return this.app.get('db').collection(that.collection, function(err, collection) {
            collection.find({
                method: 'sensor'
            }).toArray(function(err, result) {
                if ((!err) && (result.length > 0)) {
                    result.forEach(function(item) {
                        that.sensors[item._id] = item;
                        var sensor = new duino.Sensor({
                            board: that.board,
                            pin: item.pin,
                            throttle: 500
                        });
                        sensor._id = item._id;
                        sensor.on('read', function(err, value) {
                            item = that.sensors[this._id + ''];
                            if (isNaN(item.value)) {
                                item.value = 0;
                            }
                            var val = parseFloat(eval(item.formula.replace('x', +value)));
                            item.value = parseFloat(((item.value + val) / 2).toFixed(2));
                            that.values[item._id] = item.value;
                            that.app.get('sockets').emit('arduino-sensor', {
                                id: item._id,
                                value: item.value
                            });
                        });
                        that.sensorList.push(sensor);
                    });
                }
            });
        });
    };

    /**
     * Manipulate the items array before render
     *
     * @method beforeRender
     * @param {Array} items An array containing the items to be rendered
     * @param {Function} callback The callback method to execute after manipulation
     * @param {String} callback.err null if no error occured, otherwise the error
     * @param {Object} callback.result The manipulated items
     */
    Arduino.prototype.beforeRender = function(items, callback) {
        var that = this;
        items.forEach(function(item) {
            item.value = that.values[item._id] ? that.values[item._id] : 0;
        });
        return callback(null, items);
    }


    var exports = Arduino;

    return exports;

});
