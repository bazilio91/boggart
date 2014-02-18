/*global define*/

define(['backbone'], function (Backbone) {
    'use strict';
    /**
     * @class MenuModel
     */
    var MenuModel = Backbone.Model.extend({
        defaults: {
            href: '#',
            text: 'No text',
            active: false
        }
    });
    return MenuModel;
});