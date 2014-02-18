define([
    'marionette',
    'jquery',
    'loglevel',

    'config',
    'models/menu/MenuCollection',
    'views/menu/LeftMenuView'
], function (Marionette, $, loglevel, config, MenuCollection, LeftMenuView) {
    'use strict';

    var App = new Marionette.Application();

    App.addRegions({
        leftMenu: '#left-menu'
    });

    App.on('initialize:after', function () {
        App.log.info('Application has started');
    });

    App.addInitializer(function () {
        loglevel.setLevel(config.loglevel);
        App.log = loglevel;
    });

    App.addInitializer(function () {
        _.each(config.modules, function (options, name) {
            require([['modules', name, name + 'Module'].join('/')], function (module) {
                App.module(name, {
                    define: module
                });
            });
        });
    });

    App.addInitializer(function () {
        App.menu = new MenuCollection();
        App.leftMenu.show(new LeftMenuView({collection: App.menu}));
    });

    App.addInitializer(function () {


        $(document).on('click', 'a', function (event) {
            var fragment = Backbone.history.getFragment($(this).attr('href')),
                matched = _.any(Backbone.history.handlers, function (handler) {
                    return handler.route.test(fragment);
                });

            if (matched) {
                event.preventDefault();
                Backbone.history.navigate(fragment, { trigger: true });
            }
        });

        if (!Backbone.history.started) {
            Backbone.history.start({ pushState: true });
        }
    });

    return App;
});
