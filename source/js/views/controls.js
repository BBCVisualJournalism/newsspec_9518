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
            this.addListeners();
            return this.$el;
        },
        addListeners: function () {
            this.$el.find('.map-controls--reset').on('click', this.resetClicked);
            this.$el.find('.map-controls-pan__left').on('click', this.panClicked.bind(null, 'left'));
            this.$el.find('.map-controls-pan__up').on('click', this.panClicked.bind(null, 'up'));
            this.$el.find('.map-controls-pan__right').on('click', this.panClicked.bind(null, 'right'));
            this.$el.find('.map-controls-pan__down').on('click', this.panClicked.bind(null, 'down'));            
        },
        resetClicked: function () {
            news.pubsub.emit('map:reset');
        },
        panClicked: function (direction) {
            console.log(direction);
        }
    });
});