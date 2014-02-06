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
        function update() {
            $.get('/api/', function (res) {
                var $buffer = $(document.createDocumentFragment());
                _.each(res.data, function (param) {
                    $buffer.append('<tr><td>' + param.name + '</td><td>' + param.value + '</td>' +
                        '<td>' + new Date(param.date) + '</td></tr>');
                });
                $('#status').html($buffer);
            });
        }
        setInterval(update, 5000);
        update();

    })
});
