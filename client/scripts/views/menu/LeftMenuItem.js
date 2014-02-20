define(['marionette', 'templates'], function (Marionette, templates) {
    "use strict";
    /**
     * @class LeftMenuItem
     */
    var LeftMenuItem = Marionette.ItemView.extend({
        tagName: 'li',
        className: 'list-group-item',
        template: templates['menu/item'],

        onRender: function () {
            if (this.model.get('active')) {
                this.$el.addClass('active');
            }
        }
    });
    return LeftMenuItem;
});