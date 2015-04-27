define([
    'lib/news_special/bootstrap',
    'backbone'
], function (news, Backbone) {
    return Backbone.View.extend({
        className: 'map-panel',
        initialize: function (options) {
            this.mapModel = options.mapModel;
            this.dataFeed = this.mapModel.get('dataFeed');
            this.partyColours = this.mapModel.get('partyColours');
            this.template = _.template($('#panel_template').html(), {});
            this.visible = false;

            this.constituencyNames = this.mapModel.get('constituencyNames');

            news.pubsub.on('panel:show', this.show.bind(this));
            news.pubsub.on('panel:hide', this.hide.bind(this));

        },
        render: function () {
            this.$el.html(this.template);
            this.constituencyLink = this.$el.find('.panel-title');
            this.resultContainer = this.$el.find('.panel-result');
            this.panelMessage = this.$el.find('.panel-message');
            this.resultPartyColour = this.resultContainer.find('.panel-result--party-colour');
            this.resultDeclareString = this.resultContainer.find('.panel-result--declare-string');
            this.constituencyName = this.constituencyLink.find('.panel-title__constituency');
            this.urlFormat = this.constituencyLink.data('url');

            this.constituencyLink.on('click', this.click.bind(this));

            return this.$el;
        },
        updateResults: function (gssid) {
            if (this.mapModel.get('isResultsMode')) {
                var constituencyData = this.dataFeed.get(gssid);
                if (constituencyData && constituencyData.winningPartyCode && constituencyData.constituencyDeclarationString) {
                    var partyColour = this.partyColours.get(constituencyData.winningPartyCode) || this.partyColours.get('OTH');
                    this.resultPartyColour.css('backgroundColor', partyColour);
                    this.resultDeclareString.text(constituencyData.constituencyDeclarationString);

                    this.panelMessage.hide();
                    this.resultContainer.show();
                } else if (constituencyData && constituencyData.mapPanelMessage) {
                    this.panelMessage.text(constituencyData.mapPanelMessage);

                    this.panelMessage.show();
                    this.resultContainer.hide();
                } else {
                    this.panelMessage.text(this.panelMessage.data('resultsDefault'));

                    this.panelMessage.show();
                    this.resultContainer.hide();
                }
            }
        },
        show: function (gssid) {
            var constituencyName = this.constituencyNames.get(gssid);
            if (constituencyName) {
                this.constituencyName.text(constituencyName);

                this.gssid = gssid;
                this.updateResults(gssid);
                
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
