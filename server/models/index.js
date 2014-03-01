var bcrypt = require('bcrypt'),
    config = require('../../config/server.js');

var User = thinky.createModel('User', {
    id: String,
    username: {
        _type: String,
        enforce: { missing: true }
    },
    email: {
        _type: String,
        enforce: { missing: true }
    },
    password: {
        _type: String,
        enforce: { missing: true }
    }
});

User.define('setPassword', function (newPassword) {
    'use strict';

    bcrypt.genSalt(config.saltWorkFactor, function (err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(User.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            return next();
        });
    });
});

//module.exports.UserSchema.pre('save', function (next) {
//    var user = this;
//
//    if (!user.isModified('password')) {
//        return next();
//    }
//
//    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
//        if (err) {
//            return next(err);
//        }
//
//        bcrypt.hash(user.password, salt, function (err, hash) {
//            if (err) return next(err);
//            user.password = hash;
//            return next();
//        });
//    });
//});

// Password verification
User.define('comparePassword', function (candidatePassword, cb) {
    console.log(this);
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }

        return cb(null, isMatch);
    });
});

module.exports.User = User;
