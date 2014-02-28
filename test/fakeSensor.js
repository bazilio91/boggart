var http = require('http');

var jsonData = JSON.stringify({
    sensors: [
        {
            token: 'fakeSensor',
            source: 'DHT11',
            params: {
                param1: 1,
                param2: '2'
            }
        }
    ]
});

var headers = {
    'Content-Type': 'application/json',
    'Content-Length' : Buffer.byteLength(jsonData, 'utf8')
};

var options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/sensors',
    method: 'POST',
    headers: headers
};


setInterval(function () {
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
//        console.log('HEADERS: ' + JSON.stringify(res.headers));
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