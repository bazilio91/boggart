define(['marionette', 'templates'], function (Marionette, templates) {
    /**
     * @class LeftMenuItem
     */
    var LeftMenuItem = Marionette.ItemView.extend({
        template: templates['menu/item']
    });
    return LeftMenuItem;
});