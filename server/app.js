'use strict';

// Module dependencies
var express = require('express'),
    colors = require('colors'),
    http = require('http'),
    path = require('path'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    config = require('../config/server.js'),
    collectors = require('./collectors'),
    collectorsStack = {},
    data = {},
    lastUpdated = 'never';

global.models = require('./models');
mongoose.connect(config.mongoDsn);
global.db = mongoose.connection;

db.on('error', function (err) {
    console.log('DB connection error:'.red, err.message);
});
db.once('open', function callback() {
    console.log('Connected to DB!'.green);
});


// Create server
var app = express();

// Configure server
app.set('port', config.port || 3000);
app.use(express.favicon());

// Mount statics
app.use(express.static(path.join(__dirname, '../.tmp')));
app.use(express.static(path.join(__dirname, '../client')));

//app.use(function (req, res, next) {
//    var data = '';
//    req.on('data', function (chunk) {
//        data += chunk;
//    });
//
//    req.on('end', function () {
//        console.log(data);
//        next();
//    });
//});

app.use(express.bodyParser());
app.use(express.logger('dev'));




require('./routes')(app);
// Route index.html
app.get('/', function (req, res) {
    res.sendfile(path.join(__dirname, '../client/index.html'));
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
