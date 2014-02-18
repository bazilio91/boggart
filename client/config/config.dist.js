define([], function () {
    'use strict';

    return {
        apiEndpoint: 'http://localhost:3000/api/',
        loglevel: 'trace',
        modules: {
            Dashboard: {
                option: true
            }
        }
    }
});