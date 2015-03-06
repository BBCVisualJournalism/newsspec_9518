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
            this.constituencyLink = this.$el.find('.panel-title');
            this.constituencyName = this.constituencyLink.find('.panel-title__constituency');
            this.urlFormat = this.constituencyLink.data('url');

            return this.$el;
        },
        show: function (options) {
            this.constituencyName.text(options.constituency);
            this.constituencyLink.attr('href', this.urlFormat.replace('{GSSID}', options.gssid));
            
            if (!this.visible) {
                this.visible = true;

                this.$el.css('bottom', 0);
            }
        },
        hide: function () {
            if (this.visible) {
                this.visible = false;

                var height = this.$el.css('height');
                this.$el.css('bottom', '-' + height);

            }
        }
    });
});