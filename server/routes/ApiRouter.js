var _ = require('lodash');

module.exports = function (app) {
    "use strict";
    app.get('/api/update', function (req, res) {
        res.send('ok');
    });

    app.get('/api', function (req, res) {
        models.Param.find({}, 'value name date sensor').populate('sensor').exec(function (err, params) {
            var data = [];
            _.each(params, function (param) {
                param.sensorType = param.sensor.type;
                delete param.sensor;
                data.push(_.pick(param, ['name', 'value', 'date', 'sensorType']))
            });
            res.send({data: data});
        });
    });

    var handlePost = function (sensor, sensorData, req, res) {
        models.Param.find({sensor: sensor._id}).exec(
            function (err, params) {
                if (err) {
                    throw err;
                }
                _.each(sensorData.params, function (val, key) {
                    var param = _.findWhere(params, {name: key});
                    if (param) {
                        param.value = val;
                        param.date = new Date().now;
                        param.save();
                        res.send(200);
                    } else {
                        param = new models.Param({
                            name: key, value: val, sensor: sensor._id
                        });
                        param.save(function () {
                            sensor.params.push(param._id);
                            sensor.save();
                            res.send(200);
                        });
                    }

                }, this);
            });
    };
    app.post('/api', function (req, res) {
        _.each(req.body.sensors, function (sensorData) {
            models.Sensor.findOne({token: sensorData.token}).populate('params')
                .exec(function (err, sensor) {
                    if (err) {
                        throw err;
                    }
                    if (!sensor) {
                        sensor = new models.Sensor({
                            token: sensorData.token,
                            type: sensorData.source
                        });

                        sensor.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            console.log('New sensor[token=%s] registred!'.green, sensor.token);
                            handlePost(sensor, req, res);
                        });
                    } else {
                        console.log('sensor found', sensor);
                        handlePost(sensor, sensorData, req, res);
                    }
                });
        });

    });
};