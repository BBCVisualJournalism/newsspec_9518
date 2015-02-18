define([
    'lib/news_special/bootstrap',
    'backbone'
], function (news, Backbone) {
    return Backbone.View.extend({
        initialize: function () {
        },
        render: function () {
            this.$el.html('I\m going to control the map');

            return this.$el;
        }
    });
});