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
        var moduleNames = {};
        _.each(config.modules, function (options, name) {
            require([['modules', name, name + 'Module'].join('/')], function (module) {
                moduleNames[name] = false;
                App.module(name, module);
            });
        });

        // Wait for all modules started & load controller action
        App.on('module:start', function (name) {
            delete moduleNames[name];
            if (!_.isEmpty(moduleNames)) {
                return;
            }

            Backbone.history.loadUrl(Backbone.history.fragment);
        });
    });


    App.addInitializer(function () {
        App.menu = new MenuCollection({
            href: '#',
            text: 'Home'
        });
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
            Backbone.history.start({ pushState: false });
        }
    });

    return App;
});
