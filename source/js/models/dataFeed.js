define([
    'backbone',
    'lib/news_special/bootstrap'
], function (Backbone, news) {
    return Backbone.Model.extend({
        url: function () {
            if (this.mapModel.get('language') === 'english') {
                /* ENGLISH RESULTS MODE */
                return 'http://m.int.bbc.co.uk/news/components?allowcors=true&batch%5Bremote-portlet-content-only%5D%5Bopts%5D%5Bid%5D=general_election_data/uk_data';
            } else {
                 /* WELSH RESULTS MODE */
                return 'http://m.int.bbc.co.uk/news/components?allowcors=true&batch%5Bremote-portlet-content-only%5D%5Bopts%5D%5Bid%5D=general_election_data/wales_data';
            }
        },
        parse: function (response) {
            if (this.mapModel.get('language') === 'english') {
                return JSON.parse(response['general_election_data-uk_data']);
            } else {
                return JSON.parse(response['general_election_data-wales_data']);
            }

        },
        initialize: function (options) {
            var _this = this;
            this.mapModel = options.mapModel;
            this.fetch().done(function () {
                news.pubsub.emit('map:hasRequiredData');
            });
        }
    });
});
