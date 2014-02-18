var http = require('http'),
    fs = require('fs'),
    crypto = require('crypto'),
    path = require('path'),
    lame = require('lame'),
    Speaker = require('speaker'),
    cacheDir = path.dirname(require.main.filename) + '/../.voicecache/';

console.log(cacheDir);
if (!fs.existsSync(cacheDir)) {
    fs.mkdir(cacheDir);
}

function playFile(path) {
    "use strict";
    fs.createReadStream(path)
        .pipe(new lame.Decoder())
        .on('format', function (format) {
            this.pipe(new Speaker(format));
        });
}

module.exports.speak = function (text, lang) {
    "use strict";
    var md5sum = crypto.createHash('md5').update(text.toLowerCase()),
        path = cacheDir + md5sum.digest('hex') + '.mp3';
    lang = lang || 'en-us';

    if (fs.existsSync(path)) {
        playFile(path);
    } else {
        var file = fs.createWriteStream(path);
        http.get('http://translate.google.com/translate_tts?tl=' + lang +
            '&q=' + text +
            '&ie=UTF-8',
            function (res) {
                if (res.statusCode !== 200) {
                    console.log('Unable to download speech!');
                    return;
                }
                res.on('data',function (chunk) {
                    console.log(chunk);
                    file.write(chunk);
                }).on('end', function () {
                    file.end();
                    playFile(path);
                });
            })
   }
};