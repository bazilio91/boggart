'use strict';

require.config({
    paths: {
        'jquery': '../components/jquery/jquery',
        'underscore': '../components/underscore-amd/underscore',
        'backbone': '../components/backbone-amd/backbone',
        'marionette': '../components/backbone.marionette/lib/core/amd/backbone.marionette',
        'backbone.wreqr': '../components/backbone.wreqr/lib/amd/backbone.wreqr',
        'backbone.babysitter': '../components/backbone.babysitter/lib/amd/backbone.babysitter',
        'bootstrap': '../components/sass-bootstrap/dist/js/bootstrap'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['app', 'underscore'], function (App, _) {
    App.start();

    $(function () {
        setInterval(function () {
            $.get('/api/', function (res) {
                var $buffer = $(document.createDocumentFragment());
                $('.panel-footer').text('Last updated at ' + res.date);
                _.each(res.data, function (val, key) {
                    $buffer.append('<tr><td>' + key + '</td><td>' + val + '</td></tr>');
                });
                $('#status').html($buffer);
            });

        }, 5000);

    })
});
