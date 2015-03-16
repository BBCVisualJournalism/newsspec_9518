define([
    'lib/news_special/bootstrap',
    'backbone'
], function (news, Backbone) {
    return Backbone.View.extend({
        className: 'map-panel',
        initialize: function (options) {
            this.template = _.template($('#panel_template').html(), {});
            this.visible = false;

            this.dataFeed = options.mapModel.get('dataFeed');

            news.pubsub.on('panel:show', this.show.bind(this));
            news.pubsub.on('panel:hide', this.hide.bind(this));

        },
        render: function () {
            this.$el.html(this.template);
            this.constituencyLink = this.$el.find('.panel-title');
            this.constituencyName = this.constituencyLink.find('.panel-title__constituency');
            this.constituencyMessage = this.$el.find('.panel-message');
            this.urlFormat = this.constituencyLink.data('url');
            this.defaultMessage = this.constituencyMessage.data('defaultMessage');

            this.constituencyLink.on('click', this.click.bind(this));

            return this.$el;
        },
        show: function (gssid) {
            var constituencyData = this.dataFeed.get(gssid);
            if (constituencyData) {
                var freeTextMessage = constituencyData.mapPanelMessage || this.defaultMessage;
                this.constituencyName.text(constituencyData.name);
                this.constituencyMessage.text(freeTextMessage);
                this.gssid = gssid;
                
                if (!this.visible) {
                    this.visible = true;

                    this.$el.css('bottom', 0);
                }
            }
        },
        hide: function () {
            if (this.visible) {
                this.visible = false;

                this.$el.css('bottom', '-100px');
            }
        },
        click: function () {
            news.pubsub.emit('istats', ['clickthrough', 'election-map', this.gssid]);
            top.location.href = this.urlFormat.replace('{GSSID}', this.gssid);
            return false;
        }
    });
});