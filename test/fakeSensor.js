var http = require('http');

function createData() {
    return JSON.stringify({
        param1: Math.floor(20 + Math.random() * 10),
        param2: Math.floor(23 + Math.random() * 10)
    });
}


setInterval(function () {
    var jsonData = createData();
    var headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonData, 'utf8')
    };

    var options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/param',
        method: 'POST',
        headers: headers
    };


    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.on('finish', function () {
        console.log('ended');
    });

    req.write(jsonData);
    req.end();
    console.log('sent');
}, 5000);