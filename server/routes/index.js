module.exports = function (app) {
    "use strict";

    require("fs").readdirSync(__dirname).forEach(function (file) {
        var path = __filename.split('/');
        if (file === path[path.length - 1]) {
            return;
        }

        require('./' + file)(app);
    });
};