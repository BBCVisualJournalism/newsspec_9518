define([
    'backbone',
    'lib/news_special/bootstrap'
], function (Backbone, news) {
    return Backbone.Model.extend({
        url: function () {
            if (this.mapModel.get('language') === 'english') {
                /* ENGLISH RESULTS MODE */
                return 'http://www.bbc.co.uk/news/special/2015/newsspec_9518/content/english/results_data.json';
            } else {
                 /* WELSH RESULTS MODE */
                return 'http://www.bbc.co.uk/news/special/2015/newsspec_9518/content/cymru/results_data.json';
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
