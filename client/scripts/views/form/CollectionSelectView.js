/*global define*/

define(['marionette', 'underscore'], function (Marionette, _) {
    'use strict';
    var CollectionSelectItemView = Marionette.ItemView.extend({
        tagName: 'option',
        template: _.template('<%= text %>')
    });


    /**
     * @class CollectionSelectView
     */
    var CollectionSelectView = Marionette.CollectionView.extend({
        tagName: 'select',
        itemView: CollectionSelectItemView,

        valueAttribute: 'id',
        textAttribute: 'text'
    });

    return CollectionSelectView;
});