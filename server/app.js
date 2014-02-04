'use strict';

// Module dependencies
var express = require('express'),
    colors = require('colors'),
    http = require('http'),
    path = require('path'),
    _ = require('lodash'),
    collectors = require('./collectors'),
    collectorsStack = {},
    data = {},
    lastUpdated = 'never';

// Create server
var app = express();

// Configure server
app.set('port', 3000);
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.logger('dev'));

// Mount statics
app.use(express.static(path.join(__dirname, '../.tmp')));
app.use(express.static(path.join(__dirname, '../client')));

// Route index.html
app.get('/', function (req, res) {
    res.sendfile(path.join(__dirname, '../client/index.html'));
});


app.get('/api/update', function (req, res) {
    console.log('Api GET update: '.green, req.query);
    res.send('ok');
});

app.get('/api', function (req, res) {
    res.send({data: data, date: lastUpdated});
});


app.post('/api', function (req, res) {
    console.log('Api input: '.green, req.body);
    res.send(200);

});
// Start server
http.createServer(app).listen(app.get('port'), '0.0.0.0', function () {
    console.log(
        'Express server listening on port '.green + app.get('port'),
        '\nPress Ctrl+C to shutdown'.grey
    );

//    _.each(collectors, function (collector, collectorClassName) {
//        collectorsStack[collectorClassName] = new collector();
//
//        setInterval(function () {
//            collectorsStack[collectorClassName].getData(function (dataObject) {
//                data = _.merge(data, dataObject);
//                lastUpdated = new Date().toString();
//            });
//        }, 5000);
//    });
});
