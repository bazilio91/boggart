var thinky = require('thinky'),
    config = require('../config/server.js'),
    r = require('rethinkdb'),
    bcrypt = require('bcrypt'),
    connection;

thinky.init({
    host: config.db.host,
    port: config.db.port,
    db: config.db.name
});

global.thinky = thinky;

module.exports.thinky = thinky;

var createTable = thinky.createTable = function (tableName, cb) {
    r.db(config.db.name).tableList().run(connection, function (error, result) {
        if (error) {
            throw new Error(error);
        }

        if (result.indexOf(tableName) === -1) {
            r.db(config.db.name).tableCreate(tableName).run(connection, function (error, result) {
                if (error) console.log(error);

                if ((result != null) && (result.created === 1)) {
                    console.log('Table `%s` created', tableName);
                    app.events.emit('db:table:created:' + tableName);
                }
                else {
                    throw new Error('Error: Table `%s` not created', tableName);
                }

                cb && cb(error, result);
            });
        } else {
            console.log('Table %s — ok!', tableName);
            cb && cb(null, null);
        }
    });
};

var createIndex = thinky.createIndex = function (tableName, indexName, cb) {
    r.db(config.db.name).table(tableName).indexList().run(connection, function (err, result) {
        if (result.indexOf(indexName) === -1) {
            r.db(config.db.name).table(tableName).indexCreate(indexName).run(connection, function (err, result) {
                if (err) {
                    throw new Error(err);
                }

                if ((result != null) && (result.created === 1)) {
                    console.log('Index %s:%s created', tableName, indexName);
                    app.events.emit('db:table:' + tableName + ':indexCreated:' + indexName);
                } else {
                    throw new Error('Error: Index %s:%s not created'.red, tableName, indexName);
                }

                cb && cb(error, result);
            });
        } else {
            console.log('Index s%:%s — ok!', tableName, indexName);
            cb && cb(null, null);
        }
    });
};
// Connect
var connect = function () {
    r.connect({
        host: config.db.host,
        port: config.db.port,
        db: config.db.name
    }, function (error, conn) {
        if (error) throw error;
        connection = conn;
        app.events.emit('db:connect');
        console.log('\nDB conected!'.green);
        createDatabase();
    });
};

// check if User table was just created and add first user
var checkUser = function (error, result) {
    'use strict';

    if (error === null && result === null) {
        // Table exists
        return;
    }

    if (error) {
        // Failed to create user table
        return;
    }
    bcrypt.genSalt(config.saltWorkFactor, function (err, salt) {
        if (err) {
            throw new Error(err);
        }

        bcrypt.hash('boggart', salt, function (err, hash) {
            if (err) {
                throw new Error(err);
            }

            r.db(config.db.name).table('User')
                .insert([
                    {"username": "boggart", "email": "root@localhost", "password": hash}
                ]).run(connection, function (error, result) {
                    if (error) {
                        console.log(error);
                    }

                    if ((result != null) && (result.errors === 0)) {
                        console.log('Added boggart user');
                    }
                    else {
                        console.log('Error: Failed to add first user.');
                    }
                });
        });
    });
};

// Create the database
var createDatabase = function () {
    r.dbList().run(connection, function (error, result) {
        if (error) {
            throw new Error(error);
        }
        if (result.indexOf(config.db.name) === -1) {
            r.dbCreate(config.db.name).run(connection, function (error, result) {
                if (error) {
                    throw new Error(error);
                }
                if ((result != null) && (result.created === 1)) {
                    console.log('Database `%s` created', config.db.name);
                    createTable('User', checkUser);
                    createTable('session');
                }
                else {
                    throw new Error('Error: Database `%s` not created', config.db.name);
                }
            })
        } else {
            createTable('User', checkUser);
        }
    });
};

connect();