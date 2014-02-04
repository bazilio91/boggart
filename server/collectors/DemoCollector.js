"use strict";
var http = require('http'),
    _ = require('lodash'),
    util = require('util'),
    events = require('events');

var DemoCollector = function () {
    events.EventEmitter.call(this);
    var mapping = {
        'T1': 'Пол 1',
        'T2': 'Пол 2',
        'T3': 'Пол 3',
        'T4': 'Пол 4',
        'T5': 'Пол в кухне',
        'T6': 'Пол в туалете',
        'T7': 'Пол коридор',
        'T8': 'Воздух кухня',
        'T9': 'Пол 2ой этаж',
        'T10': 'Воздух 2ой этаж',
        'T11': 'Улица',
        'T12': 'Бак',
        'E': 'Статус кухня',
        'F': 'Статус туалет',
        'G': 'Статус лестница',
        'H': 'H'
    };

    this.getData = function (cb) {
        var req = http.get('http://192.168.0.124/sensors', _.bind(this.onResponse, this));
        req.on('error', function (e) {
            console.log(e.message.red);
        });

        this.once('response', _.bind(this.parseData, this));
        this.once('data', _.bind(function (data) {
            //_.pick(data);
            cb(data);
        }, this));
    };

    this.onResponse = function (res) {
        var data = '';
        res.on('data', _.bind(function (chunk) {
            data += chunk;
        }, this));

        res.on('end', _.bind(function () {
            this.emit('response', data)
        }, this));

        res.on('error', function (e) {
            console.log(e.message.red);
        });
    };

    this.parseData = function (data) {
        var dataObject = {};
        _.each(data.split('&'), function (pair) {
            var keyValue = pair.split('=');
            dataObject[mapping[keyValue[0]] || keyValue[0]] = parseFloat(keyValue[1]);
        });

        this.emit('data', dataObject);
    }
};

util.inherits(DemoCollector, events.EventEmitter);

module.exports = DemoCollector;