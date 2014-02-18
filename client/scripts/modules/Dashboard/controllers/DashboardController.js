/*global define*/

define(['marionette'], function (Marionette) {
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