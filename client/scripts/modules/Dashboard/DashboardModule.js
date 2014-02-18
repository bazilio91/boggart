/*global define*/

define([
    'marionette',

    './routers/DashboardRouter'
], function (Marionette, DashboardRouter) {
    'use strict';
    /**
     * @class DashboardModule
     */
    var DashboardModule = function (DashboardModule, App, Backbone, Marionette, $, _) {
        new DashboardRouter();

        App.menu.add({
            text: 'Dashboard',
            href: 'dashboard'
        });
        App.log.info('DashboardModule has started');
    };

    return DashboardModule;
});