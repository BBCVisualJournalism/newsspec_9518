define([
    'backbone',
    'lib/news_special/bootstrap'
], function (Backbone, news) {
    return Backbone.Model.extend({
        url: function () {
            if (this.mapModel.get('language') === 'english') {
                /* ENGLISH RESULTS MODE */
                //return 'http://m.int.bbc.co.uk/news/components?batch%5Bremote-portlet-content-only%5D%5Bopts%5D%5Bid%5D=general_election_data/map_data';
                // return 'https://api.myjson.com/bins/35j6f';
                return 'https://api.myjson.com/bins/53fdr';
            } else {
                 /* WELSH RESULTS MODE */
                //return 'http://m.int.bbc.co.uk/news/components?batch%5Bremote-portlet-content-only%5D%5Bopts%5D%5Bid%5D=general_election_data/map_data';
                // return 'https://api.myjson.com/bins/35j6f';
                return 'https://api.myjson.com/bins/53fdr';
            }
        },
        parse: function (response) {
            return JSON.parse(response['general_election_data-map_data']);
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