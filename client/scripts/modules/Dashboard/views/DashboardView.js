/*global define*/

define(['marionette'], function (Marionette) {
    'use strict';
    /**
     * @class DashboardView
     */
    var DashboardView = Marionette.CollectionView.extend({
        getItemView: function (item) {
            return item.view;
        }
    });

    return DashboardView;
});