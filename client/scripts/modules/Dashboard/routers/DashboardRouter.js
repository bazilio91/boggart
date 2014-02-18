/*global define*/

define([
    'marionette',
    '../controllers/DashboardController'
], function (Marionette, DashboardController) {
    'use strict';
    /**
     * @class DashboardRouter
     */
    var DashboardRouter = Marionette.AppRouter.extend({
        appRoutes: {
            "dashboard": "index"
        },
        controller: new DashboardController()
    });
    return DashboardRouter;
});