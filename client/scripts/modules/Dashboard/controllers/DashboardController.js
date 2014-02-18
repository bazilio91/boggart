/*global define*/

define(['marionette', 'config'], function (Marionette, config) {
    'use strict';
    /**
     * @class DashboardController
     */
    var DashboardController = Marionette.Controller.extend({
        index: function () {
            function update() {
                $.get(config.apiEndpoint, function (res) {
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

            App.log.debug('DashboardController::index');
        }
    });
    return DashboardController;
});