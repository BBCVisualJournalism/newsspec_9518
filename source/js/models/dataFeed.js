define([
    'backbone',
    'lib/news_special/bootstrap'
], function (Backbone, news) {
    return Backbone.Model.extend({
        url: function () {
            if (this.mapModel.get('language') === 'english') {
                /* ENGLISH RESULTS MODE */
                return 'http://www.test.bbc.co.uk/news/components?allowcors=true&batch[remote-portlet-content-only][opts][id]=general_election_data/map_data';
            } else {
                 /* WELSH RESULTS MODE */
                return 'http://www.test.bbc.co.uk/news/components?allowcors=true&batch[remote-portlet-content-only][opts][id]=general_election_data/map_data_welsh';
            }
        },
        parse: function (response) {
            if (this.mapModel.get('language') === 'english') {
                return JSON.parse(response['general_election_data-map_data']);
            } else {
                return JSON.parse(response['general_election_data-map_data_welsh']);
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
