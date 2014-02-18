var _ = require('lodash');

module.exports = function (app) {
    "use strict";

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



};