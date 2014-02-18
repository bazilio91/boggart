var _ = require('lodash'),
    path = require('path');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};


module.exports = function (app) {
    "use strict";
    app.get('/client', ensureAuthenticated, function (req, res) {
        res.render('index', { user: req.user, message: req.session.messages });
    });

    app.get('/', ensureAuthenticated, function (req, res) {
        res.redirect('/client');
    });

    app.get('/login', function (req, res) {
        res.render('login', { user: req.user, message: req.session.messages });

//        var user = new models.User({ username: 'admin', email: 'admin@localhost', password: 'admin' });
//        user.save(function(err) {
//            if(err) {
//                console.log(err);
//            } else {
//                console.log('user: ' + user.username + " saved.");
//            }
//        });
    });

    app.post('/login', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err)
            }
            if (!user) {
                req.session.messages = [info.message];
                return res.redirect('/login')
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};