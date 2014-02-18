/*global define*/

define([
    'marionette',

    './routers/DashboardRouter'
], function (Marionette, DashboardRouter) {
    'use strict';
    /**
     * @class DashboardModule
     */
    var DashboardModule = function (DashboardModule) {
        DashboardModule.addInitializer(function(){
            new DashboardRouter();
        });

        DashboardModule.addInitializer(function(){
            App.menu.add({
                text: 'Dashboard',
                href: 'dashboard'
            });
        });

        DashboardModule.on('start', function () {
            App.trigger('module:start', 'Dashboard');
            App.log.info('DashboardModule has started');
        });
    };

    return DashboardModule;
});