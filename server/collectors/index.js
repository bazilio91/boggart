require("fs").readdirSync(__dirname).forEach(function (file) {
    var path = __filename.split('/');
    if (file === path[path.length - 1]) {
        return;
    }

    module.exports[file.replace(/\.js$/g, '')] = require('./' + file);
});