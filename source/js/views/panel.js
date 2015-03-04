define([
    'lib/news_special/bootstrap',
    'backbone'
], function (news, Backbone) {
    return Backbone.View.extend({
        className: 'map-panel',
        initialize: function () {
            this.template = _.template($('#panel_template').html(), {});
            this.visible = false;

            news.pubsub.on('panel:show', this.show.bind(this));
            news.pubsub.on('panel:hide', this.hide.bind(this));
        },
        render: function () {
            this.$el.html(this.template);
            this.constituencyTitle = this.$el.find('.panel-title__constituency');

            return this.$el;
        },
        show: function (options) {
            this.constituencyTitle.text(options.constituency);
            
            if (!this.visible) {
                this.visible = true;

                this.$el.animate({
                    'bottom': 0
                }, 600);
            }
        },
        hide: function () {
            if (this.visible) {
                this.visible = false;

                var height = this.$el.css('height');
                this.$el.animate({
                    'bottom': '-' + height
                }, 400);

            }
        }
    });
});