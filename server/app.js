'use strict';

// Module dependencies
var express = require('express.io'),
    EventEmitter2 = require('eventemitter2').EventEmitter2,
    colors = require('colors'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    SessionStore = require("session-mongoose")(express),
    _ = require('lodash'),
    mongoose = require('mongoose'),

    config = require('../config/server.js'),
    modules = require('../config/modules.js'),

//    collectors = require('./collectors'),
//    collectorsStack = {},
    store = new SessionStore({
        url: config.mongoDsn,
        interval: 120000 // expiration check worker run interval in millisec (default: 60000)
    });

global.models = require('./models');
mongoose.connect(config.mongoDsn);
global.db = mongoose.connection;

db.on('error', function (err) {
    console.log('DB connection error:'.red, err.message);
});
db.once('open', function callback() {
    console.log('Connected to DB!'.green);
});

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    models.User.findById(id, function (err, user) {
        done(err, user);
    });
});
global.passport = passport;


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(function (username, password, done) {
    models.User.findOne({ username: username }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Unknown user ' + username });
        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) return done(err);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid password' });
            }
        });
    });
}));


// Create server
var app = express();
app.http().io();
app.io.set('log', true);
app.io.set('log level', 3);
app.events = new EventEmitter2({
    wildcard: true, delimiter: ':', maxListeners: 100
});

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', config.allowedDomains);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};


app.configure(function () {
// Configure server
    app.set('port', config.port || 3000);
    app.use(express.favicon());

// Mount statics
    app.use(express.static(path.join(__dirname, '../.tmp')));
    app.use(express.static(path.join(__dirname, '../client')));

    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.engine('ejs', require('ejs-locals'));

    app.use(express.logger('dev'));
    app.use(allowCrossDomain);

    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({
        secret: 'hohohome',
        store: store,
        cookie: { maxAge: 900000 } // expire session in 15 min or 900 seconds
    }));
    app.use(express.methodOverride());
    app.use(passport.initialize());
    app.use(passport.session());
});

require('./routes')(app);

_.each(modules, function (options, moduleName) {
    var module = require(moduleName).init(options, app.events);

    _.each(module.routers, function (router) {
        app.use(router.middleware);
    });

    _.each(module.models, function (obj, key) {
        if (models[key]) {
            throw new Error('Error initialising module ' + moduleName + ', ' +
                key + ' already defined');
        }

        models[key] = obj;
    });
});

// Start server
app.listen(app.get('port'), '0.0.0.0', function () {
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
