/*global define*/

define(['marionette', 'config'], function (Marionette, config) {
    'use strict';
    /**
     * @class DashboardController
     */
    var DashboardController = Marionette.Controller.extend({
        index: function () {
            App.log.debug('DashboardController::index');
        }
    });
    return DashboardController;
});