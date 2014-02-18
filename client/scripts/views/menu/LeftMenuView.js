define(['marionette', './LeftMenuItem'], function (Marionette, LeftMenuItem) {
    'use strict';
    /**
     * @class LeftMenuView
     */
    var LeftMenuView = Marionette.CollectionView.extend({
        className: 'list-group',
        itemView: LeftMenuItem
    });

    return LeftMenuView;
});