var _ = require('lodash');

module.exports = function (app) {
    "use strict";
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

    app.get('/say', function (req, res) {
        if (req.query.w) {
            res.send(200);
        } else {
            res.send(400);
            return;
        }

        var AudioApi = require('../components/AudioApi');
        AudioApi.speak(req.query.w, req.query.lang);
    });

    app.get('/api/:name', function (req, res) {
        models.Param.findOne({name: req.params.name}).exec(function (err, param) {
            if (err) {
                throw err;
            }

            if (!param) {
                res.send(404);
                return;
            }

            res.send(param);
        });

    });

    var handlePost = function (sensor, sensorData, req, res) {
        models.Param.find({sensor: sensor._id}).exec(
            function (err, params) {
                if (err) {
                    throw err;
                }
                var date = new Date();
                _.each(sensorData.params, function (val, key) {
                    var param = _.findWhere(params, {name: key});
                    if (param) {
                        param.value = val;
                        param.date = date;
                        param.save();
                        res.send(200);
                    } else {
                        param = new models.Param({
                            name: key, value: val, sensor: sensor._id, date: date
                        });
                        param.save(function () {
                            sensor.params.push(param._id);
                            sensor.save();
                            res.send(200);
                        });
                    }

                    var history = new models.ParamHistory({
                        value: val,
                        date: date,
                        name: key,
                        sensor: sensor._id
                    });
                    history.save(function (error) {
                        if (error) {
                            console.log('Can\'t save history!'.red);
                        }
                    });

                    app.events.emit('param:' + key, val, key);
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
                        handlePost(sensor, sensorData, req, res);
                    }
                });
        });

    });
};