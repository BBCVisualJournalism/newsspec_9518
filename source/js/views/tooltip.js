define([
    'lib/news_special/bootstrap',
    'backbone',
    'd3'
], function (news, Backbone, d3) {
    return Backbone.View.extend({
        className: 'map-tooltip',
        initialize: function (options) {
            this.mapModel = options.mapModel;
            this.visible = false;
            this.timeout = false;
            this.constText = '';

            this.mapWidth = this.mapModel.get('width');
            this.mapHeight = this.mapModel.get('height');

            news.pubsub.on('tooltip:show', this.show.bind(this));
            news.pubsub.on('tooltip:hide', this.hide.bind(this));
        },
        render: function () {
            return this.$el;
        },
        show: function (data) {
            if (!this.timeout) {
                var constText = data.properties.constituency_gssid;
                if (this.constText !== constText) {
                    this.$el.text(constText);
                    this.elWidth = this.$el.width();
                    this.elHeight = this.$el.height();
                    this.constText = constText;
                }

                var mouseLeft = d3.event.pageX - news.$('.map-wrapper').offset().left,
                    mouseTop = d3.event.pageY - news.$('.map-wrapper').offset().top,
                    left = (mouseLeft < (this.mapWidth / 2)) ? mouseLeft + 20 : mouseLeft - this.elWidth - 40,
                    top = (mouseTop < (this.mapHeight / 2)) ? mouseTop + 30 : mouseTop - this.elHeight - 30;

                this.$el.css({'left' : left + 'px', 'top' : top + 'px'});

                if (!this.visible) {
                    this.$el.show();
                    this.visible = true;
                }
            }
        },
        hide: function () {
            if (this.visible) {
                this.visible = false;
                this.$el.hide();
            }
        }
    });
});