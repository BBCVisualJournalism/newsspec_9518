define([
    'lib/news_special/bootstrap',
    'backbone'
], function (news, Backbone) {
    return Backbone.View.extend({
        className: 'map-controls',
        initialize: function () {
            this.template = _.template( $("#map_controls_template").html(), {} );
        },
        render: function () {
            this.$el.html(this.template);

            return this.$el;
        }
    });
});