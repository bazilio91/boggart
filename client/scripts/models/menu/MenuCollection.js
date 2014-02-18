/*global define*/

define(['backbone', './MenuModel'], function (Backbone, MenuModel) {
    'use strict';
    /**
     * @class MenuCollection
     */
    var MenuCollection = Backbone.Collection.extend({
        model: MenuModel
    });

    return MenuCollection;
});